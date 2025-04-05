import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Demostración de API2:2023 Broken Authentication</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Implementación Insegura</CardTitle>
            <CardDescription>Ejemplo de autenticación con vulnerabilidades comunes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Esta implementación contiene varias vulnerabilidades:</p>
            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li>No hay límite de intentos de inicio de sesión</li>
              <li>Contraseñas almacenadas sin hash</li>
              <li>Tokens de sesión predecibles</li>
              <li>No hay validación de contraseñas</li>
            </ul>
            <Link href="/insecure/login">
              <Button variant="destructive" className="w-full">
                Ver Implementación Insegura
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-500">Implementación Segura</CardTitle>
            <CardDescription>Ejemplo de autenticación siguiendo buenas prácticas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Esta implementación incluye medidas de seguridad:</p>
            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li>Límite de intentos de inicio de sesión</li>
              <li>Contraseñas con hash y salt</li>
              <li>Tokens JWT seguros</li>
              <li>Validación de contraseñas</li>
              <li>Autenticación de dos factores</li>
            </ul>
            <Link href="/secure/login">
              <Button variant="default" className="w-full">
                Ver Implementación Segura
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

