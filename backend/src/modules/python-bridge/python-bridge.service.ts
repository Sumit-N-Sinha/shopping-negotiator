import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';

@Injectable()
export class PythonBridgeService {
  private readonly logger = new Logger(PythonBridgeService.name);

  async runSearch(payload: { query: string; mode?: string; category?: string }) {
    const scriptPath = path.resolve(__dirname, '../../../services/ai_logic/bridge.py');
    const pythonExecutable = process.env.PYTHON_EXECUTABLE || (process.platform === 'win32' ? 'py' : 'python');

    return new Promise((resolve, reject) => {
      const child = spawn(pythonExecutable, [scriptPath, JSON.stringify(payload)], {
        cwd: path.resolve(__dirname, '../../../'),
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (chunk) => {
        stdout += chunk.toString();
      });

      child.stderr.on('data', (chunk) => {
        stderr += chunk.toString();
      });

      child.on('close', (code) => {
        if (code !== 0) {
          this.logger.error(`Python bridge failed: ${stderr}`);
          reject(new Error(stderr || 'Python bridge execution failed'));
          return;
        }

        try {
          resolve(JSON.parse(stdout));
        } catch (error) {
          reject(new Error(`Invalid JSON from python bridge: ${stdout}`));
        }
      });
    });
  }
}
