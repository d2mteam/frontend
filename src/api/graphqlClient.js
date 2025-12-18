/**
 * GraphQL Client for VolunteerHub Backend
 * Base URL: /graphql (proxied by Vite)
 */

const GRAPHQL_ENDPOINT = '/graphql';
const REST_API_BASE = '/api';

class GraphQLClient {
  constructor() {
    this.endpoint = GRAPHQL_ENDPOINT;
  }

  getAuthToken() {
    // Get from cookie (refresh token is HttpOnly, but we store access token in localStorage temporarily)
    return localStorage.getItem('vh_access_token');
  }

  setAuthToken(token) {
    localStorage.setItem('vh_access_token', token);
  }

  clearAuthToken() {
    localStorage.removeItem('vh_access_token');
  }

  async query(queryString, variables = {}) {
    const token = this.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: queryString,
        variables,
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data;
  }

  async mutation(mutationString, variables = {}) {
    return this.query(mutationString, variables);
  }
}

// Create singleton instance
const graphqlClient = new GraphQLClient();

export default graphqlClient;

// Export helper for REST endpoints
export const restAPI = {
  async post(endpoint, body, requiresAuth = true) {
    const token = graphqlClient.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${REST_API_BASE}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      credentials: 'include', // Include cookies for refresh token
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  },

  async get(endpoint, requiresAuth = true) {
    const token = graphqlClient.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${REST_API_BASE}${endpoint}`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  },

  async put(endpoint, body, requiresAuth = true) {
    const token = graphqlClient.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${REST_API_BASE}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  },
};
