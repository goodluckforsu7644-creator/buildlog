import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  use: { baseURL: 'http://localhost:5173', browserName: 'chromium', trace: 'retain-on-failure' },
  webServer: [
    {
      command: `${process.platform === 'win32' ? '.venv\\Scripts\\python.exe' : '.venv/bin/python'} -m uvicorn app.main:app --host 127.0.0.1 --port 8000`,
      cwd: fileURLToPath(new URL('../backend', import.meta.url)),
      url: 'http://127.0.0.1:8000/api/health',
      reuseExistingServer: false,
    },
    { command: 'npm run dev', url: 'http://localhost:5173', reuseExistingServer: false },
  ],
});
