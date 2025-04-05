"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Función para verificar JWT
const verifyJWT = (token: string): { valid: boolean; payload: any } => {
  try {
    // En un caso real, verificaríamos la firma
    const parts = token.split(".")
    if (parts.length !== 3) return { valid: false, payload: null }

    // Decodificar payload
    const payload = JSON.parse(atob(parts[1]))

    // Verificar expiración
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false, payload: null }
    }

    return { valid: true, payload }
  } catch (error) {
    return { valid: false, payload: null }
  }
}

export default function SecureDashboard() {
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificación segura de autenticación
    const token = sessionStorage.getItem("auth_token")

    if (!token) {
      router.push("/secure/login")
      return
    }

    // Verificar validez del token
    const { valid, payload } = verifyJWT(token)

    if (!valid) {
      // Token inválido o expirado
      sessionStorage.removeItem("auth_token")
      router.push("/secure/login")
      return
    }

    // Token válido, establecer datos de usuario
    setUserData({
      userId: payload.sub,
      expiresAt: new Date(payload.exp * 1000).toLocaleString(),
      token: token,
    })

    setLoading(false)

    // Configurar temporizador para verificar expiración del token
    const checkInterval = setInterval(() => {
      const currentToken = sessionStorage.getItem("auth_token")
      if (!currentToken || !verifyJWT(currentToken).valid) {
        clearInterval(checkInterval)
        sessionStorage.removeItem("auth_token")
        router.push("/secure/login")
      }
    }, 60000) // Verificar cada minuto

    return () => clearInterval(checkInterval)
  }, [router])

  const handleLogout = () => {
    // Cierre de sesión seguro
    sessionStorage.removeItem("auth_token")
    router.push("/secure/login")
  }

  if (loading) {
    return <p className="text-center py-10">Cargando...</p>
  }

  return (
    <div className="container mx-auto py-10 max-w-md">
      <Link href="/" className="text-sm text-blue-500 hover:underline mb-4 block">
        &larr; Volver al inicio
      </Link>

      <Card className="border-green-300">
        <CardHeader className="bg-green-50">
          <CardTitle className="text-green-600">Dashboard Seguro</CardTitle>
          <CardDescription>Panel de usuario con implementación segura</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 py-4">
            <div>
              <h3 className="font-medium">ID de Usuario:</h3>
              <p className="text-sm text-muted-foreground">{userData.userId}</p>
            </div>

            <div>
              <h3 className="font-medium">Sesión expira:</h3>
              <p className="text-sm text-muted-foreground">{userData.expiresAt}</p>
            </div>

            <div>
              <h3 className="font-medium">Token JWT:</h3>
              <p className="text-xs text-muted-foreground break-all bg-slate-50 p-2 rounded border">{userData.token}</p>
            </div>

            <div className="pt-4">
              <Button onClick={handleLogout} variant="outline" className="w-full">
                Cerrar sesión
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-md">
            <h3 className="font-semibold mb-2">Medidas de seguridad implementadas:</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Verificación del token en cada carga de página</li>
              <li>Verificación periódica de la validez del token</li>
              <li>Tokens con tiempo de expiración</li>
              <li>Cierre de sesión seguro</li>
              <li>Uso de sessionStorage en lugar de localStorage</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

