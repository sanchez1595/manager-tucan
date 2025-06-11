import requests
import json

def test_full_flow():
    """Test complete flow: login -> get clients -> get client detail -> get services"""
    base_url = "http://127.0.0.1:8000"
    
    print("🧪 Testing complete flow...")
    
    # Step 1: Login
    login_data = {
        'username': 'admin',
        'password': 'admin123'
    }
    
    try:
        print("\n1️⃣ Testing login...")
        response = requests.post(f"{base_url}/auth/login", data=login_data)
        if response.status_code == 200:
            token_data = response.json()
            token = token_data['access_token']
            print(f"✅ Login successful")
            
            headers = {'Authorization': f'Bearer {token}'}
            
            # Step 2: Get clients list
            print("\n2️⃣ Testing clients list...")
            response = requests.get(f"{base_url}/clients", headers=headers)
            if response.status_code == 200:
                clients_data = response.json()
                clients = clients_data.get('clients', [])
                print(f"✅ Clients list: Found {len(clients)} clients")
                
                if clients:
                    first_client = clients[0]
                    client_id = first_client.get('id')
                    print(f"   First client: {first_client.get('name')} (ID: {client_id})")
                    
                    # Step 3: Get client detail
                    print(f"\n3️⃣ Testing client detail for ID {client_id}...")
                    response = requests.get(f"{base_url}/clients/{client_id}", headers=headers)
                    if response.status_code == 200:
                        client_detail = response.json()
                        projects = client_detail.get('projects', [])
                        print(f"✅ Client detail: {client_detail.get('name')}")
                        print(f"   Projects: {len(projects)}")
                        
                        # Step 4: Test each project's services
                        for project in projects:
                            project_id = project.get('id')
                            project_name = project.get('name')
                            print(f"\n4️⃣ Testing services for project {project_id}: {project_name}")
                            
                            response = requests.get(f"{base_url}/projects/{project_id}/services", headers=headers)
                            if response.status_code == 200:
                                services_data = response.json()
                                services = services_data.get('services', {})
                                print(f"✅ Project services: {len(services)} services found")
                                
                                for service_key, service_info in services.items():
                                    active_status = service_info.get('is_active', False)
                                    print(f"   - {service_key}: {'✅ Active' if active_status else '⭕ Inactive'}")
                                    
                                    # Step 5: Test service toggle (if there are services)
                                    if services:
                                        test_service = list(services.keys())[0]
                                        current_status = services[test_service].get('is_active', False)
                                        print(f"\n5️⃣ Testing service toggle for {test_service} (current: {current_status})")
                                        
                                        response = requests.post(f"{base_url}/projects/{project_id}/services/{test_service}/toggle", headers=headers)
                                        if response.status_code == 200:
                                            toggle_result = response.json()
                                            new_status = toggle_result.get('service', {}).get('is_active')
                                            print(f"✅ Service toggle successful: {test_service} -> {new_status}")
                                            
                                            # Toggle back to original state
                                            requests.post(f"{base_url}/projects/{project_id}/services/{test_service}/toggle", headers=headers)
                                            print(f"🔄 Restored original state")
                                        else:
                                            print(f"❌ Service toggle failed: {response.status_code} - {response.text}")
                                        break  # Only test one service per project
                            else:
                                print(f"❌ Project {project_id} services: {response.status_code} - {response.text}")
                    else:
                        print(f"❌ Client detail: {response.status_code} - {response.text}")
                else:
                    print("❌ No clients found")
            else:
                print(f"❌ Clients list: {response.status_code} - {response.text}")
        else:
            print(f"❌ Login failed: {response.status_code} - {response.text}")
            
        print(f"\n🎉 Full flow test completed!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    test_full_flow()