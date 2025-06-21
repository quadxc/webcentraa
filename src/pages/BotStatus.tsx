import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  MessageSquare, 
  Users, 
  Server, 
  Clock,
  RefreshCw
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Mock data - would be replaced with actual API calls through IPC
const ipcRenderer = (window as any).require?.('electron')?.ipcRenderer;

const BotStatus: React.FC = () => {
  const [botStatus, setBotStatus] = useState({
    status: 'Loading...',
    uptime: 0,
    load: 0,
    apiStatus: 'Loading...',
    guildCount: 0,
    userCount: 0,
    commandsUsed: 0,
    messagesProcessed: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState({
    labels: [] as string[],
    load: [] as number[],
    users: [] as number[],
    commands: [] as number[]
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        let botData;
        
        if (ipcRenderer) {
          botData = await ipcRenderer.invoke('getBotStatus');
        } else {
          // Mock data for browser development
          botData = {
            status: Math.random() > 0.1 ? 'Online' : 'Offline',
            uptime: Math.floor(Math.random() * 100000),
            load: Math.floor(Math.random() * 100),
            apiStatus: Math.random() > 0.1 ? 'Operational' : 'Degraded',
            guildCount: Math.floor(Math.random() * 100) + 50,
            userCount: Math.floor(Math.random() * 10000) + 500,
            commandsUsed: Math.floor(Math.random() * 5000) + 1000,
            messagesProcessed: Math.floor(Math.random() * 50000) + 10000
          };
        }
        
        setBotStatus(botData);
        
        // Generate mock history data
        const now = new Date();
        const labels = [];
        const loadData = [];
        const userData = [];
        const commandData = [];
        
        for (let i = 23; i >= 0; i--) {
          const time = new Date(now);
          time.setHours(now.getHours() - i);
          labels.push(time.getHours() + ':00');
          
          loadData.push(Math.floor(Math.random() * 100));
          userData.push(Math.floor(Math.random() * 1000) + 500);
          commandData.push(Math.floor(Math.random() * 500) + 100);
        }
        
        setHistoryData({
          labels,
          load: loadData,
          users: userData,
          commands: commandData
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bot status data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Format uptime from seconds to days, hours, minutes
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };
  
  // Options for load chart
  const loadChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1f2937',
        borderColor: '#374151',
        borderWidth: 1,
        titleColor: '#f9fafb',
        bodyColor: '#f3f4f6',
        callbacks: {
          label: function(context: any) {
            return `Load: ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: '#374151'
        },
        ticks: {
          color: '#9ca3af'
        }
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: '#374151'
        },
        ticks: {
          color: '#9ca3af',
          callback: function(value: any) {
            return value + '%';
          }
        }
      }
    }
  };
  
  // Load chart data
  const loadChartData = {
    labels: historyData.labels,
    datasets: [
      {
        label: 'Load',
        data: historyData.load,
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4
      }
    ]
  };
  
  // User activity chart options
  const userChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#f3f4f6'
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        borderColor: '#374151',
        borderWidth: 1,
        titleColor: '#f9fafb',
        bodyColor: '#f3f4f6'
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: '#374151'
        },
        ticks: {
          color: '#9ca3af'
        }
      },
      y: {
        grid: {
          color: '#374151'
        },
        ticks: {
          color: '#9ca3af'
        }
      }
    }
  };
  
  // User activity chart data
  const userChartData = {
    labels: historyData.labels,
    datasets: [
      {
        label: 'Active Users',
        data: historyData.users,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4
      },
      {
        label: 'Commands Used',
        data: historyData.commands,
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4
      }
    ]
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Bot Status</h2>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-ghost flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
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
                <h3 className="text-lg font-semibold">Status</h3>
                <Server className="h-6 w-6 text-primary-500" />
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <div className={`status-indicator ${botStatus.status === 'Online' ? 'online' : 'offline'}`}></div>
                <span className="text-xl font-bold">{botStatus.status}</span>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Uptime: {formatUptime(botStatus.uptime)}</span>
                </div>
              </div>
            </div>
            
            {/* API Status */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">API</h3>
                <Activity className="h-6 w-6 text-accent-500" />
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <div className={`status-indicator ${botStatus.apiStatus === 'Operational' ? 'online' : 'warning'}`}></div>
                <span className="text-xl font-bold">{botStatus.apiStatus}</span>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Discord API Connection</span>
                </div>
              </div>
            </div>
            
            {/* Servers */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Servers</h3>
                <Server className="h-6 w-6 text-secondary-500" />
              </div>
              <div className="mt-4">
                <span className="text-xl font-bold">{botStatus.guildCount}</span>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  <span>{botStatus.userCount.toLocaleString()} users reached</span>
                </div>
              </div>
            </div>
            
            {/* Commands */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Commands</h3>
                <MessageSquare className="h-6 w-6 text-success-500" />
              </div>
              <div className="mt-4">
                <span className="text-xl font-bold">{botStatus.commandsUsed.toLocaleString()}</span>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  <span>{botStatus.messagesProcessed.toLocaleString()} messages processed</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Load Chart */}
            <div className="card p-6">
              <h3 className="mb-4 text-lg font-semibold">System Load (24h)</h3>
              <div className="h-80">
                <Line options={loadChartOptions} data={loadChartData} />
              </div>
            </div>
            
            {/* User Activity Chart */}
            <div className="card p-6">
              <h3 className="mb-4 text-lg font-semibold">User Activity (24h)</h3>
              <div className="h-80">
                <Line options={userChartOptions} data={userChartData} />
              </div>
            </div>
          </div>
          
          {/* Recent activity */}
          <div className="card p-6">
            <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
            <div className="space-y-4">
              {/* Mock activity items */}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start space-x-3 border-b border-dark-700 pb-4 last:border-0">
                  <div className={`mt-1 h-2 w-2 rounded-full ${['bg-success-500', 'bg-primary-500', 'bg-accent-500', 'bg-warning-500', 'bg-error-500'][i % 5]}`}></div>
                  <div>
                    <p className="font-medium">
                      {[
                        'Bot successfully restarted',
                        'New command deployed: /help',
                        'API rate limit reached',
                        'Bot joined a new server',
                        'Configuration updated'
                      ][i % 5]}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(Date.now() - i * 1000 * 60 * (10 + i * 5)).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BotStatus;