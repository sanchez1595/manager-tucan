import { Building2 } from "lucide-react"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-3 font-medium">
            <div className="bg-[#4267b2] text-white flex size-8 items-center justify-center rounded-lg">
              <Building2 className="size-5" />
            </div>
            <span className="text-xl font-bold text-gray-900">Tucan Manager</span>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-[#4267b2] to-[#345995] relative hidden lg:block">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-6 p-8">
            <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
              <Building2 className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Tucan Manager</h2>
              <p className="text-white/80 text-lg max-w-md">
                Plataforma integral para la gestión de clientes y proyectos empresariales
              </p>
            </div>
            <div className="grid gap-4 text-left max-w-md">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white/90">Gestión de clientes y proyectos</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white/90">Módulos de servicios personalizables</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white/90">Reporting y analytics avanzados</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
