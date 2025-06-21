import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  RefreshCw, 
  Upload, 
  Code, 
  MessageSquare, 
  Clock, 
  Send,
  Check,
  X,
  Loader
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Mock data - would be replaced with actual API calls through IPC
const ipcRenderer = (window as any).require?.('electron')?.ipcRenderer;

const BotManagement: React.FC = () => {
  const { user } = useAuth();
  const [commandMessage, setCommandMessage] = useState('');
  const [targetChannel, setTargetChannel] = useState('');
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [commandResult, setCommandResult] = useState<{
    success: boolean;
    message: string;
    timestamp: string;
  } | null>(null);
  
  // List of available channels (mock data)
  const availableChannels = [
    { id: '1234567890', name: 'general' },
    { id: '0987654321', name: 'bot-commands' },
    { id: '1122334455', name: 'announcements' },
    { id: '5566778899', name: 'support' }
  ];
  
  // List of recent commands (mock data)
  const recentCommands = [
    { action: 'Start', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), user: 'admin' },
    { action: 'Restart', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), user: 'admin' },
    { action: 'Deploy', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), user: 'admin' },
    { action: 'Message', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), user: 'moderator' },
    { action: 'Stop', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), user: 'admin' }
  ];
  
  const handleBotAction = async (actionType: string) => {
    if (loading[actionType]) return;
    
    setLoading((prev) => ({ ...prev, [actionType]: true }));
    setCommandResult(null);
    
    try {
      let result;
      
      if (ipcRenderer) {
        result = await ipcRenderer.invoke('controlBot', {
          type: actionType,
          userId: user?.id
        });
      } else {
        // Mock response for browser development
        await new Promise((resolve) => setTimeout(resolve, 1000));
        result = {
          success: Math.random() > 0.1,
          message: `Bot ${actionType} command executed successfully`
        };
      }
      
      setCommandResult({
        success: result.success,
        message: result.message,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Error executing ${actionType} command:`, error);
      setCommandResult({
        success: false,
        message: `Error executing ${actionType} command: ${error}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading((prev) => ({ ...prev, [actionType]: false }));
      
      // Clear result after 5 seconds
      setTimeout(() => {
        setCommandResult(null);
      }, 5000);
    }
  };
  
  const handleSendMessage = async () => {
    if (!commandMessage || !targetChannel || loading['message']) return;
    
    setLoading((prev) => ({ ...prev, message: true }));
    setCommandResult(null);
    
    try {
      let result;
      
      if (ipcRenderer) {
        result = await ipcRenderer.invoke('controlBot', {
          type: 'message',
          userId: user?.id,
          channelId: targetChannel,
          content: commandMessage
        });
      } else {
        // Mock response for browser development
        await new Promise((resolve) => setTimeout(resolve, 1000));
        result = {
          success: Math.random() > 0.1,
          message: 'Message sent successfully'
        };
      }
      
      setCommandResult({
        success: result.success,
        message: result.message,
        timestamp: new Date().toISOString()
      });
      
      if (result.success) {
        setCommandMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setCommandResult({
        success: false,
        message: `Error sending message: ${error}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading((prev) => ({ ...prev, message: false }));
      
      // Clear result after 5 seconds
      setTimeout(() => {
        setCommandResult(null);
      }, 5000);
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Bot Management</h2>
      </div>
      
      {/* Result message */}
      {commandResult && (
        <div 
          className={`rounded-lg p-4 ${
            commandResult.success ? 'bg-success-900 text-success-100' : 'bg-error-900 text-error-100'
          }`}
        >
          <div className="flex items-center space-x-2">
            {commandResult.success ? (
              <Check className="h-5 w-5 text-success-400" />
            ) : (
              <X className="h-5 w-5 text-error-400" />
            )}
            <span>{commandResult.message}</span>
          </div>
          <div className="mt-1 text-xs opacity-70">
            {formatTimestamp(commandResult.timestamp)}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Action buttons */}
        <div className="card p-6">
          <h3 className="mb-6 text-lg font-semibold">Bot Control</h3>
          <div className="space-y-4">
            <button 
              onClick={() => handleBotAction('start')}
              disabled={loading['start']}
              className="btn btn-success w-full"
            >
              {loading['start'] ? (
                <Loader className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Play className="mr-2 h-5 w-5" />
              )}
              Start Bot
            </button>
            
            <button 
              onClick={() => handleBotAction('stop')}
              disabled={loading['stop']}
              className="btn btn-error w-full"
            >
              {loading['stop'] ? (
                <Loader className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Square className="mr-2 h-5 w-5" />
              )}
              Stop Bot
            </button>
            
            <button 
              onClick={() => handleBotAction('restart')}
              disabled={loading['restart']}
              className="btn btn-warning w-full"
            >
              {loading['restart'] ? (
                <Loader className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-5 w-5" />
              )}
              Restart Bot
            </button>
            
            <button 
              onClick={() => handleBotAction('deploy')}
              disabled={loading['deploy']}
              className="btn btn-primary w-full"
            >
              {loading['deploy'] ? (
                <Loader className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Upload className="mr-2 h-5 w-5" />
              )}
              Deploy Commands
            </button>
          </div>
        </div>
        
        {/* Send message */}
        <div className="card p-6">
          <h3 className="mb-6 text-lg font-semibold">Send Message</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="channel" className="label">
                Target Channel
              </label>
              <select
                id="channel"
                className="input"
                value={targetChannel}
                onChange={(e) => setTargetChannel(e.target.value)}
              >
                <option value="">Select a channel</option>
                {availableChannels.map((channel) => (
                  <option key={channel.id} value={channel.id}>
                    #{channel.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="label">
                Message Content
              </label>
              <textarea
                id="message"
                className="input min-h-[120px]"
                value={commandMessage}
                onChange={(e) => setCommandMessage(e.target.value)}
                placeholder="Enter your message here..."
              ></textarea>
            </div>
            
            <button 
              onClick={handleSendMessage}
              disabled={!commandMessage || !targetChannel || loading['message']}
              className="btn btn-primary w-full"
            >
              {loading['message'] ? (
                <Loader className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Send className="mr-2 h-5 w-5" />
              )}
              Send Message
            </button>
          </div>
        </div>
        
        {/* Recent commands */}
        <div className="card p-6">
          <h3 className="mb-6 text-lg font-semibold">Recent Commands</h3>
          <div className="space-y-4">
            {recentCommands.map((command, index) => (
              <div 
                key={index} 
                className="flex items-start justify-between border-b border-dark-700 pb-4 last:border-0"
              >
                <div className="flex items-center space-x-2">
                  {command.action === 'Start' && <Play className="h-4 w-4 text-success-500" />}
                  {command.action === 'Stop' && <Square className="h-4 w-4 text-error-500" />}
                  {command.action === 'Restart' && <RefreshCw className="h-4 w-4 text-warning-500" />}
                  {command.action === 'Deploy' && <Upload className="h-4 w-4 text-primary-500" />}
                  {command.action === 'Message' && <MessageSquare className="h-4 w-4 text-accent-500" />}
                  
                  <div>
                    <div className="font-medium">{command.action}</div>
                    <div className="text-xs text-gray-400">by {command.user}</div>
                  </div>
                </div>
                
                <div className="flex items-center text-xs text-gray-400">
                  <Clock className="mr-1 h-3 w-3" />
                  {formatTimestamp(command.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Command console */}
      <div className="card p-6">
        <h3 className="mb-6 text-lg font-semibold">Custom Command</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="command" className="label">
              Execute Custom Command
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="command"
                className="input"
                placeholder="Enter bot command (e.g., help, stats, etc.)"
              />
              <button 
                className="btn btn-primary whitespace-nowrap"
                onClick={() => handleBotAction('custom')}
              >
                <Code className="mr-2 h-5 w-5" />
                Execute
              </button>
            </div>
          </div>
          
          <div>
            <label className="label">Command Output</label>
            <div className="h-40 overflow-auto rounded-md bg-dark-950 p-4 font-mono text-sm text-gray-300">
              {/* Mock command output */}
              <div className="text-primary-400">$ Bot command executed at {new Date().toLocaleString()}</div>
              <div className="mt-2">Command output will appear here...</div>
              <div className="mt-1 text-success-400">Ready to receive commands.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotManagement;