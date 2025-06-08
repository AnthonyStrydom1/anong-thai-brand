
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
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Customer endpoints
  async createCustomer(customerData: Omit<Customer, 'id' | 'created_at'>) {
    return this.request<{ message: string; customer: Customer }>('/create-customer', {
      method: 'POST',
      body: JSON.stringify(customerData),
    })
  }

  async updateCustomer(id: string, updates: Partial<Omit<Customer, 'id' | 'created_at'>>) {
    return this.request<{ message: string; customer: Customer }>('/update-customer', {
      method: 'POST',
      body: JSON.stringify({ id, ...updates }),
    })
  }

  async getCustomers(limit = 50, offset = 0) {
    return this.request<{ customers: Customer[] }>(`/customers?limit=${limit}&offset=${offset}`)
  }

  // Product endpoints
  async getProducts(params?: { category?: string; search?: string; limit?: number }) {
    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.append('category', params.category)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const queryString = queryParams.toString()
    return this.request<{ products: Product[] }>(`/products${queryString ? `?${queryString}` : ''}`)
  }

  async getProduct(id: string) {
    return this.request<{ product: Product }>(`/products/${id}`)
  }

  async createProduct(productData: Omit<Product, 'id' | 'created_at'>) {
    return this.request<{ message: string; product: Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  }

  // Contact endpoints
  async submitContactForm(contactData: ContactSubmission) {
    return this.request<{ message: string; submission: any }>('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    })
  }

  async getContactSubmissions() {
    return this.request<{ submissions: any[] }>('/contact')
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string }>('/health')
  }
}

export const apiService = new ApiService()
