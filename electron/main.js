import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { createConnection } from 'mysql2/promise';
import fs from 'fs';

// Configuration paths
const CONFIG_PATH = path.join(app.getPath('userData'), 'config');
const DB_CONFIG_PATH = path.join(CONFIG_PATH, 'db-config.json');
const BOT_CONFIG_PATH = path.join(CONFIG_PATH, 'bot-config.json');
const VDS_CONFIG_PATH = path.join(CONFIG_PATH, 'vds-config.json');

// Ensure config directory exists
if (!fs.existsSync(CONFIG_PATH)) {
  fs.mkdirSync(CONFIG_PATH, { recursive: true });
}

// Default configurations
const DEFAULT_DB_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: 'quadxccO6',
  database: 'centra_panel'
};

const DEFAULT_BOT_CONFIG = {
    token: '',
    clientId: '',
    guildId: ''
};

const DEFAULT_VDS_CONFIG = {
    host: '45.147.46.164',
  port: 80,
  username: 'Administrator',
    password: 'FDekNXR9KTLJQLs-'
};

// Initialize configuration files if they don't exist
if (!fs.existsSync(DB_CONFIG_PATH)) {
  fs.writeFileSync(DB_CONFIG_PATH, JSON.stringify(DEFAULT_DB_CONFIG, null, 2));
}

if (!fs.existsSync(BOT_CONFIG_PATH)) {
  fs.writeFileSync(BOT_CONFIG_PATH, JSON.stringify(DEFAULT_BOT_CONFIG, null, 2));
}

if (!fs.existsSync(VDS_CONFIG_PATH)) {
  fs.writeFileSync(VDS_CONFIG_PATH, JSON.stringify(DEFAULT_VDS_CONFIG, null, 2));
}

// Database connection pool
let dbPool = null;

async function initializeDbConnection() {
  try {
    const dbConfig = JSON.parse(fs.readFileSync(DB_CONFIG_PATH, 'utf-8'));
    dbPool = await createConnection(dbConfig);
    console.log('Database connected successfully');
    
    // Check if tables exist, create them if they don't
    await initializeDatabaseTables();
    
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

async function initializeDatabaseTables() {
  const connection = await dbPool.getConnection();
  
  try {
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        profile_image VARCHAR(255),
        rank INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create bot_logs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS bot_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        action VARCHAR(255) NOT NULL,
        details TEXT,
        user_id INT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    
    // Create vds_metrics table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS vds_metrics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cpu_usage FLOAT,
        ram_usage FLOAT,
        fps FLOAT,
        network_status VARCHAR(50),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing database tables:', error);
  } finally {
    connection.release();
  }
}

// Create the browser window
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, '../src/assets/icon.png'),
    show: false,
    backgroundColor: '#0c1221',
  });

  // Load the app
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../dist/index.html'),
    protocol: 'file:',
    slashes: true,
  });
  
  mainWindow.loadURL(startUrl);
  
  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

// App lifecycle
app.whenReady().then(async () => {
  await initializeDbConnection();
  createWindow();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('authenticate', async (event, credentials) => {
  try {
    const [rows] = await dbPool.execute(
      'SELECT id, username, rank, profile_image FROM users WHERE username = ? AND password = ?',
      [credentials.username, credentials.password]
    );
    
    if (rows.length > 0) {
      return { success: true, user: rows[0] };
    } else {
      return { success: false, message: 'Invalid credentials' };
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, message: 'Database error' };
  }
});

ipcMain.handle('getVdsMetrics', async () => {
  try {
    // Mock data for now - would be replaced with actual monitoring code
    return {
      cpu: Math.floor(Math.random() * 100),
      ram: Math.floor(Math.random() * 100),
      fps: Math.floor(Math.random() * 60) + 60,
      network: Math.random() > 0.1 ? 'Online' : 'Issues Detected'
    };
  } catch (error) {
    console.error('Error fetching VDS metrics:', error);
    return null;
  }
});

ipcMain.handle('getBotStatus', async () => {
  try {
    // Mock data for now - would be replaced with actual bot API calls
    return {
      status: Math.random() > 0.1 ? 'Online' : 'Offline',
      uptime: Math.floor(Math.random() * 10000),
      load: Math.floor(Math.random() * 100),
      apiStatus: Math.random() > 0.1 ? 'Operational' : 'Degraded'
    };
  } catch (error) {
    console.error('Error fetching bot status:', error);
    return null;
  }
});

ipcMain.handle('updateProfile', async (event, userData) => {
  try {
    await dbPool.execute(
      'UPDATE users SET email = ?, phone = ?, profile_image = ? WHERE id = ?',
      [userData.email, userData.phone, userData.profile_image, userData.id]
    );
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, message: 'Database error' };
  }
});

ipcMain.handle('updatePassword', async (event, data) => {
  try {
    await dbPool.execute(
      'UPDATE users SET password = ? WHERE id = ? AND password = ?',
      [data.newPassword, data.userId, data.currentPassword]
    );
    return { success: true };
  } catch (error) {
    console.error('Error updating password:', error);
    return { success: false, message: 'Database error' };
  }
});

ipcMain.handle('controlBot', async (event, action) => {
  try {
    // Mock bot control - would be replaced with actual bot control code
    console.log(`Bot control: ${action.type}`);
    
    // Log the action to database
    await dbPool.execute(
      'INSERT INTO bot_logs (action, details, user_id) VALUES (?, ?, ?)',
      [action.type, JSON.stringify(action), action.userId]
    );
    
    return { success: true, message: `Bot ${action.type} command executed successfully` };
  } catch (error) {
    console.error('Error controlling bot:', error);
    return { success: false, message: 'Error executing command' };
  }
});