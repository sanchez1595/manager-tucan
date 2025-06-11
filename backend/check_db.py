from sqlalchemy.orm import Session
from database import SessionLocal
from models import *

def check_database():
    """Check what data we have in the database"""
    db = SessionLocal()
    
    try:
        print("🔍 Checking database contents...")
        
        # Check clients
        clients = db.query(Client).all()
        print(f"\n📊 Clients: {len(clients)}")
        for client in clients:
            print(f"  - {client.id}: {client.name}")
        
        # Check projects
        projects = db.query(Project).all()
        print(f"\n📋 Projects: {len(projects)}")
        for project in projects:
            print(f"  - {project.id}: {project.name} (Client: {project.client_id})")
        
        # Check project services
        services = db.query(ProjectService).all()
        print(f"\n⚙️ Project Services: {len(services)}")
        for service in services:
            print(f"  - Project {service.project_id}: {service.service_type.value} (Active: {service.is_active})")
        
        # Check client users
        client_users = db.query(ClientUser).all()
        print(f"\n👥 Client Users: {len(client_users)}")
        for user in client_users:
            print(f"  - {user.email} (Project: {user.project_id})")
        
        # Check specific client with projects and services
        print(f"\n🔍 Detailed check for first client...")
        if clients:
            first_client = clients[0]
            print(f"Client: {first_client.name}")
            print(f"Projects: {len(first_client.projects)}")
            for project in first_client.projects:
                print(f"  - Project: {project.name}")
                print(f"    Services: {len(project.services)}")
                for service in project.services:
                    print(f"      - {service.service_type.value}: {service.is_active}")
                    
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_database()