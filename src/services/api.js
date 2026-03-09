const API_URL = 'https://fazeelayazqasimi-botboss-updated-backend.hf.space';

// Retry ke saath API call
export async function apiRequest(endpoint, options = {}, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      // Agar response OK nahi hai to error throw karo
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.log(`Attempt ${i + 1} failed`);
      
      if (i === retries - 1) {
        throw error; // Last attempt failed
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

// Health check with multiple attempts
export async function checkBackendHealth() {
  for (let i = 0; i < 10; i++) {
    try {
      const response = await fetch(`${API_URL}/health`, {
        method: 'GET',
        cache: 'no-cache'
      });
      
      if (response.ok) {
        console.log('✅ Backend connected!');
        return true;
      }
    } catch (error) {
      console.log(`⏳ Attempt ${i + 1}/10: Backend waking up...`);
    }
    
    // Wait 5 seconds between attempts
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  return false;
}
