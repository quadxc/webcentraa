import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Image as ImageIcon, 
  Save,
  Check,
  X,
  Upload,
  Loader
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Mock data - would be replaced with actual API calls through IPC
const ipcRenderer = (window as any).require?.('electron')?.ipcRenderer;

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  useEffect(() => {
    // Initialize form with user data
    if (user) {
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setProfileImage(user.profile_image || '');
    }
  }, [user]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      const userData = {
        id: user?.id,
        email,
        phone,
        profile_image: profileImage
      };
      
      let result;
      
      if (ipcRenderer) {
        result = await ipcRenderer.invoke('updateProfile', userData);
      } else {
        // Mock response for browser development
        await new Promise((resolve) => setTimeout(resolve, 1000));
        result = { success: true };
      }
      
      if (result.success) {
        updateUser({ email, phone, profile_image: profileImage });
        setMessage({ type: 'success', text: 'Profile updated successfully' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'An error occurred while updating your profile' });
    } finally {
      setLoading(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };
  
  // Mock image upload - in real application, this would upload to a server or save locally
  const handleImageUpload = () => {
    // Mock a random avatar URL
    const randomId = Math.floor(Math.random() * 1000);
    setProfileImage(`https://i.pravatar.cc/150?img=${randomId}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Profile</h2>
      </div>
      
      {message && (
        <div 
          className={`rounded-lg p-4 ${
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
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile information */}
        <div className="lg:col-span-2">
          <form onSubmit={handleUpdateProfile} className="card p-6">
            <h3 className="mb-6 text-xl font-semibold">Profile Information</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="username" className="label">Username</label>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-dark-600 bg-dark-700 px-3 text-gray-400">
                      <User className="h-5 w-5" />
                    </span>
                    <input
                      type="text"
                      id="username"
                      className="input rounded-l-none bg-dark-700"
                      value={user?.username || ''}
                      disabled
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">Username cannot be changed</p>
                </div>
                
                <div>
                  <label htmlFor="rank" className="label">Rank</label>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-dark-600 bg-dark-700 px-3 text-gray-400">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a3 3 0 013 3v8a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm1 0v8a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      id="rank"
                      className={`input rounded-l-none bg-dark-700 ${user?.rank >= 8 ? 'text-error-500' : ''}`}
                      value={user?.rank >= 8 ? 'Project Director' : `Rank ${user?.rank}`}
                      disabled
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">Assigned by system administrator</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="email" className="label">Email Address</label>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-dark-600 bg-dark-700 px-3 text-gray-400">
                      <Mail className="h-5 w-5" />
                    </span>
                    <input
                      type="email"
                      id="email"
                      className="input rounded-l-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="label">Phone Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-dark-600 bg-dark-700 px-3 text-gray-400">
                      <Phone className="h-5 w-5" />
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      className="input rounded-l-none"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (123) 456-7890"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Profile image */}
        <div>
          <div className="card p-6">
            <h3 className="mb-6 text-xl font-semibold">Profile Picture</h3>
            
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-dark-700">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt={user?.username || 'Profile'} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary-600 text-white">
                    <span className="text-4xl font-bold">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                
                <button 
                  onClick={handleImageUpload}
                  className="absolute bottom-0 right-0 rounded-full bg-dark-800 p-2 shadow-lg hover:bg-dark-700"
                  title="Upload new image"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
              </div>
              
              <button 
                onClick={handleImageUpload}
                className="btn btn-ghost flex items-center space-x-2"
              >
                <Upload className="h-5 w-5" />
                <span>Upload new image</span>
              </button>
              
              <p className="text-center text-sm text-gray-400">
                Recommended: Square image, at least 200x200 pixels.
              </p>
            </div>
          </div>
          
          {/* Account info */}
          <div className="mt-6 card p-6">
            <h3 className="mb-4 text-xl font-semibold">Account Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Account Created</p>
                <p>March 15, 2023</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Last Login</p>
                <p>Today, {new Date().toLocaleTimeString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Account Status</p>
                <div className="flex items-center space-x-2">
                  <span className="status-indicator online"></span>
                  <span>Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;