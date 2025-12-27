import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronLeft, Save, Eye, EyeOff, Share2, Download, Settings, Trash2, GripVertical, Plus, Edit3, Layout, Layers, Key, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToZip } from '../utils/exportUtil';

// Theme definitions
const themes = {
  light: { bg: 'bg-white', text: 'text-gray-900', border: 'border-gray-300', accent: 'bg-black text-white hover:bg-black/90', secondary: 'bg-gray-100', muted: 'text-gray-600' },
  dark: { bg: 'bg-zinc-950', text: 'text-white', border: 'border-zinc-800', accent: 'bg-white text-black hover:bg-white/90', secondary: 'bg-zinc-900', muted: 'text-zinc-400' },
  gray: { bg: 'bg-gray-50', text: 'text-gray-900', border: 'border-gray-300', accent: 'bg-gray-900 text-white hover:bg-black', secondary: 'bg-gray-200', muted: 'text-gray-600' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-950', border: 'border-blue-200', accent: 'bg-blue-600 text-white hover:bg-blue-700', secondary: 'bg-blue-100', muted: 'text-blue-700' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-950', border: 'border-indigo-200', accent: 'bg-indigo-600 text-white hover:bg-indigo-700', secondary: 'bg-indigo-100', muted: 'text-indigo-700' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-950', border: 'border-purple-200', accent: 'bg-purple-600 text-white hover:bg-purple-700', secondary: 'bg-purple-100', muted: 'text-purple-700' },
  slate: { bg: 'bg-slate-50', text: 'text-slate-900', border: 'border-slate-300', accent: 'bg-slate-900 text-white hover:bg-slate-800', secondary: 'bg-slate-100', muted: 'text-slate-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-950', border: 'border-emerald-200', accent: 'bg-emerald-600 text-white hover:bg-emerald-700', secondary: 'bg-emerald-100', muted: 'text-emerald-700' },
  charcoal: { bg: 'bg-zinc-900', text: 'text-zinc-100', border: 'border-zinc-700', accent: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200', secondary: 'bg-zinc-800', muted: 'text-zinc-400' },
  peach: { bg: 'bg-orange-50', text: 'text-orange-950', border: 'border-orange-200', accent: 'bg-orange-600 text-white hover:bg-orange-700', secondary: 'bg-orange-100', muted: 'text-orange-700' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-950', border: 'border-rose-200', accent: 'bg-rose-600 text-white hover:bg-rose-700', secondary: 'bg-rose-100', muted: 'text-rose-700' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-950', border: 'border-teal-200', accent: 'bg-teal-600 text-white hover:bg-teal-700', secondary: 'bg-teal-100', muted: 'text-teal-700' },
  midnight: { bg: 'bg-slate-950', text: 'text-slate-100', border: 'border-slate-800', accent: 'bg-indigo-500 text-white hover:bg-indigo-600', secondary: 'bg-slate-900', muted: 'text-slate-400' },
  coffee: { bg: 'bg-stone-50', text: 'text-stone-900', border: 'border-stone-300', accent: 'bg-stone-800 text-white hover:bg-stone-900', secondary: 'bg-stone-100', muted: 'text-stone-600' },
  cyber: { bg: 'bg-neutral-950', text: 'text-neutral-100', border: 'border-neutral-800', accent: 'bg-cyan-500 text-black hover:bg-cyan-400', secondary: 'bg-neutral-900', muted: 'text-neutral-400' },
  terminal: { bg: 'bg-black', text: 'text-green-400', border: 'border-green-900', accent: 'bg-green-600 text-black hover:bg-green-500', secondary: 'bg-zinc-900', muted: 'text-green-700' },
  lavender: { bg: 'bg-violet-50', text: 'text-violet-950', border: 'border-violet-200', accent: 'bg-violet-600 text-white hover:bg-violet-700', secondary: 'bg-violet-100', muted: 'text-violet-700' },
  mint: { bg: 'bg-emerald-50', text: 'text-emerald-950', border: 'border-emerald-200', accent: 'bg-emerald-600 text-white hover:bg-emerald-700', secondary: 'bg-emerald-100', muted: 'text-emerald-700' }
};

const themeGroups = {
  Minimal: ['light', 'dark', 'gray'],
  Startup: ['blue', 'indigo', 'purple'],
  Business: ['slate', 'emerald', 'charcoal'],
  Creative: ['peach', 'rose', 'teal'],
  Premium: ['midnight', 'coffee'],
  Tech: ['cyber', 'terminal'],
  Soft: ['lavender', 'mint']
};

function CanvaEditor({ initialData, onSave, onBack }) {
  const [state, setState] = useState({
    name: initialData?.name || 'Untitled Design',
    selectedSectionId: null,
    theme: initialData?.theme || 'light',
    layout: initialData?.layout || []
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('GEMINI_API_KEY') || '');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSave = async () => {
    setIsSaving(true);
    await onSave({
      name: state.name,
      theme: state.theme,
      layout: state.layout
    });
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleExport = async () => {
    if (!localStorage.getItem('GEMINI_API_KEY')) {
      setShowKeyModal(true);
      return;
    }
    setIsExporting(true);
    try {
      await exportToZip(state.name, state.layout, currentTheme);
    } catch (err) {
      alert("Export failed: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const saveApiKey = () => {
    localStorage.setItem('GEMINI_API_KEY', apiKey);
    setShowKeyModal(false);
  };

  const addElement = (type) => {
    const newElement = {
      id: `${type}-${Date.now()}`,
      type,
      data: getDefaultData(type)
    };
    setState(prev => ({
      ...prev,
      layout: [...prev.layout, newElement],
      selectedSectionId: newElement.id
    }));
  };

  const getDefaultData = (type) => {
    const defaults = {
      navbar: { logo: 'DESIGNER', links: ['Home', 'Features', 'Pricing'], align: 'right', sticky: false },
      hero: { heading: 'Design something amazing', subheading: 'Your vision, powered by AI components.', button: 'Get Started', align: 'center', minHeight: 'auto' },
      richtext: { heading: 'Our Story', body: 'Start telling your story here. This component supports multiple lines of text and custom headings.', align: 'left', width: 'normal' },
      text: { content: 'This is a text block.', fontSize: 'base', width: 'normal', align: 'left' },
      image: { height: 300, caption: 'Beautiful Image', fullWidth: false },
      cards: { count: 3, titles: Array(3).fill('Card Title'), descriptions: Array(3).fill('Card description text goes here.'), imageUrls: Array(3).fill('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80'), layout: 'grid' },
      testimonials: { items: [{ name: 'Alex Rivera', role: 'Founder', quote: 'This builder is game changing!', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' }] },
      pricing: { plans: [{ name: 'Base', price: '$0', features: ['Feature 1'], highlighted: false }, { name: 'Pro', price: '$29', features: ['All Features', 'Support'], highlighted: true }] },
      contact: { heading: 'Contact Us', email: 'hi@example.com', phone: '+1 234 567 890', address: '123 Studio St' },
      logogrid: { logos: Array(4).fill('https://via.placeholder.com/120x60/eeeeee/999999?text=LOGO'), columns: 4 },
      video: { heading: 'Product Demo', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      buttons: { buttons: [{ label: 'Action 1' }, { label: 'Action 2' }], align: 'center' },
      features: { items: [{ title: 'Power', description: 'AI generated code' }], columns: 3 },
      stats: { stats: [{ label: 'Users', value: '1M+' }], layout: 'horizontal' },
      cta: { heading: 'Ready?', supportingText: 'Join us today.', button: 'Sign Up', align: 'center' },
      faq: { items: [{ question: 'Is it fast?', answer: 'Yes, incredibly.' }] },
      divider: { height: 'md', showLine: true },
      footer: { text: '© 2025 UI Designer. All rights reserved.', columns: 1, align: 'center' }
    };
    return defaults[type] || {};
  };

  const removeElement = (id) => {
    setState(prev => ({
      ...prev,
      layout: prev.layout.filter(el => el.id !== id),
      selectedSectionId: prev.selectedSectionId === id ? null : prev.selectedSectionId
    }));
  };

  const updateElement = (id, newData) => {
    setState(prev => ({
      ...prev,
      layout: prev.layout.map(el =>
        el.id === id ? { ...el, data: newData } : el
      )
    }));
  };

  const selectSection = (id) => {
    if(!previewMode) setState(prev => ({ ...prev, selectedSectionId: id }));
  };

  const setTheme = (theme) => {
    setState(prev => ({ ...prev, theme }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setState((prev) => {
        const oldIndex = prev.layout.findIndex((item) => item.id === active.id);
        const newIndex = prev.layout.findIndex((item) => item.id === over.id);
        return {
          ...prev,
          layout: arrayMove(prev.layout, oldIndex, newIndex),
        };
      });
    }
  };

  const selectedSection = state.layout.find(el => el.id === state.selectedSectionId);
  const currentTheme = themes[state.theme];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col text-zinc-100 selection:bg-indigo-500/30">
      {/* Premium Header */}
      {!previewMode && (
        <header className="bg-zinc-900/50 backdrop-blur-xl border-b border-white/5 px-6 py-3 flex items-center justify-between z-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white/5 rounded-xl text-zinc-400 hover:text-white transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-white/10"></div>
            <input 
              type="text" 
              value={state.name}
              onChange={(e) => setState(prev => ({ ...prev, name: e.target.value }))}
              className="bg-transparent font-semibold focus:outline-none hover:bg-white/5 px-2 py-1 rounded transition-all w-48 text-sm"
              placeholder="Design Name"
            />
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowKeyModal(true)}
              className="p-2 hover:bg-white/5 rounded-xl text-zinc-400 hover:text-white transition-all"
              title="API Settings"
            >
              <Key className="w-4 h-4" />
            </button>
            <div className="h-6 w-px bg-white/10 mr-2"></div>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${isSaving ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 hover:bg-white/10'}`}
            >
              <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button 
              onClick={() => setPreviewMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold transition-all"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95 ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
              {isExporting ? 'Generating ZIP...' : 'Export ZIP'}
            </button>
          </div>
        </header>
      )}

      {/* Preview Exit Overlay */}
      <AnimatePresence>
        {previewMode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-6 right-6 z-[100]"
          >
            <button 
              onClick={() => setPreviewMode(false)}
              className="flex items-center gap-3 px-6 py-3 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl hover:bg-zinc-800 transition-all text-sm font-bold text-white group"
            >
              <EyeOff className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Exit Preview
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Key Modal */}
      <AnimatePresence>
        {showKeyModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setShowKeyModal(false)}
               className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-md bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <Key className="w-5 h-5 text-indigo-500" />
                  API Settings
                </h2>
                <button onClick={() => setShowKeyModal(false)} className="p-2 hover:bg-white/5 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <p className="text-sm text-zinc-400 mb-6 font-medium">To export your code, please provide a Gemini API key. Your key is stored only in your browser locally.</p>
              <div className="space-y-4">
                <Input label="Google Gemini API Key" value={apiKey} onChange={setApiKey} placeholder="Paste your key here..." />
                <button 
                  onClick={saveApiKey}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 underline-none"
                >
                  <Check className="w-4 h-4" />
                  Save Credentials
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className={`flex flex-1 overflow-hidden transition-all ${previewMode ? 'bg-white' : ''}`}>
        {/* Left Sidebar */}
        {!previewMode && (
          <aside className="w-72 bg-zinc-900 border-r border-white/5 overflow-y-auto hidden lg:flex flex-col">
            <div className="p-6">
              <h2 className="text-[10px] font-bold mb-6 uppercase tracking-[0.2em] text-zinc-500">Components</h2>
              <div className="grid grid-cols-1 gap-2">
                <ElementButton onClick={() => addElement('navbar')} label="Navbar" icon={<Layout className="w-4 h-4" />} />
                <ElementButton onClick={() => addElement('hero')} label="Hero Section" icon={<Layers className="w-4 h-4" />} />
                <ElementButton onClick={() => addElement('richtext')} label="Content Block" icon={<Edit3 className="w-4 h-4" />} />
                <ElementButton onClick={() => addElement('cards')} label="Grid Cards" icon={<Layout className="w-4 h-4" />} />
                <ElementButton onClick={() => addElement('cta')} label="Call to Action" icon={<Plus className="w-4 h-4" />} />
                <ElementButton onClick={() => addElement('footer')} label="Footer" icon={<Trash2 className="w-4 h-4" />} />
              </div>
            </div>
            
            <div className="p-6 border-t border-white/5 flex-1">
              <h2 className="text-[10px] font-bold mb-4 uppercase tracking-[0.2em] text-zinc-500">Theme Palette</h2>
              <div className="flex flex-wrap gap-2">
                {Object.keys(themes).map(name => (
                  <button
                    key={name}
                    onClick={() => setTheme(name)}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all capitalize ${state.theme === name ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-white/5 hover:bg-white/10 text-zinc-400'}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Center Canvas */}
        <main className={`flex-1 overflow-y-auto ${previewMode ? 'p-0' : 'p-8 lg:p-12 bg-zinc-950'} transition-all scrollbar-hide`}>
          <div className={`${previewMode ? 'w-full' : 'max-w-6xl mx-auto rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border border-white/5'} ${currentTheme.bg} min-h-[90vh] transition-all duration-500`}>
            {state.layout.length === 0 ? (
              <div className={`flex items-center justify-center h-[70vh] ${currentTheme.muted}`}>
                <div className="text-center">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 bg-white/5 rounded-3xl mx-auto flex items-center justify-center mb-6"
                  >
                    <Plus className="w-10 h-10 opacity-20" />
                  </motion.div>
                  <p className="text-xl font-semibold opacity-80">Canvas is empty</p>
                  <p className="opacity-40 mt-2 text-sm">Select build elements from the library</p>
                </div>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={state.layout.map(el => el.id)} strategy={verticalListSortingStrategy}>
                  {state.layout.map((element) => (
                    <SortableSection
                      key={element.id}
                      element={element}
                      isSelected={state.selectedSectionId === element.id}
                      onSelect={() => selectSection(element.id)}
                      theme={currentTheme}
                      previewMode={previewMode}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </main>

        {/* Right Sidebar - Inspector */}
        {!previewMode && (
          <aside className="w-80 bg-zinc-900 border-l border-white/5 overflow-y-auto hidden xl:flex flex-col sticky top-0 h-screen">
            <div className="p-6">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-8">Properties</h2>
              
              {selectedSection ? (
                <Inspector
                  section={selectedSection}
                  onUpdate={(newData) => updateElement(selectedSection.id, newData)}
                  onRemove={() => removeElement(selectedSection.id)}
                />
              ) : (
                <div className="text-center text-zinc-600 mt-24">
                  <div className="w-16 h-16 bg-white/5 rounded-full mx-auto flex items-center justify-center mb-6">
                    <Edit3 className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="text-sm font-semibold">Inspector Idle</p>
                  <p className="text-[10px] mt-2 opacity-50 px-8">Select a canvas element to tune its parameters</p>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Footer Info */}
      {!previewMode && (
        <footer className="bg-zinc-950 border-t border-white/5 px-6 py-2 flex items-center justify-between text-[10px] font-bold text-zinc-600 tracking-widest uppercase">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
              Engine v1.0
            </span>
            <span>{state.layout.length} Nodes</span>
          </div>
          <div>UI Workspace / {state.name}</div>
        </footer>
      )}
    </div>
  );
}

// Helper Components
function ElementButton({ onClick, label, icon }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 w-full px-4 py-3 bg-white/2 hover:bg-indigo-600 border border-white/5 rounded-2xl text-zinc-400 transition-all hover:text-white hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98]"
    >
      <div className="p-2 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">{icon}</div>
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}

function SortableSection({ element, isSelected, onSelect, theme, previewMode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: element.id, disabled: previewMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${!previewMode ? 'hover:outline hover:outline-2 hover:outline-indigo-500/50 cursor-pointer' : ''} ${isSelected && !previewMode ? 'outline outline-2 outline-indigo-500 shadow-2xl z-10' : ''}`}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      {!previewMode && (
        <div 
          {...attributes} {...listeners}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-zinc-900 border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all cursor-grab active:cursor-grabbing z-50 shadow-xl"
        >
          <GripVertical className="w-4 h-4 text-white" />
        </div>
      )}

      <SectionRenderer type={element.type} data={element.data} theme={theme} />
    </div>
  );
}

function SectionRenderer({ type, data, theme }) {
  const components = {
    navbar: NavbarSection,
    hero: HeroSection,
    richtext: RichTextSection,
    footer: FooterSection,
  };

  const Component = components[type] || (({type, theme}) => (
    <div className={`py-16 px-12 text-center border-y border-dashed ${theme.border} opacity-50`}>
      <p className={`text-sm font-bold uppercase tracking-widest ${theme.text}`}>Previewing: {type}</p>
      <p className="text-xs mt-2 opacity-50">Configuration active in sidebar</p>
    </div>
  ));
  
  return <Component data={data} theme={theme} type={type} />;
}

// Inspector Form Blocks
function Inspector({ section, onUpdate, onRemove }) {
  const { type, data } = section;
  
  return (
    <div className="space-y-8 pb-32">
       <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl mb-4">
        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Active Object</p>
        <p className="text-xs font-bold text-white uppercase">{type}</p>
      </div>

      {type === 'hero' && (
        <div className="space-y-6">
          <ControlGroup label="Copy">
            <Input label="Title" value={data.heading} onChange={(v) => onUpdate({ ...data, heading: v })} />
            <Textarea label="Supporting Text" value={data.subheading} onChange={(v) => onUpdate({ ...data, subheading: v })} />
            <Input label="Primary Button" value={data.button} onChange={(v) => onUpdate({ ...data, button: v })} />
          </ControlGroup>
          <ControlGroup label="Positioning">
            <Select label="Text Alignment" value={data.align} onChange={(v) => onUpdate({ ...data, align: v })} options={['left', 'center']} />
          </ControlGroup>
        </div>
      )}

      {type === 'navbar' && (
        <div className="space-y-6">
          <ControlGroup label="Identity">
            <Input label="Brand Logo" value={data.logo} onChange={(v) => onUpdate({ ...data, logo: v })} />
          </ControlGroup>
          <ControlGroup label="Navigation">
             <Textarea label="Links (comma separated)" value={data.links.join(', ')} onChange={(v) => onUpdate({...data, links: v.split(',').map(s => s.trim())})} />
          </ControlGroup>
        </div>
      )}

      {type === 'richtext' && (
        <div className="space-y-6">
          <ControlGroup label="Article">
            <Input label="Title" value={data.heading} onChange={(v) => onUpdate({ ...data, heading: v })} />
            <Textarea label="Content Body" value={data.body} onChange={(v) => onUpdate({ ...data, body: v })} rows={10} />
          </ControlGroup>
        </div>
      )}

      {!['hero', 'navbar', 'richtext'].includes(type) && (
        <div className="p-6 bg-white/2 border border-white/5 rounded-2xl italic text-[10px] text-zinc-500">
          Complex controls for {type} are currently being mapped...
        </div>
      )}

      <div className="pt-8 border-t border-white/5">
        <button
          onClick={onRemove}
          className="flex items-center justify-center gap-3 w-full px-4 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl transition-all text-[10px] font-bold uppercase tracking-widest border border-red-500/20"
        >
          <Trash2 className="w-4 h-4" />
          Purge Component
        </button>
      </div>
    </div>
  );
}

function ControlGroup({ label, children }) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{label}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{label}</label>
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-white placeholder:text-zinc-700 font-medium"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 3 }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{label}</label>
      <textarea 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-white resize-none scrollbar-hide font-medium"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-white cursor-pointer"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

// Render Components
function NavbarSection({ data, theme }) {
  return (
    <div className={`px-12 py-8 flex items-center justify-between border-b ${theme.border}`}>
      <div className={`text-2xl font-black tracking-tighter ${theme.text}`}>{data.logo}</div>
      <div className="flex gap-10">
        {data.links?.map((link, idx) => (
          <span key={idx} className={`text-sm font-bold uppercase tracking-wider hover:opacity-100 cursor-pointer opacity-70 transition-opacity ${theme.text}`}>{link}</span>
        ))}
      </div>
    </div>
  );
}

function HeroSection({ data, theme }) {
  return (
    <div className={`py-40 px-12 ${data.align === 'center' ? 'text-center' : 'text-left'}`}>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-7xl font-black tracking-tighter mb-8 max-w-5xl ${data.align === 'center' ? 'mx-auto' : ''} ${theme.text}`}
      >
        {data.heading}
      </motion.h1>
      <p className={`text-2xl mb-12 max-w-3xl ${data.align === 'center' ? 'mx-auto' : ''} leading-relaxed opacity-60 font-medium ${theme.text}`}>
        {data.subheading}
      </p>
      <button className={`px-12 py-5 text-lg font-black tracking-widest uppercase transition-all transform hover:scale-105 rounded-2xl shadow-2xl ${theme.accent}`}>
        {data.button}
      </button>
    </div>
  );
}

function RichTextSection({ data, theme }) {
  return (
    <div className="py-24 px-12">
      <div className={`max-w-4xl ${data.align === 'center' ? 'mx-auto text-center' : ''}`}>
        <h2 className={`text-5xl font-black mb-12 tracking-tight ${theme.text}`}>{data.heading}</h2>
        <div className={`text-xl leading-loose opacity-70 ${theme.text} whitespace-pre-line font-medium`}>{data.body}</div>
      </div>
    </div>
  );
}

function FooterSection({ data, theme }) {
  return (
    <div className={`py-12 px-12 border-t text-center ${theme.border} opacity-50`}>
      <p className={`text-xs font-bold uppercase tracking-widest ${theme.text}`}>{data.text}</p>
    </div>
  );
}

export default CanvaEditor;
