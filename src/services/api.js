const API_URL = 'https://fazeelayazqasimi-botboss-updated-backend.hf.space';

// Helper function for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Retry ke saath API call
export async function apiRequest(endpoint, options = {}, retries = 5) {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🌐 API Request (${i + 1}/${retries}): ${endpoint}`);
      
      // Add timeout to fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 sec timeout
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      clearTimeout(timeoutId);
      
      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      // Parse JSON response
      const data = await response.json();
      console.log(`✅ API Success (${i + 1}/${retries}): ${endpoint}`);
      return data;
      
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain errors
      if (error.name === 'AbortError') {
        console.log(`⏱️ Request timeout (${i + 1}/${retries})`);
      } else {
        console.log(`❌ Attempt ${i + 1} failed:`, error.message);
      }
      
      if (i === retries - 1) {
        console.log(`❌ All ${retries} attempts failed`);
        throw lastError;
      }
      
      // Exponential backoff: 3s, 6s, 9s, 12s, 15s
      const waitTime = 3000 * (i + 1);
      console.log(`⏳ Waiting ${waitTime/1000}s before retry...`);
      await delay(waitTime);
    }
  }
}

// Health check function
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache'
    });
    return response.ok;
  } catch (error) {
    console.log('Health check failed:', error.message);
    return false;
  }
}

// Wake up backend (multiple attempts)
export async function wakeBackend(maxAttempts = 10) {
  console.log('🔄 Waking up backend server...');
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(`${API_URL}/health`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        signal: AbortSignal.timeout(10000) // 10 sec timeout
      });
      
      if (response.ok) {
        console.log('✅ Backend is awake!');
        return true;
      }
    } catch (error) {
      console.log(`⏳ Wake attempt ${i + 1}/${maxAttempts} failed`);
    }
    
    // Wait before next attempt
    await delay(5000); // 5 sec
  }
  
  console.log('❌ Failed to wake backend after', maxAttempts, 'attempts');
  return false;
}

// GET request helper
export async function get(endpoint, retries = 3) {
  return apiRequest(endpoint, { method: 'GET' }, retries);
}

// POST request helper
export async function post(endpoint, data, retries = 3) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }, retries);
}

// PUT request helper
export async function put(endpoint, data, retries = 3) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }, retries);
}

// DELETE request helper
export async function del(endpoint, retries = 3) {
  return apiRequest(endpoint, { method: 'DELETE' }, retries);
}

export default {
  apiRequest,
  checkBackendHealth,
  wakeBackend,
  get,
  post,
  put,
  delete: del
};
