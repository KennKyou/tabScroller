#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🚀 Starting build process...');

// Ensure dist directory exists
const distDir = join(projectRoot, 'dist');
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

try {
  // Step 1: Clean previous builds
  console.log('🧹 Cleaning previous builds...');
  execSync('rm -f dist/*.min.js dist/*.min.css dist/*.map', { 
    cwd: projectRoot,
    stdio: 'inherit' 
  });

  // Step 2: Lint code
  console.log('🔍 Linting code...');
  execSync('npm run lint', { 
    cwd: projectRoot,
    stdio: 'inherit' 
  });

  // Step 3: Format code
  console.log('💅 Formatting code...');
  execSync('npm run format', { 
    cwd: projectRoot,
    stdio: 'inherit' 
  });

  // Step 4: Run tests
  console.log('🧪 Running tests...');
  execSync('npm test', { 
    cwd: projectRoot,
    stdio: 'inherit' 
  });

  // Step 5: Build JavaScript
  console.log('📦 Building JavaScript...');
  execSync('npm run build:js', { 
    cwd: projectRoot,
    stdio: 'inherit' 
  });

  // Step 6: Build CSS
  console.log('🎨 Building CSS...');
  execSync('npm run build:css', { 
    cwd: projectRoot,
    stdio: 'inherit' 
  });

  console.log('✅ Build completed successfully!');
  console.log('📁 Check the dist/ folder for minified files');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}