"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function InsecureDashboard() {
  const [userId, setUserId] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Verificación insegura de autenticación
    const storedToken = localStorage.getItem("auth_token")
    const storedUserId = localStorage.getItem("user_id")

    if (!storedToken || !storedUserId) {
      router.push("/insecure/login")
      return
    }

    // No hay validación del token, simplemente confía en su presencia
    setToken(storedToken)
    setUserId(storedUserId)
  }, [router])

  const handleLogout = () => {
    // Cierre de sesión inseguro - simplemente elimina el token
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_id")
    router.push("/insecure/login")
  }

  if (!userId || !token) {
    return <p className="text-center py-10">Cargando...</p>
  }

  return (
    <div className="container mx-auto py-10 max-w-md">
      <Link href="/" className="text-sm text-blue-500 hover:underline mb-4 block">
        &larr; Volver al inicio
      </Link>

      <Card className="border-red-300">
        <CardHeader className="bg-red-50">
          <CardTitle className="text-red-500">Dashboard Inseguro</CardTitle>
          <CardDescription>Panel de usuario con implementación insegura</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 py-4">
            <div>
              <h3 className="font-medium">ID de Usuario:</h3>
              <p className="text-sm text-muted-foreground">{userId}</p>
            </div>

            <div>
              <h3 className="font-medium">Token de sesión:</h3>
              <p className="text-sm text-muted-foreground break-all">{token}</p>
            </div>

            <div className="pt-4">
              <Button onClick={handleLogout} variant="outline" className="w-full">
                Cerrar sesión
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-red-50 rounded-md">
            <h3 className="font-semibold mb-2">Vulnerabilidades presentes:</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>No hay verificación del token en el servidor</li>
              <li>El token es predecible y no está firmado</li>
              <li>No hay expiración del token</li>
              <li>El ID de usuario está expuesto y puede ser manipulado</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

