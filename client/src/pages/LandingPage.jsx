import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Layers, Layout, Zap, Edit3, Share2, Code } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-gray-200 font-sans selection:bg-cyan-500/30">
            {/* Background Grid */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-cyan-500 opacity-20 blur-[100px]"></div>
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded border border-white/10 bg-white/5 flex items-center justify-center">
                            <Layers className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="text-sm font-bold text-white tracking-widest uppercase font-mono">Automator.UI</span>
                    </div>
                    <div className="flex items-center gap-8">
                        <a href="#features" className="text-xs font-mono text-gray-400 hover:text-cyan-400 transition-colors uppercase tracking-wider">Features</a>
                        <a href="#how-it-works" className="text-xs font-mono text-gray-400 hover:text-cyan-400 transition-colors uppercase tracking-wider">How it Works</a>
                        <button
                            onClick={() => navigate('/login')}
                            className="text-xs font-bold font-mono bg-white text-black px-5 py-2 hover:bg-cyan-400 transition-colors border border-transparent hover:border-cyan-300"
                        >
                            SIGN_IN
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="pt-32 pb-20 px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-cyan-400 mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        <span>SYSTEM_ONLINE_V2.0</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-8 leading-tight">
                        Automate Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-600">Design Workflow.</span>
                    </h1>

                    <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                        Construct high-fidelity interfaces with machine precision.
                        <span className="text-gray-300"> Drag. Drop. Compile.</span>
                    </p>

                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="group relative px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-sm font-bold transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center gap-2 border border-cyan-500"
                        >
                            INITIALIZE_EDITOR
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-8 py-4 bg-black hover:bg-white/5 text-gray-300 font-mono text-sm font-bold transition-all border border-white/10 hover:border-white/20"
                        >
                            VIEW_DEMO
                        </button>
                    </div>

                    {/* Hero Image Mockup */}
                    <div className="mt-20 relative rounded border border-white/10 shadow-2xl bg-[#0A0A0A] aspect-video group overflow-hidden">
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10" />
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] opacity-20"></div>

                        {/* Mock UI Elements - Wireframe Style */}
                        <div className="p-8 grid grid-cols-12 gap-4 h-full opacity-60 group-hover:opacity-100 transition-opacity duration-700">
                            <div className="col-span-3 border-r border-white/10 h-full flex flex-col gap-4">
                                <div className="h-8 w-24 bg-white/10 rounded-sm" />
                                <div className="h-4 w-16 bg-white/5 rounded-sm" />
                                <div className="h-4 w-20 bg-white/5 rounded-sm" />
                                <div className="mt-auto h-12 w-full bg-white/5 rounded-sm" />
                            </div>
                            <div className="col-span-9 space-y-4 pt-2">
                                <div className="flex gap-4 mb-8">
                                    <div className="h-32 flex-1 border border-cyan-500/30 bg-cyan-500/5 rounded-sm relative">
                                        <div className="absolute top-2 left-2 w-2 h-2 bg-cyan-500"></div>
                                    </div>
                                    <div className="h-32 flex-1 border border-white/10 bg-white/5 rounded-sm" />
                                </div>
                                <div className="h-2 w-32 bg-white/10 rounded-sm" />
                                <div className="h-2 w-48 bg-white/5 rounded-sm" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="py-24 px-6 relative z-10 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Layout className="w-5 h-5 text-cyan-400" />}
                            title="VISUAL_ENGINE"
                            desc="Direct manipulation interface for instant layout generation."
                        />
                        <FeatureCard
                            icon={<Zap className="w-5 h-5 text-cyan-400" />}
                            title="REALTIME_SYNC"
                            desc="Sub-millisecond state synchronization across all viewports."
                        />
                        <FeatureCard
                            icon={<Code className="w-5 h-5 text-cyan-400" />}
                            title="PURE_OUTPUT"
                            desc="Generate semantic, unopinionated React + Tailwind code."
                        />
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section id="how-it-works" className="py-24 px-6 bg-white/[0.02] border-y border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">System Architecture.</h2>
                            <div className="space-y-12">
                                <Step
                                    num="01"
                                    title="Select Template"
                                    desc="Initialize project from high-performance presets."
                                />
                                <Step
                                    num="02"
                                    title="Configure Parameters"
                                    desc="Fine-tune visual attributes via the inspector panel."
                                />
                                <Step
                                    num="03"
                                    title="Deploy Build"
                                    desc="Compile and push to production environment."
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500/10 blur-[60px] rounded-full opacity-20" />
                            <div className="relative bg-[#050505] border border-white/10 rounded p-1 shadow-2xl">
                                <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-sm">
                                    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                    </div>
                                    <div className="space-y-2 font-mono text-xs text-gray-400">
                                        <div className="flex gap-2">
                                            <span className="text-purple-400">const</span>
                                            <span className="text-yellow-200">App</span>
                                            <span>=</span>
                                            <span className="text-blue-400">()</span>
                                            <span className="text-purple-400">=&gt;</span>
                                            <span className="text-yellow-400">{`{`}</span>
                                        </div>
                                        <div className="pl-4">
                                            <span className="text-purple-400">return</span>
                                            <span className="text-blue-400">(</span>
                                        </div>
                                        <div className="pl-8 text-green-300">
                                            &lt;Component /&gt;
                                        </div>
                                        <div className="pl-4">
                                            <span className="text-blue-400">)</span>
                                        </div>
                                        <div className="text-yellow-400">{`}`}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 bg-[#050505] text-center relative z-10">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <Layers className="w-4 h-4 text-cyan-600" />
                    <span className="text-sm font-bold text-gray-400 tracking-widest uppercase font-mono">Automator.UI</span>
                </div>
                <p className="text-[10px] text-gray-600 font-mono uppercase">System Status: Online</p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="p-6 bg-[#0F0F0F] border border-white/5 hover:border-cyan-500/50 hover:bg-[#151515] transition-all group">
        <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:text-cyan-400 transition-colors">
            {icon}
        </div>
        <h3 className="text-sm font-bold text-white mb-2 font-mono tracking-wider">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed font-mono">{desc}</p>
    </div>
);

const Step = ({ num, title, desc }) => (
    <div className="flex gap-5 group">
        <div className="w-px h-full bg-white/10 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-black border border-white/30 group-hover:border-cyan-400 group-hover:bg-cyan-500 transition-colors rounded-full" />
        </div>
        <div className="pb-8">
            <span className="text-xs font-mono text-cyan-500 mb-2 block">{num}</span>
            <h4 className="text-base font-bold text-white mb-1 uppercase tracking-wide">{title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">{desc}</p>
        </div>
    </div>
);

export default LandingPage;
