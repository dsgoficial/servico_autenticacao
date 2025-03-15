import fs from 'fs-extra';
import npmRun from 'npm-run';
import path from 'path';
import colors from 'colors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

colors.enable();

/**
 * Creates a complete build of the application by:
 * 1. Building the frontend React app
 * 2. Compiling the backend TypeScript code
 * 3. Copying frontend build to backend locations
 */
const createBuild = async () => {
  // Step 1: Build the frontend
  console.log('Criando build do frontend'.blue);
  console.log('Esta operação pode demorar alguns minutos');

  try {
    await new Promise((resolve, reject) => {
      npmRun.exec('npm run build', { cwd: path.join(__dirname, 'client') }, (err, stdout, stderr) => {
        if (err) {
          reject(err);
          return;
        }
        console.log(stdout);
        resolve();
      });
    });
    
    console.log('Build do frontend criada com sucesso!'.blue);
    
    // Step 2: Build the backend TypeScript code
    console.log('Compilando código TypeScript do backend'.blue);
    
    await new Promise((resolve, reject) => {
      npmRun.exec('npm run build', { cwd: path.join(__dirname, 'server') }, (err, stdout, stderr) => {
        if (err) {
          reject(err);
          return;
        }
        console.log(stdout);
        resolve();
      });
    });
    
    console.log('Compilação do TypeScript concluída com sucesso!'.blue);
    
    // Step 3: Copy frontend build to both src/build and dist/build for compatibility
    console.log('Copiando arquivos do frontend para o backend'.blue);
    
    // Ensure dist/build directory exists
    const serverDistBuildPath = path.join(__dirname, 'server', 'dist', 'build');
    await fs.ensureDir(serverDistBuildPath);
    
    // Copy to src/build (for development compatibility)
    await fs.copy(
      path.join(__dirname, 'client', 'build'), 
      path.join(__dirname, 'server', 'src', 'build')
    );
    
    // Copy to dist/build (for production use)
    await fs.copy(
      path.join(__dirname, 'client', 'build'), 
      serverDistBuildPath
    );
    
    console.log('Arquivos copiados com sucesso!'.blue);
    console.log('Build completa finalizada!'.green);
    
  } catch (error) {
    console.log('Erro durante o processo de build!'.red);
    console.log(error.message.red);
    console.log('-------------------------------------------------');
    console.log(error);
    process.exit(1);
  }
};

createBuild();