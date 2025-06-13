
const BACKEND_URL = 'https://anong-thai-brand.onrender.com'

export interface Customer {
  id: string
  fullName: string
  email: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url?: string
  created_at: string
}

export interface ContactSubmission {
  name: string
  email: string
  subject?: string
  message: string
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BACKEND_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  private getAuthHeaders(): HeadersInit {
    // Get token from localStorage or session storage
    const token = localStorage.getItem('sb-nyadgiutmweuyxqetfuh-auth-token')
    if (token) {
      try {
        const authData = JSON.parse(token)
        if (authData.access_token) {
          return {
            'Authorization': `Bearer ${authData.access_token}`
          }
        }
      } catch (e) {
        console.error('Error parsing auth token:', e)
      }
    }
    return {}
  }

  // Customer endpoints
  async createCustomer(customerData: Omit<Customer, 'id' | 'created_at'>) {
    return this.request<{ message: string; customer: Customer }>('/api/create-customer', {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders()
      },
      body: JSON.stringify(customerData),
    })
  }

  async updateCustomer(id: string, updates: Partial<Omit<Customer, 'id' | 'created_at'>>) {
    return this.request<{ message: string; customer: Customer }>('/api/update-customer', {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({ id, ...updates }),
    })
  }

  async getCustomers(limit = 50, offset = 0) {
    return this.request<{ customers: Customer[] }>(`/api/customers?limit=${limit}&offset=${offset}`, {
      headers: {
        ...this.getAuthHeaders()
      }
    })
  }

  async getMyCustomer() {
    return this.request<{ customer: Customer }>('/api/customer/me', {
      headers: {
        ...this.getAuthHeaders()
      }
    })
  }

  // Product endpoints (public)
  async getProducts(params?: { category?: string; search?: string; limit?: number }) {
    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.append('category', params.category)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const queryString = queryParams.toString()
    return this.request<{ products: Product[] }>(`/api/products${queryString ? `?${queryString}` : ''}`)
  }

  async getProduct(id: string) {
    return this.request<{ product: Product }>(`/api/products/${id}`)
  }

  async createProduct(productData: Omit<Product, 'id' | 'created_at'>) {
    return this.request<{ message: string; product: Product }>('/api/products', {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders()
      },
      body: JSON.stringify(productData),
    })
  }

  // Contact endpoints (public)
  async submitContactForm(contactData: ContactSubmission) {
    return this.request<{ message: string; submission: any }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    })
  }

  async getContactSubmissions() {
    return this.request<{ submissions: any[] }>('/api/contact', {
      headers: {
        ...this.getAuthHeaders()
      }
    })
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string }>('/health')
  }
}

export const apiService = new ApiService()
