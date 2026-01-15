import { projectId, publicAnonKey } from './supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c4cc4184`;

interface ApiOptions {
  method?: string;
  body?: any;
  requireAuth?: boolean;
}

async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const { method = 'GET', body, requireAuth = false } = options;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (requireAuth) {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

// Auth API
export const authApi = {
  signup: async (email: string, password: string, name: string) => {
    return apiCall('/auth/signup', {
      method: 'POST',
      body: { email, password, name }
    });
  },
  
  getUser: async () => {
    return apiCall('/auth/user', { requireAuth: true });
  }
};

// Events API
export const eventsApi = {
  getAll: async () => {
    return apiCall('/events');
  },
  
  create: async (event: any) => {
    return apiCall('/events', {
      method: 'POST',
      body: event,
      requireAuth: true
    });
  },
  
  update: async (id: string, updates: any) => {
    return apiCall(`/events/${id}`, {
      method: 'PUT',
      body: updates,
      requireAuth: true
    });
  },
  
  delete: async (id: string) => {
    return apiCall(`/events/${id}`, {
      method: 'DELETE',
      requireAuth: true
    });
  }
};

// News API
export const newsApi = {
  getAll: async () => {
    return apiCall('/news');
  },
  
  create: async (article: any) => {
    return apiCall('/news', {
      method: 'POST',
      body: article,
      requireAuth: true
    });
  },
  
  update: async (id: string, updates: any) => {
    return apiCall(`/news/${id}`, {
      method: 'PUT',
      body: updates,
      requireAuth: true
    });
  },
  
  delete: async (id: string) => {
    return apiCall(`/news/${id}`, {
      method: 'DELETE',
      requireAuth: true
    });
  }
};

// Media API
export const mediaApi = {
  getAll: async () => {
    return apiCall('/media');
  },
  
  create: async (mediaItem: any) => {
    return apiCall('/media', {
      method: 'POST',
      body: mediaItem,
      requireAuth: true
    });
  },
  
  update: async (id: string, updates: any) => {
    return apiCall(`/media/${id}`, {
      method: 'PUT',
      body: updates,
      requireAuth: true
    });
  },
  
  delete: async (id: string) => {
    return apiCall(`/media/${id}`, {
      method: 'DELETE',
      requireAuth: true
    });
  }
};

// Settings API
export const settingsApi = {
  get: async () => {
    return apiCall('/settings');
  },
  
  update: async (settings: any) => {
    return apiCall('/settings', {
      method: 'PUT',
      body: settings,
      requireAuth: true
    });
  }
};

// Testimonies API
export const testimoniesApi = {
  getAll: async () => {
    return apiCall('/testimonies');
  },
  
  create: async (testimony: any) => {
    return apiCall('/testimonies', {
      method: 'POST',
      body: testimony,
      requireAuth: true
    });
  },
  
  update: async (id: string, updates: any) => {
    return apiCall(`/testimonies/${id}`, {
      method: 'PUT',
      body: updates,
      requireAuth: true
    });
  },
  
  delete: async (id: string) => {
    return apiCall(`/testimonies/${id}`, {
      method: 'DELETE',
      requireAuth: true
    });
  }
};

// Leaders API
export const leadersApi = {
  getAll: async () => {
    return apiCall('/leaders');
  },
  
  create: async (leader: any) => {
    return apiCall('/leaders', {
      method: 'POST',
      body: leader,
      requireAuth: true
    });
  },
  
  update: async (id: string, updates: any) => {
    return apiCall(`/leaders/${id}`, {
      method: 'PUT',
      body: updates,
      requireAuth: true
    });
  },
  
  delete: async (id: string) => {
    return apiCall(`/leaders/${id}`, {
      method: 'DELETE',
      requireAuth: true
    });
  }
};

// Upload API
export const uploadApi = {
  uploadFile: async (file: File) => {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'File upload failed');
    }

    return response.json();
  }
};