// src/services/ai.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const maskHugeStrings = (obj, map = new Map(), threshold = 1000) => {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    if (obj.length > threshold) {
      const key = `__HUGE_STRING_${map.size}__`;
      map.set(key, obj);
      return key;
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => maskHugeStrings(item, map, threshold));
  }
  if (typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = maskHugeStrings(obj[key], map, threshold);
    }
    return newObj;
  }
  return obj;
};

export const generateCode = async (layout, themeObj, pageRouteMap = {}) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "models/gemini-3-flash-preview" });

    const pageName = layout.name || 'Page';
    const componentName = pageName.replace(/\s+/g, '');

    // Mask huge strings (base64 images) to prevent prompt bloat and output truncation
    const stringMap = new Map();
    const layoutData = layout.layout || layout;
    const maskedLayout = maskHugeStrings(JSON.parse(JSON.stringify(layoutData)), stringMap);

    const themePrompt = `
    Theme Colors (Tailwind Classes):
    - Background: ${themeObj.bg}
    - Text: ${themeObj.text}
    - Border: ${themeObj.border}
    - Accent: ${themeObj.accent}
    - Secondary: ${themeObj.secondary}
    - Muted: ${themeObj.muted}
    `;

    const componentTemplates = `
    COMPONENT TEMPLATES (STRICTLY FOLLOW FOR THESE TYPES):
    
    1. TYPE: "cards"
       - Structure: Grid layout based on item count.
       - Container Class: "grid gap-8 " + (isMobile ? "grid-cols-1" : items.length <= 2 ? "grid-cols-2" : items.length === 3 ? "grid-cols-3" : "grid-cols-4")
       - Card Style: "p-8 rounded-3xl border [theme.border] [theme.secondary] transition-all hover:scale-[1.02] flex flex-col"
       - Image: "h-48 mb-6 overflow-hidden rounded-2xl" -> img "w-full h-full object-cover"
       - Title: "text-xl font-bold mb-4 [theme.text]"
       - Description: "text-sm opacity-60 leading-relaxed [theme.text] mb-6 flex-grow"
       - Button: "mt-auto w-full py-3 text-xs font-bold uppercase tracking-widest rounded-xl border [theme.border] hover:bg-white/5 transition-colors [theme.text]"

    2. TYPE: "cafemenu" (Cafe Menu)
       - Structure: 
         - Heading: "text-6xl font-black mb-20 tracking-tight text-center [theme.text] italic"
         - Category: "text-3xl font-black text-center uppercase tracking-widest [theme.text] border-b-2 border-dashed [theme.border] pb-6 mx-auto max-w-xs"
         - Grid: "grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"
         - Item Card: "group relative"
           - Flex Container: "flex gap-6 items-start"
           - Image: "w-32 h-32 shrink-0 rounded-2xl overflow-hidden shadow-lg rotate-3 group-hover:rotate-0 transition-all duration-300"
           - Text Content: "flex-1 space-y-2"
             - Header Row: "flex justify-between items-baseline border-b border-dashed border-gray-700/30 pb-2"
             - Name: "text-xl font-bold [theme.text] font-serif"
             - Price: "text-xl font-bold [theme.accent_text] whitespace-nowrap"
    `;

    const prompt = `You are a strict code generator. Your task is to convert JSON layout data into a React component. 

Theme Context:
${themePrompt}

${componentTemplates}

Layout Data:
${JSON.stringify(maskedLayout, null, 2)}

Page Name: ${pageName}

Link Logic Ref:
Page ID to Route mapping: ${JSON.stringify(pageRouteMap, null, 2)}

Requirements:
1. Generate ONLY the ${componentName}.jsx code.
2. The component should be exported as default: "export default function ${componentName}() { ... }".
3. Use Tailwind CSS for styling using the EXACT classes from the "Theme Context".
4. Render the sections EXACTLY as defined in the Layout Data.
5. STRICT DATA FIDELITY RULES:
   - DO NOT add any text, images, or elements that are not explicitly present in the Layout Data.
   - DO NOT fill empty fields with "Lorem ipsum" or placeholder data. If a field is empty, render it empty.
   - DO NOT change any text or numbers provided in the Layout Data. Use them exactly as is.
   - Iterate through lists (like menu items, features) and render ONLY the items present in the array. Do not add "example" items.
6. Use proper React component structure.
7. If you see keys like "__HUGE_STRING_X__", use them EXACTLY as string literals in the code. Do not try to interpret them.

CRITICAL LINK HANDLING:
- If props contain { type: 'internal', pageId: '...' }: Use <Link to="...">.
- If props contain { type: 'external', url: '...' }: Use <a href="..." target="_blank">.
- If props contain a string: Use <a href="...">.

Return ONLY the raw JavaScript code for the component.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedCode = response.text();

    // Clean up any markdown formatting if present
    let code = generatedCode
      .replace(/```javascript\n?/g, '')
      .replace(/```jsx\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Unmask strings
    stringMap.forEach((value, key) => {
      // Replace all occurrences of the key with the original large string
      code = code.split(key).join(value);
    });

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
        Theme: ${JSON.stringify(themeObj)}
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
  };
};

// 🔹 NEW FUNCTION FOR INLINE AI SUGGESTIONS (DO NOT TOUCH generateCode)

export const generateSuggestion = async ({ prompt, target, context }) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "models/gemini-3-flash-preview" });

    const fullPrompt = `
You are an expert UI/UX copywriter.

User is designing a website UI.

Generate ONLY a short ${target} text.
Do NOT explain anything.
Do NOT use quotes.
Do NOT add punctuation at the end.

Make it modern, professional, and catchy.

Current UI context:
${JSON.stringify(context)}

User idea:
"${prompt}"
`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text().trim();

  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    throw new Error("Suggestion generation failed");
  }
};
