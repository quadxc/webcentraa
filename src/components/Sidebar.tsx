import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Bot, 
  Server, 
  Terminal, 
  User, 
  Settings as SettingsIcon,
  Command
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-dark-900 border-r border-dark-800 flex flex-col h-full">
      <div className="p-4 border-b border-dark-800">
        <div className="flex items-center justify-center space-x-2">
          <Command className="h-8 w-8 text-primary-500" />
          <h1 className="text-xl font-bold">Centra Panel</h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `sidebar-item ${isActive ? 'active' : ''}`
            }
            end
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/bot-status" 
            className={({ isActive }) => 
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <Bot className="h-5 w-5" />
            <span>Bot Status</span>
          </NavLink>
          
          <NavLink 
            to="/vds-monitoring" 
            className={({ isActive }) => 
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <Server className="h-5 w-5" />
            <span>VDS Monitoring</span>
          </NavLink>
          
          <NavLink 
            to="/bot-management" 
            className={({ isActive }) => 
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <Terminal className="h-5 w-5" />
            <span>Bot Management</span>
          </NavLink>
          
          <NavLink 
            to="/profile" 
            className={({ isActive }) => 
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
          </NavLink>
          
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <SettingsIcon className="h-5 w-5" />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>
      
      <div className="p-4 border-t border-dark-800">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white">
              {user?.profile_image ? (
                <img 
                  src={user.profile_image} 
                  alt={user?.username} 
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold">
                  {user?.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success-500 border-2 border-dark-900"></span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{user?.username}</span>
            <span className={`text-xs ${user?.rank >= 8 ? 'text-error-500' : 'text-gray-400'}`}>
              {user?.rank >= 8 ? 'Project Director' : `Rank ${user?.rank}`}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;