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
import { ChevronLeft, Save, Eye, EyeOff, Download, Settings, Trash2, GripVertical, Plus, Edit3, Layout, Layers, X, Check, DollarSign, Mail, MessageSquare, HelpCircle, Grid, BarChart3, Megaphone, ImageIcon, Search, ChevronDown, Video, MousePointer, Minus, Clock, Copy, AlignLeft, AlignCenter, AlignRight, Type, Image as ImageIcon2, ArrowUp, ArrowDown, ChevronsUpDown, Smartphone, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { useRef } from 'react'; // Added useRef explicitly if not present
// IMPORT NEW COMPONENTS 


// Theme definitions
const themes = {
  // Light Themes
  light: { type: 'light', bg: 'bg-white', text: 'text-gray-900', border: 'border-gray-200', accent: 'bg-black text-white hover:bg-neutral-800', secondary: 'bg-gray-50', muted: 'text-gray-500' },
  corporate: { type: 'light', bg: 'bg-slate-50', text: 'text-slate-900', border: 'border-slate-300', accent: 'bg-blue-700 text-white hover:bg-blue-800', secondary: 'bg-white', muted: 'text-slate-500' },
  gray: { type: 'light', bg: 'bg-gray-50', text: 'text-gray-900', border: 'border-gray-300', accent: 'bg-gray-900 text-white hover:bg-black', secondary: 'bg-gray-200', muted: 'text-gray-600' },
  retro: { type: 'light', bg: 'bg-[#FFF8E7]', text: 'text-[#4A403A]', border: 'border-[#D4C5B0]', accent: 'bg-[#E07A5F] text-white hover:bg-[#D0654C]', secondary: 'bg-[#F4E4BC]', muted: 'text-[#9A8C7D]' },
  lavender: { type: 'light', bg: 'bg-violet-50', text: 'text-violet-950', border: 'border-violet-200', accent: 'bg-violet-600 text-white hover:bg-violet-700', secondary: 'bg-violet-100', muted: 'text-violet-700' },
  mint: { type: 'light', bg: 'bg-emerald-50', text: 'text-emerald-950', border: 'border-emerald-200', accent: 'bg-emerald-600 text-white hover:bg-emerald-700', secondary: 'bg-emerald-100', muted: 'text-emerald-700' },
  peach: { type: 'light', bg: 'bg-orange-50', text: 'text-orange-950', border: 'border-orange-200', accent: 'bg-orange-600 text-white hover:bg-orange-700', secondary: 'bg-orange-100', muted: 'text-orange-700' },
  sunset: { type: 'light', bg: 'bg-rose-50', text: 'text-rose-950', border: 'border-rose-200', accent: 'bg-amber-500 text-white hover:bg-amber-600', secondary: 'bg-rose-100', muted: 'text-rose-700' },
  aqua: { type: 'light', bg: 'bg-cyan-50', text: 'text-cyan-950', border: 'border-cyan-200', accent: 'bg-cyan-600 text-white hover:bg-cyan-700', secondary: 'bg-cyan-100', muted: 'text-cyan-700' },
  forest: { type: 'light', bg: 'bg-stone-50', text: 'text-stone-900', border: 'border-stone-300', accent: 'bg-emerald-700 text-white hover:bg-emerald-800', secondary: 'bg-stone-200', muted: 'text-stone-600' },

  // Dark Themes
  dark: { type: 'dark', bg: 'bg-[#0A0A0A]', text: 'text-gray-200', border: 'border-white/5', accent: 'bg-white text-black hover:bg-gray-200', secondary: 'bg-[#0F0F0F]', muted: 'text-gray-500' },
  cyber: { type: 'dark', bg: 'bg-neutral-950', text: 'text-neutral-100', border: 'border-neutral-800', accent: 'bg-cyan-500 text-black hover:bg-cyan-400', secondary: 'bg-neutral-900', muted: 'text-neutral-400' },
  midnight: { type: 'dark', bg: 'bg-slate-950', text: 'text-slate-100', border: 'border-slate-800', accent: 'bg-indigo-500 text-white hover:bg-indigo-600', secondary: 'bg-slate-900', muted: 'text-slate-400' },
  obsidian: { type: 'dark', bg: 'bg-[#050505]', text: 'text-gray-300', border: 'border-white/10', accent: 'bg-purple-600 text-white hover:bg-purple-500', secondary: 'bg-[#121212]', muted: 'text-gray-600' },
  terminal: { type: 'dark', bg: 'bg-black', text: 'text-green-400', border: 'border-green-900', accent: 'bg-green-600 text-black hover:bg-green-500', secondary: 'bg-zinc-900', muted: 'text-green-700' },
  luxury: { type: 'dark', bg: 'bg-[#1A1A1A]', text: 'text-[#D4AF37]', border: 'border-[#D4AF37]/20', accent: 'bg-[#D4AF37] text-black hover:bg-[#C5A028]', secondary: 'bg-[#222]', muted: 'text-[#888]' },
  deep_space: { type: 'dark', bg: 'bg-[#0F172A]', text: 'text-blue-100', border: 'border-blue-900', accent: 'bg-blue-500 text-white hover:bg-blue-600', secondary: 'bg-[#1E293B]', muted: 'text-blue-400' },
  crimson: { type: 'dark', bg: 'bg-[#1a0505]', text: 'text-red-100', border: 'border-red-900/30', accent: 'bg-red-600 text-white hover:bg-red-700', secondary: 'bg-[#2b0a0a]', muted: 'text-red-400' },
  dracula: { type: 'dark', bg: 'bg-[#282a36]', text: 'text-[#f8f8f2]', border: 'border-[#6272a4]', accent: 'bg-[#ff79c6] text-[#282a36] hover:bg-[#bd93f9]', secondary: 'bg-[#44475a]', muted: 'text-[#6272a4]' },
  neon: { type: 'dark', bg: 'bg-black', text: 'text-white', border: 'border-fuchsia-500', accent: 'bg-fuchsia-600 text-white hover:bg-fuchsia-500 shadow-[0_0_15px_rgba(192,38,211,0.5)]', secondary: 'bg-neutral-900', muted: 'text-fuchsia-300' },
};

const elementCategories = {
  Layout: [
    { type: 'navbar', label: 'Navbar', icon: Layout, desc: 'Top navigation bar' },
    { type: 'footer', label: 'Footer', icon: Trash2, desc: 'Bottom footer area' },
    { type: 'divider', label: 'Divider', icon: Minus, desc: 'Section separator' },
  ],
  Content: [
    { type: 'hero', label: 'Hero', icon: Layers, desc: 'Main landing section' },
    { type: 'richtext', label: 'Rich Text', icon: Edit3, desc: 'Advanced text block' },
    { type: 'features', label: 'Features', icon: Grid, desc: 'Feature highlights' },
    { type: 'faq', label: 'FAQ', icon: HelpCircle, desc: 'Questions & Answers' },
    { type: 'timeline', label: 'Timeline', icon: Clock, desc: 'Chronological steps' },
    { type: 'stats', label: 'Stats', icon: BarChart3, desc: 'Numerical statistics' },
    { type: 'testimonials', label: 'Testimonials', icon: MessageSquare, desc: 'Customer reviews' },
  ],
  Media: [
    { type: 'image', label: 'Image', icon: ImageIcon, desc: 'Photos and illustrations' },
    { type: 'video', label: 'Video', icon: Video, desc: 'Embedded video player' },
    { type: 'cards', label: 'Cards', icon: Layout, desc: 'Grid of info cards' },
    { type: 'logogrid', label: 'Logo Grid', icon: Grid, desc: 'Partner logos' },
  ],
  Marketing: [
    { type: 'cta', label: 'Call to Action', icon: Plus, desc: 'Conversion block' },
    { type: 'pricing', label: 'Pricing', icon: DollarSign, desc: 'Price tables' },
    { type: 'contact', label: 'Contact', icon: Mail, desc: 'Contact forms' },
    { type: 'buttons', label: 'Buttons', icon: MousePointer, desc: 'Action buttons' },
  ]
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
    theme: initialData?.theme || 'light',
    layout: initialData?.layout || []
  });
  const [activeTab, setActiveTab] = useState('components');
  const [activeSection, setActiveSection] = useState('Content');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Zoom State
  const [zoom, setZoom] = useState(1);
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

  // Element Actions
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

  // const addElement = (type) => {
  //   const newElement = {
  //     id: `${type}-${Date.now()}`,
  //     type,
  //     data: getDefaultData(type)
  //   };
  //   setState(prev => ({
  //     ...prev,
  //     layout: [...prev.layout, newElement],
  //     selectedSectionId: newElement.id
  //   }));
  // };
  const addElement = (type) => {
    console.log("🟢 ADD ELEMENT CLICKED:", type);

    const newElement = {
      id: `${type}-${Date.now()}`,
      type,
      data: getDefaultData(type),
    };

    console.log("🟢 NEW ELEMENT OBJECT:", newElement);

    setState(prev => {
      const next = {
        ...prev,
        layout: [...prev.layout, newElement],
        selectedSectionId: newElement.id,
      };
      console.log("🟢 NEW LAYOUT:", next.layout);
      return next;
    });
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
      navbar: { ...common, logo: 'DESIGNER', links: ['Home', 'Features', 'Pricing'], sticky: false, py: 'py-8' },
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
      cta: { ...common, heading: 'Ready?', supportingText: 'Join us today.', button: 'Sign Up', py: 'py-24' },
      faq: { ...common, items: [{ question: 'Is it fast?', answer: 'Yes, incredibly.' }] },
      divider: { ...common, height: 'md', showLine: true, py: 'py-0' },
      footer: { ...common, text: '© 2025 UI Designer. All rights reserved.', py: 'py-12' },
      timeline: { ...common, items: [{ title: 'Step 1', description: 'Describe the first step.' }, { title: 'Step 1', description: 'Describe the first step.' }, { title: 'Step 3', description: 'Describe the third step.' }], py: 'py-16' },

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

  const duplicateElement = (id) => {
    const elToClone = state.layout.find(el => el.id === id);
    if (!elToClone) return;
    const newEl = {
      ...elToClone,
      id: `${elToClone.type}-${Date.now()}`,
    };
    setState(prev => {
      const idx = prev.layout.findIndex(el => el.id === id);
      const newLayout = [...prev.layout];
      newLayout.splice(idx + 1, 0, newEl);
      return {
        ...prev,
        layout: newLayout,
        selectedSectionId: newEl.id
      }
    });
  };

  const moveElementUp = (id) => {
    setState(prev => {
      const idx = prev.layout.findIndex(el => el.id === id);
      if (idx <= 0) return prev; // Already at top
      const newLayout = arrayMove(prev.layout, idx, idx - 1);
      return { ...prev, layout: newLayout };
    });
  };

  const moveElementDown = (id) => {
    setState(prev => {
      const idx = prev.layout.findIndex(el => el.id === id);
      if (idx < 0 || idx >= prev.layout.length - 1) return prev; // Already at bottom
      const newLayout = arrayMove(prev.layout, idx, idx + 1);
      return { ...prev, layout: newLayout };
    });
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
    <div className="h-screen bg-[#0A0A0A] flex flex-col text-gray-200 selection:bg-cyan-500/30 overflow-hidden font-sans">
      {/* Premium Header */}
      {!previewMode && (
        <header className="bg-[#0A0A0A]/50 backdrop-blur-md border-b border-white/5 px-6 py-3 flex items-center justify-between z-50">
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

          <div className="flex bg-[#0F0F0F] rounded-lg p-1 border border-white/5">
            <button
              onClick={() => setIsMobileView(false)}
              className={`p-1.5 rounded transition-all ${!isMobileView ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMobileView(true)}
              className={`p-1.5 rounded transition-all ${isMobileView ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">

            <div className="h-6 w-px bg-white/10 mr-2"></div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold transition-all font-mono uppercase tracking-wide text-[10px] ${isSaving ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 hover:bg-white/10'}`}
            >
              <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
              {isSaving ? 'SAVING...' : 'SAVE'}
            </button>
            <button
              onClick={() => setPreviewMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-xs font-bold transition-all font-mono uppercase tracking-wide text-[10px]"
            >
              <Eye className="w-4 h-4" />
              PREVIEW
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className={`flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold shadow-lg shadow-cyan-600/20 transition-all active:scale-95 font-mono uppercase tracking-wide text-[10px] ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
              {isExporting ? 'COMPILING...' : 'EXPORT_BUILD'}
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
        {/* Left Sidebar - Nav Rail + Drawer */}
        {!previewMode && (
          // Web: Fixed w-20 (Overlay). Mobile: Expands (Push)
          <div className={`relative flex h-full shrink-0 z-40 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${isMobileView && activeTab ? 'w-[25rem]' : 'w-20'}`}>
            {/* 1. Navigation Rail (Fixed Icons) */}
            <div className="w-20 bg-[#050505] border-r border-white/5 flex flex-col items-center py-6 gap-6 z-50 relative">
              <NavRailButton
                active={activeTab === 'components'}
                onClick={() => setActiveTab(activeTab === 'components' ? null : 'components')}
                icon={<Grid className="w-5 h-5" />}
                label="Elements"
              />
              <NavRailButton
                active={activeTab === 'themes'}
                onClick={() => setActiveTab(activeTab === 'themes' ? null : 'themes')}
                icon={<Layers className="w-5 h-5" />}
                label="Design"
              />
            </div>

            {/* 2. Drawer Panel (Absolute Overlay) */}
            <div className={`
                absolute top-0 left-20 h-full
                bg-[#0F0F0F] border-r border-white/5 flex flex-col 
                transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] 
                overflow-hidden shadow-[4px_0_24px_-2px_rgba(0,0,0,0.5)] z-30
                ${activeTab ? 'w-80 opacity-100' : 'w-0 opacity-0 pointer-events-none'}
             `}>
              {/* Content Container - Fixed Width to prevent internal squashing */}
              <div className="flex flex-col h-full w-80 min-w-[20rem] bg-[#0F0F0F]">
                {activeTab === 'components' && (
                  <>
                    {/* Search Header */}
                    <div className="p-5 border-b border-white/5 bg-[#0F0F0F] sticky top-0 z-20 space-y-4">
                      <div>
                        <h2 className="text-sm font-bold text-white">Elements</h2>
                        <p className="text-[10px] text-zinc-500 mt-1">Drag and drop components to build</p>
                      </div>
                      <div className="relative group">
                        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                          type="text"
                          placeholder="Search components..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/5 transition-all"
                        />
                      </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                      {searchQuery ? (
                        // Search Results View
                        <div className="p-4 grid grid-cols-2 gap-3">
                          {Object.values(elementCategories).flat().filter(item =>
                            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.desc.toLowerCase().includes(searchQuery.toLowerCase())
                          ).map((item) => (
                            <ElementCard
                              key={item.type}
                              onClick={() => addElement(item.type)}
                              label={item.label}
                              icon={<item.icon className="w-5 h-5" />}
                              desc={item.desc}
                            />
                          ))}
                          {Object.values(elementCategories).flat().filter(item =>
                            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.desc.toLowerCase().includes(searchQuery.toLowerCase())
                          ).length === 0 && (
                              <div className="col-span-2 py-12 text-center opacity-40">
                                <Search className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                                <p className="text-xs">No components found</p>
                              </div>
                            )}
                        </div>
                      ) : (
                        // Accordion View
                        <div className="pb-12">
                          {Object.entries(elementCategories).map(([section, items]) => (
                            <div key={section} className="border-b border-white/5 last:border-0">
                              <button
                                onClick={() => setActiveSection(activeSection === section ? null : section)}
                                className="w-full px-5 py-3 flex items-center justify-between hover:bg-white/5 transition-colors group"
                              >
                                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-white transition-colors">{section}</span>
                                <ChevronDown className={`w-3 h-3 text-zinc-600 transition-transform duration-300 ${activeSection === section ? 'rotate-180 text-zinc-400' : ''}`} />
                              </button>
                              <div className={`grid transition-all duration-300 ease-in-out overflow-hidden ${activeSection === section ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="min-h-0">
                                  <div className="p-4 grid grid-cols-2 gap-3 bg-black/10 inset-shadow-sm">
                                    {items.map((item) => (
                                      <ElementCard
                                        key={item.type}
                                        onClick={() => addElement(item.type)}
                                        label={item.label}
                                        icon={<item.icon className="w-5 h-5" />}
                                        desc={item.desc}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {activeTab === 'themes' && (
                  <>
                    <div className="p-5 border-b border-white/5 bg-[#0F0F0F] sticky top-0 z-10">
                      <h2 className="text-sm font-bold text-white">Design System</h2>
                      <p className="text-[10px] text-zinc-500 mt-1">Global styling and color palettes</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5 scrollbar-hide space-y-8">
                      {/* Dark Themes */}
                      <div>
                        <h3 className="text-[10px] uppercase font-bold text-gray-500 mb-3 tracking-wider">Dark Modes</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.keys(themes).filter(k => themes[k].type === 'dark').map(name => (
                            <button
                              key={name}
                              onClick={() => setTheme(name)}
                              className={`p-3 rounded transition-all capitalize text-xs font-bold text-left relative overflow-hidden group border ${state.theme === name ? 'border-cyan-500 ring-1 ring-cyan-500/50 bg-cyan-500/10' : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10'}`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-3 h-3 rounded-full ${themes[name].accent.split(' ')[0]}`}></div>
                                <div className={`w-3 h-3 rounded-full ${themes[name].bg.split(' ')[0]} border border-white/20`}></div>
                              </div>
                              <span className="text-gray-300 group-hover:text-white transition-colors">{name.replace('_', ' ')}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Light Themes */}
                      <div>
                        <h3 className="text-[10px] uppercase font-bold text-gray-500 mb-3 tracking-wider">Light Modes</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.keys(themes).filter(k => themes[k].type === 'light').map(name => (
                            <button
                              key={name}
                              onClick={() => setTheme(name)}
                              className={`p-3 rounded transition-all capitalize text-xs font-bold text-left relative overflow-hidden group border ${state.theme === name ? 'border-cyan-500 ring-1 ring-cyan-500/50 bg-cyan-500/10' : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10'}`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-3 h-3 rounded-full ${themes[name].accent.split(' ')[0]}`}></div>
                                <div className={`w-3 h-3 rounded-full ${themes[name].bg.split(' ')[0]} border border-black/10`}></div>
                              </div>
                              <span className="text-gray-300 group-hover:text-white transition-colors">{name.replace('_', ' ')}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Center Canvas */}
        <main
          onClick={() => !isMobileView && activeTab && setActiveTab(null)}
          className={`flex-1 overflow-hidden relative transition-all duration-300 flex flex-col items-center ${previewMode ? 'bg-white' : 'bg-[#050505] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]'}`}
        >

          {/* Zoom Bar */}
          {!previewMode && <ZoomBar zoom={zoom} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />}

          <div className="flex-1 w-full overflow-auto p-8 lg:p-12 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent flex items-start justify-center">
            <div
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
              className={`
                   transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
                   ${previewMode ? 'w-full max-w-full rounded-none shadow-none h-full' : 'shadow-2xl shadow-black border border-white/5 min-h-[90vh]'}
                   ${isMobileView && !previewMode ? 'w-[375px] max-w-[375px] border-[8px] border-[#1a1a1a] rounded-[2.5rem] overflow-hidden ring-4 ring-black/20' : 'w-full max-w-6xl'}
                   ${currentTheme.bg}
                `}
            >
              {state.layout.length === 0 ? (
                <div className={`flex items-center justify-center h-[70vh] ${currentTheme.muted}`}>
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-20 h-20 bg-white/5 border border-white/5 rounded-sm mx-auto flex items-center justify-center mb-6"
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
                        isMobileView={isMobileView && !previewMode}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Inspector */}
        {!previewMode && (
          <aside className="w-80 bg-[#0F0F0F] border-l border-white/5 hidden xl:flex flex-col sticky top-0 h-screen z-40">
            {selectedSection ? (
              <div className="flex-1 overflow-y-auto scrollbar-hide relative bg-[#0F0F0F]">
                <Inspector
                  section={selectedSection}
                  onUpdate={(newData) => updateElement(selectedSection.id, newData)}
                  onDuplicate={() => duplicateElement(selectedSection.id)}
                  onRemove={() => removeElement(selectedSection.id)}
                  onMoveUp={() => moveElementUp(selectedSection.id)}
                  onMoveDown={() => moveElementDown(selectedSection.id)}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-600 flex-col gap-4 font-mono text-xs">
                <div className="w-16 h-16 rounded border border-white/5 bg-white/5 flex items-center justify-center animate-pulse">
                  <MousePointer className="w-6 h-6 opacity-20" />
                </div>
                <p className="uppercase tracking-widest opacity-50">Select_Component</p>
              </div>
            )}
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
function EditableText({ value, onChange, className, type = 'input', placeholder = 'Type here...' }) {
  const ref = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const lastEmittedValue = useRef(value);
  const prevValue = useRef(value);

  // Sync external changes only when not focused
  useEffect(() => {
    // Only update DOM if the PROP has actually changed (external update)
    if (value !== prevValue.current) {
      prevValue.current = value;

      // If we are not focused, accept the new value
      if (ref.current && !isFocused) {
        ref.current.innerText = value || '';
        lastEmittedValue.current = value;
      }
    }
  }, [value, isFocused]);

  const handleBlur = (e) => {
    setIsFocused(false);
    const newValue = e.target.innerText;

    // Only emit if different
    if (newValue !== value) {
      lastEmittedValue.current = newValue;
      onChange(newValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      e.preventDefault();
      e.target.blur();
    }
    e.stopPropagation();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onClick={(e) => e.stopPropagation()}
      className={`
        outline-none min-w-[1ch] inline-block align-top transition-all duration-200 decoration-clone cursor-text
        ${isFocused ? 'bg-cyan-500/20 ring-1 ring-cyan-500 rounded px-1 -mx-1 relative z-10' : 'hover:bg-cyan-500/10 hover:ring-1 hover:ring-cyan-500/30 rounded px-0.5 -mx-0.5'}
        ${!value ? 'min-w-[30px] opacity-50 before:content-[attr(data-placeholder)]' : ''}
        ${className}
      `}
      data-placeholder={placeholder}
      style={{ whiteSpace: type === 'textarea' ? 'pre-wrap' : 'normal' }}
    >
      {value}
    </span>
  );
}

function NavRailButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center gap-1 p-2 rounded-xl transition-all relative ${active ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
    >
      <div className={`p-3 rounded transition-all ${active ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/25 ring-1 ring-cyan-400' : 'bg-transparent group-hover:bg-white/5'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold">{label}</span>
      {active && (
        <motion.div layoutId="activeRail" className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
      )}
    </button>
  )
}

function ElementCard({ onClick, label, icon, desc }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-start gap-2 w-full p-3 bg-[#121212] hover:bg-[#1A1A1A] border border-white/5 hover:border-cyan-500/50 rounded transition-all hover:shadow-xl hover:shadow-cyan-500/10 active:scale-[0.98] text-left relative overflow-hidden"
    >
      <div className="flex items-start justify-between w-full">
        <div className="p-2 bg-white/5 rounded group-hover:bg-cyan-500/20 text-gray-500 group-hover:text-cyan-400 transition-colors">
          {icon}
        </div>
        {/* Hidden but accessible add action, entire card is clickable */}
      </div>
      <div>
        <span className="text-[11px] font-bold text-zinc-200 group-hover:text-white block">{label}</span>
        <span className="text-[9px] text-zinc-500 group-hover:text-zinc-400 leading-tight block mt-0.5">{desc}</span>
      </div>
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Plus className="w-3 h-3 text-cyan-400" />
      </div>
    </button>
  );
}

function SortableSection({ element, isSelected, onSelect, theme, previewMode, isMobileView }) {
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
      className={`relative group ${!previewMode ? 'hover:outline hover:outline-1 hover:outline-cyan-500/50 cursor-pointer' : ''} ${isSelected && !previewMode ? 'outline outline-1 outline-cyan-500 shadow-2xl z-10' : ''}`}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      {!previewMode && (
        <div
          {...attributes} {...listeners}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-[#0F0F0F] border border-white/10 rounded opacity-0 group-hover:opacity-100 transition-all cursor-grab active:cursor-grabbing z-50 shadow-xl"
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
        isMobileView={isMobileView}
      />
    </div>
  );
}

const SectionRenderer = ({ type, data, theme, onUpdate, isSelected, isMobileView }) => {
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

    faq: FAQSection,
    divider: DividerSection,
    footer: FooterSection,
    // ADDED COMPONENT
    timeline: TimelineSection,

    stats: StatsSection,
    cta: CTASection,

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

  // Mobile Override Logic
  const displayData = isMobileView
    ? { ...data, py: 'py-12', px: 'px-4' }
    : data;

  const anim = animations[displayData.animation] || animations.none;

  return (
    <motion.div
      initial={anim.initial}
      whileInView={anim.animate}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={customStyle}
      className={`${displayData.py} ${displayData.px}`}
    >
      <div className={`${displayData.maxWidth} mx-auto ${displayData.radius} ${displayData.shadow}`}>
        <Component data={displayData} theme={theme} type={type} onUpdate={onUpdate} isSelected={isSelected} isMobileView={isMobileView} />
      </div>
    </motion.div>
  );
}

// Zoom Controls Component
function ZoomBar({ zoom, onZoomIn, onZoomOut }) {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#0A0A0A]/90 backdrop-blur-md border border-white/10 rounded px-4 py-2 flex items-center gap-4 shadow-xl z-50">
      <button onClick={onZoomOut} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
        <Minus className="w-4 h-4" />
      </button>
      <span className="text-xs font-bold font-mono text-gray-300 w-12 text-center">{Math.round(zoom * 100)}%</span>
      <button onClick={onZoomIn} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

// Inspector Components
function InspectorHeader({ type, onDuplicate, onDelete, onMoveUp, onMoveDown }) {
  return (
    <div className="sticky top-0 z-20 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_15px_-3px_rgba(6,182,212,0.1)]">
          <Layers className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest font-mono">{type}</h3>
        </div>
      </div>

      <div className="flex items-center bg-white/[0.02] rounded border border-white/5 p-0.5">
        <div className="flex items-center gap-0.5 pr-1 border-r border-white/5 mr-1">
          <button onClick={onMoveUp} className="p-1.5 hover:bg-white/10 rounded-sm text-gray-500 hover:text-white transition-colors" title="Move Up">
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button onClick={onMoveDown} className="p-1.5 hover:bg-white/10 rounded-sm text-gray-500 hover:text-white transition-colors" title="Move Down">
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <button onClick={onDuplicate} className="p-1.5 hover:bg-white/10 rounded-sm text-gray-500 hover:text-white transition-all" title="Duplicate">
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button onClick={onDelete} className="p-1.5 hover:bg-red-500/20 rounded-sm text-gray-500 hover:text-red-400 transition-all" title="Delete">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

function QuickControls({ type, data, onUpdate }) {
  if (!data) return null;

  // Strict allowlist for alignment controls
  const supportsAlign = ['hero', 'text', 'buttons', 'richtext', 'footer', 'cta'].includes(type);

  return (
    <div className="px-5 py-4 grid grid-cols-2 gap-3 border-b border-white/5 bg-[#0A0A0A]">
      {/* Alignment Quick Toggle */}
      {supportsAlign ? (
        <div className="flex items-center bg-white/5 rounded p-1 border border-white/5">
          {['left', 'center', 'right'].map(align => (
            <button
              key={align}
              onClick={() => onUpdate({ ...data, align })}
              className={`flex-1 h-7 flex items-center justify-center rounded-sm transition-all ${data.align === align ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30' : 'text-gray-600 hover:text-gray-300'}`}
              title={`Align ${align}`}
            >
              {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
              {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
              {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-[10px] lowercase font-mono text-gray-700 italic select-none">
            // no_alignment
        </div>
      )}

      {/* Visibility / Spacing Preset Toggle (Mock functionality for now) */}
      <div className="flex items-center gap-2">
        <button
          className="h-full px-3 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/5 rounded text-gray-500 hover:text-white transition-colors gap-2 w-full"
          title="Cycle Vertical Spacing"
          onClick={() => {
            const levels = ['py-12', 'py-24', 'py-48'];
            const current = levels.includes(data.py) ? data.py : 'py-24';
            const next = levels[(levels.indexOf(current) + 1) % levels.length];
            onUpdate({ ...data, py: next });
          }}
        >
          <ChevronsUpDown className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold font-mono uppercase">
            {data.py === 'py-12' ? 'Compact' : data.py === 'py-48' ? 'Relaxed' : 'Normal'}
          </span>
        </button>
      </div>
    </div>
  )
}

function InspectorSection({ title, icon: Icon, isOpen, onToggle, children }) {
  return (
    <div className="border-b border-white/5 last:border-0 relative">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className={`w-3.5 h-3.5 transition-colors ${isOpen ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-zinc-400'}`} />}
          <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isOpen ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>{title}</span>
        </div>
        <ChevronDown className={`w-3 h-3 text-zinc-700 transition-transform duration-300 group-hover:text-zinc-500 ${isOpen ? 'rotate-180 text-indigo-500/80 group-hover:text-indigo-400' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="min-h-0">
          <div className="px-5 pb-6 pt-2 space-y-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function Inspector({ section, onUpdate, onDuplicate, onRemove, onMoveUp, onMoveDown }) {
  const { type, data, id } = section;
  const [activeSection, setActiveSection] = useState('Content');

  const update = (key, value) => {
    onUpdate({ ...data, [key]: value });
  };

  const toggle = (sec) => setActiveSection(activeSection === sec ? null : sec);

  return (
    <div className="pb-32 min-h-screen bg-[#0F0F0F] overflow-x-hidden border-l border-white/5">
      <InspectorHeader
        type={type}
        onDuplicate={onDuplicate}
        onDelete={onRemove}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
      />
      <QuickControls type={type} data={data} onUpdate={onUpdate} />

      {/* 1. CONTENT SECTION */}
      <InspectorSection title="Content" icon={Type} isOpen={activeSection === 'Content'} onToggle={() => toggle('Content')}>
        {type === 'hero' && (
          <>
            <ControlGroup label="Text Content">
              <Input label="Title" value={data.heading} onChange={(v) => update('heading', v)} />
              <Textarea label="Subtitle" value={data.subheading} onChange={(v) => update('subheading', v)} rows={3} />
            </ControlGroup>
            <ControlGroup label="Action">
              <Input label="Button Label" value={data.button} onChange={(v) => update('button', v)} />
            </ControlGroup>
          </>
        )}

        {type === 'navbar' && (
          <>
            <ControlGroup label="Brand">
              <Input label="Logo Text" value={data.logo} onChange={(v) => update('logo', v)} />
            </ControlGroup>
            <ControlGroup label="Links">
              <Textarea label="Menu Items (comma separated)" value={data.links.join(', ')} onChange={(v) => update('links', v.split(',').map(s => s.trim()))} />
            </ControlGroup>
          </>
        )}

        {type === 'richtext' && (
          <ControlGroup label="Article">
            <Input label="Heading" value={data.heading} onChange={(v) => update('heading', v)} />
            <Textarea label="Body Text" value={data.body} onChange={(v) => update('body', v)} rows={8} />
          </ControlGroup>
        )}

        {type === 'text' && (
          <ControlGroup label="Typography">
            <Select label="Size" value={data.fontSize} onChange={(v) => update('fontSize', v)} options={['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl']} />
            <Textarea label="Content" value={data.content} onChange={(v) => update('content', v)} rows={4} />
          </ControlGroup>
        )}

        {type === 'video' && (
          <ControlGroup label="Video Source">
            <Input label="Embed URL" value={data.videoUrl} onChange={(v) => update('videoUrl', v)} />
          </ControlGroup>
        )}

        {type === 'divider' && (
          <ControlGroup label="Divider Settings">
            <Select label="Height" value={data.height} onChange={(v) => update('height', v)} options={['sm', 'md', 'lg']} />
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" checked={data.showLine} onChange={(e) => update('showLine', e.target.checked)} className="rounded border-white/20 bg-zinc-800" />
              <span className="text-xs text-zinc-400">Show Line</span>
            </div>
          </ControlGroup>
        )}

        {type === 'buttons' && (
          <div className="space-y-4">
            {data.buttons.map((btn, i) => (
              <div key={i} className="p-3 bg-zinc-800/50 rounded-xl border border-white/5 space-y-2">
                <Input label={`Button ${i + 1}`} value={btn.label} onChange={(v) => {
                  const newBtns = [...data.buttons];
                  newBtns[i] = { ...btn, label: v };
                  update('buttons', newBtns);
                }} />
              </div>
            ))}
            <button onClick={() => update('buttons', [...data.buttons, { label: 'New Action' }])} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold px-2">+ Add Button</button>
          </div>
        )}

        {type === 'pricing' && (
          <div className="space-y-4">
            {data.plans.map((plan, i) => (
              <div key={i} className="p-3 bg-zinc-800/50 rounded-xl border border-white/5 space-y-2">
                <Input label="Name" value={plan.name} onChange={(v) => {
                  const newPlans = [...data.plans];
                  newPlans[i] = { ...plan, name: v };
                  update('plans', newPlans);
                }} />
                <Input label="Price" value={plan.price} onChange={(v) => {
                  const newPlans = [...data.plans];
                  newPlans[i] = { ...plan, price: v };
                  update('plans', newPlans);
                }} />
              </div>
            ))}
          </div>
        )}

        {type === 'testimonials' && (
          <div className="space-y-4">
            {data.items.map((item, i) => (
              <div key={i} className="p-3 bg-zinc-800/50 rounded-xl border border-white/5 space-y-2">
                <Input label="Name" value={item.name} onChange={(v) => {
                  const newItems = [...data.items];
                  newItems[i] = { ...item, name: v };
                  update('items', newItems);
                }} />
                <Input label="Role" value={item.role} onChange={(v) => {
                  const newItems = [...data.items];
                  newItems[i] = { ...item, role: v };
                  update('items', newItems);
                }} />
                <Textarea label="Quote" value={item.quote} onChange={(v) => {
                  const newItems = [...data.items];
                  newItems[i] = { ...item, quote: v };
                  update('items', newItems);
                }} rows={2} />
                <Input label="Avatar URL" value={item.imageUrl} onChange={(v) => {
                  const newItems = [...data.items];
                  newItems[i] = { ...item, imageUrl: v };
                  update('items', newItems);
                }} />
              </div>
            ))}
          </div>
        )}

        {['timeline'].includes(type) && (
          <div className="space-y-4">
            {data.items.map((item, i) => (
              <div key={i} className="p-3 bg-zinc-800/50 rounded-xl border border-white/5 space-y-2">
                <Input label="Title" value={item.title} onChange={(v) => {
                  const newItems = [...data.items];
                  newItems[i] = { ...item, title: v };
                  update('items', newItems);
                }} />
                <Textarea label="Description" value={item.description} onChange={(v) => {
                  const newItems = [...data.items];
                  newItems[i] = { ...item, description: v };
                  update('items', newItems);
                }} rows={2} />
              </div>
            ))}
            <button onClick={() => update('items', [...data.items, { title: 'Step', description: 'Desc' }])} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold px-2">+ Add Step</button>
          </div>
        )}

        {type === 'image' && (
          <ControlGroup label="Image Source">
            <Input label="URL" value={data.url} onChange={(v) => update('url', v)} placeholder="https://..." />
            <Input label="Caption" value={data.caption} onChange={(v) => update('caption', v)} />
          </ControlGroup>
        )}

        {type === 'cards' && (
          <>
            <ControlGroup label="Grid Config">
              <Input label="Count" type="number" value={data.count} onChange={(v) => {
                const count = Math.max(1, parseInt(v) || 1);
                update('count', count);
                // Preserve existing data if possible, else fill
                const newTitles = Array(count).fill('').map((_, i) => data.titles[i] || `Card ${i + 1}`);
                const newDesc = Array(count).fill('').map((_, i) => data.descriptions[i] || 'Description...');
                const newImgs = Array(count).fill('').map((_, i) => data.imageUrls[i] || 'https://via.placeholder.com/400x300');
                onUpdate({ ...data, count, titles: newTitles, descriptions: newDesc, imageUrls: newImgs });
              }} />
            </ControlGroup>
            <div className="space-y-4">
              {data.titles.map((title, i) => (
                <div key={i} className="p-3 bg-zinc-800/50 rounded-xl border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Card {i + 1}</span>
                  </div>
                  <Input label="Title" value={title} onChange={(v) => {
                    const newTitles = [...data.titles];
                    newTitles[i] = v;
                    update('titles', newTitles);
                  }} />
                  <Textarea label="Description" value={data.descriptions[i]} onChange={(v) => {
                    const newDesc = [...data.descriptions];
                    newDesc[i] = v;
                    update('descriptions', newDesc);
                  }} rows={2} />
                  <Input label="Image URL" value={data.imageUrls[i]} onChange={(v) => {
                    const newImgs = [...data.imageUrls];
                    newImgs[i] = v;
                    update('imageUrls', newImgs);
                  }} />
                </div>
              ))}
            </div>
          </>
        )}

        {type === 'stats' && (
          <div className="space-y-4">
            {data.stats.map((stat, i) => (
              <div key={i} className="p-3 bg-zinc-800/50 rounded-xl border border-white/5 space-y-2">
                <Input label="Label" value={stat.label} onChange={(v) => {
                  const newStats = [...data.stats];
                  newStats[i] = { ...stat, label: v };
                  update('stats', newStats);
                }} />
                <Input label="Value" value={stat.value} onChange={(v) => {
                  const newStats = [...data.stats];
                  newStats[i] = { ...stat, value: v };
                  update('stats', newStats);
                }} />
              </div>
            ))}
            <button onClick={() => update('stats', [...data.stats, { label: 'New Metric', value: '0' }])} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold px-2">+ Add Stat</button>
          </div>
        )}

        {type === 'features' && (
          <div className="space-y-4">
            {data.items.map((item, i) => (
              <div key={i} className="p-3 bg-zinc-800/50 rounded-xl border border-white/5 space-y-2">
                <Input label="Title" value={item.title} onChange={(v) => {
                  const newItems = [...data.items];
                  newItems[i] = { ...item, title: v };
                  update('items', newItems);
                }} />
                <Textarea label="Description" value={item.description} onChange={(v) => {
                  const newItems = [...data.items];
                  newItems[i] = { ...item, description: v };
                  update('items', newItems);
                }} rows={2} />
              </div>
            ))}
            <button onClick={() => update('items', [...data.items, { title: 'Feature', description: 'Description' }])} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold px-2">+ Add Feature</button>
          </div>
        )}

        {type === 'logogrid' && (
          <div className="space-y-4">
            <ControlGroup label="Logo Items">
              {data.logos.map((url, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    label={`Logo ${i + 1}`}
                    value={url}
                    onChange={(v) => {
                      const newLogos = [...data.logos];
                      newLogos[i] = v;
                      update('logos', newLogos);
                    }}
                  />
                  <button
                    onClick={() => {
                      const newLogos = data.logos.filter((_, idx) => idx !== i);
                      update('logos', newLogos);
                    }}
                    className="mt-4 p-2 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => update('logos', [...data.logos, 'https://via.placeholder.com/120x60/eeeeee/999999?text=LOGO'])}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold px-2 block mt-2"
              >
                + Add Logo
              </button>
            </ControlGroup>
            <ControlGroup label="Grid Config">
              <Input label="Columns" type="number" value={data.columns} onChange={(v) => update('columns', parseInt(v))} />
            </ControlGroup>
          </div>
        )
        }

        {
          type === 'cta' && (
            <ControlGroup label="Call to Action">
              <Input label="Heading" value={data.heading} onChange={(v) => update('heading', v)} />
              <Textarea label="Supporting Text" value={data.supportingText} onChange={(v) => update('supportingText', v)} rows={3} />
              <Input label="Button Label" value={data.button} onChange={(v) => update('button', v)} />
            </ControlGroup>
          )
        }

        {
          type === 'contact' && (
            <ControlGroup label="Contact Info">
              <Input label="Heading" value={data.heading} onChange={(v) => update('heading', v)} />
              <Input label="Email" value={data.email} onChange={(v) => update('email', v)} />
              <Input label="Phone" value={data.phone} onChange={(v) => update('phone', v)} />
              <Textarea label="Address" value={data.address} onChange={(v) => update('address', v)} rows={2} />
            </ControlGroup>
          )
        }

        {
          type === 'faq' && (
            <div className="space-y-4">
              {data.items.map((item, i) => (
                <div key={i} className="p-3 bg-zinc-800/50 rounded-xl border border-white/5 space-y-2">
                  <Input label="Question" value={item.question} onChange={(v) => {
                    const newItems = [...data.items];
                    newItems[i] = { ...item, question: v };
                    update('items', newItems);
                  }} />
                  <Textarea label="Answer" value={item.answer} onChange={(v) => {
                    const newItems = [...data.items];
                    newItems[i] = { ...item, answer: v };
                    update('items', newItems);
                  }} rows={3} />
                  <button
                    onClick={() => {
                      const newItems = data.items.filter((_, idx) => idx !== i);
                      update('items', newItems);
                    }}
                    className="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase"
                  >
                    Remove Item
                  </button>
                </div>
              ))}
              <button onClick={() => update('items', [...data.items, { question: 'New Question', answer: 'New Answer' }])} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold px-2">+ Add FAQ Item</button>
            </div>
          )
        }

        {
          type === 'footer' && (
            <ControlGroup label="Footer Content">
              <Input label="Copyright Text" value={data.text} onChange={(v) => update('text', v)} />
            </ControlGroup>
          )
        }

        {/* Fallback for simple inputs if not explicitly handled above but common */}
        {
          data.heading !== undefined && !['hero', 'richtext', 'cta', 'contact', 'video'].includes(type) && (
            <Input label="Heading" value={data.heading} onChange={(v) => update('heading', v)} />
          )
        }
        {
          data.text !== undefined && type !== 'footer' && (
            <Input label="Text" value={data.text} onChange={(v) => update('text', v)} />
          )
        }
      </InspectorSection >

      {/* 2. LAYOUT SECTION */}
      < InspectorSection title="Layout" icon={Layout} isOpen={activeSection === 'Layout'} onToggle={() => toggle('Layout')}>
        <ControlGroup label="Spacing">
          <Select label="Vertical Scale" value={data.py} onChange={(v) => update('py', v)} options={['py-0', 'py-8', 'py-16', 'py-24', 'py-32', 'py-40', 'py-60']} />
          <Select label="Horizontal Scale" value={data.px} onChange={(v) => update('px', v)} options={['px-0', 'px-4', 'px-8', 'px-12', 'px-20', 'px-32']} />
        </ControlGroup>

        <ControlGroup label="Container">
          <Select label="Max Width" value={data.maxWidth} onChange={(v) => update('maxWidth', v)} options={['max-w-4xl', 'max-w-5xl', 'max-w-6xl', 'max-w-7xl', 'max-w-full']} />
          {['features', 'logogrid', 'stats', 'cards'].includes(type) && (
            <Input label="Grid Columns" type="number" value={data.columns} onChange={(v) => update('columns', parseInt(v))} />
          )}
        </ControlGroup>

        {/* Alignment moved to QuickControls, enabling specific manual overrides here if needed, or remove to simplify */}

        {
          type === 'image' && (
            <ControlGroup label="Size">
              <Input label="Height (px)" type="number" value={data.height} onChange={(v) => update('height', parseInt(v))} />
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" checked={data.fullWidth} onChange={(e) => update('fullWidth', e.target.checked)} className="rounded border-white/20 bg-zinc-800" />
                <span className="text-xs text-zinc-400">Full Width</span>
              </div>
            </ControlGroup>
          )
        }
      </InspectorSection >

      {/* 3. STYLE SECTION */}
      < InspectorSection title="Appearance" icon={ImageIcon2} isOpen={activeSection === 'Appearance'} onToggle={() => toggle('Appearance')}>
        <ControlGroup label="Shape & Shadow">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Radius" value={data.radius} onChange={(v) => update('radius', v)} options={['rounded-none', 'rounded-lg', 'rounded-2xl', 'rounded-3xl', 'rounded-full']} />
            <Select label="Shadow" value={data.shadow} onChange={(v) => update('shadow', v)} options={['shadow-none', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-2xl']} />
          </div>
        </ControlGroup>

        <ControlGroup label="Animation">
          <Select label="Entrance" value={data.animation || 'none'} onChange={(v) => update('animation', v)} options={['none', 'fadeUp', 'fadeDown', 'fadeIn', 'scaleUp', 'slideLeft', 'slideRight']} />
        </ControlGroup>

        <ControlGroup label="Custom Colors">
          <Input label="Background" value={data.customBg} onChange={(v) => update('customBg', v)} placeholder="hex or rgba" />
          <Input label="Text Color" value={data.customText} onChange={(v) => update('customText', v)} placeholder="hex or rgba" />
        </ControlGroup>
      </InspectorSection >

    </div >
  );
}
// Helper Components for Inspector
function ControlGroup({ label, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">{label}</h3>
        {/* Optional: Add reset or indicator here */}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div className="space-y-1.5 group">
      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-400 transition-colors duration-300">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black/20 hover:bg-black/40 border border-white/5 focus:border-indigo-500/50 rounded-xl px-3 py-2.5 text-[13px] focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 text-zinc-100 placeholder:text-zinc-700 font-medium"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 3 }) {
  return (
    <div className="space-y-1.5 group">
      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-400 transition-colors duration-300">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-black/20 hover:bg-black/40 border border-white/5 focus:border-indigo-500/50 rounded-xl px-3 py-2.5 text-[13px] focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 text-zinc-100 resize-none scrollbar-hide font-medium leading-relaxed"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="space-y-1.5 group">
      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-400 transition-colors duration-300">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-black/20 hover:bg-black/40 border border-white/5 focus:border-indigo-500/50 rounded-xl px-3 py-2.5 text-[13px] focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 text-zinc-100 cursor-pointer appearance-none"
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none group-hover:text-zinc-300 transition-colors" />
      </div>
    </div>
  );
}

// Render Components
function NavbarSection({ data, theme, onUpdate, isMobileView }) {
  return (
    <div className={`flex ${isMobileView ? 'flex-col gap-4 text-center' : 'items-center justify-between'}`}>
      <EditableText
        value={data.logo}
        onChange={(v) => onUpdate({ ...data, logo: v })}
        className={`text-2xl font-black tracking-tighter ${theme.text}`}
      />
      <div className={`flex ${isMobileView ? 'flex-col gap-3' : 'gap-10'}`}>
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
  const alignClass = data.align === 'center' ? 'text-center' : data.align === 'right' ? 'text-right' : 'text-left';
  const marginClass = data.align === 'center' ? 'mx-auto' : data.align === 'right' ? 'ml-auto' : 'mr-auto';

  return (
    <div className={alignClass}>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-7xl font-black tracking-tighter mb-8 max-w-5xl ${marginClass} ${theme.text}`}
      >
        <EditableText value={data.heading} onChange={(v) => onUpdate({ ...data, heading: v })} />
      </motion.h1>
      <div className={`text-2xl mb-12 max-w-3xl ${marginClass} leading-relaxed opacity-60 font-medium ${theme.text}`}>
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


function CardsSection({ data, theme, onUpdate, isMobileView }) {
  return (
    <div className={`grid gap-8 ${isMobileView ? 'grid-cols-1' : (data.count <= 2 ? 'grid-cols-2' : data.count === 3 ? 'grid-cols-3' : 'grid-cols-4')}`}>
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

function PricingSection({ data, theme, onUpdate, isMobileView }) {
  return (
    <div className={`grid ${isMobileView ? 'grid-cols-1' : 'grid-cols-2'} gap-8 max-w-4xl mx-auto`}>
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

function ContactSection({ data, theme, onUpdate, isMobileView }) {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h2 className={`text-5xl font-black mb-12 tracking-tight ${theme.text}`}>
        <EditableText value={data.heading} onChange={(v) => onUpdate({ ...data, heading: v })} />
      </h2>
      <div className={`grid ${isMobileView ? 'grid-cols-1 gap-8' : 'grid-cols-3 gap-12'}`}>
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

function LogoGridSection({ data, theme, onUpdate, isMobileView }) {
  const colMap = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-5', 6: 'grid-cols-6' };
  return (
    <div className={`grid ${isMobileView ? 'grid-cols-2 gap-8' : (colMap[data.columns] || 'grid-cols-4 gap-12')} items-center`}>
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

function ButtonsSection({ data, theme, onUpdate, isMobileView }) {
  return (
    <div className={`flex gap-6 ${isMobileView ? 'flex-col items-center' : (data.align === 'center' ? 'justify-center' : data.align === 'right' ? 'justify-end' : 'justify-start')}`}>
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

function FeaturesSection({ data, theme, onUpdate, isMobileView }) {
  const colMap = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3' };
  return (
    <div className={`grid ${isMobileView ? 'grid-cols-1' : (colMap[data.columns] || 'grid-cols-3')} gap-16`}>
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
// ADDING COMPONENT
function TimelineSection({ data, theme, onUpdate }) {
  return (
    <div className={`${data.py}`}>
      <div className="space-y-6">
        {data.items.map((item, idx) => (
          <div key={idx} className="flex gap-4">
            <div className={`font-bold ${theme.text}`}>
              {idx + 1}.
            </div>
            <div>
              <EditableText
                value={item.title}
                onChange={(v) => {
                  const items = [...data.items];
                  items[idx].title = v;
                  onUpdate({ ...data, items });
                }}
                className={`text-lg font-semibold ${theme.text}`}
              />
              <EditableText
                value={item.description}
                onChange={(v) => {
                  const items = [...data.items];
                  items[idx].description = v;
                  onUpdate({ ...data, items });
                }}
                className={`opacity-70 ${theme.text}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturesGridSection({ data, theme, onUpdate }) {
  const updateItem = (index, key, value) => {
    const items = [...data.items];
    items[index] = { ...items[index], [key]: value };
    onUpdate({ ...data, items });
  };

  return (
    <div className={`max-w-6xl mx-auto ${data.py}`}>
      <div
        className={`grid gap-6 ${data.columns === 4
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          : data.columns === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-3'
          }`}
      >
        {data.items.map((item, idx) => (
          <div
            key={idx}
            className={`p-8 rounded-3xl border ${theme.secondary} ${theme.border}`}
          >
            <EditableText
              value={item.title}
              onChange={(v) => updateItem(idx, 'title', v)}
              className={`text-lg font-bold mb-2 ${theme.text}`}
            />

            <EditableText
              value={item.description}
              onChange={(v) => updateItem(idx, 'description', v)}
              className={`text-sm opacity-70 ${theme.text}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsSection({ data, theme, onUpdate }) {
  const updateStat = (index, key, value) => {
    const stats = [...data.stats];
    stats[index] = { ...stats[index], [key]: value };
    onUpdate({ ...data, stats });
  };

  return (
    <div className={`max-w-6xl mx-auto ${data.py}`}>
      <div
        className={`grid gap-6 ${data.layout === 'vertical'
          ? 'grid-cols-1 md:grid-cols-4'
          : 'grid-cols-1 md:grid-cols-3'
          }`}
      >
        {data.stats.map((stat, idx) => (
          <div
            key={idx}
            className={`p-8 rounded-3xl border text-center ${theme.secondary} ${theme.border}`}
          >
            <EditableText
              value={stat.value}
              onChange={(v) => updateStat(idx, 'value', v)}
              className={`text-4xl font-black mb-2 ${theme.text}`}
            />

            <EditableText
              value={stat.label}
              onChange={(v) => updateStat(idx, 'label', v)}
              className={`text-xs uppercase tracking-widest opacity-60 ${theme.text}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function CTASection({ data, theme, onUpdate }) {
  const updateField = (key, value) => {
    onUpdate({ ...data, [key]: value });
  };

  return (
    <div className={`max-w-5xl mx-auto ${data.py}`}>
      <div
        className={`p-12 rounded-3xl text-center border ${theme.secondary} ${theme.border}`}
      >
        <EditableText
          value={data.heading}
          onChange={(v) => updateField('heading', v)}
          className={`text-3xl font-black mb-4 ${theme.text}`}
        />

        <EditableText
          value={data.supportingText}
          onChange={(v) => updateField('supportingText', v)}
          className={`text-sm opacity-70 mb-8 ${theme.text}`}
        />

        <button
          className={`inline-flex items-center justify-center px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${theme.accent || 'bg-indigo-600 text-white'
            }`}
        >
          <EditableText
            value={data.button}
            onChange={(v) => updateField('button', v)}
            className="outline-none"
          />
        </button>
      </div>
    </div>
  );
}

function ImageSection({ data, theme, onUpdate }) {
  const updateField = (key, value) => {
    onUpdate({ ...data, [key]: value });
  };

  return (
    <div className={`max-w-6xl mx-auto ${data.py}`}>
      <div
        className={`rounded-3xl border overflow-hidden ${theme.secondary} ${theme.border}`}
      >
        {data.url ? (
          <img
            src={data.url}
            alt={data.caption || 'Image'}
            className={`w-full object-cover ${data.fullWidth ? 'h-auto' : `h-[${data.height}px]`
              }`}
          />
        ) : (
          <div className="h-64 flex items-center justify-center opacity-40 text-sm">
            No image selected
          </div>
        )}

        {data.caption && (
          <div className={`p-4 text-center text-sm opacity-60 ${theme.text}`}>
            <EditableText
              value={data.caption}
              onChange={(v) => updateField('caption', v)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CanvaEditor;
