const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    icon: path.join(__dirname, 'icon.ico'),
    title: "R2 - Oil and Gas",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadURL('https://chat.openai.com/');

  win.webContents.on('did-finish-load', () => {
    win.webContents.executeJavaScript(`
      // === Sidebar Cleanup ===
      function nukeSidebarByTextContent(targets) {
        document.querySelectorAll('nav *').forEach(el => {
          if (!el.innerText) return;
          for (const txt of targets) {
            if (el.innerText.trim() === txt) {
              let row = el.closest('a,button,li,[role="listitem"],div');
              if (row && row !== document.body && row.innerText.trim() === txt) {
                row.style.display = "none";
              } else {
                el.style.display = "none";
              }
            }
          }
        });
      }
      const sidebarTargets = ["ChatGPT", "Sora", "Explore GPTs"];
      nukeSidebarByTextContent(sidebarTargets);
      setInterval(() => nukeSidebarByTextContent(sidebarTargets), 2000);

      // === Model Dropdown Removal ===
      function removeModelDropdown() {
        document.querySelectorAll('button[aria-haspopup="listbox"]').forEach(btn => {
          if (btn.innerText.trim() === "ChatGPT 4o") {
            btn.style.display = "none";
          }
        });
        document.querySelectorAll('h1,h2,h3,header,div').forEach(el => {
          if (
            el.childElementCount === 1 &&
            el.innerText.trim() === "ChatGPT 4o"
          ) {
            el.style.display = "none";
          }
        });
      }
      removeModelDropdown();
      setInterval(removeModelDropdown, 2000);

      // === Footer Removal (Safe) ===
      function hideFooters() {
        // Sidebar "Add teammates" etc.
        document.querySelectorAll('nav *').forEach(el => {
          if (!el.innerText) return;
          if (
            el.innerText.includes("Add teammates") ||
            el.innerText.includes("Invite coworkers")
          ) {
            let row = el.closest('div,li,[role="listitem"],section');
            if (row) row.style.display = "none";
            else el.style.display = "none";
          }
        });
        // Main window footer with exact branding
        document.querySelectorAll('*').forEach(el => {
          if (!el.innerText) return;
          if (
            el.innerText.trim() === "ChatGPT can make mistakes. OpenAI doesn't use R2's Workspace workspace data to train its models."
            || el.innerText.trim().startsWith("ChatGPT can make mistakes.")
          ) {
            el.style.display = "none";
          }
        });
      }
      hideFooters();
      setInterval(hideFooters, 2000);

// === Rename Popup Menu Items ===
    function renamePopupMenuItems() {
      const renames = {
        "My GPTs": "My Custom Bots",
        "Customize ChatGPT": "Customize R2",
        "Get ChatGPT search extension": "Get R2 Search Extension"
      };
      document.querySelectorAll('*').forEach(el => {
        if (!el.innerText) return;
        for (const [oldTxt, newTxt] of Object.entries(renames)) {
          if (el.innerText.trim() === oldTxt) {
            el.innerText = newTxt;
          }
        }
      });
    }
    renamePopupMenuItems();
    setInterval(renamePopupMenuItems, 2000);

    // === Keep Custom Title ===
    document.title = "R2 - Oil and Gas";
    setInterval(() => {
      if (document.title !== "R2 - Oil and Gas") document.title = "R2 - Oil and Gas";
    }, 1000);
  `);
});
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
