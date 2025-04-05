"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Simulación de base de datos de usuarios (con contraseñas hasheadas)
// En un caso real, estos hashes serían generados con bcrypt o similar
const users = [
  {
    id: 1,
    username: "admin",
    // Esto simula un hash bcrypt de "password123"
    passwordHash: "$2a$12$r8jJh.iCq1wCBmnNDxfYI.H8IbPqXOzD4RPnHiSJQZm5KrUDCwAOK",
    failedAttempts: 0,
    lastFailedAttempt: 0,
    twoFactorEnabled: true,
    twoFactorSecret: "JBSWY3DPEHPK3PXP", // Secreto TOTP de ejemplo
  },
  {
    id: 2,
    username: "usuario",
    // Esto simula un hash bcrypt de "123456"
    passwordHash: "$2a$12$QqF.cXPVSPjRIi5NrFu.xeQPQTlAXLNz/GKV/FEV5TcVjxoH9L7/S",
    failedAttempts: 0,
    lastFailedAttempt: 0,
    twoFactorEnabled: false,
    twoFactorSecret: "",
  },
]

// Simulación de verificación de contraseña hasheada
// En un caso real, usaríamos bcrypt.compare()
const verifyPassword = (password: string, hash: string): boolean => {
  // Esto es solo una simulación para el ejemplo
  if (password === "password123" && hash === "$2a$12$r8jJh.iCq1wCBmnNDxfYI.H8IbPqXOzD4RPnHiSJQZm5KrUDCwAOK") return true
  if (password === "123456" && hash === "$2a$12$QqF.cXPVSPjRIi5NrFu.xeQPQTlAXLNz/GKV/FEV5TcVjxoH9L7/S") return true
  return false
}

// Simulación de generación de JWT
const generateJWT = (userId: number): string => {
  // En un caso real, usaríamos una biblioteca como jsonwebtoken
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hora
    }),
  )
  const signature = btoa("simulatedSignature") // En un caso real, esto sería una firma HMAC

  return `${header}.${payload}.${signature}`
}

// Simulación de verificación de código TOTP
const verifyTOTP = (token: string, secret: string): boolean => {
  // En un caso real, usaríamos una biblioteca como otplib
  // Para este ejemplo, aceptamos "123456" como código válido
  return token === "123456"
}

export default function SecureLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [totpCode, setTotpCode] = useState("")
  const [error, setError] = useState("")
  const [step, setStep] = useState<"credentials" | "2fa">("credentials")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const router = useRouter()

  // Función de login segura
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Buscar usuario por nombre de usuario (caso insensible)
    const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase())

    if (!user) {
      // Mensaje de error genérico que no revela información
      setError("Credenciales inválidas")
      return
    }

    // Verificar si la cuenta está bloqueada por demasiados intentos fallidos
    const now = Date.now()
    if (user.failedAttempts >= 5 && now - user.lastFailedAttempt < 15 * 60 * 1000) {
      setError("Cuenta bloqueada temporalmente. Intente nuevamente más tarde.")
      return
    }

    // Verificar contraseña (simulando bcrypt.compare)
    if (!verifyPassword(password, user.passwordHash)) {
      // Actualizar contador de intentos fallidos (en un caso real, esto se haría en el servidor)
      user.failedAttempts += 1
      user.lastFailedAttempt = now

      // Mensaje de error genérico
      setError("Credenciales inválidas")
      return
    }

    // Restablecer contador de intentos fallidos
    user.failedAttempts = 0

    // Si el usuario tiene 2FA habilitado, pasar al siguiente paso
    if (user.twoFactorEnabled) {
      setCurrentUser(user)
      setStep("2fa")
      return
    }

    // Si no tiene 2FA, completar el login
    completeLogin(user)
  }

  // Verificar código TOTP
  const handleVerifyTOTP = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) {
      setError("Sesión inválida")
      setStep("credentials")
      return
    }

    // Verificar código TOTP
    if (!verifyTOTP(totpCode, currentUser.twoFactorSecret)) {
      setError("Código de verificación inválido")
      return
    }

    // Completar el login
    completeLogin(currentUser)
  }

  // Completar el proceso de login
  const completeLogin = (user: any) => {
    // Generar JWT seguro
    const token = generateJWT(user.id)

    // Almacenar token en sessionStorage (más seguro que localStorage)
    // En un caso real, usaríamos cookies HttpOnly
    sessionStorage.setItem("auth_token", token)

    // Redirección después del login
    router.push("/secure/dashboard")
  }

  return (
    <div className="container mx-auto py-10 max-w-md">
      <Link href="/" className="text-sm text-blue-500 hover:underline mb-4 block">
        &larr; Volver al inicio
      </Link>

      <Card className="border-green-300">
        <CardHeader className="bg-green-50">
          <CardTitle className="text-green-600">Login Seguro</CardTitle>
          <CardDescription>Esta implementación sigue buenas prácticas de seguridad</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === "credentials" ? (
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Nombre de usuario</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-muted-foreground">
                    Pista: prueba con "password123" para el usuario "admin"
                  </p>
                </div>

                <Button type="submit" className="w-full">
                  Iniciar sesión
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyTOTP}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="totp">Código de verificación</Label>
                  <Input
                    id="totp"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                  />
                  <p className="text-xs text-muted-foreground">Pista: usa "123456" como código de verificación</p>
                </div>

                <Button type="submit" className="w-full">
                  Verificar
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={() => setStep("credentials")}>
                  Volver
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start border-t p-4 bg-green-50">
          <h3 className="font-semibold mb-2">Medidas de seguridad implementadas:</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Contraseñas almacenadas con hash (simulado)</li>
            <li>Límite de intentos de inicio de sesión</li>
            <li>Mensajes de error genéricos</li>
            <li>Autenticación de dos factores</li>
            <li>Tokens JWT con expiración</li>
            <li>Uso de sessionStorage en lugar de localStorage</li>
          </ul>
        </CardFooter>
      </Card>
    </div>
  )
}

