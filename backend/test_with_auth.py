import requests
import json

def test_with_auth():
    """Test API endpoints with authentication"""
    base_url = "http://127.0.0.1:8000"
    
    print("🧪 Testing API endpoints with authentication...")
    
    # Login first
    login_data = {
        'username': 'admin',
        'password': 'admin123'
    }
    
    try:
        response = requests.post(f"{base_url}/auth/login", data=login_data)
        if response.status_code == 200:
            token_data = response.json()
            token = token_data['access_token']
            print(f"✅ Login successful, token: {token[:20]}...")
            
            headers = {'Authorization': f'Bearer {token}'}
            
            # Test clients with auth
            response = requests.get(f"{base_url}/clients", headers=headers)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Clients: {response.status_code} - Found {len(data.get('clients', []))} clients")
                if data.get('clients'):
                    first_client = data['clients'][0]
                    print(f"   First client: {first_client.get('name')} (ID: {first_client.get('id')})")
                    
                    # Test specific client
                    client_id = first_client.get('id')
                    response = requests.get(f"{base_url}/clients/{client_id}", headers=headers)
                    if response.status_code == 200:
                        data = response.json()
                        print(f"✅ Client {client_id}: {response.status_code} - {data.get('name')}")
                        print(f"   Projects: {len(data.get('projects', []))}")
                        if data.get('projects'):
                            for project in data['projects']:
                                print(f"     - {project.get('name')} (ID: {project.get('id')})")
                                
                                # Test project services
                                project_id = project.get('id')
                                response = requests.get(f"{base_url}/projects/{project_id}/services", headers=headers)
                                if response.status_code == 200:
                                    services_data = response.json()
                                    print(f"✅ Project {project_id} services: {response.status_code}")
                                    services = services_data.get('services', {})
                                    print(f"     Services: {len(services)}")
                                    for service_key, service_info in services.items():
                                        print(f"       - {service_key}: {service_info.get('is_active', False)}")
                                else:
                                    print(f"❌ Project {project_id} services: {response.status_code} - {response.text}")
                    else:
                        print(f"❌ Client {client_id}: {response.status_code} - {response.text}")
            else:
                print(f"❌ Clients: {response.status_code} - {response.text}")
        else:
            print(f"❌ Login failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    test_with_auth()