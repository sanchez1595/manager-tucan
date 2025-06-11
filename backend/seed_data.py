from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import *
from passlib.context import CryptContext
from datetime import datetime, timedelta
import json

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully")

def seed_data():
    """Insert test data into database"""
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(AuditLog).delete()
        db.query(ServiceUsage).delete()
        db.query(BillingRecord).delete()
        db.query(ProjectService).delete()
        db.query(ClientUser).delete()
        db.query(Project).delete()
        db.query(Client).delete()
        db.query(User).delete()
        db.commit()
        
        # Create admin users
        admin_users = [
            User(
                email="admin@tucanmanager.com",
                username="admin",
                hashed_password=pwd_context.hash("admin123"),
                is_active=True
            ),
            User(
                email="developer@tucanmanager.com", 
                username="developer",
                hashed_password=pwd_context.hash("dev123"),
                is_active=True
            )
        ]
        
        for user in admin_users:
            db.add(user)
        db.commit()
        print("✅ Admin users created")
        
        # Create clients
        clients_data = [
            {
                "name": "Acme Corporation",
                "email": "contact@acmecorp.com",
                "legal_representative": "John Smith",
                "contact_person": "Jane Doe",
                "phone": "+1-555-0123",
                "logo_url": "https://example.com/logos/acme.png"
            },
            {
                "name": "TechStart Solutions",
                "email": "info@techstart.com",
                "legal_representative": "Maria Garcia",
                "contact_person": "Carlos Rodriguez",
                "phone": "+1-555-0456", 
                "logo_url": "https://example.com/logos/techstart.png"
            },
            {
                "name": "Global Enterprises",
                "email": "business@globalent.com",
                "legal_representative": "Robert Johnson",
                "contact_person": "Sarah Wilson",
                "phone": "+1-555-0789",
                "logo_url": "https://example.com/logos/global.png"
            },
            {
                "name": "Innovation Labs",
                "email": "hello@innovlabs.com",
                "legal_representative": "Dr. Emily Chen",
                "contact_person": "Michael Brown",
                "phone": "+1-555-0321",
                "logo_url": "https://example.com/logos/innovlabs.png"
            }
        ]
        
        clients = []
        for client_data in clients_data:
            client = Client(**client_data)
            db.add(client)
            clients.append(client)
        db.commit()
        print("✅ Clients created")
        
        # Create projects
        projects_data = [
            {
                "client": clients[0],
                "name": "Employee Management System",
                "description": "Complete HR management platform with MDM and reporting capabilities",
                "status": ProjectStatus.ACTIVE,
                "start_date": datetime.now() - timedelta(days=90),
                "logo_url": "https://example.com/projects/emp-mgmt.png",
                "primary_color": "#2563eb",
                "secondary_color": "#1e40af",
                "brand_colors": {"accent": "#3b82f6", "success": "#22c55e", "warning": "#f59e0b"},
                "billing_type": BillingType.MONTHLY,
                "billing_rate": 2500.00
            },
            {
                "client": clients[1],
                "name": "Customer Survey Platform",
                "description": "Dynamic forms and communication campaigns for customer feedback",
                "status": ProjectStatus.ACTIVE,
                "start_date": datetime.now() - timedelta(days=60),
                "logo_url": "https://example.com/projects/survey.png",
                "primary_color": "#dc2626",
                "secondary_color": "#b91c1c",
                "brand_colors": {"accent": "#ef4444", "success": "#16a34a", "warning": "#ea580c"},
                "billing_type": BillingType.USAGE,
                "billing_rate": 0.25
            },
            {
                "client": clients[2],
                "name": "Training Portal",
                "description": "E-learning platform with progress tracking and certificates",
                "status": ProjectStatus.ACTIVE,
                "start_date": datetime.now() - timedelta(days=30),
                "logo_url": "https://example.com/projects/training.png",
                "primary_color": "#059669",
                "secondary_color": "#047857",
                "brand_colors": {"accent": "#10b981", "success": "#22c55e", "warning": "#f59e0b"},
                "billing_type": BillingType.MONTHLY,
                "billing_rate": 1800.00
            },
            {
                "client": clients[3],
                "name": "Omnichannel Communications",
                "description": "Multi-channel communication platform with analytics",
                "status": ProjectStatus.ACTIVE,
                "start_date": datetime.now() - timedelta(days=15),
                "logo_url": "https://example.com/projects/omni.png",
                "primary_color": "#7c3aed",
                "secondary_color": "#6d28d9",
                "brand_colors": {"accent": "#8b5cf6", "success": "#22c55e", "warning": "#f59e0b"},
                "billing_type": BillingType.USAGE,
                "billing_rate": 0.15
            }
        ]
        
        projects = []
        for project_data in projects_data:
            client = project_data.pop("client")
            project = Project(client_id=client.id, **project_data)
            db.add(project)
            projects.append(project)
        db.commit()
        print("✅ Projects created")
        
        # Create project services
        services_data = [
            # Acme Corporation - Employee Management
            {"project": projects[0], "service_type": ServiceType.MDM, "is_active": True, "monthly_cost": 800.00},
            {"project": projects[0], "service_type": ServiceType.REPORTING, "is_active": True, "monthly_cost": 400.00},
            {"project": projects[0], "service_type": ServiceType.DYNAMIC_FORMS, "is_active": True, "monthly_cost": 300.00},
            
            # TechStart - Survey Platform
            {"project": projects[1], "service_type": ServiceType.DYNAMIC_FORMS, "is_active": True, "cost_per_unit": 0.10},
            {"project": projects[1], "service_type": ServiceType.COMMUNICATION_CAMPAIGNS, "is_active": True, "cost_per_unit": 0.05},
            {"project": projects[1], "service_type": ServiceType.REPORTING, "is_active": True, "monthly_cost": 200.00},
            
            # Global Enterprises - Training
            {"project": projects[2], "service_type": ServiceType.ELEARNING, "is_active": True, "monthly_cost": 1200.00},
            {"project": projects[2], "service_type": ServiceType.REPORTING, "is_active": True, "monthly_cost": 300.00},
            
            # Innovation Labs - Omnichannel
            {"project": projects[3], "service_type": ServiceType.OMNICHANNEL, "is_active": True, "cost_per_unit": 0.08},
            {"project": projects[3], "service_type": ServiceType.COMMUNICATION_CAMPAIGNS, "is_active": True, "cost_per_unit": 0.03},
            {"project": projects[3], "service_type": ServiceType.REPORTING, "is_active": True, "monthly_cost": 250.00},
        ]
        
        for service_data in services_data:
            project = service_data.pop("project")
            service = ProjectService(
                project_id=project.id,
                activated_at=datetime.now() - timedelta(days=30),
                **service_data
            )
            db.add(service)
        db.commit()
        print("✅ Project services created")
        
        # Create client users
        client_users_data = [
            {"project": projects[0], "email": "admin@acmecorp.com", "username": "acme_admin", "full_name": "John Smith", "role": "owner"},
            {"project": projects[0], "email": "hr@acmecorp.com", "username": "acme_hr", "full_name": "Jane Doe", "role": "manager"},
            
            {"project": projects[1], "email": "admin@techstart.com", "username": "tech_admin", "full_name": "Maria Garcia", "role": "owner"},
            
            {"project": projects[2], "email": "admin@globalent.com", "username": "global_admin", "full_name": "Robert Johnson", "role": "owner"},
            {"project": projects[2], "email": "training@globalent.com", "username": "global_trainer", "full_name": "Sarah Wilson", "role": "trainer"},
            
            {"project": projects[3], "email": "admin@innovlabs.com", "username": "innov_admin", "full_name": "Dr. Emily Chen", "role": "owner"},
        ]
        
        for user_data in client_users_data:
            project = user_data.pop("project")
            client_user = ClientUser(project_id=project.id, **user_data)
            db.add(client_user)
        db.commit()
        print("✅ Client users created")
        
        # Create some usage records
        usage_records = []
        for project in projects:
            for service in project.services:
                if service.cost_per_unit:  # Usage-based services
                    for i in range(50):  # 50 usage records per service
                        usage = ServiceUsage(
                            service_id=service.id,
                            usage_date=datetime.now() - timedelta(days=i),
                            usage_type=f"{service.service_type.value}_usage",
                            quantity=1,
                            cost=service.cost_per_unit
                        )
                        db.add(usage)
        db.commit()
        print("✅ Usage records created")
        
        # Create billing records
        for project in projects:
            billing_record = BillingRecord(
                project_id=project.id,
                billing_period_start=datetime.now() - timedelta(days=30),
                billing_period_end=datetime.now(),
                total_cost=sum(s.monthly_cost or 0 for s in project.services if s.is_active),
                monthly_costs=sum(s.monthly_cost or 0 for s in project.services if s.is_active),
                usage_costs=sum(s.cost_per_unit or 0 for s in project.services if s.is_active and s.cost_per_unit) * 50,
                cost_breakdown={
                    service.service_type.value: {
                        "monthly": float(service.monthly_cost or 0),
                        "usage": float(service.cost_per_unit or 0) * 50 if service.cost_per_unit else 0
                    }
                    for service in project.services if service.is_active
                }
            )
            db.add(billing_record)
        db.commit()
        print("✅ Billing records created")
        
        print("\n🎉 Test data inserted successfully!")
        print(f"📊 Created:")
        print(f"   - {len(admin_users)} admin users")
        print(f"   - {len(clients)} clients")
        print(f"   - {len(projects)} projects")
        print(f"   - {len(services_data)} services")
        print(f"   - {len(client_users_data)} client users")
        print(f"   - Usage and billing records")
        
    except Exception as e:
        print(f"❌ Error inserting data: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Creating database tables and inserting test data...")
    create_tables()
    seed_data()