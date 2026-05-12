/**
 * Robust API Service for FarmDirect
 * Handles:
 * - Environment-based Base URL
 * - Automatic Retries with Exponential Backoff
 * - Request Timeouts
 * - Centralized Error Handling
 * - Response Validation
 */

const getBaseUrl = () => {
  // Priority 1: Environment variable from Vite
  const envUrl = import.meta.env.VITE_API_URL;
  const isProd = import.meta.env.PROD;

  console.log(`[API Service] Detection: Environment=${isProd ? 'Production' : 'Development'}`);

  if (envUrl) {
    console.log(`[API Service] Using VITE_API_URL: ${envUrl}`);
    return envUrl.replace(/\/$/, '');
  }

  // Priority 2: Auto-detect environment
  if (isProd) {
    const productionUrl = 'https://hackathonwebapp.onrender.com/api';
    console.log(`[API Service] Production mode detected. Using URL: ${productionUrl}`);
    return productionUrl;
  }

  // Priority 3: Local development fallback
  console.warn('[API Service] No VITE_API_URL found. Falling back to production backend for stability.');
  return 'https://hackathonwebapp.onrender.com/api';
};

const API_BASE_URL = getBaseUrl();
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 2;

/**
 * Custom Error class for API failures
 */
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.isNetworkError = !status;
  }
}

/**
 * Validates the URL format before making a call
 */
const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    console.error('Invalid API URL:', url);
    return false;
  }
};

/**
 * Robust fetch wrapper with timeout and retries
 */
const fetchWithRetry = async (endpoint, options = {}, retries = MAX_RETRIES, backoff = 500) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  if (!validateUrl(url)) {
    throw new ApiError('Invalid API configuration. Please check your environment variables.', 0);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT);

  try {
    console.log(`[API Request] ${options.method || 'GET'} ${url}`);
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
  ...(options.body instanceof FormData
    ? {}
    : { "Content-Type": "application/json" }),
  ...options.headers,
},
});

    clearTimeout(timeoutId);

    // Handle non-200 responses
    if (!response.ok) {
      console.error(`[API Response] Error ${response.status} from ${url}`);
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `HTTP Error ${response.status}` };
      }
      throw new ApiError(errorData.message || 'Server error', response.status, errorData);
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.log(`[API Response] Success (Non-JSON) from ${url}`);
      return { success: true, data: null };
    }

    const result = await response.json();
    console.log(`[API Response] Success from ${url}`);
    
    // Basic data validation
    if (result === null || typeof result !== 'object') {
      throw new ApiError('Invalid response format from server', 500);
    }

    return result;

  } catch (error) {
    clearTimeout(timeoutId);

    // Handle Timeout / Abort
    if (error.name === 'AbortError') {
      if (retries > 0) {
        console.warn(`[API Retry] Request timed out. Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES}) for ${url}`);
        await new Promise(resolve => setTimeout(resolve, backoff));
        return fetchWithRetry(endpoint, options, retries - 1, backoff * 2);
      }
      console.error(`[API Error] Request timed out after multiple attempts for ${url}`);
      throw new ApiError('Request timed out after multiple attempts.', 408);
    }

    // Handle Network Failures
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      if (retries > 0) {
        console.warn(`[API Retry] Network error. Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES}) for ${url}`);
        await new Promise(resolve => setTimeout(resolve, backoff));
        return fetchWithRetry(endpoint, options, retries - 1, backoff * 2);
      }
      console.error(`[API Error] Cannot connect to the server at ${url}. Possible reasons: Backend down, CORS issues, or incorrect URL.`);
      throw new ApiError('Cannot connect to the server. Please check your internet connection or backend status.', 0);
    }

    // Rethrow ApiErrors or wrap generic errors
    if (error instanceof ApiError) throw error;

    // Intelligent Fallback: If local backend fails, try production for stability
    const isLocalhost = url.includes('localhost') || url.includes('127.0.0.1');
    const productionUrl = 'https://hackathonwebapp.onrender.com/api';
    
    if (isLocalhost && !url.includes(productionUrl)) {
      console.warn(`[API Fallback] Local connection failed. Attempting production fallback for ${endpoint}...`);
      const fallbackUrl = `${productionUrl}${endpoint}`;
      try {
        return await fetchWithRetry(fallbackUrl, options, 0); // No retries for fallback
      } catch (fallbackError) {
        console.error(`[API Fallback] Production fallback also failed.`);
      }
    }

    throw new ApiError(error.message || 'An unexpected error occurred', 500);
  }
};

/**
 * Centralized API Service
 */
export const apiService = {
  getMyProducts: async (token) => {
    return fetchWithRetry('/products/my-products', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  getCategories: async () => {
    return fetchWithRetry('/products/categories');
  },

  getMyOrders: async (token) => {
    return fetchWithRetry('/orders/my-orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  getProductsByFarmer: async (farmerId) => {
    return fetchWithRetry(`/products?farmer=${farmerId}`);
  },

  addProduct: async (productData, token) => {
    return fetchWithRetry('/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: productData instanceof FormData ? productData : JSON.stringify(productData)
    });
  },

  getProductById: async (productId) => {
    return fetchWithRetry(`/products/${productId}`);
  },

  updateProduct: async (productId, productData, token) => {
    return fetchWithRetry(`/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: productData instanceof FormData ? productData : JSON.stringify(productData)
    });
  },

  getMe: async (token) => {
    return fetchWithRetry('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  getOrders: async (token) => {
    return fetchWithRetry('/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  
  getOrderById: async (orderId, token) => {
    return fetchWithRetry(`/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  login: async (email, password) => {
    return fetchWithRetry('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register: async (userData) => {
    return fetchWithRetry('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  getReviews: async (token) => {
    return fetchWithRetry('/reviews/my-reviews', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  replyToReview: async (reviewId, reply, token) => {
    return fetchWithRetry(`/reviews/${reviewId}/reply`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reply })
    });
  },

  updateProfile: async (profileData, token) => {
    return fetchWithRetry('/auth/update-profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: profileData instanceof FormData ? profileData : JSON.stringify(profileData)
    });
  },

  requestVerification: async (token) => {
    return fetchWithRetry('/auth/request-verification', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  getSupportTickets: async (token) => {
    return fetchWithRetry('/support/tickets', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  createSupportTicket: async (ticketData, token) => {
    return fetchWithRetry('/support/tickets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: ticketData instanceof FormData ? ticketData : JSON.stringify(ticketData)
    });
  },
  
  getEarningsReport: async (token) => {
    return fetchWithRetry('/earnings/report', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  getWeather: async (pincode, token) => {
    return fetchWithRetry(`/weather/${pincode}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  updateOrderStatus: async (orderId, status, token) => {
    return fetchWithRetry(`/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
  }
};


