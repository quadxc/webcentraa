import React, { useState } from 'react';
import { 
  KeyRound, 
  Server, 
  Bot, 
  Save, 
  Eye, 
  EyeOff,
  Check,
  X,
  Loader
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Mock data - would be replaced with actual API calls through IPC
const ipcRenderer = (window as any).require?.('electron')?.ipcRenderer;

const Settings: React.FC = () => {
  const { user } = useAuth();
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Database connection state
  const [dbHost, setDbHost] = useState('localhost');
  const [dbUser, setDbUser] = useState('root');
  const [dbPassword, setDbPassword] = useState('');
  const [dbName, setDbName] = useState('centra_panel');
  
  // Bot configuration state
  const [botToken, setBotToken] = useState('');
  const [botClientId, setBotClientId] = useState('');
  const [botGuildId, setBotGuildId] = useState('');
  
  // VDS configuration state
  const [vdsHost, setVdsHost] = useState('localhost');
  const [vdsPort, setVdsPort] = useState('22');
  const [vdsUsername, setVdsUsername] = useState('');
  const [vdsPassword, setVdsPassword] = useState('');
  
  // UI state
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<{ section: string, type: 'success' | 'error', text: string } | null>(null);
  
  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading['password']) return;
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ 
        section: 'password', 
        type: 'error', 
        text: 'All password fields are required' 
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMessage({ 
        section: 'password', 
        type: 'error', 
        text: 'New passwords do not match' 
      });
      return;
    }
    
    setLoading((prev) => ({ ...prev, password: true }));
    setMessage(null);
    
    try {
      let result;
      
      if (ipcRenderer) {
        result = await ipcRenderer.invoke('updatePassword', {
          userId: user?.id,
          currentPassword,
          newPassword
        });
      } else {
        // Mock response for browser development
        await new Promise((resolve) => setTimeout(resolve, 1000));
        result = { success: true };
      }
      
      if (result.success) {
        setMessage({ 
          section: 'password', 
          type: 'success', 
          text: 'Password updated successfully' 
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ 
          section: 'password', 
          type: 'error', 
          text: result.message || 'Current password is incorrect' 
        });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({ 
        section: 'password', 
        type: 'error', 
        text: 'An error occurred while updating your password' 
      });
    } finally {
      setLoading((prev) => ({ ...prev, password: false }));
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };
  
  // Handle database settings update
  const handleDbSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading['database']) return;
    
    setLoading((prev) => ({ ...prev, database: true }));
    setMessage(null);
    
    try {
      // Mock saving config
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setMessage({ 
        section: 'database', 
        type: 'success', 
        text: 'Database settings updated successfully' 
      });
    } catch (error) {
      console.error('Error updating database settings:', error);
      setMessage({ 
        section: 'database', 
        type: 'error', 
        text: 'An error occurred while updating database settings' 
      });
    } finally {
      setLoading((prev) => ({ ...prev, database: false }));
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };
  
  // Handle bot settings update
  const handleBotSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading['bot']) return;
    
    setLoading((prev) => ({ ...prev, bot: true }));
    setMessage(null);
    
    try {
      // Mock saving config
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setMessage({ 
        section: 'bot', 
        type: 'success', 
        text: 'Bot settings updated successfully' 
      });
    } catch (error) {
      console.error('Error updating bot settings:', error);
      setMessage({ 
        section: 'bot', 
        type: 'error', 
        text: 'An error occurred while updating bot settings' 
      });
    } finally {
      setLoading((prev) => ({ ...prev, bot: false }));
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };
  
  // Handle VDS settings update
  const handleVdsSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading['vds']) return;
    
    setLoading((prev) => ({ ...prev, vds: true }));
    setMessage(null);
    
    try {
      // Mock saving config
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setMessage({ 
        section: 'vds', 
        type: 'success', 
        text: 'VDS settings updated successfully' 
      });
    } catch (error) {
      console.error('Error updating VDS settings:', error);
      setMessage({ 
        section: 'vds', 
        type: 'error', 
        text: 'An error occurred while updating VDS settings' 
      });
    } finally {
      setLoading((prev) => ({ ...prev, vds: false }));
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Password Change */}
        <div className="card p-6">
          <h3 className="mb-6 text-xl font-semibold">Change Password</h3>
          
          {message?.section === 'password' && (
            <div 
              className={`mb-4 rounded-lg p-4 ${
                message.type === 'success' ? 'bg-success-900 text-success-100' : 'bg-error-900 text-error-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                {message.type === 'success' ? (
                  <Check className="h-5 w-5 text-success-400" />
                ) : (
                  <X className="h-5 w-5 text-error-400" />
                )}
                <span>{message.text}</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label htmlFor="current-password" className="label">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="current-password"
                  className="input pr-10"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="new-password" className="label">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="new-password"
                    className="input pr-10"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="label">Confirm New Password</label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="confirm-password"
                  className="input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            
            <div>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading['password']}
              >
                {loading['password'] ? (
                  <>
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <KeyRound className="mr-2 h-5 w-5" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Database Connection */}
        <div className="card p-6">
          <h3 className="mb-6 text-xl font-semibold">Database Connection</h3>
          
          {message?.section === 'database' && (
            <div 
              className={`mb-4 rounded-lg p-4 ${
                message.type === 'success' ? 'bg-success-900 text-success-100' : 'bg-error-900 text-error-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                {message.type === 'success' ? (
                  <Check className="h-5 w-5 text-success-400" />
                ) : (
                  <X className="h-5 w-5 text-error-400" />
                )}
                <span>{message.text}</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleDbSettingsUpdate} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="db-host" className="label">Database Host</label>
                <input
                  type="text"
                  id="db-host"
                  className="input"
                  value={dbHost}
                  onChange={(e) => setDbHost(e.target.value)}
                  placeholder="localhost"
                />
              </div>
              
              <div>
                <label htmlFor="db-name" className="label">Database Name</label>
                <input
                  type="text"
                  id="db-name"
                  className="input"
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  placeholder="centra_panel"
                />
              </div>
              
              <div>
                <label htmlFor="db-user" className="label">Database User</label>
                <input
                  type="text"
                  id="db-user"
                  className="input"
                  value={dbUser}
                  onChange={(e) => setDbUser(e.target.value)}
                  placeholder="root"
                />
              </div>
              
              <div>
                <label htmlFor="db-password" className="label">Database Password</label>
                <input
                  type="password"
                  id="db-password"
                  className="input"
                  value={dbPassword}
                  onChange={(e) => setDbPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading['database']}
              >
                {loading['database'] ? (
                  <>
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Save Database Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Bot Configuration */}
        <div className="card p-6">
          <h3 className="mb-6 text-xl font-semibold">Bot Configuration</h3>
          
          {message?.section === 'bot' && (
            <div 
              className={`mb-4 rounded-lg p-4 ${
                message.type === 'success' ? 'bg-success-900 text-success-100' : 'bg-error-900 text-error-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                {message.type === 'success' ? (
                  <Check className="h-5 w-5 text-success-400" />
                ) : (
                  <X className="h-5 w-5 text-error-400" />
                )}
                <span>{message.text}</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleBotSettingsUpdate} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="bot-token" className="label">Bot Token</label>
                <input
                  type="password"
                  id="bot-token"
                  className="input"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  placeholder="Discord Bot Token"
                />
                <p className="mt-1 text-xs text-gray-400">From Discord Developer Portal</p>
              </div>
              
              <div>
                <label htmlFor="bot-client-id" className="label">Client ID</label>
                <input
                  type="text"
                  id="bot-client-id"
                  className="input"
                  value={botClientId}
                  onChange={(e) => setBotClientId(e.target.value)}
                  placeholder="Bot Client ID"
                />
              </div>
              
              <div>
                <label htmlFor="bot-guild-id" className="label">Guild ID</label>
                <input
                  type="text"
                  id="bot-guild-id"
                  className="input"
                  value={botGuildId}
                  onChange={(e) => setBotGuildId(e.target.value)}
                  placeholder="Discord Server ID"
                />
                <p className="mt-1 text-xs text-gray-400">Optional - for single-server bots</p>
              </div>
            </div>
            
            <div>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading['bot']}
              >
                {loading['bot'] ? (
                  <>
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-5 w-5" />
                    Save Bot Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* VDS Configuration */}
        <div className="card p-6">
          <h3 className="mb-6 text-xl font-semibold">VDS Configuration</h3>
          
          {message?.section === 'vds' && (
            <div 
              className={`mb-4 rounded-lg p-4 ${
                message.type === 'success' ? 'bg-success-900 text-success-100' : 'bg-error-900 text-error-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                {message.type === 'success' ? (
                  <Check className="h-5 w-5 text-success-400" />
                ) : (
                  <X className="h-5 w-5 text-error-400" />
                )}
                <span>{message.text}</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleVdsSettingsUpdate} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="vds-host" className="label">VDS Host</label>
                <input
                  type="text"
                  id="vds-host"
                  className="input"
                  value={vdsHost}
                  onChange={(e) => setVdsHost(e.target.value)}
                  placeholder="IP Address or Hostname"
                />
              </div>
              
              <div>
                <label htmlFor="vds-port" className="label">SSH Port</label>
                <input
                  type="text"
                  id="vds-port"
                  className="input"
                  value={vdsPort}
                  onChange={(e) => setVdsPort(e.target.value)}
                  placeholder="22"
                />
              </div>
              
              <div>
                <label htmlFor="vds-username" className="label">Username</label>
                <input
                  type="text"
                  id="vds-username"
                  className="input"
                  value={vdsUsername}
                  onChange={(e) => setVdsUsername(e.target.value)}
                  placeholder="root"
                />
              </div>
              
              <div>
                <label htmlFor="vds-password" className="label">Password</label>
                <input
                  type="password"
                  id="vds-password"
                  className="input"
                  value={vdsPassword}
                  onChange={(e) => setVdsPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading['vds']}
              >
                {loading['vds'] ? (
                  <>
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Server className="mr-2 h-5 w-5" />
                    Save VDS Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;