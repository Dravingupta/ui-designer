// src/services/ai.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export const generateCode = async (layout, theme, pageRouteMap = {}) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const pageName = layout.name || 'Page';
    const componentName = pageName.replace(/\s+/g, '');

    const prompt = `You are an expert React developer. Generate a complete, production-ready React component for a page in a website.

Theme: ${theme}
Layout: ${JSON.stringify(layout.layout || layout, null, 2)}
Page Name: ${pageName}

Link Logic Ref:
Page ID to Route mapping: ${JSON.stringify(pageRouteMap, null, 2)}

Requirements:
1. Generate ONLY the ${componentName}.jsx code - no explanations, no markdown formatting.
2. The component should be exported as default: "export default function ${componentName}() { ... }".
3. Use React hooks (useState, useEffect) where appropriate.
4. Use Tailwind CSS for styling.
5. Make it responsive and modern.
6. Include all sections from the layout data.
7. Apply the theme colors consistently.
8. Make sure all text content is editable and comes from the layout data.
9. Use proper component structure.

CRITICAL LINK HANDLING:
Link properties (href, buttonHref, etc.) might be objects or strings.
- If it is an OBJECT: { type: 'internal', pageId: '...' }: IMPORT "Link" from 'react-router-dom' and generate <Link to="route_from_map">...</Link>. Use the provided Page ID to Route mapping to find the path.
- If it is an OBJECT: { type: 'external', url: '...' }: Generate <a href="..." target="_blank" rel="noopener noreferrer">...</a>.
- If it is a STRING (legacy): Generate <a href="...">...</a>.

Return ONLY the raw JavaScript code for the component, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedCode = response.text();

    // Clean up any markdown formatting if present
    let code = generatedCode
      .replace(/```javascript\n?/g, '')
      .replace(/```jsx\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();



    return code;
  } catch (error) {
    console.error('Gemini API Error:', error);

    // Fallback to basic template if AI fails
    const pageName = layout.name || 'Page';
    const componentName = pageName.replace(/\s+/g, '');

    return `import { useState } from 'react';

export default function ${componentName}() {
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-center py-8">
        ${pageName}
      </h1>
      <p className="text-center text-gray-600">
        Theme: ${theme}
      </p>
      <div className="max-w-6xl mx-auto p-4">
        <p className="text-sm text-gray-500">
          AI generation temporarily unavailable. Using fallback template.
        </p>
      </div>
    </div>
  );
}
`;
  }
};
