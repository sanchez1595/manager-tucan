from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
from models import ProjectStatus, BillingType, ServiceType
from decimal import Decimal

# Auth schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    password: Optional[str] = None

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Client schemas
class ClientBase(BaseModel):
    name: str
    email: EmailStr
    legal_representative: Optional[str] = None
    contact_person: Optional[str] = None
    phone: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    legal_representative: Optional[str] = None
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    logo_url: Optional[str] = None

class Client(ClientBase):
    id: int
    logo_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ClientWithProjects(Client):
    projects: List["Project"] = []

# Project schemas
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: ProjectStatus = ProjectStatus.ACTIVE
    start_date: datetime
    end_date: Optional[datetime] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    billing_type: BillingType = BillingType.MONTHLY
    billing_rate: Optional[Decimal] = None

class ProjectCreate(ProjectBase):
    client_id: int

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    logo_url: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    brand_colors: Optional[dict] = None
    billing_type: Optional[BillingType] = None
    billing_rate: Optional[Decimal] = None

class Project(ProjectBase):
    id: int
    client_id: int
    logo_url: Optional[str] = None
    brand_colors: Optional[dict] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ProjectWithClient(Project):
    client: Client

class ProjectWithServices(Project):
    services: List["ProjectService"] = []

# Service schemas
class ProjectServiceBase(BaseModel):
    service_type: ServiceType
    cost_per_unit: Optional[Decimal] = None
    monthly_cost: Optional[Decimal] = None
    service_config: Optional[dict] = None

class ProjectServiceCreate(ProjectServiceBase):
    project_id: int

class ProjectServiceUpdate(BaseModel):
    is_active: Optional[bool] = None
    cost_per_unit: Optional[Decimal] = None
    monthly_cost: Optional[Decimal] = None
    service_config: Optional[dict] = None

class ProjectService(ProjectServiceBase):
    id: int
    project_id: int
    is_active: bool
    activated_at: Optional[datetime] = None
    deactivated_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Client User schemas
class ClientUserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    role: str = "owner"
    permissions: Optional[dict] = None

class ClientUserCreate(ClientUserBase):
    project_id: int

class ClientUserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    permissions: Optional[dict] = None
    is_active: Optional[bool] = None

class ClientUser(ClientUserBase):
    id: int
    project_id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Response schemas
class ClientListResponse(BaseModel):
    clients: List[Client]
    total: int
    page: int
    per_page: int
    total_pages: int

class ProjectListResponse(BaseModel):
    projects: List[ProjectWithClient]
    total: int
    page: int
    per_page: int
    total_pages: int