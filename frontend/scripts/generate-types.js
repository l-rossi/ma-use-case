/**
 * I am not going to lie, this script is completely LLM-generated.
 */

const { execSync } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Get the root directory of the project
const rootDir = path.resolve(__dirname, '../..');
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

// Define paths
const exportedTypesPath = path.join(backendDir, 'exported_types.py');
const outputPath = path.join(frontendDir, 'generated', 'types.ts');
const json2tsPath = path.join(frontendDir, 'node_modules', '.bin', 'json2ts');

// Ensure the generated directory exists
const generatedDir = path.join(frontendDir, 'generated');
if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir, { recursive: true });
}

// Determine the OS and set the appropriate command to activate the virtual environment
const isWindows = os.platform() === 'win32';
let activateCommand;
let pythonCommand;

if (isWindows) {
  // Windows
  activateCommand = `${path.join(backendDir, '.venv', 'Scripts', 'activate.bat')} &&`;
  pythonCommand = 'python';
} else {
  // Unix-like (Linux, macOS)
  activateCommand = `source ${path.join(backendDir, '.venv', 'bin', 'activate')} &&`;
  pythonCommand = 'python3';
}

// Build the full command
const command = `${activateCommand} pydantic2ts --module ${exportedTypesPath} --output "${outputPath}" --json2ts-cmd "${json2tsPath}"`;

console.log('Generating TypeScript types...');
console.log(`Command: ${command}`);

try {
  // Execute the command
  execSync(command, {
    stdio: 'inherit',
    shell: true,
    cwd: rootDir,
  });
  console.log(`TypeScript types successfully generated at: ${outputPath}`);
} catch (error) {
  console.error('Error generating TypeScript types:');
  console.error(error.message);
  process.exit(1);
}
