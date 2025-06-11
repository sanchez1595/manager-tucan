from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from database import get_db
from routers import auth, clients, projects

app = FastAPI(title="Tucan Manager API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(clients.router)
app.include_router(projects.router)

@app.get("/")
async def root():
    return {"message": "Tucan Manager API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/services/types")
async def get_service_types():
    """Obtener tipos de servicios disponibles"""
    from models import ServiceType
    return {
        "services": [
            {"value": service.value, "label": service.value.replace("_", " ").title()}
            for service in ServiceType
        ]
    }

@app.get("/dashboard/stats")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """Obtener estadísticas generales del dashboard"""
    from models import Client, Project, ProjectService, ProjectStatus
    from sqlalchemy import func, text
    
    # Estadísticas básicas
    total_clients = db.query(Client).count()
    total_projects = db.query(Project).count()
    active_projects = db.query(Project).filter(Project.status == ProjectStatus.ACTIVE).count()
    
    # Servicios activos por tipo
    services_stats = db.query(
        ProjectService.service_type,
        func.count(ProjectService.id).label('count')
    ).filter(ProjectService.is_active == True).group_by(ProjectService.service_type).all()
    
    # Proyectos por estado
    status_stats = db.query(
        Project.status,
        func.count(Project.id).label('count')
    ).group_by(Project.status).all()
    
    # Clientes recientes (últimos 5)
    recent_clients = db.query(Client).order_by(Client.created_at.desc()).limit(5).all()
    
    # Proyectos recientes (últimos 5)
    recent_projects = db.query(Project).options(
        joinedload(Project.client)
    ).order_by(Project.created_at.desc()).limit(5).all()
    
    return {
        "totals": {
            "clients": total_clients,
            "projects": total_projects,
            "active_projects": active_projects
        },
        "services_by_type": {stat.service_type.value: stat.count for stat in services_stats},
        "projects_by_status": {stat.status.value: stat.count for stat in status_stats},
        "recent_clients": [
            {
                "id": client.id,
                "name": client.name,
                "email": client.email,
                "created_at": client.created_at
            } for client in recent_clients
        ],
        "recent_projects": [
            {
                "id": project.id,
                "name": project.name,
                "client_name": project.client.name,
                "status": project.status.value,
                "created_at": project.created_at
            } for project in recent_projects
        ]
    }