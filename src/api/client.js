/**
 * API Client Service
 * Handles all API requests and integrates with Toast Service
 */

const API_BASE_URL = '/api';

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'An error occurred',
        toastType: data.toastType || 'error',
        errors: data.errors || null,
      };
    }

    return {
      success: true,
      message: data.message,
      toastType: data.toastType || 'success',
      data: data.data || null,
    };
  }

  // AUTH ENDPOINTS
  async register(userData) {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async login(email, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const result = await this.handleResponse(response);
    if (result.data?.token) {
      this.setToken(result.data.token);
    }
    return result;
  }

  async getCurrentUser() {
    const response = await fetch(`${this.baseURL}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateProfile(userData) {
    const response = await fetch(`${this.baseURL}/auth/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async deactivateAccount() {
    const response = await fetch(`${this.baseURL}/auth/deactivate`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // EVENT ENDPOINTS
  async getAllEvents(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters,
    });
    const response = await fetch(`${this.baseURL}/events/all?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getEventById(eventId) {
    const response = await fetch(`${this.baseURL}/events/${eventId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createEvent(eventData) {
    const response = await fetch(`${this.baseURL}/events/create`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(eventData),
    });
    return this.handleResponse(response);
  }

  async updateEvent(eventId, eventData) {
    const response = await fetch(`${this.baseURL}/events/${eventId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(eventData),
    });
    return this.handleResponse(response);
  }

  async registerForEvent(eventId) {
    const response = await fetch(`${this.baseURL}/events/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ eventId }),
    });
    return this.handleResponse(response);
  }

  async getUserRegisteredEvents() {
    const response = await fetch(`${this.baseURL}/events/user/registered`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async approveEvent(eventId, approvalStatus) {
    const response = await fetch(`${this.baseURL}/events/${eventId}/approve`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ approvalStatus }),
    });
    return this.handleResponse(response);
  }

  // MEMBERSHIP ENDPOINTS
  async registerMembership(membershipData) {
    const response = await fetch(`${this.baseURL}/membership/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(membershipData),
    });
    return this.handleResponse(response);
  }

  async getAllMemberships(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams({ page, limit, ...filters });
    const response = await fetch(`${this.baseURL}/membership/all?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async approveMembership(membershipId) {
    const response = await fetch(`${this.baseURL}/membership/${membershipId}/approve`, {
      method: 'PUT',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async rejectMembership(membershipId) {
    const response = await fetch(`${this.baseURL}/membership/${membershipId}/reject`, {
      method: 'PUT',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getMembershipStatistics() {
    const response = await fetch(`${this.baseURL}/membership/statistics`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  logout() {
    this.clearToken();
  }

  // Generic HTTP Methods
  async get(url, options = {}) {
    const headers = { ...this.getHeaders(), ...options.headers };
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    const queryParams = options.params ? '?' + new URLSearchParams(options.params).toString() : '';
    
    const response = await fetch(`${fullUrl}${queryParams}`, {
      method: 'GET',
      headers,
    });
    
    if (options.responseType === 'blob') {
      return response.blob();
    }
    
    return this.handleResponse(response);
  }

  async post(url, data, options = {}) {
    const headers = { ...this.getHeaders(), ...options.headers };
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    const body = headers['Content-Type'] === 'multipart/form-data' 
      ? data 
      : JSON.stringify(data);
    
    if (headers['Content-Type'] === 'multipart/form-data') {
      delete headers['Content-Type']; // Let browser set it with boundary
    }
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body,
    });
    
    return this.handleResponse(response);
  }

  async put(url, data, options = {}) {
    const headers = { ...this.getHeaders(), ...options.headers };
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    const response = await fetch(fullUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    
    return this.handleResponse(response);
  }

  async patch(url, data, options = {}) {
    const headers = { ...this.getHeaders(), ...options.headers };
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    const response = await fetch(fullUrl, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });
    
    return this.handleResponse(response);
  }

  async delete(url, options = {}) {
    const headers = { ...this.getHeaders(), ...options.headers };
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    const response = await fetch(fullUrl, {
      method: 'DELETE',
      headers,
    });
    
    return this.handleResponse(response);
  }
}

export default new APIClient();
