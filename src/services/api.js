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
      return await response.json();
    } catch (error) {
      console.log(`Attempt ${i + 1} failed, ${retries - i - 1} retries left`);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec wait
    }
  }
}
