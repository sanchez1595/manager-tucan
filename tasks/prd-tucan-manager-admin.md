# Product Requirements Document (PRD) - Tucan Manager Admin

## Introducción/Overview

**Tucan Manager Admin** es una plataforma administrativa B2B que permite gestionar clientes, sus proyectos, servicios y facturación. La plataforma actúa como centro de control para activar/desactivar servicios de microservicios (MDM, formularios dinámicos, reportería, e-learning, omnichannel, campañas de comunicación) que se reflejan automáticamente en las aplicaciones cliente correspondientes.

**Problema que resuelve:** Centralizar la gestión de múltiples clientes, sus proyectos y servicios contratados, permitiendo control granular sobre qué funcionalidades están disponibles para cada cliente y tracking de costos asociados.

## Objetivos

1. **Gestión centralizada de clientes:** CRUD completo de clientes con información corporativa e identidad gráfica
2. **Administración de proyectos:** Gestión de múltiples proyectos por cliente con configuraciones específicas
3. **Control de servicios:** Activación/desactivación de servicios que afecta directamente las apps cliente
4. **Tracking financiero:** Monitoreo de costos por servicio con modelos de facturación flexibles
5. **Personalización:** Gestión de identidad gráfica por proyecto (colores, logos, branding)

## User Stories

### Como Administrador del Sistema:
- **US1:** Quiero crear, editar y eliminar clientes para mantener actualizada la base de datos corporativa
- **US2:** Quiero ver una lista de todos los clientes con filtros y búsqueda para encontrar información rápidamente
- **US3:** Quiero acceder al detalle de un cliente y ver todos sus proyectos activos
- **US4:** Quiero crear proyectos para cada cliente con información específica del contrato
- **US5:** Quiero activar/desactivar servicios por proyecto sabiendo que esto afectará la app del cliente
- **US6:** Quiero configurar la identidad gráfica (colores, logo) por proyecto
- **US7:** Quiero ver el tracking de costos por cliente/proyecto/servicio
- **US8:** Quiero configurar el modelo de facturación (mensual/por uso) por cliente
- **US9:** Quiero gestionar usuarios owner y sus permisos por cliente

## Functional Requirements

### Módulo de Clientes
1. **CR-01:** El sistema debe permitir crear clientes con: nombre, email, representante legal/contacto, teléfono, fecha de registro
2. **CR-02:** El sistema debe permitir subir y gestionar el logo corporativo del cliente
3. **CR-03:** El sistema debe mostrar una lista paginada de clientes con búsqueda por nombre
4. **CR-04:** El sistema debe permitir editar y eliminar clientes existentes
5. **CR-05:** El sistema debe mostrar un dashboard del cliente con sus proyectos activos

### Módulo de Proyectos
6. **PR-01:** El sistema debe permitir crear proyectos asociados a un cliente específico
7. **PR-02:** Cada proyecto debe contener: nombre, descripción, estado, fecha inicio, fecha fin contrato
8. **PR-03:** El sistema debe permitir configurar identidad gráfica por proyecto (colores, logo)
9. **PR-04:** El sistema debe mostrar los servicios activos por proyecto
10. **PR-05:** El sistema debe permitir gestionar usuarios owner del proyecto

### Módulo de Servicios
11. **SR-01:** El sistema debe ofrecer 6 tipos de servicios: MDM, Formularios Dinámicos, Reportería, E-Learning, Omnichannel, Campañas de Comunicación
12. **SR-02:** El sistema debe permitir activar/desactivar servicios por proyecto mediante toggle switches
13. **SR-03:** Los cambios de estado de servicios deben reflejarse automáticamente en la app cliente
14. **SR-04:** El sistema debe registrar el historial de activación/desactivación de servicios
15. **SR-05:** Cada servicio debe tener un costo asociado configurable
16. **SR-06:** El servicio de Omnichannel debe gestionar canales de comunicación integrados
17. **SR-07:** El servicio de Campañas debe soportar WhatsApp, Email y SMS

### Módulo de Billing
18. **BI-01:** El sistema debe trackear costos por servicio, proyecto y cliente
19. **BI-02:** El sistema debe permitir seleccionar modelo de facturación: mensual o por uso
20. **BI-03:** El sistema debe permitir modificar valores de cálculo de costos
21. **BI-04:** El sistema debe generar reportes de costos por período
22. **BI-05:** El sistema debe mostrar dashboard financiero con métricas clave
23. **BI-06:** El sistema debe trackear consumos específicos de campañas (mensajes enviados, emails, SMS)

### Módulo de Identidad Gráfica
24. **IG-01:** El sistema debe permitir subir logos por proyecto
25. **IG-02:** El sistema debe permitir configurar paleta de colores personalizada por proyecto
26. **IG-03:** El sistema debe previsualizar cómo se verá la identidad en la app cliente
27. **IG-04:** Los cambios de identidad deben aplicarse automáticamente en la app cliente

### Módulo de Servicios de Comunicación
28. **SC-01:** El sistema debe configurar credenciales de WhatsApp Business API por proyecto
29. **SC-02:** El sistema debe configurar parámetros SMTP para email por proyecto
30. **SC-03:** El sistema debe configurar proveedores SMS por proyecto
31. **SC-04:** El sistema debe mostrar estadísticas de uso por canal de comunicación
32. **SC-05:** El sistema debe permitir configurar límites de envío por servicio

## Non-Goals (Out of Scope)

- Funcionalidades de la aplicación cliente (solo gestión administrativa)
- Procesamiento de pagos automático (solo tracking)
- Creación de contenido de campañas (solo habilitación del servicio)
- Gestión de contactos de clientes finales
- Multi-idioma en esta versión inicial
- APIs públicas para terceros
- Envío directo de campañas desde la plataforma admin

## Design Considerations

### UI/UX
- Dashboard principal con métricas clave y accesos rápidos
- Navegación por breadcrumbs: Clientes > Cliente X > Proyecto Y > Servicios
- Tables responsivas con paginación y filtros
- Modal/sidebar forms para crear/editar entidades
- Preview en tiempo real de cambios de identidad gráfica
- Panel de servicios con switches y configuraciones específicas

### Arquitectura
- Separación clara entre módulos (clientes, proyectos, servicios, billing)
- APIs REST para comunicación con apps cliente
- Webhooks para notificar cambios de servicios a microservicios
- Upload de archivos para logos e imágenes
- Configuración segura de credenciales de terceros (WhatsApp, SMTP, SMS)

## Technical Considerations

### Backend
- Relaciones de base de datos: Cliente -> Proyectos -> Servicios -> Configuraciones
- Audit logs para cambios críticos (activación/desactivación servicios)
- Validación de reglas de negocio (no eliminar cliente con proyectos activos)
- APIs para sincronización con apps cliente
- Encriptación de credenciales de servicios de terceros
- Rate limiting para servicios de comunicación

### Frontend
- Componentes reutilizables con shadcn/ui
- Estado global para información de usuario administrador
- Upload de archivos con preview
- Formularios con validación client-side y server-side
- Configuración segura de servicios de terceros
- Dashboard de métricas en tiempo real

## Success Metrics

### Eficiencia Operativa
- Reducir tiempo de gestión de clientes en 50%
- Automatizar 100% de la activación/desactivación de servicios
- Centralizar gestión de identidad gráfica por proyecto

### Control Financiero
- Tracking completo de costos por servicio
- Visibilidad de ingresos proyectados vs reales
- Flexibilidad en modelos de facturación
- Monitoreo de consumos de servicios de comunicación

### Escalabilidad
- Soportar +100 clientes sin degradación de performance
- Gestión simultánea de +500 proyectos
- Activación/desactivación de servicios en <5 segundos
- Procesar configuraciones de múltiples canales de comunicación

## Open Questions

1. **Integración con microservicios:** ¿Cómo notificar cambios de servicios a cada microservicio?
2. **Backup de identidad gráfica:** ¿Versioning de logos y configuraciones visuales?
3. **Auditoría:** ¿Nivel de detalle requerido en logs de cambios?
4. **Performance:** ¿Implementar cache para consultas frecuentes de servicios activos?
5. **Notificaciones:** ¿Sistema de alertas para contratos próximos a vencer?
6. **Seguridad:** ¿Rotación automática de credenciales de servicios de terceros?
7. **Límites:** ¿Implementar rate limiting por cliente en servicios de comunicación?