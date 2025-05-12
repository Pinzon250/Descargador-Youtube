const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = app.isPackaged ? false : require("electron-is-dev");
const { spawn } = require("child_process");

let backendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    icon: path.join(__dirname, "../public/descarga.ico"),
    autoHideMenuBar: true,
    transparent: false,
    backgroundColor: "#101828",
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadURL(`file://${path.join(__dirname, "../dist/index.html")}`);
    win.setMenuBarVisibility(false);
  }
}

function startBackend() {
  const pythonExecutable = isDev
    ? "../.venv/Scripts/python.exe"
    : "./.venv/Scripts/python.exe";

  const scriptPath = isDev
    ? "backend/app/main.py"
    : "./backend/app/main.py";

  backendProcess = spawn(pythonExecutable, [scriptPath], {
    stdio: "inherit",
    shell: true,
  });

  backendProcess.on("close", (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
});

app.on("window-all-closed", () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

