import { useState, useEffect } from "react";
import { Sparkles, Check, X, ChevronDown } from "lucide-react";

function AiSuggestion({ selectedSection, setAiDraft, applyAiDraft, clearDraft }) {
    const [text, setText] = useState("");
    const [suggestion, setSuggestion] = useState("");
    const [targetField, setTargetField] = useState("heading");

    const fields = [];
    if (selectedSection) {
        const { type, data } = selectedSection;
        if (data.heading !== undefined) fields.push({ id: 'heading', label: 'Title' });
        if (data.subheading !== undefined) fields.push({ id: 'subheading', label: 'Subtitle' });
        if (data.supportingText !== undefined) fields.push({ id: 'supportingText', label: 'Supporting Text' });
        if (data.body !== undefined) fields.push({ id: 'body', label: 'Body Text' });
        if (data.button !== undefined) fields.push({ id: 'button', label: 'Main Button' });
        if (data.buttonLabel !== undefined) fields.push({ id: 'buttonLabel', label: 'Button Label' });

        // Handle arrays
        if (data.buttons) {
            data.buttons.forEach((b, i) => fields.push({ id: `button-${i}`, label: `Button ${i + 1}` }));
        }
        if (data.plans) {
            data.plans.forEach((p, i) => {
                fields.push({ id: `planName-${i}`, label: `Plan ${i + 1} Name` });
                fields.push({ id: `planPrice-${i}`, label: `Plan ${i + 1} Price` });
                fields.push({ id: `planButton-${i}`, label: `Plan ${i + 1} Button` });
            });
        }
        if (data.titles) {
            data.titles.forEach((t, i) => fields.push({ id: `title-${i}`, label: `Title ${i + 1}` }));
        }
        if (data.items) {
            data.items.forEach((item, i) => {
                if (item.title !== undefined) fields.push({ id: `featureTitle-${i}`, label: `Feature ${i + 1} Title` });
                if (item.description !== undefined) fields.push({ id: `featureDescription-${i}`, label: `Feature ${i + 1} Desc` });
                if (item.question !== undefined) fields.push({ id: `question-${i}`, label: `Question ${i + 1}` });
                if (item.answer !== undefined) fields.push({ id: `answer-${i}`, label: `Answer ${i + 1}` });
            });
        }
    }

    // Set default targetField if current one is not valid for new section
    useEffect(() => {
        if (fields.length > 0 && !fields.find(f => f.id === targetField)) {
            setTargetField(fields[0].id);
        }
    }, [selectedSection]);

    // Generate REAL AI suggestion after user stops typing
    useEffect(() => {
        if (!text || !selectedSection) {
            setSuggestion("");
            clearDraft();
            return;
        }

        const timer = setTimeout(async () => {
            try {
                // Get current text for context
                let currentVal = selectedSection.data[targetField];
                if (targetField.includes('-')) {
                    const [fieldName, indexStr] = targetField.split('-');
                    const index = parseInt(indexStr);
                    const data = selectedSection.data;
                    if (fieldName === 'button' && data.buttons) currentVal = data.buttons[index]?.label;
                    else if (fieldName === 'planName' && data.plans) currentVal = data.plans[index]?.name;
                    else if (fieldName === 'planPrice' && data.plans) currentVal = data.plans[index]?.price;
                    else if (fieldName === 'planButton' && data.plans) currentVal = data.plans[index]?.buttonLabel;
                    else if (fieldName === 'title' && data.titles) currentVal = data.titles[index];
                    else if (fieldName === 'description' && data.descriptions) currentVal = data.descriptions[index];
                    else if (fieldName === 'featureTitle' && data.items) currentVal = data.items[index]?.title;
                    else if (fieldName === 'featureDescription' && data.items) currentVal = data.items[index]?.description;
                    else if (fieldName === 'question' && data.items) currentVal = data.items[index]?.question;
                    else if (fieldName === 'answer' && data.items) currentVal = data.items[index]?.answer;
                }

                const res = await fetch("http://localhost:5000/generate/suggest", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        prompt: text,
                        target: targetField,   // "heading" | "subheading" | "button"
                        context: {
                            type: selectedSection.type,
                            currentText: currentVal,
                            theme: selectedSection.data.align || "default"
                        }
                    })
                });

                const data = await res.json();

                if (!data.suggestion) return;

                // Show suggestion in AI panel
                setSuggestion(data.suggestion);

                // 🔥 LIVE PREVIEW ON CANVAS
                setAiDraft({
                    elementId: selectedSection.id,
                    field: targetField,
                    text: data.suggestion
                });

            } catch (error) {
                console.error("AI fetch error:", error);
            }
        }, 800); // debounce

        return () => clearTimeout(timer);
    }, [text, selectedSection, targetField]);


    if (!selectedSection) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500 text-center px-4">
                <Sparkles className="w-8 h-8 mb-4 opacity-20" />
                <p className="text-xs font-medium">Select a section to use AI Assistant</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Target Field</label>
                <div className="relative">
                    <select
                        value={targetField}
                        onChange={(e) => setTargetField(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-500/50 appearance-none cursor-pointer"
                    >
                        {fields.map(f => <option key={f.id} value={f.id} className="bg-[#0F0F0F]">{f.label}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
                </div>
            </div>

            <div className="relative group">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Content Input</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type keywords or a draft..."
                    className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder:text-zinc-700 outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all resize-none mt-2"
                />
                {suggestion && (
                    <div className="absolute top-[2.4rem] left-4 right-4 pointer-events-none text-xs text-zinc-500/50 select-none whitespace-pre-wrap">
                        {text}
                        <span className="text-cyan-400/50">{suggestion.replace(text, "")}</span>
                        <div className="mt-2 text-[9px] text-cyan-500/40 uppercase tracking-tighter animate-pulse">Press Tab to accept</div>
                    </div>
                )}
            </div>

            {suggestion && (
                <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <button
                        onClick={() => { setText(suggestion); setSuggestion(""); }}
                        className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20"
                    >
                        <Check className="w-3 h-3" /> Use Suggestion
                    </button>
                    <button
                        onClick={() => { setText(""); setSuggestion(""); clearDraft(); }}
                        className="w-10 bg-white/5 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 py-2.5 rounded-xl transition-all flex items-center justify-center border border-white/5"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            )}

            {text && !suggestion && (
                <button
                    onClick={applyAiDraft}
                    className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
                >
                    Apply Draft
                </button>
            )}
        </div>
    );
}

export default AiSuggestion;
