"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Activity, 
  Users, 
  Server, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Zap,
  Database,
  Wifi,
  Shield,
  Download
} from "lucide-react"

const ReportsPage = () => {
  const [timeRange, setTimeRange] = useState("7d")

  // Mock data para métricas
  const systemMetrics = {
    totalClients: 48,
    activeUsers: 156,
    systemUptime: 99.8,
    responseTime: 245,
    totalProjects: 89,
    activeProjects: 67
  }

  const performanceData = [
    { service: "MDM", uptime: 99.9, responseTime: 180, requests: 12500, errors: 3 },
    { service: "Formularios", uptime: 99.5, responseTime: 320, requests: 8900, errors: 12 },
    { service: "Reportería", uptime: 98.8, responseTime: 450, requests: 6700, errors: 25 },
    { service: "E-Learning", uptime: 99.2, responseTime: 280, requests: 4300, errors: 8 },
    { service: "Omnichannel", uptime: 97.5, responseTime: 680, requests: 2100, errors: 45 },
    { service: "Campañas", uptime: 99.7, responseTime: 220, requests: 3400, errors: 2 }
  ]

  const alertsData = [
    { id: 1, type: "error", service: "Omnichannel", message: "Alto tiempo de respuesta detectado", time: "hace 5 min", severity: "high" },
    { id: 2, type: "warning", service: "Reportería", message: "Uso de memoria por encima del 80%", time: "hace 12 min", severity: "medium" },
    { id: 3, type: "info", service: "MDM", message: "Actualización de sistema completada", time: "hace 1 hora", severity: "low" },
    { id: 4, type: "error", service: "Formularios", message: "Conexión a base de datos intermitente", time: "hace 2 horas", severity: "high" }
  ]

  const clientUsageData = [
    { client: "Empresa ABC Corp", projects: 3, users: 25, storage: 2.3, bandwidth: 145 },
    { client: "Tech Solutions Ltd", projects: 2, users: 18, storage: 1.8, bandwidth: 98 },
    { client: "Digital Innovation SA", projects: 1, users: 8, storage: 0.9, bandwidth: 45 },
    { client: "Global Tech Inc", projects: 5, users: 42, storage: 4.1, bandwidth: 287 }
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error": return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning": return <Clock className="h-4 w-4 text-yellow-500" />
      case "info": return <CheckCircle className="h-4 w-4 text-blue-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    const variants = {
      high: "bg-red-50 text-red-700 border-red-200",
      medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
      low: "bg-blue-50 text-blue-700 border-blue-200"
    }
    return (
      <Badge className={`${variants[severity as keyof typeof variants]} text-xs`}>
        {severity === "high" ? "Alta" : severity === "medium" ? "Media" : "Baja"}
      </Badge>
    )
  }

  const getUptimeBadge = (uptime: number) => {
    if (uptime >= 99.5) return "bg-green-50 text-green-700 border-green-200"
    if (uptime >= 98.0) return "bg-yellow-50 text-yellow-700 border-yellow-200"
    return "bg-red-50 text-red-700 border-red-200"
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Observabilidad del Sistema</h1>
            <p className="text-sm text-gray-500">Monitoreo en tiempo real de plataformas y servicios</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-36 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Última hora</SelectItem>
                <SelectItem value="24h">Últimas 24h</SelectItem>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-10 w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Clientes</p>
              <p className="text-xl font-bold text-gray-900">{systemMetrics.totalClients}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Usuarios Activos</p>
              <p className="text-xl font-bold text-gray-900">{systemMetrics.activeUsers}</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <Activity className="h-4 w-4 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Uptime</p>
              <p className="text-xl font-bold text-gray-900">{systemMetrics.systemUptime}%</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <Server className="h-4 w-4 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Resp. Time</p>
              <p className="text-xl font-bold text-gray-900">{systemMetrics.responseTime}ms</p>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Zap className="h-4 w-4 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Proyectos</p>
              <p className="text-xl font-bold text-gray-900">{systemMetrics.totalProjects}</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Database className="h-4 w-4 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Activos</p>
              <p className="text-xl font-bold text-gray-900">{systemMetrics.activeProjects}</p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido por pestañas */}
      <Tabs defaultValue="performance" className="space-y-4 sm:space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1">
            <TabsTrigger value="performance" className="text-xs sm:text-sm py-2 px-2">
              <span className="hidden sm:inline">Rendimiento</span>
              <span className="sm:hidden">Perf.</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="text-xs sm:text-sm py-2 px-2">Alertas</TabsTrigger>
            <TabsTrigger value="usage" className="text-xs sm:text-sm py-2 px-2">
              <span className="hidden sm:inline">Uso por Cliente</span>
              <span className="sm:hidden">Uso</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm py-2 px-2">
              <span className="hidden sm:inline">Seguridad</span>
              <span className="sm:hidden">Seg.</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="mt-6 space-y-4">
            <div className="space-y-4">
              {performanceData.map((service) => (
                <Card key={service.service} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Shield className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{service.service}</h3>
                          <p className="text-sm text-gray-500">{service.requests.toLocaleString()} requests</p>
                        </div>
                      </div>
                      <Badge className={`${getUptimeBadge(service.uptime)} font-medium`}>
                        {service.uptime}% Uptime
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Tiempo de respuesta</p>
                        <p className="text-sm font-medium">{service.responseTime}ms</p>
                        <Progress value={Math.min(service.responseTime / 10, 100)} className="h-2 mt-1" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Requests totales</p>
                        <p className="text-sm font-medium">{service.requests.toLocaleString()}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-600">+12%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Errores</p>
                        <p className="text-sm font-medium text-red-600">{service.errors}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingDown className="h-3 w-3 text-red-500" />
                          <span className="text-xs text-red-600">-5%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="mt-6">
            <div className="space-y-3">
              {alertsData.map((alert) => (
                <div key={alert.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900">{alert.service}</p>
                      {getSeverityBadge(alert.severity)}
                    </div>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="usage" className="mt-6">
            <div className="space-y-4">
              {clientUsageData.map((client) => (
                <Card key={client.client} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">{client.client}</h3>
                      <Badge variant="outline">{client.projects} proyectos</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Usuarios</p>
                        <p className="text-lg font-semibold">{client.users}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Almacenamiento</p>
                        <p className="text-lg font-semibold">{client.storage} GB</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Ancho de banda</p>
                        <p className="text-lg font-semibold">{client.bandwidth} MB</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Estado</p>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600">Activo</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Autenticación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Intentos fallidos</span>
                      <span className="text-sm font-medium">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Sesiones activas</span>
                      <span className="text-sm font-medium">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">2FA habilitado</span>
                      <span className="text-sm font-medium text-green-600">87%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-blue-600" />
                    Conexiones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">IPs únicas</span>
                      <span className="text-sm font-medium">342</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Conexiones SSL</span>
                      <span className="text-sm font-medium text-green-600">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">IPs bloqueadas</span>
                      <span className="text-sm font-medium text-red-600">12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    Amenazas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Intentos de ataque</span>
                      <span className="text-sm font-medium text-red-600">7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Malware detectado</span>
                      <span className="text-sm font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Vulnerabilidades</span>
                      <span className="text-sm font-medium text-yellow-600">3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default ReportsPage