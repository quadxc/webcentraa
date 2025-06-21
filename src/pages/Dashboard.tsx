import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Server, 
  Activity, 
  Zap, 
  AlertTriangle,
  Clock,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data - would be replaced with actual API calls through IPC
const ipcRenderer = (window as any).require?.('electron')?.ipcRenderer;

const Dashboard: React.FC = () => {
  const [botStatus, setBotStatus] = useState({
    status: 'Loading...',
    uptime: 0,
    load: 0,
    apiStatus: 'Loading...'
  });
  
  const [vdsMetrics, setVdsMetrics] = useState({
    cpu: 0,
    ram: 0,
    fps: 0,
    network: 'Loading...'
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        let botData, vdsData;
        
        if (ipcRenderer) {
          botData = await ipcRenderer.invoke('getBotStatus');
          vdsData = await ipcRenderer.invoke('getVdsMetrics');
        } else {
          // Mock data for browser development
          botData = {
            status: Math.random() > 0.1 ? 'Online' : 'Offline',
            uptime: Math.floor(Math.random() * 10000),
            load: Math.floor(Math.random() * 100),
            apiStatus: Math.random() > 0.1 ? 'Operational' : 'Degraded'
          };
          
          vdsData = {
            cpu: Math.floor(Math.random() * 100),
            ram: Math.floor(Math.random() * 100),
            fps: Math.floor(Math.random() * 60) + 60,
            network: Math.random() > 0.1 ? 'Online' : 'Issues Detected'
          };
        }
        
        setBotStatus(botData);
        setVdsMetrics(vdsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Refresh data every 10 seconds
    const interval = setInterval(fetchData, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Format uptime from seconds to days, hours, minutes
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <div className="text-sm text-gray-400">
          <Clock className="mr-2 inline-block h-4 w-4" />
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Status cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Bot Status */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Bot Status</h3>
                <Bot className="h-6 w-6 text-primary-500" />
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <div className={`status-indicator ${botStatus.status === 'Online' ? 'online' : 'offline'}`}></div>
                <span className="text-xl font-bold">{botStatus.status}</span>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                <Clock className="mr-1 inline-block h-4 w-4" />
                Uptime: {formatUptime(botStatus.uptime)}
              </div>
            </div>
            
            {/* Bot Load */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Bot Load</h3>
                <Activity className="h-6 w-6 text-accent-500" />
              </div>
              <div className="mt-4">
                <span className="text-xl font-bold">{botStatus.load}%</span>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-dark-700">
                  <div 
                    className={`h-full ${
                      botStatus.load < 50 ? 'bg-success-500' : 
                      botStatus.load < 80 ? 'bg-warning-500' : 'bg-error-500'
                    }`}
                    style={{ width: `${botStatus.load}%` }}
                  ></div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                <Zap className="mr-1 inline-block h-4 w-4" />
                System load is {botStatus.load < 50 ? 'normal' : botStatus.load < 80 ? 'moderate' : 'high'}
              </div>
            </div>
            
            {/* VDS CPU */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">CPU Usage</h3>
                <Server className="h-6 w-6 text-secondary-500" />
              </div>
              <div className="mt-4">
                <span className="text-xl font-bold">{vdsMetrics.cpu}%</span>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-dark-700">
                  <div 
                    className={`h-full ${
                      vdsMetrics.cpu < 50 ? 'bg-success-500' : 
                      vdsMetrics.cpu < 80 ? 'bg-warning-500' : 'bg-error-500'
                    }`}
                    style={{ width: `${vdsMetrics.cpu}%` }}
                  ></div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                <Zap className="mr-1 inline-block h-4 w-4" />
                Server performance is {vdsMetrics.cpu < 50 ? 'optimal' : vdsMetrics.cpu < 80 ? 'normal' : 'stressed'}
              </div>
            </div>
            
            {/* API Status */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">API Status</h3>
                <AlertTriangle className={`h-6 w-6 ${botStatus.apiStatus === 'Operational' ? 'text-success-500' : 'text-warning-500'}`} />
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <div className={`status-indicator ${botStatus.apiStatus === 'Operational' ? 'online' : 'warning'}`}></div>
                <span className="text-xl font-bold">{botStatus.apiStatus}</span>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                <MessageSquare className="mr-1 inline-block h-4 w-4" />
                Discord API connectivity
              </div>
            </div>
          </div>
          
          {/* Quick access cards */}
          <h3 className="text-xl font-bold">Quick Access</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Link to="/bot-status" className="card flex flex-col p-6 transition-transform hover:-translate-y-1">
              <Bot className="h-8 w-8 text-primary-500" />
              <h3 className="mt-4 text-lg font-semibold">Bot Status</h3>
              <p className="mt-2 text-sm text-gray-400">
                View detailed bot performance metrics and statistics
              </p>
            </Link>
            
            <Link to="/vds-monitoring" className="card flex flex-col p-6 transition-transform hover:-translate-y-1">
              <Server className="h-8 w-8 text-secondary-500" />
              <h3 className="mt-4 text-lg font-semibold">VDS Monitoring</h3>
              <p className="mt-2 text-sm text-gray-400">
                Monitor server resources and performance metrics
              </p>
            </Link>
            
            <Link to="/bot-management" className="card flex flex-col p-6 transition-transform hover:-translate-y-1">
              <Terminal className="h-8 w-8 text-accent-500" />
              <h3 className="mt-4 text-lg font-semibold">Bot Management</h3>
              <p className="mt-2 text-sm text-gray-400">
                Control bot operations and send commands
              </p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;