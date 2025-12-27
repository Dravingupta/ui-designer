import { useState } from 'react';
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

// Theme definitions - Applied ONLY to canvas
const themes = {
  // Minimal
  light: { bg: 'bg-white', text: 'text-gray-900', border: 'border-gray-300', accent: 'bg-black text-white', secondary: 'bg-gray-100', muted: 'text-gray-600' },
  dark: { bg: 'bg-gray-900', text: 'text-white', border: 'border-gray-700', accent: 'bg-white text-black', secondary: 'bg-gray-800', muted: 'text-gray-400' },
  gray: { bg: 'bg-gray-50', text: 'text-gray-900', border: 'border-gray-300', accent: 'bg-gray-900 text-white', secondary: 'bg-gray-200', muted: 'text-gray-600' },
  // Startup
  blue: { bg: 'bg-blue-50', text: 'text-blue-950', border: 'border-blue-300', accent: 'bg-blue-600 text-white', secondary: 'bg-blue-100', muted: 'text-blue-700' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-950', border: 'border-indigo-300', accent: 'bg-indigo-600 text-white', secondary: 'bg-indigo-100', muted: 'text-indigo-700' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-950', border: 'border-purple-300', accent: 'bg-purple-600 text-white', secondary: 'bg-purple-100', muted: 'text-purple-700' },
  // Business
  slate: { bg: 'bg-slate-50', text: 'text-slate-900', border: 'border-slate-300', accent: 'bg-slate-900 text-white', secondary: 'bg-slate-100', muted: 'text-slate-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-950', border: 'border-emerald-300', accent: 'bg-emerald-600 text-white', secondary: 'bg-emerald-100', muted: 'text-emerald-700' },
  charcoal: { bg: 'bg-zinc-900', text: 'text-zinc-100', border: 'border-zinc-700', accent: 'bg-zinc-100 text-zinc-900', secondary: 'bg-zinc-800', muted: 'text-zinc-400' },
  // Creative
  peach: { bg: 'bg-orange-50', text: 'text-orange-950', border: 'border-orange-300', accent: 'bg-orange-600 text-white', secondary: 'bg-orange-100', muted: 'text-orange-700' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-950', border: 'border-rose-300', accent: 'bg-rose-600 text-white', secondary: 'bg-rose-100', muted: 'text-rose-700' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-950', border: 'border-teal-300', accent: 'bg-teal-600 text-white', secondary: 'bg-teal-100', muted: 'text-teal-700' },
  // Premium
  midnight: { bg: 'bg-slate-950', text: 'text-slate-100', border: 'border-slate-700', accent: 'bg-indigo-500 text-white', secondary: 'bg-slate-900', muted: 'text-slate-400' },
  coffee: { bg: 'bg-stone-50', text: 'text-stone-900', border: 'border-stone-300', accent: 'bg-stone-800 text-white', secondary: 'bg-stone-100', muted: 'text-stone-600' },
  // Tech
  cyber: { bg: 'bg-neutral-950', text: 'text-neutral-100', border: 'border-neutral-700', accent: 'bg-cyan-500 text-black', secondary: 'bg-neutral-900', muted: 'text-neutral-400' },
  terminal: { bg: 'bg-black', text: 'text-green-400', border: 'border-green-700', accent: 'bg-green-600 text-black', secondary: 'bg-zinc-900', muted: 'text-green-700' },
  // Soft
  lavender: { bg: 'bg-violet-50', text: 'text-violet-950', border: 'border-violet-300', accent: 'bg-violet-600 text-white', secondary: 'bg-violet-100', muted: 'text-violet-700' },
  mint: { bg: 'bg-emerald-50', text: 'text-emerald-950', border: 'border-emerald-300', accent: 'bg-emerald-600 text-white', secondary: 'bg-emerald-100', muted: 'text-emerald-700' }
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

function App() {
  const [state, setState] = useState({
    selectedSectionId: null,
    theme: 'light',
    layout: []
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      navbar: {
        logo: 'LOGO',
        links: ['Home', 'About', 'Services', 'Contact'],
        align: 'right',
        sticky: false
      },
      hero: {
        heading: 'Welcome to Our Website',
        subheading: 'Build amazing experiences with our platform',
        button: 'Get Started',
        align: 'center',
        minHeight: 'auto'
      },
      richtext: {
        heading: 'Section Heading',
        body: 'This is a rich text section. Add your content here to communicate your message effectively. You can customize the heading, body text, alignment, and width to match your design needs.',
        align: 'left',
        width: 'normal'
      },
      text: {
        content: 'This is a text block. Add your paragraph content here.',
        fontSize: 'base',
        width: 'normal',
        align: 'left'
      },
      image: {
        height: 300,
        caption: 'Image caption',
        fullWidth: false
      },
      cards: {
        count: 3,
        titles: ['Card One', 'Card Two', 'Card Three'],
        descriptions: ['Description for card one', 'Description for card two', 'Description for card three'],
        imageUrls: ['https://via.placeholder.com/300', 'https://via.placeholder.com/300', 'https://via.placeholder.com/300'],
        layout: 'grid'
      },
      testimonials: {
        items: [
          { name: 'John Doe', role: 'CEO, Company', quote: 'This product changed everything for us.', imageUrl: 'https://via.placeholder.com/100' },
          { name: 'Jane Smith', role: 'Designer', quote: 'Absolutely love the simplicity and power.', imageUrl: 'https://via.placeholder.com/100' }
        ]
      },
      pricing: {
        plans: [
          { name: 'Basic', price: '$9/mo', features: ['Feature 1', 'Feature 2'], highlighted: false },
          { name: 'Pro', price: '$29/mo', features: ['Feature 1', 'Feature 2', 'Feature 3'], highlighted: true },
          { name: 'Enterprise', price: '$99/mo', features: ['All features', 'Priority support'], highlighted: false }
        ]
      },
      contact: {
        heading: 'Get in Touch',
        email: 'hello@example.com',
        phone: '+1 234 567 8900',
        address: '123 Main St, City, State 12345'
      },
      logogrid: {
        logos: [
          'https://via.placeholder.com/120x60',
          'https://via.placeholder.com/120x60',
          'https://via.placeholder.com/120x60',
          'https://via.placeholder.com/120x60'
        ],
        columns: 4
      },
      video: {
        heading: 'Watch how it works',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      buttons: {
        buttons: [
          { label: 'Get Started' },
          { label: 'Contact Us' }
        ],
        align: 'center'
      },
      features: {
        items: [
          { title: 'Feature One', description: 'Description for feature one' },
          { title: 'Feature Two', description: 'Description for feature two' },
          { title: 'Feature Three', description: 'Description for feature three' }
        ],
        columns: 3
      },
      stats: {
        stats: [
          { label: 'Users', value: '10K+' },
          { label: 'Projects', value: '500+' },
          { label: 'Countries', value: '50+' },
          { label: 'Uptime', value: '99.9%' }
        ],
        layout: 'horizontal'
      },
      cta: {
        heading: 'Ready to get started?',
        supportingText: 'Join thousands of satisfied customers today',
        button: 'Sign Up Now',
        align: 'center'
      },
      faq: {
        items: [
          { question: 'What is this product?', answer: 'This is a comprehensive solution for your needs.' },
          { question: 'How does it work?', answer: 'It works seamlessly with your existing workflow.' },
          { question: 'Is there support?', answer: 'Yes, we offer 24/7 customer support.' }
        ]
      },
      divider: {
        height: 'md',
        showLine: true
      },
      footer: {
        text: '© 2025 Your Company. All rights reserved.',
        columns: 1,
        align: 'center'
      }
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
    setState(prev => ({ ...prev, selectedSectionId: id }));
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Bar - Builder UI (no theme) */}
      <header className="bg-white border-b border-gray-300 px-6 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">Website Builder</h1>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500">{state.layout.length} sections</span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(themeGroups).map(([group, names]) => (
              <div key={group} className="flex items-center gap-1">
                <span className="text-[10px] uppercase text-gray-400 mr-1">{group}</span>
                {names.map(name => (
                  <button
                    key={name}
                    onClick={() => setTheme(name)}
                    className={`px-2 py-1 text-xs rounded capitalize ${state.theme === name ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Element Library */}
        <aside className="w-60 bg-white border-r border-gray-300 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xs font-bold mb-3 uppercase tracking-wide text-gray-600">Add Section</h2>
            <div className="space-y-1">
              <ElementButton onClick={() => addElement('navbar')} label="Navigation Bar" />
              <ElementButton onClick={() => addElement('hero')} label="Hero Section" />
              <ElementButton onClick={() => addElement('richtext')} label="Text with Heading" />
              <ElementButton onClick={() => addElement('text')} label="Text" />
              <ElementButton onClick={() => addElement('image')} label="Image" />
              <ElementButton onClick={() => addElement('cards')} label="Cards" />
              <ElementButton onClick={() => addElement('features')} label="Features" />
              <ElementButton onClick={() => addElement('testimonials')} label="Testimonials" />
              <ElementButton onClick={() => addElement('pricing')} label="Pricing Plans" />
              <ElementButton onClick={() => addElement('stats')} label="Statistics" />
              <ElementButton onClick={() => addElement('cta')} label="Call to Action" />
              <ElementButton onClick={() => addElement('faq')} label="FAQ" />
              <ElementButton onClick={() => addElement('contact')} label="Contact Info" />
              <ElementButton onClick={() => addElement('logogrid')} label="Logo Grid" />
              <ElementButton onClick={() => addElement('video')} label="Video" />
              <ElementButton onClick={() => addElement('buttons')} label="Button Group" />
              <ElementButton onClick={() => addElement('divider')} label="Divider" />
              <ElementButton onClick={() => addElement('footer')} label="Footer" />
            </div>
          </div>
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 p-8 overflow-y-auto bg-gray-100">
          {/* Canvas wrapper with theme applied */}
          <div className={`max-w-6xl mx-auto ${currentTheme.bg} border ${currentTheme.border} min-h-screen shadow-sm`}>
            {state.layout.length === 0 ? (
              <div className={`flex items-center justify-center h-96 ${currentTheme.muted}`}>
                <div className="text-center">
                  <p className="text-base font-medium mb-1">Empty Canvas</p>
                  <p className="text-sm">Add sections from the element library</p>
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
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </main>

        {/* Right Sidebar - Inspector (Sticky) */}
        <aside className="w-80 bg-white border-l border-gray-300 overflow-y-auto sticky top-0 h-screen">
          <div className="p-4">
            <h2 className="text-xs font-bold mb-3 uppercase tracking-wide text-gray-600">Edit Section</h2>
            {selectedSection ? (
              <Inspector
                section={selectedSection}
                onUpdate={(newData) => updateElement(selectedSection.id, newData)}
                onRemove={() => removeElement(selectedSection.id)}
              />
            ) : (
              <div className="text-center text-gray-400 mt-16">
                <p className="text-sm font-medium">No section selected</p>
                <p className="text-xs mt-1">Click a section to edit</p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Bottom Panel - JSON Output */}
      <footer className="bg-white border-t border-gray-300 p-3">
        <details>
          <summary className="text-xs font-bold uppercase tracking-wide text-gray-600 cursor-pointer">
            JSON Schema ({state.layout.length} sections)
          </summary>
          <pre className="bg-gray-50 border border-gray-200 p-2 mt-2 overflow-x-auto text-xs font-mono max-h-32 overflow-y-auto rounded">
            {JSON.stringify({ theme: state.theme, layout: state.layout }, null, 2)}
          </pre>
        </details>
      </footer>
    </div>
  );
}

// Element Button
function ElementButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="w-full px-3 py-2 text-left text-xs font-medium border border-gray-300 rounded hover:bg-gray-50 transition"
    >
      + {label}
    </button>
  );
}

// Sortable Section Wrapper
function SortableSection({ element, isSelected, onSelect, theme }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sectionLabels = {
    navbar: 'NAVIGATION',
    hero: 'HERO',
    richtext: 'TEXT WITH HEADING',
    text: 'TEXT',
    image: 'IMAGE',
    cards: 'CARDS',
    features: 'FEATURES',
    testimonials: 'TESTIMONIALS',
    pricing: 'PRICING',
    stats: 'STATISTICS',
    cta: 'CALL TO ACTION',
    faq: 'FAQ',
    contact: 'CONTACT',
    logogrid: 'LOGO GRID',
    video: 'VIDEO',
    buttons: 'BUTTONS',
    divider: 'DIVIDER',
    footer: 'FOOTER'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group border-b ${theme.border} cursor-pointer ${isSelected ? 'ring-4 ring-black ring-inset' : ''}`}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-2 cursor-move opacity-0 group-hover:opacity-100 transition bg-gray-200 border border-gray-400 px-1.5 py-0.5 text-xs font-mono z-10 rounded"
      >
        ⋮⋮
      </div>

      {/* Section Label */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-black text-white px-2 py-0.5 text-xs font-bold z-10 rounded">
          {sectionLabels[element.type]}
        </div>
      )}

      {/* Render Section */}
      <SectionRenderer type={element.type} data={element.data} theme={theme} />
    </div>
  );
}

// Section Renderer
function SectionRenderer({ type, data, theme }) {
  const components = {
    navbar: NavbarSection,
    hero: HeroSection,
    richtext: RichTextSection,
    text: TextSection,
    image: ImageSection,
    cards: CardsSection,
    features: FeaturesSection,
    testimonials: TestimonialsSection,
    pricing: PricingSection,
    stats: StatsSection,
    cta: CTASection,
    faq: FAQSection,
    contact: ContactSection,
    logogrid: LogoGridSection,
    video: VideoSection,
    buttons: ButtonsSection,
    divider: DividerSection,
    footer: FooterSection
  };

  const Component = components[type];
  return Component ? <Component data={data} theme={theme} /> : null;
}

// Inspector Panel
function Inspector({ section, onUpdate, onRemove }) {
  const { type, data } = section;

  const sectionInfo = {
    navbar: { title: 'Navigation Bar', desc: 'Top navigation menu' },
    hero: { title: 'Hero Section', desc: 'Main header area' },
    richtext: { title: 'Text with Heading', desc: 'Heading and paragraph' },
    text: { title: 'Text', desc: 'Simple text paragraph' },
    image: { title: 'Image', desc: 'Image display' },
    cards: { title: 'Cards', desc: 'Card grid layout' },
    features: { title: 'Features', desc: 'Feature highlights' },
    testimonials: { title: 'Testimonials', desc: 'Customer reviews' },
    pricing: { title: 'Pricing Plans', desc: 'Pricing table' },
    stats: { title: 'Statistics', desc: 'Number highlights' },
    cta: { title: 'Call to Action', desc: 'Action prompt' },
    faq: { title: 'FAQ', desc: 'Questions and answers' },
    contact: { title: 'Contact Info', desc: 'Contact details' },
    logogrid: { title: 'Logo Grid', desc: 'Client/partner logos' },
    video: { title: 'Video', desc: 'Embedded video player' },
    buttons: { title: 'Button Group', desc: 'Multiple action buttons' },
    divider: { title: 'Divider', desc: 'Visual separator' },
    footer: { title: 'Footer', desc: 'Bottom section' }
  };

  const info = sectionInfo[type] || { title: 'Section', desc: '' };

  return (
    <div className="space-y-4">
      <div className="pb-3 border-b border-gray-200">
        <h3 className="font-semibold text-sm">{info.title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{info.desc}</p>
      </div>

      {/* Navbar Inspector */}
      {type === 'navbar' && (
        <>
          <ControlGroup label="Content">
            <Input label="Logo Text" value={data.logo} onChange={(v) => onUpdate({ ...data, logo: v })} />
            <Textarea
              label="Links (comma-separated)"
              value={data.links.join(', ')}
              onChange={(v) => onUpdate({ ...data, links: v.split(',').map(l => l.trim()).filter(l => l) })}
              rows={2}
            />
          </ControlGroup>
          <ControlGroup label="Layout">
            <Select label="Alignment" value={data.align} onChange={(v) => onUpdate({ ...data, align: v })} options={['left', 'center', 'right']} />
          </ControlGroup>
          <ControlGroup label="Behavior">
            <Toggle label="Sticky Navbar" checked={data.sticky} onChange={(v) => onUpdate({ ...data, sticky: v })} />
          </ControlGroup>
        </>
      )}

      {/* Hero Inspector */}
      {type === 'hero' && (
        <>
          <ControlGroup label="Content">
            <Input label="Heading" value={data.heading} onChange={(v) => onUpdate({ ...data, heading: v })} />
            <Textarea label="Subheading" value={data.subheading} onChange={(v) => onUpdate({ ...data, subheading: v })} rows={2} />
            <Input label="Button Text" value={data.button} onChange={(v) => onUpdate({ ...data, button: v })} />
          </ControlGroup>
          <ControlGroup label="Layout">
            <Select label="Alignment" value={data.align} onChange={(v) => onUpdate({ ...data, align: v })} options={['left', 'center']} />
            <Select label="Min Height" value={data.minHeight} onChange={(v) => onUpdate({ ...data, minHeight: v })} options={['auto', 'screen']} />
          </ControlGroup>
        </>
      )}

      {/* Rich Text Inspector */}
      {type === 'richtext' && (
        <>
          <ControlGroup label="Content">
            <Input label="Heading" value={data.heading} onChange={(v) => onUpdate({ ...data, heading: v })} />
            <Textarea label="Body Text" value={data.body} onChange={(v) => onUpdate({ ...data, body: v })} rows={4} />
          </ControlGroup>
          <ControlGroup label="Layout">
            <Select label="Width" value={data.width} onChange={(v) => onUpdate({ ...data, width: v })} options={['narrow', 'normal', 'full']} />
            <Select label="Alignment" value={data.align} onChange={(v) => onUpdate({ ...data, align: v })} options={['left', 'center']} />
          </ControlGroup>
        </>
      )}

      {/* Text Inspector */}
      {type === 'text' && (
        <>
          <ControlGroup label="Content">
            <Textarea label="Text Content" value={data.content} onChange={(v) => onUpdate({ ...data, content: v })} rows={4} />
          </ControlGroup>
          <ControlGroup label="Layout">
            <Select label="Font Size" value={data.fontSize} onChange={(v) => onUpdate({ ...data, fontSize: v })} options={['sm', 'base', 'lg']} />
            <Select label="Width" value={data.width} onChange={(v) => onUpdate({ ...data, width: v })} options={['narrow', 'normal', 'full']} />
            <Select label="Alignment" value={data.align} onChange={(v) => onUpdate({ ...data, align: v })} options={['left', 'center']} />
          </ControlGroup>
        </>
      )}

      {/* Image Inspector */}
      {type === 'image' && (
        <>
          <ControlGroup label="Content">
            <Slider label={`Height: ${data.height}px`} value={data.height} onChange={(v) => onUpdate({ ...data, height: v })} min={100} max={600} />
            <Input label="Caption" value={data.caption} onChange={(v) => onUpdate({ ...data, caption: v })} />
          </ControlGroup>
          <ControlGroup label="Layout">
            <Toggle label="Full Width" checked={data.fullWidth} onChange={(v) => onUpdate({ ...data, fullWidth: v })} />
          </ControlGroup>
        </>
      )}

      {/* Cards Inspector */}
      {type === 'cards' && (
        <>
          <ControlGroup label="Content">
            <Select label="Number of Cards" value={data.count} onChange={(v) => {
              const newCount = parseInt(v);
              const newTitles = [...data.titles];
              const newDescriptions = [...data.descriptions];
              const newImageUrls = [...(data.imageUrls || [])];
              while (newTitles.length < newCount) {
                newTitles.push(`Card ${newTitles.length + 1}`);
                newDescriptions.push(`Description for card ${newDescriptions.length + 1}`);
                newImageUrls.push('https://via.placeholder.com/300');
              }
              onUpdate({ ...data, count: newCount, titles: newTitles.slice(0, newCount), descriptions: newDescriptions.slice(0, newCount), imageUrls: newImageUrls.slice(0, newCount) });
            }} options={[1, 2, 3, 4, 5, 6]} />
            {data.titles.slice(0, data.count).map((title, idx) => (
              <div key={idx} className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                <Input
                  label={`Card ${idx + 1} Title`}
                  value={title}
                  onChange={(v) => {
                    const newTitles = [...data.titles];
                    newTitles[idx] = v;
                    onUpdate({ ...data, titles: newTitles });
                  }}
                />
                <Textarea
                  label="Description"
                  value={data.descriptions[idx] || ''}
                  onChange={(v) => {
                    const newDescriptions = [...data.descriptions];
                    newDescriptions[idx] = v;
                    onUpdate({ ...data, descriptions: newDescriptions });
                  }}
                  rows={2}
                />
                <Input
                  label="Image URL"
                  value={(data.imageUrls && data.imageUrls[idx]) || ''}
                  onChange={(v) => {
                    const newImageUrls = [...(data.imageUrls || [])];
                    newImageUrls[idx] = v;
                    onUpdate({ ...data, imageUrls: newImageUrls });
                  }}
                />
              </div>
            ))}
          </ControlGroup>
          <ControlGroup label="Layout">
            <Select label="Layout Style" value={data.layout} onChange={(v) => onUpdate({ ...data, layout: v })} options={['grid', 'horizontal']} />
          </ControlGroup>
        </>
      )}

      {/* Features Inspector */}
      {type === 'features' && (
        <>
          <ControlGroup label="Content">
            {data.items.map((item, idx) => (
              <div key={idx} className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                <Input
                  label={`Feature ${idx + 1} Title`}
                  value={item.title}
                  onChange={(v) => {
                    const newItems = [...data.items];
                    newItems[idx] = { ...item, title: v };
                    onUpdate({ ...data, items: newItems });
                  }}
                />
                <Textarea
                  label="Description"
                  value={item.description}
                  onChange={(v) => {
                    const newItems = [...data.items];
                    newItems[idx] = { ...item, description: v };
                    onUpdate({ ...data, items: newItems });
                  }}
                  rows={2}
                />
              </div>
            ))}
          </ControlGroup>
          <ControlGroup label="Layout">
            <Select label="Columns" value={data.columns} onChange={(v) => onUpdate({ ...data, columns: parseInt(v) })} options={[1, 2, 3]} />
          </ControlGroup>
        </>
      )}

      {/* Stats Inspector */}
      {type === 'stats' && (
        <>
          <ControlGroup label="Content">
            {data.stats.map((stat, idx) => (
              <div key={idx} className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                <Input
                  label={`Stat ${idx + 1} Label`}
                  value={stat.label}
                  onChange={(v) => {
                    const newStats = [...data.stats];
                    newStats[idx] = { ...stat, label: v };
                    onUpdate({ ...data, stats: newStats });
                  }}
                />
                <Input
                  label="Value"
                  value={stat.value}
                  onChange={(v) => {
                    const newStats = [...data.stats];
                    newStats[idx] = { ...stat, value: v };
                    onUpdate({ ...data, stats: newStats });
                  }}
                />
              </div>
            ))}
          </ControlGroup>
          <ControlGroup label="Layout">
            <Select label="Layout Style" value={data.layout} onChange={(v) => onUpdate({ ...data, layout: v })} options={['horizontal', 'grid']} />
          </ControlGroup>
        </>
      )}

      {/* CTA Inspector */}
      {type === 'cta' && (
        <>
          <ControlGroup label="Content">
            <Input label="Heading" value={data.heading} onChange={(v) => onUpdate({ ...data, heading: v })} />
            <Textarea label="Supporting Text" value={data.supportingText} onChange={(v) => onUpdate({ ...data, supportingText: v })} rows={2} />
            <Input label="Button Text" value={data.button} onChange={(v) => onUpdate({ ...data, button: v })} />
          </ControlGroup>
          <ControlGroup label="Layout">
            <Select label="Alignment" value={data.align} onChange={(v) => onUpdate({ ...data, align: v })} options={['left', 'center']} />
          </ControlGroup>
        </>
      )

      }

      {/* Testimonials Inspector */}
      {type === 'testimonials' && (
        <>
          <ControlGroup label="Content">
            {data.items.map((item, idx) => (
              <div key={idx} className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                <Input
                  label={`Person ${idx + 1} Name`}
                  value={item.name}
                  onChange={(v) => {
                    const newItems = [...data.items];
                    newItems[idx] = { ...item, name: v };
                    onUpdate({ ...data, items: newItems });
                  }}
                />
                <Input
                  label="Role/Title"
                  value={item.role}
                  onChange={(v) => {
                    const newItems = [...data.items];
                    newItems[idx] = { ...item, role: v };
                    onUpdate({ ...data, items: newItems });
                  }}
                />
                <Textarea
                  label="Quote"
                  value={item.quote}
                  onChange={(v) => {
                    const newItems = [...data.items];
                    newItems[idx] = { ...item, quote: v };
                    onUpdate({ ...data, items: newItems });
                  }}
                  rows={2}
                />
                <Input
                  label="Image URL"
                  value={item.imageUrl}
                  onChange={(v) => {
                    const newItems = [...data.items];
                    newItems[idx] = { ...item, imageUrl: v };
                    onUpdate({ ...data, items: newItems });
                  }}
                />
              </div>
            ))}
          </ControlGroup>
        </>
      )}

      {/* Pricing Inspector */}
      {type === 'pricing' && (
        <>
          <ControlGroup label="Content">
            {data.plans.map((plan, idx) => (
              <div key={idx} className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                <Input
                  label={`Plan ${idx + 1} Name`}
                  value={plan.name}
                  onChange={(v) => {
                    const newPlans = [...data.plans];
                    newPlans[idx] = { ...plan, name: v };
                    onUpdate({ ...data, plans: newPlans });
                  }}
                />
                <Input
                  label="Price"
                  value={plan.price}
                  onChange={(v) => {
                    const newPlans = [...data.plans];
                    newPlans[idx] = { ...plan, price: v };
                    onUpdate({ ...data, plans: newPlans });
                  }}
                />
                <Textarea
                  label="Features (comma-separated)"
                  value={plan.features.join(', ')}
                  onChange={(v) => {
                    const newPlans = [...data.plans];
                    newPlans[idx] = { ...plan, features: v.split(',').map(f => f.trim()).filter(f => f) };
                    onUpdate({ ...data, plans: newPlans });
                  }}
                  rows={2}
                />
                <Toggle
                  label="Highlight This Plan"
                  checked={plan.highlighted}
                  onChange={(v) => {
                    const newPlans = [...data.plans];
                    newPlans[idx] = { ...plan, highlighted: v };
                    onUpdate({ ...data, plans: newPlans });
                  }}
                />
              </div>
            ))}
          </ControlGroup>
        </>
      )}

      {/* Contact Inspector */}
      {type === 'contact' && (
        <>
          <ControlGroup label="Content">
            <Input label="Heading" value={data.heading} onChange={(v) => onUpdate({ ...data, heading: v })} />
            <Input label="Email" value={data.email} onChange={(v) => onUpdate({ ...data, email: v })} />
            <Input label="Phone" value={data.phone} onChange={(v) => onUpdate({ ...data, phone: v })} />
            <Input label="Address" value={data.address} onChange={(v) => onUpdate({ ...data, address: v })} />
          </ControlGroup>
        </>
      )}

      {/* Logo Grid Inspector */}
      {type === 'logogrid' && (
        <>
          <ControlGroup label="Content">
            {data.logos.map((logo, idx) => (
              <Input
                key={idx}
                label={`Logo ${idx + 1} URL`}
                value={logo}
                onChange={(v) => {
                  const newLogos = [...data.logos];
                  newLogos[idx] = v;
                  onUpdate({ ...data, logos: newLogos });
                }}
              />
            ))}
          </ControlGroup>
          <ControlGroup label="Layout">
            <Select label="Columns" value={data.columns} onChange={(v) => onUpdate({ ...data, columns: parseInt(v) })} options={[2, 3, 4, 5, 6]} />
          </ControlGroup>
        </>
      )}

      {/* Video Inspector */}
      {type === 'video' && (
        <>
          <ControlGroup label="Content">
            <Input label="Heading" value={data.heading} onChange={(v) => onUpdate({ ...data, heading: v })} />
            <Input label="Video URL (YouTube/Vimeo embed)" value={data.videoUrl} onChange={(v) => onUpdate({ ...data, videoUrl: v })} />
          </ControlGroup>
        </>
      )}

      {/* Button Group Inspector */}
      {type === 'buttons' && (
        <>
          <ControlGroup label="Content">
            {data.buttons.map((button, idx) => (
              <Input
                key={idx}
                label={`Button ${idx + 1} Text`}
                value={button.label}
                onChange={(v) => {
                  const newButtons = [...data.buttons];
                  newButtons[idx] = { ...button, label: v };
                  onUpdate({ ...data, buttons: newButtons });
                }}
              />
            ))}
          </ControlGroup>
          <ControlGroup label="Layout">
            <Select label="Alignment" value={data.align} onChange={(v) => onUpdate({ ...data, align: v })} options={['left', 'center', 'right']} />
          </ControlGroup>
        </>
      )}

      {/* FAQ Inspector */}
      {type === 'faq' && (


        <>
          <ControlGroup label="Content">
            {data.items.map((item, idx) => (
              <div key={idx} className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                <Input
                  label={`Question ${idx + 1}`}
                  value={item.question}
                  onChange={(v) => {
                    const newItems = [...data.items];
                    newItems[idx] = { ...item, question: v };
                    onUpdate({ ...data, items: newItems });
                  }}
                />
                <Textarea
                  label="Answer"
                  value={item.answer}
                  onChange={(v) => {
                    const newItems = [...data.items];
                    newItems[idx] = { ...item, answer: v };
                    onUpdate({ ...data, items: newItems });
                  }}
                  rows={2}
                />
              </div>
            ))}
          </ControlGroup>
        </>
      )}

      {/* Divider Inspector */}
      {type === 'divider' && (
        <>
          <ControlGroup label="Layout">
            <Select label="Height" value={data.height} onChange={(v) => onUpdate({ ...data, height: v })} options={['xs', 'sm', 'md', 'lg']} />
            <Toggle label="Show Line" checked={data.showLine} onChange={(v) => onUpdate({ ...data, showLine: v })} />
          </ControlGroup>
        </>
      )}

      {/* Footer Inspector */}
      {type === 'footer' && (
        <>
          <ControlGroup label="Content">
            <Input label="Text" value={data.text} onChange={(v) => onUpdate({ ...data, text: v })} />
          </ControlGroup>
          <ControlGroup label="Layout">
            <Select label="Columns" value={data.columns} onChange={(v) => onUpdate({ ...data, columns: parseInt(v) })} options={[1, 2, 3]} />
            <Select label="Alignment" value={data.align} onChange={(v) => onUpdate({ ...data, align: v })} options={['left', 'center', 'right']} />
          </ControlGroup>
        </>
      )}

      {/* Delete Button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={onRemove}
          className="w-full px-3 py-2 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded hover:bg-red-100 transition"
        >
          Delete Section
        </button>
      </div>
    </div>
  );
}

// Inspector Control Components
function ControlGroup({ label, children }) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{label}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 3 }) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-black resize-none"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-black"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-xs cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded focus:ring-2 focus:ring-black"
      />
      <span className="font-medium">{label}</span>
    </label>
  );
}

function Slider({ label, value, onChange, min, max }) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

// Section Components (View-Only - Render from state)
function NavbarSection({ data, theme }) {
  const alignClass = data.align === 'left' ? 'justify-start' : data.align === 'center' ? 'justify-center' : 'justify-end';

  return (
    <div className={`px-6 py-4 ${data.sticky ? theme.secondary : ''}`}>
      <div className="flex justify-between items-center">
        <div className={`font-bold text-base ${theme.text}`}>{data.logo}</div>
        <nav className={`flex gap-6 ${alignClass}`}>
          {data.links.map((link, idx) => (
            <span key={idx} className={`text-sm ${theme.text}`}>{link}</span>
          ))}
        </nav>
      </div>
    </div>
  );
}

function HeroSection({ data, theme }) {
  const alignClass = data.align === 'left' ? 'text-left' : 'text-center';
  const heightClass = data.minHeight === 'screen' ? 'min-h-screen flex items-center' : '';

  return (
    <div className={`p-16 ${alignClass} ${heightClass}`}>
      <div className={`max-w-3xl ${data.align === 'center' ? 'mx-auto' : ''}`}>
        <h1 className={`text-4xl font-bold mb-4 ${theme.text}`}>{data.heading}</h1>
        <p className={`text-lg mb-6 ${theme.muted}`}>{data.subheading}</p>
        <button className={`px-6 py-3 font-semibold ${theme.accent}`}>{data.button}</button>
      </div>
    </div>
  );
}

function RichTextSection({ data, theme }) {
  const widthClass = data.width === 'narrow' ? 'max-w-2xl' : data.width === 'full' ? 'max-w-full' : 'max-w-4xl';
  const alignClass = data.align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className="p-8">
      <div className={`${widthClass} mx-auto ${alignClass}`}>
        <h2 className={`text-2xl font-bold mb-4 ${theme.text}`}>{data.heading}</h2>
        <p className={`text-base leading-relaxed ${theme.text}`}>{data.body}</p>
      </div>
    </div>
  );
}

function TextSection({ data, theme }) {
  const widthClass = data.width === 'narrow' ? 'max-w-2xl' : data.width === 'full' ? 'max-w-full' : 'max-w-4xl';
  const alignClass = data.align === 'center' ? 'text-center' : 'text-left';
  const sizeClass = data.fontSize === 'sm' ? 'text-sm' : data.fontSize === 'lg' ? 'text-lg' : 'text-base';

  return (
    <div className="p-8">
      <div className={`${widthClass} mx-auto ${alignClass}`}>
        <p className={`${sizeClass} leading-relaxed ${theme.text}`}>{data.content}</p>
      </div>
    </div>
  );
}

function ImageSection({ data, theme }) {
  const widthClass = data.fullWidth ? 'w-full' : 'max-w-4xl mx-auto';

  return (
    <div className="p-8">
      <div className={widthClass}>
        <div className={`${theme.secondary} flex items-center justify-center border ${theme.border}`} style={{ height: `${data.height}px` }}>
          <span className={`font-semibold ${theme.muted}`}>IMAGE</span>
        </div>
        {data.caption && (
          <p className={`text-sm mt-2 text-center italic ${theme.muted}`}>{data.caption}</p>
        )}
      </div>
    </div>
  );
}

function CardsSection({ data, theme }) {
  const layoutClass = data.layout === 'grid' ?
    `grid gap-4 ${data.count <= 2 ? 'grid-cols-2' : data.count === 3 ? 'grid-cols-3' : 'grid-cols-4'}` :
    'flex gap-4 overflow-x-auto';

  return (
    <div className="p-8">
      <div className={`max-w-6xl mx-auto ${layoutClass}`}>
        {Array.from({ length: data.count }).map((_, idx) => (
          <div key={idx} className={`border ${theme.border} p-4 min-w-[200px]`}>
            {data.imageUrls && data.imageUrls[idx] ? (
              <img src={data.imageUrls[idx]} alt={data.titles[idx]} className="w-full h-32 object-cover mb-3" />
            ) : (
              <div className={`w-full h-32 ${theme.secondary} mb-3 flex items-center justify-center`}>
                <span className={`text-xs ${theme.muted}`}>IMAGE</span>
              </div>
            )}
            <h4 className={`font-semibold mb-2 ${theme.text}`}>{data.titles[idx] || `Card ${idx + 1}`}</h4>
            <p className={`text-sm ${theme.muted}`}>{data.descriptions[idx] || 'Description'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialsSection({ data, theme }) {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 gap-6">
        {data.items.map((item, idx) => (
          <div key={idx} className={`border ${theme.border} p-6 rounded`}>
            <p className={`italic text-lg mb-4 ${theme.text}`}>"{item.quote}"</p>
            <div className="flex items-center gap-3">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className={`w-12 h-12 rounded-full ${theme.secondary} flex items-center justify-center`}>
                  <span className={`text-xs ${theme.muted}`}>IMG</span>
                </div>
              )}
              <div>
                <p className={`font-semibold ${theme.text}`}>{item.name}</p>
                <p className={`text-xs ${theme.muted}`}>{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingSection({ data, theme }) {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6">
        {data.plans.map((plan, idx) => (
          <div key={idx} className={`border-2 ${plan.highlighted ? 'border-black' : theme.border} p-6 rounded ${plan.highlighted ? theme.secondary : ''}`}>
            <h3 className={`text-xl font-bold mb-2 ${theme.text}`}>{plan.name}</h3>
            <p className={`text-3xl font-bold mb-4 ${theme.text}`}>{plan.price}</p>
            <ul className="space-y-2">
              {plan.features.map((feature, fIdx) => (
                <li key={fIdx} className={`text-sm ${theme.text}`}>✓ {feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactSection({ data, theme }) {
  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className={`text-2xl font-bold mb-6 ${theme.text}`}>{data.heading}</h2>
        <div className="space-y-3">
          <p className={theme.text}>📧 {data.email}</p>
          <p className={theme.text}>📞 {data.phone}</p>
          <p className={theme.text}>📍 {data.address}</p>
        </div>
      </div>
    </div>
  );
}

function LogoGridSection({ data, theme }) {
  return (
    <div className="p-8">
      <div className={`max-w-5xl mx-auto grid gap-6 grid-cols-${data.columns}`}>
        {data.logos.map((logo, idx) => (
          <img
            key={idx}
            src={logo}
            alt="Logo"
            className="mx-auto max-h-12 object-contain opacity-80"
          />
        ))}
      </div>
    </div>
  );
}

function VideoSection({ data, theme }) {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h3 className={`text-xl font-bold mb-4 ${theme.text}`}>{data.heading}</h3>
        <div className="aspect-video border">
          <iframe
            src={data.videoUrl}
            className="w-full h-full"
            allowFullScreen
            title="Video player"
          />
        </div>
      </div>
    </div>
  );
}

function ButtonsSection({ data, theme }) {
  const alignClass = data.align === 'left' ? 'justify-start' : data.align === 'right' ? 'justify-end' : 'justify-center';

  return (
    <div className="p-8">
      <div className={`max-w-4xl mx-auto flex gap-4 ${alignClass}`}>
        {data.buttons.map((button, idx) => (
          <button key={idx} className={`px-6 py-3 font-semibold ${theme.accent}`}>
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FeaturesSection({ data, theme }) {


  const colClass = data.columns === 1 ? 'grid-cols-1' : data.columns === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className={`grid ${colClass} gap-6`}>
          {data.items.map((item, idx) => (
            <div key={idx}>
              <h4 className={`font-semibold mb-2 ${theme.text}`}>{item.title}</h4>
              <p className={`text-sm ${theme.muted}`}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatsSection({ data, theme }) {
  const layoutClass = data.layout === 'horizontal' ? 'flex justify-around' : `grid grid-cols-${Math.min(data.stats.length, 4)} gap-6`;

  return (
    <div className={`p-8 ${theme.secondary}`}>
      <div className={`max-w-5xl mx-auto ${layoutClass}`}>
        {data.stats.map((stat, idx) => (
          <div key={idx} className="text-center">
            <p className={`text-3xl font-bold mb-1 ${theme.text}`}>{stat.value}</p>
            <p className={`text-sm ${theme.muted}`}>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CTASection({ data, theme }) {
  const alignClass = data.align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={`p-12 ${theme.secondary} ${alignClass}`}>
      <div className="max-w-2xl mx-auto">
        <h2 className={`text-3xl font-bold mb-3 ${theme.text}`}>{data.heading}</h2>
        <p className={`text-lg mb-6 ${theme.muted}`}>{data.supportingText}</p>
        <button className={`px-8 py-3 font-semibold ${theme.accent}`}>{data.button}</button>
      </div>
    </div>
  );
}

function FAQSection({ data, theme }) {
  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto space-y-4">
        {data.items.map((item, idx) => (
          <div key={idx} className={`border ${theme.border} p-4 rounded`}>
            <h4 className={`font-semibold mb-2 ${theme.text}`}>{item.question}</h4>
            <p className={`text-sm ${theme.muted}`}>{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DividerSection({ data, theme }) {
  const heightMap = { xs: 'h-4', sm: 'h-8', md: 'h-16', lg: 'h-24' };
  const heightClass = heightMap[data.height] || 'h-16';

  return (
    <div className={`${heightClass} flex items-center justify-center`}>
      {data.showLine && <div className={`w-full max-w-4xl border-t ${theme.border}`}></div>}
    </div>
  );
}

function FooterSection({ data, theme }) {
  const alignClass = data.align === 'left' ? 'text-left' : data.align === 'right' ? 'text-right' : 'text-center';
  const colClass = data.columns === 1 ? 'grid-cols-1' : data.columns === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className={`p-6 ${theme.secondary} ${alignClass}`}>
      <div className={`grid ${colClass} gap-4 max-w-4xl mx-auto`}>
        <p className={`text-sm ${theme.muted}`}>{data.text}</p>
      </div>
    </div>
  );
}

export default App;
