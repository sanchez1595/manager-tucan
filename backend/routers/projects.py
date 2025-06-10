from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, func
from typing import Optional
from database import get_db
from models import Project, Client, ProjectService, ServiceType, User
from schemas import (
    ProjectCreate, ProjectUpdate, Project as ProjectSchema,
    ProjectWithClient, ProjectWithServices, ProjectListResponse
)
from auth import get_current_user
import math

router = APIRouter(prefix="/projects", tags=["projects"])

@router.post("/", response_model=ProjectSchema)
async def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crear un nuevo proyecto"""
    
    # Verificar que el cliente existe
    client = db.query(Client).filter(Client.id == project.client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )
    
    db_project = Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    # Crear servicios por defecto (todos desactivados)
    for service_type in ServiceType:
        project_service = ProjectService(
            project_id=db_project.id,
            service_type=service_type,
            is_active=False
        )
        db.add(project_service)
    
    db.commit()
    
    return db_project

@router.get("/", response_model=ProjectListResponse)
async def get_projects(
    page: int = Query(1, ge=1, description="Número de página"),
    per_page: int = Query(10, ge=1, le=100, description="Elementos por página"),
    client_id: Optional[int] = Query(None, description="Filtrar por cliente"),
    status: Optional[str] = Query(None, description="Filtrar por estado"),
    search: Optional[str] = Query(None, description="Buscar por nombre"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener lista paginada de proyectos con filtros"""
    
    query = db.query(Project).options(joinedload(Project.client))
    
    # Aplicar filtros
    if client_id:
        query = query.filter(Project.client_id == client_id)
    
    if status:
        query = query.filter(Project.status == status)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(Project.name.ilike(search_filter))
    
    # Contar total
    total = query.count()
    total_pages = math.ceil(total / per_page)
    
    # Aplicar paginación
    offset = (page - 1) * per_page
    projects = query.offset(offset).limit(per_page).all()
    
    return ProjectListResponse(
        projects=projects,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages
    )

@router.get("/{project_id}", response_model=ProjectWithServices)
async def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener proyecto por ID con servicios"""
    
    project = db.query(Project).options(
        joinedload(Project.client),
        joinedload(Project.services)
    ).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proyecto no encontrado"
        )
    
    return project

@router.put("/{project_id}", response_model=ProjectSchema)
async def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Actualizar proyecto existente"""
    
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proyecto no encontrado"
        )
    
    # Actualizar campos
    update_data = project_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_project, field, value)
    
    db.commit()
    db.refresh(db_project)
    
    return db_project

@router.delete("/{project_id}")
async def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Eliminar proyecto"""
    
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proyecto no encontrado"
        )
    
    db.delete(db_project)
    db.commit()
    
    return {"message": "Proyecto eliminado exitosamente"}

@router.get("/{project_id}/services")
async def get_project_services(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener servicios del proyecto con su estado"""
    
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proyecto no encontrado"
        )
    
    services = db.query(ProjectService).filter(
        ProjectService.project_id == project_id
    ).all()
    
    # Organizar servicios por tipo
    services_dict = {}
    for service in services:
        services_dict[service.service_type.value] = {
            "id": service.id,
            "is_active": service.is_active,
            "cost_per_unit": service.cost_per_unit,
            "monthly_cost": service.monthly_cost,
            "activated_at": service.activated_at,
            "deactivated_at": service.deactivated_at
        }
    
    return {
        "project_id": project_id,
        "project_name": project.name,
        "services": services_dict
    }

@router.post("/{project_id}/services/{service_type}/toggle")
async def toggle_service(
    project_id: int,
    service_type: ServiceType,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Activar/desactivar un servicio específico"""
    
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proyecto no encontrado"
        )
    
    service = db.query(ProjectService).filter(
        ProjectService.project_id == project_id,
        ProjectService.service_type == service_type
    ).first()
    
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Servicio no encontrado"
        )
    
    # Toggle del estado
    service.is_active = not service.is_active
    
    if service.is_active:
        service.activated_at = func.now()
        service.deactivated_at = None
    else:
        service.deactivated_at = func.now()
    
    db.commit()
    db.refresh(service)
    
    # TODO: Aquí se podría enviar webhook a microservicios
    # notify_service_change(project_id, service_type, service.is_active)
    
    return {
        "message": f"Servicio {service_type.value} {'activado' if service.is_active else 'desactivado'} exitosamente",
        "service": {
            "type": service_type.value,
            "is_active": service.is_active,
            "activated_at": service.activated_at,
            "deactivated_at": service.deactivated_at
        }
    }