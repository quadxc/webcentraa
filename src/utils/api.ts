// API utility functions for communicating with the backend

// Mock API function - would be replaced with actual electron IPC calls
export const executeApiCall = async (endpoint: string, data: any = null) => {
  // In a real app, this would use ipcRenderer to communicate with the main process
  console.log(`API call to ${endpoint} with data:`, data);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock responses
  switch (endpoint) {
    case 'auth/login':
      if (data.username === 'admin' && data.password === 'admin') {
        return {
          success: true,
          user: {
            id: 1,
            username: 'admin',
            rank: 8,
            email: 'admin@example.com'
          }
        };
      }
      return { success: false, message: 'Invalid credentials' };
      
    case 'bot/status':
      return {
        success: true,
        status: 'Online',
        uptime: 123456,
        load: 45,
        apiStatus: 'Operational'
      };
      
    case 'vds/metrics':
      return {
        success: true,
        cpu: 35,
        ram: 42,
        fps: 120,
        network: 'Online'
      };
      
    default:
      return { success: false, message: 'Endpoint not found' };
  }
};

// Export typed versions of common API calls
export const authApi = {
  login: (username: string, password: string) => 
    executeApiCall('auth/login', { username, password }),
    
  updateProfile: (userData: any) =>
    executeApiCall('auth/profile', userData),
    
  updatePassword: (data: { currentPassword: string, newPassword: string }) =>
    executeApiCall('auth/password', data)
};

export const botApi = {
  getStatus: () => executeApiCall('bot/status'),
  
  control: (action: string, data: any = {}) =>
    executeApiCall(`bot/${action}`, data),
    
  sendMessage: (channelId: string, message: string) =>
    executeApiCall('bot/message', { channelId, message })
};

export const vdsApi = {
  getMetrics: () => executeApiCall('vds/metrics'),
  
  updateConfig: (config: any) =>
    executeApiCall('vds/config', config)
};