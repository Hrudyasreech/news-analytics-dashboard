"use client"

import { useState } from "react"
import { Newspaper, Eye, EyeOff, Loader2, Shield, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel, FieldError, FieldGroup, FieldDescription } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LoginPageProps {
  onLogin: (email: string, password: string, isAdmin: boolean) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [loginType, setLoginType] = useState<"user" | "admin">("user")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login")

  function validateForm() {
    const newErrors: { email?: string; password?: string } = {}
    
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }
    
    if (!password && mode !== "forgot") {
      newErrors.password = "Password is required"
    } else if (password.length < 6 && mode !== "forgot") {
      newErrors.password = "Password must be at least 6 characters"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setErrors({})
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (mode === "forgot") {
      setErrors({ general: "Password reset link sent to your email" })
      setIsLoading(false)
      return
    }
    
    // Admin login check
    if (loginType === "admin") {
      if (email === "admin@newslens.com" && password === "admin123") {
        onLogin(email, password, true)
      } else {
        setErrors({ general: "Invalid admin credentials. Try admin@newslens.com / admin123" })
      }
    } else {
      // User login check
      if (email === "user@newslens.com" && password === "user123") {
        onLogin(email, password, false)
      } else if (mode === "register") {
        onLogin(email, password, false)
      } else {
        setErrors({ general: "Invalid credentials. Try user@newslens.com / user123" })
      }
    }
    
    setIsLoading(false)
  }

  function handleTabChange(value: string) {
    setLoginType(value as "user" | "admin")
    setEmail("")
    setPassword("")
    setErrors({})
    setMode("login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Newspaper className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold text-foreground">NewsLens</span>
          </div>
          <p className="text-muted-foreground text-center text-balance">
            NLP-powered news analysis platform for keyword trends, topic modeling, and sentiment analysis
          </p>
        </div>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <Tabs value={loginType} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="user" className="flex items-center gap-2 data-[state=active]:bg-card">
                  <User className="h-4 w-4" />
                  User Login
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2 data-[state=active]:bg-card">
                  <Shield className="h-4 w-4" />
                  Admin Login
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="pt-4">
              <CardTitle className="text-xl text-center">
                {mode === "login" && (loginType === "admin" ? "Admin Access" : "Welcome back")}
                {mode === "register" && "Create an account"}
                {mode === "forgot" && "Reset password"}
              </CardTitle>
              <CardDescription className="text-center mt-1">
                {mode === "login" && loginType === "admin" && "Sign in with admin credentials"}
                {mode === "login" && loginType === "user" && "Sign in to access your dashboard"}
                {mode === "register" && "Enter your details to get started"}
                {mode === "forgot" && "Enter your email to receive a reset link"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder={loginType === "admin" ? "admin@newslens.com" : "you@example.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                    disabled={isLoading}
                  />
                  {errors.email && <FieldError>{errors.email}</FieldError>}
                </Field>

                {mode !== "forgot" && (
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        aria-invalid={!!errors.password}
                        disabled={isLoading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <FieldError>{errors.password}</FieldError>}
                  </Field>
                )}
              </FieldGroup>

              {mode === "login" && loginType === "user" && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {errors.general && (
                <div className={`text-sm p-3 rounded-md ${
                  errors.general.includes("sent") 
                    ? "bg-success/10 text-success border border-success/20" 
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}>
                  {errors.general}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {mode === "login" && "Signing in..."}
                    {mode === "register" && "Creating account..."}
                    {mode === "forgot" && "Sending link..."}
                  </>
                ) : (
                  <>
                    {mode === "login" && (loginType === "admin" ? "Sign in as Admin" : "Sign in")}
                    {mode === "register" && "Create account"}
                    {mode === "forgot" && "Send reset link"}
                  </>
                )}
              </Button>
            </form>

            {loginType === "user" && (
              <div className="mt-6 pt-4 border-t border-border">
                {mode === "login" && (
                  <p className="text-center text-sm text-muted-foreground">
                    {"Don't have an account? "}
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign up
                    </button>
                  </p>
                )}
                {mode === "register" && (
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </p>
                )}
                {mode === "forgot" && (
                  <p className="text-center text-sm text-muted-foreground">
                    Remember your password?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            )}

            {/* Demo credentials hint */}
            {mode === "login" && (
              <div className="mt-4 p-3 rounded-md bg-muted/50 border border-border/50">
                <FieldDescription className="text-center">
                  {loginType === "admin" 
                    ? "Demo: admin@newslens.com / admin123"
                    : "Demo: user@newslens.com / user123"
                  }
                </FieldDescription>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
