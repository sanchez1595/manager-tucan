const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private getAuthHeaders(): Record<string, string> {
    if (typeof window === 'undefined') return {}
    const token = localStorage.getItem('tucan_manager_token')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Dashboard stats
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // Clients
  async getClients(params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params?.search) searchParams.append('search', params.search);
    
    const query = searchParams.toString();
    return this.request(`/clients${query ? `?${query}` : ''}`);
  }

  async getClient(id: number) {
    return this.request(`/clients/${id}`);
  }

  async createClient(client: any) {
    return this.request('/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
  }

  async updateClient(id: number, client: any) {
    return this.request(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(client),
    });
  }

  async deleteClient(id: number) {
    return this.request(`/clients/${id}`, {
      method: 'DELETE',
    });
  }

  async getClientDashboard(id: number) {
    return this.request(`/clients/${id}/dashboard`);
  }

  // Projects
  async getProjects(params?: {
    page?: number;
    per_page?: number;
    client_id?: number;
    status?: string;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params?.client_id) searchParams.append('client_id', params.client_id.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);
    
    const query = searchParams.toString();
    return this.request(`/projects${query ? `?${query}` : ''}`);
  }

  async getProject(id: number) {
    return this.request(`/projects/${id}`);
  }

  async createProject(project: any) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(id: number, project: any) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  }

  async deleteProject(id: number) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async getProjectServices(id: number) {
    return this.request(`/projects/${id}/services`);
  }

  async toggleService(projectId: number, serviceType: string) {
    return this.request(`/projects/${projectId}/services/${serviceType}/toggle`, {
      method: 'POST',
    });
  }

  // Service types
  async getServiceTypes() {
    return this.request('/services/types');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
export default apiService;