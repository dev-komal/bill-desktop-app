import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.NODE_ENV === 'development';

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: !isDev, // Disable webSecurity in dev mode for hot reload
      allowRunningInsecureContent: false
    }
  });

  // In development, load from Vite dev server
  if (isDev) {
    try {
      await mainWindow.loadURL('http://localhost:5173/');
      mainWindow.webContents.openDevTools();
      
      // Enable hot reload in development
      mainWindow.webContents.on('did-fail-load', () => {
        console.log('Page failed to load - retrying...');
        setTimeout(() => {
          mainWindow.loadURL('http://localhost:5173/');
        }, 1000);
      });
    } catch (e) {
      console.error('Failed to load URL:', e);
    }
  } else {
    // In production, load the built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Handle window state
  mainWindow.on('closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  // Prevent navigation to unknown protocols except in dev mode
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!isDev && !url.startsWith('file://')) {
      event.preventDefault();
    }
  });

  return mainWindow;
}

// This method will be called when Electron has finished initialization
app.whenReady().then(async () => {
  const mainWindow = await createWindow();

  // Handle macOS dock click
  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle IPC messages here
ipcMain.on('message', (event, arg) => {
  console.log(arg);
  event.reply('reply', 'pong');
}); 