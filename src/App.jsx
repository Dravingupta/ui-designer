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

function App() {
  const [state, setState] = useState({
    selectedSectionId: null,
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
        sticky: false,
        height: 'normal'
      },
      hero: {
        heading: 'Welcome to Our Website',
        subheading: 'Build amazing experiences with our platform',
        button: 'Get Started',
        align: 'center',
        width: 'normal',
        minHeight: 'auto'
      },
      text: {
        content: 'This is a text block. Add your paragraph content here to communicate your message effectively.',
        fontSize: 'base',
        width: 'normal',
        align: 'left'
      },
      image: {
        height: 300,
        aspectRatio: '16:9',
        caption: 'Image caption',
        fullWidth: false
      },
      cards: {
        count: 3,
        layout: 'grid',
        columns: 'auto',
        align: 'top'
      },
      features: {
        items: ['Feature one', 'Feature two', 'Feature three'],
        columns: 3,
        showIcons: true
      },
      cta: {
        heading: 'Ready to get started?',
        supportingText: 'Join thousands of satisfied customers today',
        button: 'Sign Up Now',
        align: 'center',
        emphasis: 'normal'
      },
      pricing: {
        planCount: 3,
        plans: [
          { title: 'Basic', price: '$9/mo', features: ['Feature 1', 'Feature 2'], highlighted: false },
          { title: 'Pro', price: '$29/mo', features: ['Feature 1', 'Feature 2', 'Feature 3'], highlighted: true },
          { title: 'Enterprise', price: '$99/mo', features: ['All features', 'Priority support'], highlighted: false }
        ]
      },
      testimonials: {
        count: 3,
        testimonials: [
          { name: 'John Doe', role: 'CEO, Company', quote: 'This product changed everything for us.' },
          { name: 'Jane Smith', role: 'Designer', quote: 'Absolutely love the simplicity and power.' },
          { name: 'Mike Johnson', role: 'Developer', quote: 'Best tool I\'ve used in years.' }
        ],
        layout: 'grid'
      },
      stats: {
        count: 4,
        stats: [
          { label: 'Users', value: '10K+' },
          { label: 'Projects', value: '500+' },
          { label: 'Countries', value: '50+' },
          { label: 'Uptime', value: '99.9%' }
        ],
        layout: 'horizontal'
      },
      divider: {
        height: 'md',
        showLine: true
      },
      footer: {
        text: '© 2025 Your Company. All rights reserved.',
        columns: 1,
        align: 'center',
        showCopyright: true
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
    setState(prev => ({
      ...prev,
      selectedSectionId: id
    }));
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 px-6 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">Wireframe Builder</h1>
        <div className="text-xs text-gray-500">{state.layout.length} sections</div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Element Library */}
        <aside className="w-60 bg-white border-r border-gray-300 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xs font-bold mb-3 uppercase tracking-wide text-gray-600">Element Library</h2>
            <div className="space-y-1">
              <ElementButton onClick={() => addElement('navbar')} label="Navbar" />
              <ElementButton onClick={() => addElement('hero')} label="Hero Section" />
              <ElementButton onClick={() => addElement('text')} label="Text Block" />
              <ElementButton onClick={() => addElement('image')} label="Image Section" />
              <ElementButton onClick={() => addElement('cards')} label="Cards Section" />
              <ElementButton onClick={() => addElement('features')} label="Features Section" />
              <ElementButton onClick={() => addElement('cta')} label="CTA Section" />
              <ElementButton onClick={() => addElement('pricing')} label="Pricing Section" />
              <ElementButton onClick={() => addElement('testimonials')} label="Testimonials" />
              <ElementButton onClick={() => addElement('stats')} label="Stats Section" />
              <ElementButton onClick={() => addElement('divider')} label="Divider / Spacer" />
              <ElementButton onClick={() => addElement('footer')} label="Footer" />
            </div>
          </div>
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 p-8 overflow-y-auto bg-gray-100">
          <div className="max-w-6xl mx-auto bg-white border border-gray-300 min-h-screen shadow-sm">
            {state.layout.length === 0 ? (
              <div className="flex items-center justify-center h-96 text-gray-400">
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
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </main>

        {/* Right Sidebar - Inspector */}
        <aside className="w-80 bg-white border-l border-gray-300 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xs font-bold mb-3 uppercase tracking-wide text-gray-600">Inspector</h2>
            {selectedSection ? (
              <Inspector
                section={selectedSection}
                onUpdate={(newData) => updateElement(selectedSection.id, newData)}
                onRemove={() => removeElement(selectedSection.id)}
              />
            ) : (
              <div className="text-center text-gray-400 mt-16">
                <p className="text-sm font-medium">No section selected</p>
                <p className="text-xs mt-1">Click a section to edit its properties</p>
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
            {JSON.stringify({ layout: state.layout }, null, 2)}
          </pre>
        </details>
      </footer>
    </div>
  );
}

// Element Button Component
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
function SortableSection({ element, isSelected, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sectionLabels = {
    navbar: 'NAVBAR',
    hero: 'HERO SECTION',
    text: 'TEXT BLOCK',
    image: 'IMAGE SECTION',
    cards: 'CARDS SECTION',
    features: 'FEATURES SECTION',
    cta: 'CTA SECTION',
    pricing: 'PRICING SECTION',
    testimonials: 'TESTIMONIALS',
    stats: 'STATS SECTION',
    divider: 'DIVIDER',
    footer: 'FOOTER'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group border-b border-gray-200 cursor-pointer ${isSelected ? 'ring-4 ring-black ring-inset' : ''}`}
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
      <SectionRenderer type={element.type} data={element.data} />
    </div>
  );
}

// Section Renderer
function SectionRenderer({ type, data }) {
  const components = {
    navbar: NavbarSection,
    hero: HeroSection,
    text: TextSection,
    image: ImageSection,
    cards: CardsSection,
    features: FeaturesSection,
    cta: CTASection,
    pricing: PricingSection,
    testimonials: TestimonialsSection,
    stats: StatsSection,
    divider: DividerSection,
    footer: FooterSection
  };

  const Component = components[type];
  return Component ? <Component data={data} /> : null;
}

// Inspector Panel
function Inspector({ section, onUpdate, onRemove }) {
  const { type, data } = section;

  const sectionInfo = {
    navbar: { title: 'Navbar', desc: 'Top navigation bar' },
    hero: { title: 'Hero Section', desc: 'Large introductory section' },
    text: { title: 'Text Block', desc: 'Paragraph content' },
    image: { title: 'Image Section', desc: 'Image placeholder' },
    cards: { title: 'Cards Section', desc: 'Grid of cards' },
    features: { title: 'Features Section', desc: 'Feature list' },
    cta: { title: 'CTA Section', desc: 'Call-to-action' },
    pricing: { title: 'Pricing Section', desc: 'Pricing plans' },
    testimonials: { title: 'Testimonials', desc: 'Customer testimonials' },
    stats: { title: 'Stats Section', desc: 'Statistics display' },
    divider: { title: 'Divider', desc: 'Spacing element' },
    footer: { title: 'Footer', desc: 'Bottom page section' }
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
            <Select label="Height" value={data.height} onChange={(v) => onUpdate({ ...data, height: v })} options={['compact', 'normal', 'tall']} />
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
            <Select label="Content Width" value={data.width} onChange={(v) => onUpdate({ ...data, width: v })} options={['narrow', 'normal', 'wide']} />
            <Select label="Min Height" value={data.minHeight} onChange={(v) => onUpdate({ ...data, minHeight: v })} options={['auto', 'screen']} />
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
            <Select label="Aspect Ratio" value={data.aspectRatio} onChange={(v) => onUpdate({ ...data, aspectRatio: v })} options={['16:9', '4:3', 'square']} />
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
            <Select label="Card Count" value={data.count} onChange={(v) => onUpdate({ ...data, count: parseInt(v) })} options={[1, 2, 3, 4, 5, 6]} />
          </ControlGroup>
          <ControlGroup label="Layout">
            <Select label="Layout Style" value={data.layout} onChange={(v) => onUpdate({ ...data, layout: v })} options={['grid', 'horizontal']} />
            <Select label="Columns" value={data.columns} onChange={(v) => onUpdate({ ...data, columns: v })} options={['auto', '2', '3', '4']} />
            <Select label="Card Alignment" value={data.align} onChange={(v) => onUpdate({ ...data, align: v })} options={['top', 'center']} />
          </ControlGroup>
        </>
      )}

      {/* Features Inspector */}
      {type === 'features' && (
        <>
          <ControlGroup label="Content">
            <Textarea
              label="Features (comma-separated)"
              value={data.items.join(', ')}
              onChange={(v) => onUpdate({ ...data, items: v.split(',').map(i => i.trim()).filter(i => i) })}
              rows={3}
            />
          </ControlGroup>
          <ControlGroup label="Layout">
            <Select label="Columns" value={data.columns} onChange={(v) => onUpdate({ ...data, columns: parseInt(v) })} options={[1, 2, 3]} />
            <Toggle label="Show Icon Placeholders" checked={data.showIcons} onChange={(v) => onUpdate({ ...data, showIcons: v })} />
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
            <Select label="Emphasis Level" value={data.emphasis} onChange={(v) => onUpdate({ ...data, emphasis: v })} options={['normal', 'strong']} />
          </ControlGroup>
        </>
      )}

      {/* Pricing Inspector */}
      {type === 'pricing' && (
        <>
          <ControlGroup label="Content">
            <Select label="Number of Plans" value={data.planCount} onChange={(v) => onUpdate({ ...data, planCount: parseInt(v) })} options={[1, 2, 3]} />
            <p className="text-xs text-gray-500 mt-2">Edit plan details below</p>
            {data.plans.slice(0, data.planCount).map((plan, idx) => (
              <div key={idx} className="mt-3 p-2 bg-gray-50 rounded border border-gray-200">
                <Input
                  label={`Plan ${idx + 1} Title`}
                  value={plan.title}
                  onChange={(v) => {
                    const newPlans = [...data.plans];
                    newPlans[idx] = { ...plan, title: v };
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
                <Toggle
                  label="Highlight Plan"
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

      {/* Testimonials Inspector */}
      {type === 'testimonials' && (
        <>
          <ControlGroup label="Content">
            <Select label="Number of Testimonials" value={data.count} onChange={(v) => onUpdate({ ...data, count: parseInt(v) })} options={[1, 2, 3, 4]} />
          </ControlGroup>
          <ControlGroup label="Layout">
            <Select label="Layout Style" value={data.layout} onChange={(v) => onUpdate({ ...data, layout: v })} options={['grid', 'carousel']} />
          </ControlGroup>
        </>
      )}

      {/* Stats Inspector */}
      {type === 'stats' && (
        <>
          <ControlGroup label="Content">
            <Select label="Number of Stats" value={data.count} onChange={(v) => onUpdate({ ...data, count: parseInt(v) })} options={[2, 3, 4, 5]} />
          </ControlGroup>
          <ControlGroup label="Layout">
            <Select label="Layout Style" value={data.layout} onChange={(v) => onUpdate({ ...data, layout: v })} options={['horizontal', 'grid']} />
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
            <Toggle label="Show Copyright" checked={data.showCopyright} onChange={(v) => onUpdate({ ...data, showCopyright: v })} />
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

// Section Components (View-Only)
function NavbarSection({ data }) {
  const heightClass = data.height === 'compact' ? 'py-2' : data.height === 'tall' ? 'py-6' : 'py-4';
  const alignClass = data.align === 'left' ? 'justify-start' : data.align === 'center' ? 'justify-center' : 'justify-end';

  return (
    <div className={`px-6 ${heightClass} ${data.sticky ? 'bg-gray-50' : ''}`}>
      <div className="flex justify-between items-center">
        <div className="font-bold text-base">{data.logo}</div>
        <nav className={`flex gap-6 ${alignClass}`}>
          {data.links.map((link, idx) => (
            <span key={idx} className="text-sm">{link}</span>
          ))}
        </nav>
      </div>
    </div>
  );
}

function HeroSection({ data }) {
  const alignClass = data.align === 'left' ? 'text-left' : 'text-center';
  const widthClass = data.width === 'narrow' ? 'max-w-2xl' : data.width === 'wide' ? 'max-w-5xl' : 'max-w-3xl';
  const heightClass = data.minHeight === 'screen' ? 'min-h-screen flex items-center' : '';

  return (
    <div className={`p-16 ${alignClass} ${heightClass}`}>
      <div className={`${widthClass} ${data.align === 'center' ? 'mx-auto' : ''}`}>
        <h1 className="text-4xl font-bold mb-4">{data.heading}</h1>
        <p className="text-lg text-gray-600 mb-6">{data.subheading}</p>
        <button className="px-6 py-3 bg-black text-white font-semibold">{data.button}</button>
      </div>
    </div>
  );
}

function TextSection({ data }) {
  const widthClass = data.width === 'narrow' ? 'max-w-2xl' : data.width === 'full' ? 'max-w-full' : 'max-w-4xl';
  const alignClass = data.align === 'center' ? 'text-center' : 'text-left';
  const sizeClass = data.fontSize === 'sm' ? 'text-sm' : data.fontSize === 'lg' ? 'text-lg' : 'text-base';

  return (
    <div className="p-8">
      <div className={`${widthClass} mx-auto ${alignClass}`}>
        <p className={`${sizeClass} leading-relaxed`}>{data.content}</p>
      </div>
    </div>
  );
}

function ImageSection({ data }) {
  const widthClass = data.fullWidth ? 'w-full' : 'max-w-4xl mx-auto';

  return (
    <div className="p-8">
      <div className={widthClass}>
        <div className="bg-gray-300 flex items-center justify-center" style={{ height: `${data.height}px` }}>
          <span className="text-gray-600 font-semibold">IMAGE</span>
        </div>
        {data.caption && (
          <p className="text-sm text-gray-500 mt-2 text-center italic">{data.caption}</p>
        )}
      </div>
    </div>
  );
}

function CardsSection({ data }) {
  const cols = data.columns === 'auto' ?
    (data.count <= 2 ? 'grid-cols-2' : data.count === 3 ? 'grid-cols-3' : 'grid-cols-4') :
    `grid-cols-${data.columns}`;
  const layoutClass = data.layout === 'grid' ? `grid ${cols} gap-4` : 'flex gap-4 overflow-x-auto';

  return (
    <div className="p-8">
      <div className={`max-w-6xl mx-auto ${layoutClass}`}>
        {Array.from({ length: data.count }).map((_, idx) => (
          <div key={idx} className="border border-gray-300 p-4 min-w-[200px]">
            <div className="w-full h-32 bg-gray-200 mb-3 flex items-center justify-center">
              <span className="text-xs text-gray-500">IMAGE</span>
            </div>
            <h4 className="font-semibold mb-2">Card {idx + 1}</h4>
            <p className="text-sm text-gray-600">Description text goes here</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturesSection({ data }) {
  const colClass = data.columns === 1 ? 'grid-cols-1' : data.columns === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <ul className={`grid ${colClass} gap-4`}>
          {data.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              {data.showIcons && <div className="w-6 h-6 bg-gray-300 rounded flex-shrink-0"></div>}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CTASection({ data }) {
  const alignClass = data.align === 'center' ? 'text-center' : 'text-left';
  const bgClass = data.emphasis === 'strong' ? 'bg-gray-900 text-white' : 'bg-gray-50';

  return (
    <div className={`p-12 ${bgClass} ${alignClass}`}>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-3">{data.heading}</h2>
        <p className={`text-lg mb-6 ${data.emphasis === 'strong' ? 'text-gray-300' : 'text-gray-600'}`}>
          {data.supportingText}
        </p>
        <button className={`px-8 py-3 font-semibold ${data.emphasis === 'strong' ? 'bg-white text-black' : 'bg-black text-white'}`}>
          {data.button}
        </button>
      </div>
    </div>
  );
}

function PricingSection({ data }) {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6">
        {data.plans.slice(0, data.planCount).map((plan, idx) => (
          <div key={idx} className={`border-2 p-6 ${plan.highlighted ? 'border-black bg-gray-50' : 'border-gray-300'}`}>
            <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
            <p className="text-3xl font-bold mb-4">{plan.price}</p>
            <ul className="space-y-2">
              {plan.features.map((feature, fidx) => (
                <li key={fidx} className="text-sm flex items-start gap-2">
                  <span>✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialsSection({ data }) {
  const layoutClass = data.layout === 'grid' ? `grid grid-cols-${Math.min(data.count, 3)} gap-6` : 'flex gap-6 overflow-x-auto';

  return (
    <div className="p-8">
      <div className={`max-w-5xl mx-auto ${layoutClass}`}>
        {data.testimonials.slice(0, data.count).map((testimonial, idx) => (
          <div key={idx} className="border border-gray-300 p-6 min-w-[300px]">
            <p className="text-sm italic mb-4">"{testimonial.quote}"</p>
            <div>
              <p className="font-semibold text-sm">{testimonial.name}</p>
              <p className="text-xs text-gray-600">{testimonial.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsSection({ data }) {
  const layoutClass = data.layout === 'horizontal' ? 'flex justify-around' : `grid grid-cols-${Math.min(data.count, 4)} gap-6`;

  return (
    <div className="p-8 bg-gray-50">
      <div className={`max-w-5xl mx-auto ${layoutClass}`}>
        {data.stats.slice(0, data.count).map((stat, idx) => (
          <div key={idx} className="text-center">
            <p className="text-3xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DividerSection({ data }) {
  const heightMap = { xs: 'h-4', sm: 'h-8', md: 'h-16', lg: 'h-24' };
  const heightClass = heightMap[data.height] || 'h-16';

  return (
    <div className={`${heightClass} flex items-center justify-center`}>
      {data.showLine && <div className="w-full max-w-4xl border-t border-gray-300"></div>}
    </div>
  );
}

function FooterSection({ data }) {
  const alignClass = data.align === 'left' ? 'text-left' : data.align === 'right' ? 'text-right' : 'text-center';
  const colClass = data.columns === 1 ? 'grid-cols-1' : data.columns === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className={`p-6 bg-gray-100 ${alignClass}`}>
      <div className={`grid ${colClass} gap-4 max-w-4xl mx-auto`}>
        {data.showCopyright && <p className="text-sm text-gray-600">{data.text}</p>}
      </div>
    </div>
  );
}

export default App;
