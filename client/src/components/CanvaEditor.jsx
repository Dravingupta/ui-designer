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
import { ChevronLeft, Save, Eye, EyeOff, Download, Settings, Trash2, GripVertical, Plus, Edit3, Layout, Layers, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

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

function CanvaEditor({ initialData, projectId, onSave, onBack }) {
  const [state, setState] = useState({
    name: initialData?.name || 'Untitled Design',
    selectedSectionId: null,
    theme: initialData?.theme || 'light',
    layout: initialData?.layout || []
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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
    setIsExporting(true);
    try {
      const response = await api.post(`/generate/${projectId}`);

      // Convert base64 to blob
      const binaryString = window.atob(response.data.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/zip' });

      // Download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = response.data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
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
    const common = {
      py: 'py-24',
      px: 'px-12',
      radius: 'rounded-none',
      shadow: 'shadow-none',
      customBg: '',
      customText: '',
      maxWidth: 'max-w-6xl'
    };

    const defaults = {
      navbar: { ...common, logo: 'DESIGNER', links: ['Home', 'Features', 'Pricing'], align: 'right', sticky: false, py: 'py-8' },
      hero: { ...common, heading: 'Design something amazing', subheading: 'Your vision, powered by AI components.', button: 'Get Started', align: 'center', py: 'py-40' },
      richtext: { ...common, heading: 'Our Story', body: 'Start telling your story here. This component supports multiple lines of text and custom headings.', align: 'left' },
      text: { ...common, content: 'This is a text block.', fontSize: 'base', align: 'left', py: 'py-8' },
      image: { ...common, url: '', height: 400, caption: 'Beautiful Image', fullWidth: false },
      cards: { ...common, count: 3, titles: Array(3).fill('Card Title'), descriptions: Array(3).fill('Card description text goes here.'), imageUrls: Array(3).fill('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80') },
      testimonials: { ...common, items: [{ name: 'Alex Rivera', role: 'Founder', quote: 'This builder is game changing!', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' }] },
      pricing: { ...common, plans: [{ name: 'Base', price: '$0', features: ['Feature 1'], highlighted: false }, { name: 'Pro', price: '$29', features: ['All Features', 'Support'], highlighted: true }] },
      contact: { ...common, heading: 'Contact Us', email: 'hi@example.com', phone: '+1 234 567 890', address: '123 Studio St' },
      logogrid: { ...common, logos: Array(4).fill('https://via.placeholder.com/120x60/eeeeee/999999?text=LOGO'), columns: 4 },
      video: { ...common, heading: 'Product Demo', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      buttons: { ...common, buttons: [{ label: 'Action 1' }, { label: 'Action 2' }], align: 'center', py: 'py-12' },
      features: { ...common, items: [{ title: 'Power', description: 'AI generated code' }], columns: 3 },
      stats: { ...common, stats: [{ label: 'Users', value: '1M+' }], layout: 'horizontal', py: 'py-16' },
      cta: { ...common, heading: 'Ready?', supportingText: 'Join us today.', button: 'Sign Up', align: 'center' },
      faq: { ...common, items: [{ question: 'Is it fast?', answer: 'Yes, incredibly.' }] },
      divider: { ...common, height: 'md', showLine: true, py: 'py-0' },
      footer: { ...common, text: '© 2025 UI Designer. All rights reserved.', align: 'center', py: 'py-12' }
    };
    return defaults[type] || { ...common };
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
    if (!previewMode) setState(prev => ({ ...prev, selectedSectionId: id }));
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
function EditableText({ value, onChange, className, type = 'input' }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue !== value) onChange(tempValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && type === 'input') {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setTempValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return type === 'textarea' ? (
      <textarea
        autoFocus
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`bg-indigo-500/10 outline-none ring-2 ring-indigo-500 rounded px-1 w-full resize-none ${className}`}
        rows={Math.max(2, tempValue.split('\n').length)}
      />
    ) : (
      <input
        autoFocus
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`bg-indigo-500/10 outline-none ring-2 ring-indigo-500 rounded px-1 w-full ${className}`}
      />
    );
  }

  return (
    <div
      onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
      className={`hover:ring-1 hover:ring-indigo-500/30 rounded cursor-text transition-all ${className}`}
    >
      {value || <span className="opacity-20 italic">Empty text...</span>}
    </div>
  );
}

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

      <SectionRenderer
        type={element.type}
        data={element.data}
        theme={theme}
        onUpdate={(newData) => onSelect() || updateElement(element.id, newData)}
        isSelected={isSelected && !previewMode}
      />
    </div>
  );
}

const SectionRenderer = ({ type, data, theme, onUpdate, isSelected }) => {
  const components = {
    navbar: NavbarSection,
    hero: HeroSection,
    richtext: RichTextSection,
    text: TextSection,
    image: ImageSection,
    cards: CardsSection,
    testimonials: TestimonialsSection,
    pricing: PricingSection,
    contact: ContactSection,
    logogrid: LogoGridSection,
    video: VideoSection,
    buttons: ButtonsSection,
    features: FeaturesSection,
    stats: StatsSection,
    cta: CTASection,
    faq: FAQSection,
    divider: DividerSection,
    footer: FooterSection,
  };

  const Component = components[type] || (({ type, theme }) => (
    <div className={`py-16 px-12 text-center border-y border-dashed ${theme.border} opacity-50`}>
      <p className={`text-sm font-bold uppercase tracking-widest ${theme.text}`}>Previewing: {type}</p>
      <p className="text-xs mt-2 opacity-50">Configuration active in sidebar</p>
    </div>
  ));

  const customStyle = {
    backgroundColor: data.customBg || undefined,
    color: data.customText || undefined,
  };

  const animations = {
    none: { initial: { opacity: 1 }, animate: { opacity: 1 } },
    fadeUp: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } },
    fadeDown: { initial: { opacity: 0, y: -40 }, animate: { opacity: 1, y: 0 } },
    fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 } },
    scaleUp: { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 } },
    slideLeft: { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 } },
    slideRight: { initial: { opacity: 0, x: -40 }, animate: { opacity: 1, x: 0 } },
  };

  const anim = animations[data.animation] || animations.none;

  return (
    <motion.div
      initial={anim.initial}
      whileInView={anim.animate}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={customStyle}
      className={`${data.py} ${data.px}`}
    >
      <div className={`${data.maxWidth} mx-auto ${data.radius} ${data.shadow}`}>
        <Component data={data} theme={theme} type={type} onUpdate={onUpdate} isSelected={isSelected} />
      </div>
    </motion.div>
  );
}

// Inspector Form Blocks
function Inspector({ section, onUpdate, onRemove }) {
  const { type, data } = section;
  const [activeTab, setActiveTab] = useState('content');

  return (
    <div className="space-y-8 pb-32">
      <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl mb-4">
        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Active Object</p>
        <p className="text-xs font-bold text-white uppercase">{type}</p>
      </div>

      <div className="flex gap-1 p-1 bg-black/20 rounded-xl mb-6">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'content' ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-white'}`}
        >
          Content
        </button>
        <button
          onClick={() => setActiveTab('design')}
          className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'design' ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-white'}`}
        >
          Design
        </button>
      </div>

      {activeTab === 'content' ? (
        <div className="space-y-6">
          {type === 'hero' && (
            <>
              <ControlGroup label="Copy">
                <Input label="Title" value={data.heading} onChange={(v) => onUpdate({ ...data, heading: v })} />
                <Textarea label="Supporting Text" value={data.subheading} onChange={(v) => onUpdate({ ...data, subheading: v })} />
                <Input label="Primary Button" value={data.button} onChange={(v) => onUpdate({ ...data, button: v })} />
              </ControlGroup>
              <ControlGroup label="Positioning">
                <Select label="Text Alignment" value={data.align} onChange={(v) => onUpdate({ ...data, align: v })} options={['left', 'center']} />
              </ControlGroup>
            </>
          )}

          {type === 'navbar' && (
            <>
              <ControlGroup label="Identity">
                <Input label="Brand Logo" value={data.logo} onChange={(v) => onUpdate({ ...data, logo: v })} />
              </ControlGroup>
              <ControlGroup label="Navigation">
                <Textarea label="Links (comma separated)" value={data.links.join(', ')} onChange={(v) => onUpdate({ ...data, links: v.split(',').map(s => s.trim()) })} />
              </ControlGroup>
            </>
          )}

          {type === 'richtext' && (
            <ControlGroup label="Article">
              <Input label="Title" value={data.heading} onChange={(v) => onUpdate({ ...data, heading: v })} />
              <Textarea label="Content Body" value={data.body} onChange={(v) => onUpdate({ ...data, body: v })} rows={10} />
            </ControlGroup>
          )}

          {type === 'text' && (
            <ControlGroup label="Text Content">
              <Textarea label="Content" value={data.content} onChange={(v) => onUpdate({ ...data, content: v })} />
              <Select label="Font Size" value={data.fontSize} onChange={(v) => onUpdate({ ...data, fontSize: v })} options={['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl']} />
              <Select label="Alignment" value={data.align} onChange={(v) => onUpdate({ ...data, align: v })} options={['left', 'center', 'right']} />
            </ControlGroup>
          )}

          {type === 'image' && (
            <ControlGroup label="Media">
              <Input label="Image URL" value={data.url} onChange={(v) => onUpdate({ ...data, url: v })} />
              <Input label="Caption" value={data.caption} onChange={(v) => onUpdate({ ...data, caption: v })} />
              <Input label="Height (px)" value={data.height} onChange={(v) => onUpdate({ ...data, height: parseInt(v) || 0 })} />
              <div className="flex items-center gap-3 px-1 py-1">
                <input type="checkbox" checked={data.fullWidth} onChange={(e) => onUpdate({ ...data, fullWidth: e.target.checked })} className="w-4 h-4 rounded border-white/10 bg-zinc-950" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Full Width Container</span>
              </div>
            </ControlGroup>
          )}

          {type === 'cards' && (
            <>
              <ControlGroup label="Grid Config">
                <Input label="Number of Cards" value={data.count} onChange={(v) => {
                  const count = Math.max(1, parseInt(v) || 1);
                  onUpdate({
                    ...data,
                    count,
                    titles: Array(count).fill('').map((_, i) => data.titles[i] || `Title ${i + 1}`),
                    descriptions: Array(count).fill('').map((_, i) => data.descriptions[i] || `Description ${i + 1}`),
                    imageUrls: Array(count).fill('').map((_, i) => data.imageUrls[i] || 'https://via.placeholder.com/400x300')
                  });
                }} />
              </ControlGroup>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {data.titles.map((title, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase">Card {i + 1}</p>
                    <Input label="Image URL" value={data.imageUrls[i]} onChange={(v) => {
                      const newImgs = [...data.imageUrls];
                      newImgs[i] = v;
                      onUpdate({ ...data, imageUrls: newImgs });
                    }} />
                    <Input label="Title" value={title} onChange={(v) => {
                      const newTitles = [...data.titles];
                      newTitles[i] = v;
                      onUpdate({ ...data, titles: newTitles });
                    }} />
                    <Textarea label="Description" value={data.descriptions[i]} onChange={(v) => {
                      const newDesc = [...data.descriptions];
                      newDesc[i] = v;
                      onUpdate({ ...data, descriptions: newDesc });
                    }} />
                  </div>
                ))}
              </div>
            </>
          )}

          {type === 'cta' && (
            <ControlGroup label="Call to Action">
              <Input label="Heading" value={data.heading} onChange={(v) => onUpdate({ ...data, heading: v })} />
              <Textarea label="Supporting Text" value={data.supportingText} onChange={(v) => onUpdate({ ...data, supportingText: v })} />
              <Input label="Button Label" value={data.button} onChange={(v) => onUpdate({ ...data, button: v })} />
              <Select label="Alignment" value={data.align} onChange={(v) => onUpdate({ ...data, align: v })} options={['left', 'center', 'right']} />
            </ControlGroup>
          )}

          {type === 'footer' && (
            <ControlGroup label="Footer Content">
              <Input label="Copyright Text" value={data.text} onChange={(v) => onUpdate({ ...data, text: v })} />
              <Select label="Alignment" value={data.align} onChange={(v) => onUpdate({ ...data, align: v })} options={['left', 'center', 'right']} />
            </ControlGroup>
          )}

          {/* Fallback for other types or implement them similarly */}
          {!['hero', 'navbar', 'richtext', 'text', 'image', 'cards', 'cta', 'footer'].includes(type) && (
            <div className="p-4 bg-white/5 rounded-2xl italic text-[10px] text-zinc-500 text-center">
              Add more custom controls for {type} here...
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <ControlGroup label="Layout & Spacing">
            <Select
              label="Vertical Padding"
              value={data.py}
              onChange={(v) => onUpdate({ ...data, py: v })}
              options={['py-0', 'py-4', 'py-8', 'py-12', 'py-20', 'py-32', 'py-40', 'py-60']}
            />
            <Select
              label="Horizontal Padding"
              value={data.px}
              onChange={(v) => onUpdate({ ...data, px: v })}
              options={['px-0', 'px-4', 'px-8', 'px-12', 'px-20', 'px-32']}
            />
            <Select
              label="Max Width"
              value={data.maxWidth}
              onChange={(v) => onUpdate({ ...data, maxWidth: v })}
              options={['max-w-4xl', 'max-w-5xl', 'max-w-6xl', 'max-w-7xl', 'max-w-full']}
            />
          </ControlGroup>

          <ControlGroup label="Styling">
            <Select
              label="Border Radius"
              value={data.radius}
              onChange={(v) => onUpdate({ ...data, radius: v })}
              options={['rounded-none', 'rounded-lg', 'rounded-2xl', 'rounded-3xl', 'rounded-[40px]', 'rounded-full']}
            />
            <Select
              label="Shadow"
              value={data.shadow}
              onChange={(v) => onUpdate({ ...data, shadow: v })}
              options={['shadow-none', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl']}
            />
            <Select
              label="Entrance Animation"
              value={data.animation || 'none'}
              onChange={(v) => onUpdate({ ...data, animation: v })}
              options={['none', 'fadeUp', 'fadeDown', 'fadeIn', 'scaleUp', 'slideLeft', 'slideRight']}
            />
          </ControlGroup>

          <ControlGroup label="Custom Colors">
            <Input label="Background Color (CSS)" value={data.customBg} onChange={(v) => onUpdate({ ...data, customBg: v })} placeholder="#ffffff or rgba(0,0,0,0.5)" />
            <Input label="Text Color (CSS)" value={data.customText} onChange={(v) => onUpdate({ ...data, customText: v })} placeholder="#000000" />
          </ControlGroup>
        </div>
      )}

      {type === 'pricing' && (
        <div className="space-y-6">
          {data.plans.map((plan, i) => (
            <ControlGroup key={i} label={`Plan ${i + 1}`}>
              <Input label="Name" value={plan.name} onChange={(v) => {
                const newPlans = [...data.plans];
                newPlans[i] = { ...plan, name: v };
                onUpdate({ ...data, plans: newPlans });
              }} />
              <Input label="Price" value={plan.price} onChange={(v) => {
                const newPlans = [...data.plans];
                newPlans[i] = { ...plan, price: v };
                onUpdate({ ...data, plans: newPlans });
              }} />
            </ControlGroup>
          ))}
        </div>
      )}

      {type === 'features' && (
        <div className="space-y-6">
          <ControlGroup label="Grid Config">
            <Input label="Columns" value={data.columns} onChange={(v) => onUpdate({ ...data, columns: parseInt(v) || 3 })} />
          </ControlGroup>
          {data.items.map((item, i) => (
            <ControlGroup key={i} label={`Feature ${i + 1}`}>
              <Input label="Title" value={item.title} onChange={(v) => {
                const newItems = [...data.items];
                newItems[i] = { ...item, title: v };
                onUpdate({ ...data, items: newItems });
              }} />
              <Input label="Description" value={item.description} onChange={(v) => {
                const newItems = [...data.items];
                newItems[i] = { ...item, description: v };
                onUpdate({ ...data, items: newItems });
              }} />
            </ControlGroup>
          ))}
          <button onClick={() => onUpdate({ ...data, items: [...data.items, { title: 'New Feature', description: 'Desc' }] })} className="w-full py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all">Add Feature</button>
        </div>
      )}

      {type === 'stats' && (
        <div className="space-y-6">
          {data.stats.map((stat, i) => (
            <ControlGroup key={i} label={`Stat ${i + 1}`}>
              <Input label="Label" value={stat.label} onChange={(v) => {
                const newStats = [...data.stats];
                newStats[i] = { ...stat, label: v };
                onUpdate({ ...data, stats: newStats });
              }} />
              <Input label="Value" value={stat.value} onChange={(v) => {
                const newStats = [...data.stats];
                newStats[i] = { ...stat, value: v };
                onUpdate({ ...data, stats: newStats });
              }} />
            </ControlGroup>
          ))}
          <button onClick={() => onUpdate({ ...data, stats: [...data.stats, { label: 'Metric', value: '100%' }] })} className="w-full py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all">Add Stat</button>
        </div>
      )}

      {type === 'contact' && (
        <div className="space-y-6">
          <ControlGroup label="Header">
            <Input label="Heading" value={data.heading} onChange={(v) => onUpdate({ ...data, heading: v })} />
          </ControlGroup>
          <ControlGroup label="Contact Info">
            <Input label="Email" value={data.email} onChange={(v) => onUpdate({ ...data, email: v })} />
            <Input label="Phone" value={data.phone} onChange={(v) => onUpdate({ ...data, phone: v })} />
            <Input label="Address" value={data.address} onChange={(v) => onUpdate({ ...data, address: v })} />
          </ControlGroup>
        </div>
      )}

      {type === 'faq' && (
        <div className="space-y-6">
          {data.items.map((item, i) => (
            <ControlGroup key={i} label={`FAQ ${i + 1}`}>
              <Input label="Question" value={item.question} onChange={(v) => {
                const newItems = [...data.items];
                newItems[i] = { ...item, question: v };
                onUpdate({ ...data, items: newItems });
              }} />
              <Textarea label="Answer" value={item.answer} onChange={(v) => {
                const newItems = [...data.items];
                newItems[i] = { ...item, answer: v };
                onUpdate({ ...data, items: newItems });
              }} />
            </ControlGroup>
          ))}
          <button onClick={() => onUpdate({ ...data, items: [...data.items, { question: 'New Question', answer: 'Answer' }] })} className="w-full py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all">Add FAQ</button>
        </div>
      )}

      {type === 'video' && (
        <div className="space-y-6">
          <ControlGroup label="Heading">
            <Input label="Title" value={data.heading} onChange={(v) => onUpdate({ ...data, heading: v })} />
          </ControlGroup>
          <ControlGroup label="Source">
            <Input label="Embed URL" value={data.videoUrl} onChange={(v) => onUpdate({ ...data, videoUrl: v })} />
          </ControlGroup>
        </div>
      )}

      {type === 'logogrid' && (
        <div className="space-y-6">
          <ControlGroup label="Layout">
            <Input label="Columns" value={data.columns} onChange={(v) => onUpdate({ ...data, columns: parseInt(v) || 4 })} />
          </ControlGroup>
          <ControlGroup label="Logos">
            {data.logos.map((logo, i) => (
              <Input key={i} label={`Logo ${i + 1} URL`} value={logo} onChange={(v) => {
                const newLogos = [...data.logos];
                newLogos[i] = v;
                onUpdate({ ...data, logos: newLogos });
              }} />
            ))}
          </ControlGroup>
        </div>
      )}

      {!['hero', 'navbar', 'richtext', 'text', 'image', 'cards', 'testimonials', 'pricing', 'contact', 'logogrid', 'video', 'buttons', 'features', 'stats', 'cta', 'faq', 'divider', 'footer'].includes(type) && (
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
function NavbarSection({ data, theme, onUpdate }) {
  return (
    <div className={`flex items-center justify-between`}>
      <EditableText
        value={data.logo}
        onChange={(v) => onUpdate({ ...data, logo: v })}
        className={`text-2xl font-black tracking-tighter ${theme.text}`}
      />
      <div className="flex gap-10">
        {data.links?.map((link, idx) => (
          <EditableText
            key={idx}
            value={link}
            onChange={(v) => {
              const newLinks = [...data.links];
              newLinks[idx] = v;
              onUpdate({ ...data, links: newLinks });
            }}
            className={`text-sm font-bold uppercase tracking-wider hover:opacity-100 cursor-pointer opacity-70 transition-opacity ${theme.text}`}
          />
        ))}
      </div>
    </div>
  );
}

function HeroSection({ data, theme, onUpdate }) {
  return (
    <div className={`${data.align === 'center' ? 'text-center' : 'text-left'}`}>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-7xl font-black tracking-tighter mb-8 max-w-5xl ${data.align === 'center' ? 'mx-auto' : ''} ${theme.text}`}
      >
        <EditableText value={data.heading} onChange={(v) => onUpdate({ ...data, heading: v })} />
      </motion.h1>
      <div className={`text-2xl mb-12 max-w-3xl ${data.align === 'center' ? 'mx-auto' : ''} leading-relaxed opacity-60 font-medium ${theme.text}`}>
        <EditableText value={data.subheading} onChange={(v) => onUpdate({ ...data, subheading: v })} type="textarea" />
      </div>
      <button className={`px-12 py-5 text-lg font-black tracking-widest uppercase transition-all transform hover:scale-105 rounded-2xl shadow-2xl ${theme.accent}`}>
        <EditableText value={data.button} onChange={(v) => onUpdate({ ...data, button: v })} />
      </button>
    </div>
  );
}

function RichTextSection({ data, theme, onUpdate }) {
  return (
    <div className={`${data.align === 'center' ? 'text-center' : ''}`}>
      <h2 className={`text-5xl font-black mb-12 tracking-tight ${theme.text}`}>
        <EditableText value={data.heading} onChange={(v) => onUpdate({ ...data, heading: v })} />
      </h2>
      <div className={`text-xl leading-loose opacity-70 ${theme.text} whitespace-pre-line font-medium`}>
        <EditableText value={data.body} onChange={(v) => onUpdate({ ...data, body: v })} type="textarea" />
      </div>
    </div>
  );
}

function TextSection({ data, theme, onUpdate }) {
  const sizeMap = {
    xs: 'text-xs', sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl', '2xl': 'text-2xl', '3xl': 'text-3xl'
  };
  return (
    <div className={`${data.align === 'center' ? 'text-center' : data.align === 'right' ? 'text-right' : 'text-left'}`}>
      <div className={`${sizeMap[data.fontSize] || 'text-base'} ${theme.text} opacity-80 leading-relaxed`}>
        <EditableText value={data.content} onChange={(v) => onUpdate({ ...data, content: v })} type="textarea" />
      </div>
    </div>
  );
}

function ImageSection({ data, theme, onUpdate }) {
  return (
    <div className={`${data.fullWidth ? 'w-full' : 'w-full mx-auto'}`}>
      <img src={data.url || 'https://via.placeholder.com/800x400'} alt={data.caption} className="w-full rounded-2xl shadow-xl object-cover" style={{ height: data.height || 400 }} />
      {data.caption && (
        <div className={`mt-4 text-xs font-bold uppercase tracking-widest opacity-40 text-center ${theme.text}`}>
          <EditableText value={data.caption} onChange={(v) => onUpdate({ ...data, caption: v })} />
        </div>
      )}
    </div>
  );
}

function CardsSection({ data, theme, onUpdate }) {
  return (
    <div className={`grid gap-8 ${data.count <= 2 ? 'grid-cols-2' : data.count === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
      {Array(data.count).fill(0).map((_, i) => (
        <div key={i} className={`p-8 rounded-3xl border ${theme.border} ${theme.secondary} transition-all hover:scale-[1.02]`}>
          <div className="h-48 mb-6 overflow-hidden rounded-2xl">
            <img src={data.imageUrls[i]} alt={data.titles[i]} className="w-full h-full object-cover" />
          </div>
          <h3 className={`text-xl font-bold mb-4 ${theme.text}`}>
            <EditableText value={data.titles[i]} onChange={(v) => {
              const newTitles = [...data.titles];
              newTitles[i] = v;
              onUpdate({ ...data, titles: newTitles });
            }} />
          </h3>
          <div className={`text-sm opacity-60 leading-relaxed ${theme.text}`}>
            <EditableText value={data.descriptions[i]} onChange={(v) => {
              const newDesc = [...data.descriptions];
              newDesc[i] = v;
              onUpdate({ ...data, descriptions: newDesc });
            }} type="textarea" />
          </div>
        </div>
      ))}
    </div>
  );
}

function TestimonialsSection({ data, theme, onUpdate }) {
  return (
    <div className="grid gap-12 max-w-5xl mx-auto">
      {data.items.map((item, i) => (
        <div key={i} className="text-center">
          <img src={item.imageUrl} className="w-20 h-20 rounded-full mx-auto mb-6 border-2 border-indigo-500 p-1" alt={item.name} />
          <div className={`text-2xl font-medium italic mb-8 ${theme.text}`}>
            <EditableText value={item.quote} onChange={(v) => {
              const newItems = [...data.items];
              newItems[i].quote = v;
              onUpdate({ ...data, items: newItems });
            }} type="textarea" />
          </div>
          <h4 className={`text-sm font-bold uppercase tracking-widest ${theme.text}`}>
            <EditableText value={item.name} onChange={(v) => {
              const newItems = [...data.items];
              newItems[i].name = v;
              onUpdate({ ...data, items: newItems });
            }} />
          </h4>
          <div className={`text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1 ${theme.text}`}>
            <EditableText value={item.role} onChange={(v) => {
              const newItems = [...data.items];
              newItems[i].role = v;
              onUpdate({ ...data, items: newItems });
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function PricingSection({ data, theme, onUpdate }) {
  return (
    <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
      {data.plans.map((plan, i) => (
        <div key={i} className={`p-10 rounded-3xl border-2 transition-all ${plan.highlighted ? 'border-indigo-500 scale-105 shadow-2xl z-10' : `${theme.border} opacity-80`} ${theme.secondary}`}>
          <div className={`text-sm font-bold uppercase tracking-widest mb-2 ${theme.text}`}>
            <EditableText value={plan.name} onChange={(v) => {
              const newPlans = [...data.plans];
              newPlans[i].name = v;
              onUpdate({ ...data, plans: newPlans });
            }} />
          </div>
          <div className={`text-5xl font-black mb-8 ${theme.text}`}>
            <EditableText value={plan.price} onChange={(v) => {
              const newPlans = [...data.plans];
              newPlans[i].price = v;
              onUpdate({ ...data, plans: newPlans });
            }} />
          </div>
          <ul className="space-y-4 mb-10">
            {plan.features.map((f, idx) => (
              <li key={idx} className={`text-sm font-bold opacity-60 flex items-center gap-3 ${theme.text}`}>
                <Check className="w-4 h-4 text-indigo-500" />
                <EditableText value={f} onChange={(v) => {
                  const newPlans = [...data.plans];
                  newPlans[i].features[idx] = v;
                  onUpdate({ ...data, plans: newPlans });
                }} />
              </li>
            ))}
          </ul>
          <button className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${plan.highlighted ? theme.accent : 'bg-white/5 hover:bg-white/10 text-white'}`}>Get Started</button>
        </div>
      ))}
    </div>
  );
}

function ContactSection({ data, theme, onUpdate }) {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h2 className={`text-5xl font-black mb-12 tracking-tight ${theme.text}`}>
        <EditableText value={data.heading} onChange={(v) => onUpdate({ ...data, heading: v })} />
      </h2>
      <div className="grid grid-cols-3 gap-12">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Email</p>
          <div className={`text-sm font-bold ${theme.text}`}>
            <EditableText value={data.email} onChange={(v) => onUpdate({ ...data, email: v })} />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Phone</p>
          <div className={`text-sm font-bold ${theme.text}`}>
            <EditableText value={data.phone} onChange={(v) => onUpdate({ ...data, phone: v })} />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Address</p>
          <div className={`text-sm font-bold ${theme.text}`}>
            <EditableText value={data.address} onChange={(v) => onUpdate({ ...data, address: v })} />
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoGridSection({ data, theme, onUpdate }) {
  const colMap = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-5', 6: 'grid-cols-6' };
  return (
    <div className={`grid ${colMap[data.columns] || 'grid-cols-4'} gap-12 items-center`}>
      {data.logos.map((logo, i) => (
        <div key={i} className="relative group/logo">
          <img src={logo} className="w-full opacity-40 grayscale group-hover/logo:grayscale-0 group-hover/logo:opacity-100 transition-all cursor-pointer" alt="Client Logo" />
          {onUpdate && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity bg-black/40 rounded-lg pointer-events-none">
              <span className="text-[8px] font-bold text-white uppercase">Replace in Sidebar</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function VideoSection({ data, theme, onUpdate }) {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className={`text-4xl font-black mb-12 tracking-tight text-center ${theme.text}`}>
        <EditableText value={data.heading} onChange={(v) => onUpdate({ ...data, heading: v })} />
      </h2>
      <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        <iframe className="w-full h-full" src={data.videoUrl} title="Video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </div>
    </div>
  );
}

function ButtonsSection({ data, theme, onUpdate }) {
  return (
    <div className={`flex gap-6 ${data.align === 'center' ? 'justify-center' : data.align === 'right' ? 'justify-end' : 'justify-start'}`}>
      {data.buttons.map((btn, i) => (
        <button key={i} className={`px-10 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 ${i === 0 ? theme.accent : 'bg-white/5 hover:bg-white/10 text-white'}`}>
          <EditableText value={btn.label} onChange={(v) => {
            const newBtns = [...data.buttons];
            newBtns[i].label = v;
            onUpdate({ ...data, buttons: newBtns });
          }} />
        </button>
      ))}
    </div>
  );
}

function FeaturesSection({ data, theme, onUpdate }) {
  const colMap = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3' };
  return (
    <div className={`grid ${colMap[data.columns] || 'grid-cols-3'} gap-16`}>
      {data.items.map((item, i) => (
        <div key={i} className="space-y-4">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
            <span className="font-black text-xl">{i + 1}</span>
          </div>
          <h3 className={`text-xl font-bold ${theme.text}`}>
            <EditableText value={item.title} onChange={(v) => {
              const newItems = [...data.items];
              newItems[i].title = v;
              onUpdate({ ...data, items: newItems });
            }} />
          </h3>
          <div className={`text-sm opacity-60 leading-relaxed ${theme.text}`}>
            <EditableText value={item.description} onChange={(v) => {
              const newItems = [...data.items];
              newItems[i].description = v;
              onUpdate({ ...data, items: newItems });
            }} type="textarea" />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatsSection({ data, theme, onUpdate }) {
  return (
    <div className={`flex ${data.layout === 'horizontal' ? 'flex-row justify-around' : 'flex-col gap-12 items-center'} flex-wrap gap-8`}>
      {data.stats.map((stat, i) => (
        <div key={i} className="text-center">
          <div className={`text-6xl font-black mb-2 tracking-tighter ${theme.text}`}>
            <EditableText value={stat.value} onChange={(v) => {
              const newStats = [...data.stats];
              newStats[i].value = v;
              onUpdate({ ...data, stats: newStats });
            }} />
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">
            <EditableText value={stat.label} onChange={(v) => {
              const newStats = [...data.stats];
              newStats[i].label = v;
              onUpdate({ ...data, stats: newStats });
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function CTASection({ data, theme, onUpdate }) {
  return (
    <div className={`${data.align === 'center' ? 'text-center' : 'text-left'}`}>
      <div className={`max-w-5xl ${data.align === 'center' ? 'mx-auto' : ''} p-16 rounded-[40px] bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20`}>
        <h2 className="text-6xl font-black mb-6 tracking-tighter">
          <EditableText value={data.heading} onChange={(v) => onUpdate({ ...data, heading: v })} />
        </h2>
        <div className="text-xl opacity-80 mb-10 max-w-2xl mx-auto">
          <EditableText value={data.supportingText} onChange={(v) => onUpdate({ ...data, supportingText: v })} type="textarea" />
        </div>
        <button className="px-12 py-5 bg-white text-indigo-600 text-sm font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl">
          <EditableText value={data.button} onChange={(v) => onUpdate({ ...data, button: v })} />
        </button>
      </div>
    </div>
  );
}

function FAQSection({ data, theme, onUpdate }) {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {data.items.map((item, i) => (
        <div key={i} className={`p-8 rounded-2xl border ${theme.border} ${theme.secondary}`}>
          <h4 className={`text-lg font-bold mb-4 ${theme.text}`}>
            <EditableText value={item.question} onChange={(v) => {
              const newItems = [...data.items];
              newItems[i].question = v;
              onUpdate({ ...data, items: newItems });
            }} />
          </h4>
          <div className={`text-sm opacity-60 leading-relaxed ${theme.text}`}>
            <EditableText value={item.answer} onChange={(v) => {
              const newItems = [...data.items];
              newItems[i].answer = v;
              onUpdate({ ...data, items: newItems });
            }} type="textarea" />
          </div>
        </div>
      ))}
    </div>
  );
}

function DividerSection({ data, theme }) {
  const heightMap = { sm: 'h-8', md: 'h-16', lg: 'h-32' };
  return (
    <div className={`${heightMap[data.height] || 'h-16'} flex items-center justify-center`}>
      {data.showLine && <div className={`w-full h-px ${theme.border} opacity-20`}></div>}
    </div>
  );
}

function FooterSection({ data, theme, onUpdate }) {
  return (
    <div className={`text-center opacity-50`}>
      <div className={`text-xs font-bold uppercase tracking-widest ${theme.text}`}>
        <EditableText value={data.text} onChange={(v) => onUpdate({ ...data, text: v })} />
      </div>
    </div>
  );
}

export default CanvaEditor;
