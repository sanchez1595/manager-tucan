from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON, DECIMAL, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class BillingType(str, enum.Enum):
    MONTHLY = "monthly"
    USAGE = "usage"

class ProjectStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    COMPLETED = "completed"

class ServiceType(str, enum.Enum):
    MDM = "mdm"
    DYNAMIC_FORMS = "dynamic_forms"
    REPORTING = "reporting"
    ELEARNING = "elearning"
    OMNICHANNEL = "omnichannel"
    COMMUNICATION_CAMPAIGNS = "communication_campaigns"

# Admin Users (tu equipo)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

# Clientes
class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    email = Column(String, nullable=False)
    legal_representative = Column(String)
    contact_person = Column(String)
    phone = Column(String)
    logo_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    projects = relationship("Project", back_populates="client", cascade="all, delete-orphan")

# Proyectos
class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.ACTIVE)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True))
    
    # Identidad gráfica
    logo_url = Column(String)
    primary_color = Column(String)
    secondary_color = Column(String)
    brand_colors = Column(JSON)  # Paleta completa de colores
    
    # Configuraciones
    billing_type = Column(Enum(BillingType), default=BillingType.MONTHLY)
    billing_rate = Column(DECIMAL(10, 2))  # Valor base para cálculos
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    client = relationship("Client", back_populates="projects")
    services = relationship("ProjectService", back_populates="project", cascade="all, delete-orphan")
    client_users = relationship("ClientUser", back_populates="project", cascade="all, delete-orphan")
    billing_records = relationship("BillingRecord", back_populates="project", cascade="all, delete-orphan")

# Servicios por proyecto
class ProjectService(Base):
    __tablename__ = "project_services"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    service_type = Column(Enum(ServiceType), nullable=False)
    is_active = Column(Boolean, default=False)
    cost_per_unit = Column(DECIMAL(10, 2))  # Costo por unidad/uso
    monthly_cost = Column(DECIMAL(10, 2))   # Costo mensual fijo
    
    # Configuraciones específicas del servicio (JSON flexible)
    service_config = Column(JSON)  # Para credenciales, límites, etc.
    
    activated_at = Column(DateTime(timezone=True))
    deactivated_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="services")
    usage_records = relationship("ServiceUsage", back_populates="service", cascade="all, delete-orphan")

# Usuarios cliente (owners por proyecto)
class ClientUser(Base):
    __tablename__ = "client_users"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    email = Column(String, nullable=False)
    username = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String, default="owner")
    permissions = Column(JSON)  # Permisos específicos
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="client_users")

# Tracking de uso de servicios
class ServiceUsage(Base):
    __tablename__ = "service_usage"

    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("project_services.id"), nullable=False)
    usage_date = Column(DateTime(timezone=True), server_default=func.now())
    usage_type = Column(String)  # email_sent, sms_sent, form_submission, etc.
    quantity = Column(Integer, default=1)
    cost = Column(DECIMAL(10, 2))
    usage_metadata = Column(JSON)  # Información adicional del uso
    
    # Relationships
    service = relationship("ProjectService", back_populates="usage_records")

# Registros de facturación
class BillingRecord(Base):
    __tablename__ = "billing_records"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    billing_period_start = Column(DateTime(timezone=True), nullable=False)
    billing_period_end = Column(DateTime(timezone=True), nullable=False)
    
    # Costos calculados
    total_cost = Column(DECIMAL(10, 2), nullable=False)
    monthly_costs = Column(DECIMAL(10, 2), default=0)
    usage_costs = Column(DECIMAL(10, 2), default=0)
    
    # Detalles por servicio
    cost_breakdown = Column(JSON)  # Detalle de costos por servicio
    
    # Modificaciones manuales
    manual_adjustments = Column(DECIMAL(10, 2), default=0)
    adjustment_notes = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="billing_records")

# Auditoría de cambios críticos
class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String, nullable=False)  # service_activated, service_deactivated, etc.
    entity_type = Column(String, nullable=False)  # project_service, client, etc.
    entity_id = Column(Integer, nullable=False)
    old_values = Column(JSON)
    new_values = Column(JSON)
    ip_address = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User")