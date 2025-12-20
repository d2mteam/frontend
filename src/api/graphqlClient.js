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

    if (!response.ok) {
      const reason = result?.reasonCode;
      const msg = result?.message || result?.error || result?.errors?.[0]?.message || 'Request failed';
      const combined = [reason ? `[${reason}]` : '', msg, response.status ? `(HTTP ${response.status})` : ''].filter(Boolean).join(' ');
      const err = new Error(combined);
      err.response = { status: response.status, data: result };
      throw err;
    }

    if (result.errors) {
      const msg = result.errors.map((e) => e.message).join('; ');
      const err = new Error(msg);
      err.response = { status: response.status, data: result };
      throw err;
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
      const reason = error?.reasonCode;
      const msg = error?.message || error?.error || 'Request failed';
      const combined = [reason ? `[${reason}]` : '', msg, `(HTTP ${response.status})`].filter(Boolean).join(' ');
      const err = new Error(combined);
      err.response = { status: response.status, data: error };
      throw err;
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
      const reason = error?.reasonCode;
      const msg = error?.message || error?.error || 'Request failed';
      const combined = [reason ? `[${reason}]` : '', msg, `(HTTP ${response.status})`].filter(Boolean).join(' ');
      const err = new Error(combined);
      err.response = { status: response.status, data: error };
      throw err;
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
      const reason = error?.reasonCode;
      const msg = error?.message || error?.error || 'Request failed';
      const combined = [reason ? `[${reason}]` : '', msg, `(HTTP ${response.status})`].filter(Boolean).join(' ');
      const err = new Error(combined);
      err.response = { status: response.status, data: error };
      throw err;
    }

    return response.json();
  },
};
