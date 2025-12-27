import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateSectionCode, generateAppCode } from './gemini';

export const exportToZip = async (projectName, sections, theme) => {
    const zip = new JSZip();

    // 1. Create Folder Structure
    const src = zip.folder("src");
    const components = src.folder("components");

    // 2. Generate Section Components
    const sectionList = [];
    for (const section of sections) {
        const componentName = `${section.type.charAt(0).toUpperCase() + section.type.slice(1)}_${section.id.split('-')[1]}`;
        try {
            const code = await generateSectionCode(section, theme);
            components.file(`${componentName}.jsx`, code);
            sectionList.push({ name: componentName, ...section });
        } catch (error) {
            // Fallback or skip
            console.error(`Failed to generate ${componentName}`, error);
        }
    }

    // 3. Generate App.jsx
    src.file("App.jsx", generateAppCode(sectionList));

    // 4. Base Project Files (Main.jsx, Index.html, package.json etc)
    src.file("main.jsx", `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
  `);

    src.file("index.css", `
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  color-scheme: ${theme.bg.includes('dark') || theme.bg.includes('black') || theme.bg.includes('900') ? 'dark' : 'light'};
}
  `);

    zip.file("index.html", `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Inter', sans-serif; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
  `);

    zip.file("package.json", JSON.stringify({
        name: projectName.toLowerCase().replace(/\s+/g, '-'),
        private: true,
        version: "0.0.0",
        type: "module",
        scripts: {
            dev: "vite",
            build: "vite build",
            preview: "vite preview"
        },
        dependencies: {
            "@google/generative-ai": "^0.11.4",
            "framer-motion": "^11.2.10",
            "lucide-react": "^0.395.0",
            "react": "^18.3.1",
            "react-dom": "^18.3.1"
        },
        devDependencies: {
            "@types/react": "^18.3.3",
            "@types/react-dom": "^18.3.0",
            "@vitejs/plugin-react": "^4.3.1",
            "autoprefixer": "^10.4.19",
            "postcss": "^8.4.38",
            "tailwindcss": "^3.4.4",
            "vite": "^5.3.1"
        }
    }, null, 2));

    zip.file("vite.config.js", `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
  `);

    // 5. Generate and Save ZIP
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${projectName.replace(/\s+/g, '_')}_project.zip`);
};
