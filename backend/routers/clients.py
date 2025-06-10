from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, func
from typing import Optional
from database import get_db
from models import Client, Project, User
from schemas import (
    ClientCreate, ClientUpdate, Client as ClientSchema, 
    ClientWithProjects, ClientListResponse
)
from auth import get_current_user
import math

router = APIRouter(prefix="/clients", tags=["clients"])

@router.post("/", response_model=ClientSchema)
async def create_client(
    client: ClientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crear un nuevo cliente"""
    
    # Verificar que no existe un cliente con el mismo email
    existing_client = db.query(Client).filter(Client.email == client.email).first()
    if existing_client:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un cliente con este email"
        )
    
    db_client = Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    
    return db_client

@router.get("/", response_model=ClientListResponse)
async def get_clients(
    page: int = Query(1, ge=1, description="Número de página"),
    per_page: int = Query(10, ge=1, le=100, description="Elementos por página"),
    search: Optional[str] = Query(None, description="Buscar por nombre o email"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener lista paginada de clientes con búsqueda"""
    
    query = db.query(Client)
    
    # Aplicar filtro de búsqueda
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Client.name.ilike(search_filter),
                Client.email.ilike(search_filter),
                Client.legal_representative.ilike(search_filter),
                Client.contact_person.ilike(search_filter)
            )
        )
    
    # Contar total de registros
    total = query.count()
    total_pages = math.ceil(total / per_page)
    
    # Aplicar paginación
    offset = (page - 1) * per_page
    clients = query.offset(offset).limit(per_page).all()
    
    return ClientListResponse(
        clients=clients,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages
    )

@router.get("/{client_id}", response_model=ClientWithProjects)
async def get_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener cliente por ID con sus proyectos"""
    
    client = db.query(Client).options(
        joinedload(Client.projects)
    ).filter(Client.id == client_id).first()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )
    
    return client

@router.put("/{client_id}", response_model=ClientSchema)
async def update_client(
    client_id: int,
    client_update: ClientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Actualizar cliente existente"""
    
    db_client = db.query(Client).filter(Client.id == client_id).first()
    if not db_client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )
    
    # Verificar email único si se está actualizando
    if client_update.email and client_update.email != db_client.email:
        existing_client = db.query(Client).filter(
            Client.email == client_update.email,
            Client.id != client_id
        ).first()
        if existing_client:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un cliente con este email"
            )
    
    # Actualizar campos
    update_data = client_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_client, field, value)
    
    db.commit()
    db.refresh(db_client)
    
    return db_client

@router.delete("/{client_id}")
async def delete_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Eliminar cliente (solo si no tiene proyectos activos)"""
    
    db_client = db.query(Client).filter(Client.id == client_id).first()
    if not db_client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )
    
    # Verificar que no tenga proyectos activos
    active_projects = db.query(Project).filter(
        Project.client_id == client_id,
        Project.status.in_(["active", "suspended"])
    ).count()
    
    if active_projects > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se puede eliminar el cliente. Tiene {active_projects} proyecto(s) activo(s)"
        )
    
    db.delete(db_client)
    db.commit()
    
    return {"message": "Cliente eliminado exitosamente"}

@router.get("/{client_id}/dashboard")
async def get_client_dashboard(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Dashboard del cliente con métricas principales"""
    
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )
    
    # Obtener métricas
    projects = db.query(Project).filter(Project.client_id == client_id).all()
    
    total_projects = len(projects)
    active_projects = len([p for p in projects if p.status == "active"])
    completed_projects = len([p for p in projects if p.status == "completed"])
    
    # Servicios activos por tipo
    from sqlalchemy import text
    services_query = text("""
        SELECT ps.service_type, COUNT(*) as count
        FROM project_services ps
        JOIN projects p ON ps.project_id = p.id
        WHERE p.client_id = :client_id AND ps.is_active = true
        GROUP BY ps.service_type
    """)
    
    services_result = db.execute(services_query, {"client_id": client_id})
    active_services = {row[0]: row[1] for row in services_result}
    
    return {
        "client": client,
        "metrics": {
            "total_projects": total_projects,
            "active_projects": active_projects,
            "completed_projects": completed_projects,
            "active_services": active_services
        },
        "recent_projects": projects[:5]  # Últimos 5 proyectos
    }