import { NextResponse } from "next/server"
import { authenticateUser } from "@/lib/data"
import type { LoginCredentials, AuthResponse } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body: LoginCredentials = await request.json()
    const { email, password, loginType } = body

    // Validate input
    if (!email || !password || !loginType) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Authenticate user
    const user = authenticateUser(email, password, loginType)

    if (!user) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Generate a simple token (in production, use JWT or similar)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64")

    // Create response with cookie
    const response = NextResponse.json<AuthResponse>({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      },
      token,
    })

    // Set HTTP-only cookie for session
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch {
    return NextResponse.json<AuthResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
