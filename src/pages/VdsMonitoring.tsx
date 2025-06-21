import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  HardDrive, 
  Activity, 
  Wifi, 
  RefreshCw,
  AlertTriangle,
  Clock,
  BarChart
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Mock data - would be replaced with actual API calls through IPC
const ipcRenderer = (window as any).require?.('electron')?.ipcRenderer;

const VdsMonitoring: React.FC = () => {
  const [vdsMetrics, setVdsMetrics] = useState({
    cpu: 0,
    ram: 0,
    fps: 0,
    network: 'Loading...',
    diskUsage: 0,
    networkSpeed: 0,
    temperature: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState({
    labels: [] as string[],
    cpu: [] as number[],
    ram: [] as number[],
    fps: [] as number[],
    network: [] as number[]
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        let vdsData;
        
        if (ipcRenderer) {
          vdsData = await ipcRenderer.invoke('getVdsMetrics');
        } else {
          // Mock data for browser development
          vdsData = {
            cpu: Math.floor(Math.random() * 100),
            ram: Math.floor(Math.random() * 100),
            fps: Math.floor(Math.random() * 60) + 60,
            network: Math.random() > 0.1 ? 'Online' : 'Issues Detected',
            diskUsage: Math.floor(Math.random() * 90) + 10,
            networkSpeed: Math.floor(Math.random() * 100) + 50,
            temperature: Math.floor(Math.random() * 40) + 40
          };
        }
        
        setVdsMetrics(vdsData);
        
        // Generate mock history data
        const now = new Date();
        const labels = [];
        const cpuData = [];
        const ramData = [];
        const fpsData = [];
        const networkData = [];
        
        for (let i = 59; i >= 0; i--) {
          const time = new Date(now);
          time.setMinutes(now.getMinutes() - i);
          labels.push(time.getHours() + ':' + (time.getMinutes() < 10 ? '0' : '') + time.getMinutes());
          
          cpuData.push(Math.floor(Math.random() * 100));
          ramData.push(Math.floor(Math.random() * 100));
          fpsData.push(Math.floor(Math.random() * 60) + 60);
          networkData.push(Math.floor(Math.random() * 100) + 50);
        }
        
        setHistoryData({
          labels,
          cpu: cpuData,
          ram: ramData,
          fps: fpsData,
          network: networkData
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching VDS metrics data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Refresh data every 5 seconds
    const interval = setInterval(fetchData, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Options for CPU & RAM chart
  const systemChartOptions = {
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
          color: '#9ca3af',
          maxTicksLimit: 12
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
  
  // CPU & RAM chart data
  const systemChartData = {
    labels: historyData.labels,
    datasets: [
      {
        label: 'CPU Usage',
        data: historyData.cpu,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4
      },
      {
        label: 'RAM Usage',
        data: historyData.ram,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4
      }
    ]
  };
  
  // Options for FPS chart
  const fpsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
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
          color: '#9ca3af',
          maxTicksLimit: 12
        }
      },
      y: {
        min: 0,
        grid: {
          color: '#374151'
        },
        ticks: {
          color: '#9ca3af',
          callback: function(value: any) {
            return value + ' FPS';
          }
        }
      }
    }
  };
  
  // FPS chart data
  const fpsChartData = {
    labels: historyData.labels,
    datasets: [
      {
        label: 'FPS',
        data: historyData.fps,
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
  
  // Options for Network chart
  const networkChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1f2937',
        borderColor: '#374151',
        borderWidth: 1,
        titleColor: '#f9fafb',
        bodyColor: '#f3f4f6',
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y} Mbps`;
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
          color: '#9ca3af',
          maxTicksLimit: 12
        }
      },
      y: {
        min: 0,
        grid: {
          color: '#374151'
        },
        ticks: {
          color: '#9ca3af',
          callback: function(value: any) {
            return value + ' Mbps';
          }
        }
      }
    }
  };
  
  // Network chart data
  const networkChartData = {
    labels: historyData.labels,
    datasets: [
      {
        label: 'Network Speed',
        data: historyData.network,
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
  
  // Resource allocation chart
  const resourceAllocationData = {
    labels: ['CPU', 'RAM', 'Disk', 'Network'],
    datasets: [
      {
        label: 'Resource Usage',
        data: [vdsMetrics.cpu, vdsMetrics.ram, vdsMetrics.diskUsage, vdsMetrics.networkSpeed / 2],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(14, 165, 233, 0.8)'
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(14, 165, 233)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  const resourceAllocationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
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
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">VDS Monitoring</h2>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-400">
            <Clock className="mr-1 inline-block h-4 w-4" />
            Auto-refresh: 5s
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-ghost flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
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
            {/* CPU Usage */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">CPU Usage</h3>
                <Cpu className="h-6 w-6 text-error-500" />
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
                <div className="flex items-center">
                  <AlertTriangle className={`mr-1 h-4 w-4 ${vdsMetrics.temperature > 70 ? 'text-error-500' : 'text-gray-400'}`} />
                  <span>Temp: {vdsMetrics.temperature}°C</span>
                </div>
              </div>
            </div>
            
            {/* RAM Usage */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">RAM Usage</h3>
                <HardDrive className="h-6 w-6 text-success-500" />
              </div>
              <div className="mt-4">
                <span className="text-xl font-bold">{vdsMetrics.ram}%</span>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-dark-700">
                  <div 
                    className={`h-full ${
                      vdsMetrics.ram < 50 ? 'bg-success-500' : 
                      vdsMetrics.ram < 80 ? 'bg-warning-500' : 'bg-error-500'
                    }`}
                    style={{ width: `${vdsMetrics.ram}%` }}
                  ></div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <HardDrive className="mr-1 h-4 w-4" />
                  <span>Disk Usage: {vdsMetrics.diskUsage}%</span>
                </div>
              </div>
            </div>
            
            {/* FPS */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">FPS</h3>
                <Activity className="h-6 w-6 text-accent-500" />
              </div>
              <div className="mt-4">
                <span className="text-xl font-bold">{vdsMetrics.fps}</span>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-dark-700">
                  <div 
                    className={`h-full ${
                      vdsMetrics.fps > 100 ? 'bg-success-500' : 
                      vdsMetrics.fps > 60 ? 'bg-warning-500' : 'bg-error-500'
                    }`}
                    style={{ width: `${(vdsMetrics.fps / 120) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Activity className="mr-1 h-4 w-4" />
                  <span>Performance: {vdsMetrics.fps > 100 ? 'Excellent' : vdsMetrics.fps > 60 ? 'Good' : 'Poor'}</span>
                </div>
              </div>
            </div>
            
            {/* Network */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Network</h3>
                <Wifi className={`h-6 w-6 ${vdsMetrics.network === 'Online' ? 'text-primary-500' : 'text-warning-500'}`} />
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <div className={`status-indicator ${vdsMetrics.network === 'Online' ? 'online' : 'warning'}`}></div>
                <span className="text-xl font-bold">{vdsMetrics.network}</span>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Activity className="mr-1 h-4 w-4" />
                  <span>Speed: {vdsMetrics.networkSpeed} Mbps</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* CPU & RAM Chart */}
            <div className="card p-6">
              <h3 className="mb-4 text-lg font-semibold">System Usage (Last Hour)</h3>
              <div className="h-80">
                <Line options={systemChartOptions} data={systemChartData} />
              </div>
            </div>
            
            {/* FPS Chart */}
            <div className="card p-6">
              <h3 className="mb-4 text-lg font-semibold">FPS (Last Hour)</h3>
              <div className="h-80">
                <Line options={fpsChartOptions} data={fpsChartData} />
              </div>
            </div>
            
            {/* Network Chart */}
            <div className="card p-6">
              <h3 className="mb-4 text-lg font-semibold">Network Speed (Last Hour)</h3>
              <div className="h-80">
                <Line options={networkChartOptions} data={networkChartData} />
              </div>
            </div>
            
            {/* Resource Allocation Chart */}
            <div className="card p-6">
              <h3 className="mb-4 text-lg font-semibold">Resource Allocation</h3>
              <div className="h-80">
                <Bar options={resourceAllocationOptions} data={resourceAllocationData} />
              </div>
            </div>
          </div>
          
          {/* Server Info */}
          <div className="card p-6">
            <h3 className="mb-4 text-lg font-semibold">Server Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Server Type</span>
                  <span>Virtual Dedicated Server</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Hostname</span>
                  <span>vds-centra-001</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">IP Address</span>
                  <span>192.168.1.1</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">CPU Cores</span>
                  <span>8 Cores</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">RAM</span>
                  <span>16 GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Storage</span>
                  <span>500 GB SSD</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Operating System</span>
                  <span>Ubuntu 22.04 LTS</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Uptime</span>
                  <span>14 days, 6 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Last Reboot</span>
                  <span>14 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VdsMonitoring;