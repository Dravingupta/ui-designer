// src/services/zip.js
import archiver from 'archiver';
import { Readable } from 'stream';

export const createZip = async (files, projectName) => {
    return new Promise((resolve, reject) => {
        const archive = archiver('zip', { zlib: { level: 9 } });
        const chunks = [];

        archive.on('data', (chunk) => chunks.push(chunk));
        archive.on('end', () => resolve(Buffer.concat(chunks)));
        archive.on('error', (err) => reject(err));

        // Add files to ZIP
        for (const [filepath, content] of Object.entries(files)) {
            archive.append(content, { name: filepath });
        }

        // Add package.json
        const packageJson = {
            name: projectName.toLowerCase().replace(/\s+/g, '-'),
            version: '1.0.0',
            type: 'module',
            scripts: {
                dev: 'vite',
                build: 'vite build',
                preview: 'vite preview'
            },
            dependencies: {
                react: '^18.2.0',
                'react-dom': '^18.2.0'
            },
            devDependencies: {
                '@vitejs/plugin-react': '^4.2.0',
                autoprefixer: '^10.4.16',
                postcss: '^8.4.32',
                tailwindcss: '^3.3.6',
                vite: '^5.0.8'
            }
        };

        archive.append(JSON.stringify(packageJson, null, 2), { name: 'package.json' });

        // Add vite config
        const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`;
        archive.append(viteConfig, { name: 'vite.config.js' });

        // Add tailwind config
        const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
        archive.append(tailwindConfig, { name: 'tailwind.config.js' });

        // Add postcss config
        const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
        archive.append(postcssConfig, { name: 'postcss.config.js' });

        // Add index.html
        const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;
        archive.append(indexHtml, { name: 'index.html' });

        // Add main.jsx
        const mainJsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;
        archive.append(mainJsx, { name: 'src/main.jsx' });

        // Add .gitignore
        const gitignore = `node_modules
dist
.env
`;
        archive.append(gitignore, { name: '.gitignore' });

        archive.finalize();
    });
};
