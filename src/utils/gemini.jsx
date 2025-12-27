import { GoogleGenerativeAI } from "@google/generative-ai";

const getApiKey = () => {
    return localStorage.getItem('GEMINI_API_KEY') || '';
};

export const generateSectionCode = async (section, theme) => {
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error('Please provide a Gemini API key in the settings.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Generate a modern, premium React component for a " + section.type + " section. " +
    "Use Tailwind CSS for styling. Theme Context: " + JSON.stringify(theme) + " Section Data: " + JSON.stringify(section.data) + 
    " Return ONLY the code for a functional React component. Use Lucide-React icons if needed. " +
    "The component should be named " + (section.type.charAt(0).toUpperCase() + section.type.slice(1)) + "Section. " +
    "Do not include any explanations or markdown formatting outside the code block.";

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/```javascript/g, '').replace(/```jsx/g, '').replace(/```/g, '').trim();
        return text;
    } catch (error) {
        console.error("Gemini Error:", error);
        throw error;
    }
};

export const generateAppCode = (sections) => {
    const imports = sections.map(s => "import " + s.name + " from './components/" + s.name + "';").join('\n');
    const componentsList = sections.map(s => "<" + s.name + " />").join('\n        ');

  return "import React from 'react';\n" + 
         imports + "\n\n" +
         "function App() {\n" +
         "  return (\n" +
         "    <div className=\"min-h-screen\">\n" +
         "        " + componentsList + "\n" +
         "    </div>\n" +
         "  );\n" +
         "}\n\n" +
         "export default App;";
};
