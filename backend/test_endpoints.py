import requests
import json

def test_endpoints():
    """Test API endpoints"""
    base_url = "http://127.0.0.1:8000"
    
    print("🧪 Testing API endpoints...")
    
    # Test health
    try:
        response = requests.get(f"{base_url}/health")
        print(f"✅ Health: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ Health endpoint failed: {e}")
        return
    
    # Test clients
    try:
        response = requests.get(f"{base_url}/clients")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Clients: {response.status_code} - Found {len(data.get('clients', []))} clients")
            if data.get('clients'):
                first_client = data['clients'][0]
                print(f"   First client: {first_client.get('name')} (ID: {first_client.get('id')})")
        else:
            print(f"❌ Clients: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Clients endpoint failed: {e}")
    
    # Test specific client
    try:
        response = requests.get(f"{base_url}/clients/1")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Client 1: {response.status_code} - {data.get('name')}")
            print(f"   Projects: {len(data.get('projects', []))}")
            if data.get('projects'):
                for project in data['projects']:
                    print(f"     - {project.get('name')} (ID: {project.get('id')})")
        else:
            print(f"❌ Client 1: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Client 1 endpoint failed: {e}")
    
    # Test project services
    try:
        response = requests.get(f"{base_url}/projects/1/services")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Project 1 services: {response.status_code}")
            print(f"   Services found: {json.dumps(data, indent=2)}")
        else:
            print(f"❌ Project 1 services: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Project 1 services endpoint failed: {e}")

if __name__ == "__main__":
    test_endpoints()