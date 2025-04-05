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

// Simulación de base de datos de usuarios (¡INSEGURO! - contraseñas en texto plano)
const users = [
  { id: 1, username: "admin", password: "password123" },
  { id: 2, username: "usuario", password: "123456" },
]

export default function InsecureLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  // Función de login insegura
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Vulnerabilidad: Comparación directa de contraseñas en texto plano
    const user = users.find((u) => u.username === username && u.password === password)

    if (user) {
      // Vulnerabilidad: Token de sesión predecible basado en timestamp
      const insecureToken = `token_${Date.now()}_${user.id}`

      // Almacenamiento inseguro del token en localStorage
      localStorage.setItem("auth_token", insecureToken)
      localStorage.setItem("user_id", user.id.toString())

      // Redirección después del login
      router.push("/insecure/dashboard")
    } else {
      // Vulnerabilidad: Mensaje de error específico que revela información
      if (users.some((u) => u.username === username)) {
        setError("Contraseña incorrecta para este usuario")
      } else {
        setError("Usuario no encontrado")
      }
    }
  }

  return (
    <div className="container mx-auto py-10 max-w-md">
      <Link href="/" className="text-sm text-blue-500 hover:underline mb-4 block">
        &larr; Volver al inicio
      </Link>

      <Card className="border-red-300">
        <CardHeader className="bg-red-50">
          <CardTitle className="text-red-500">Login Inseguro</CardTitle>
          <CardDescription>Esta implementación contiene vulnerabilidades de autenticación</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
                <p className="text-xs text-muted-foreground">Pista: prueba con "password123" para el usuario "admin"</p>
              </div>

              <Button type="submit" className="w-full">
                Iniciar sesión
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-start border-t p-4 bg-red-50">
          <h3 className="font-semibold mb-2">Vulnerabilidades presentes:</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Contraseñas almacenadas en texto plano</li>
            <li>No hay límite de intentos de inicio de sesión</li>
            <li>Mensajes de error que revelan información</li>
            <li>Tokens de sesión predecibles</li>
            <li>Almacenamiento inseguro de tokens en localStorage</li>
          </ul>
        </CardFooter>
      </Card>
    </div>
  )
}

