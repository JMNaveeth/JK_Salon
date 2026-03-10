import React from 'react';
import { Save, Image as ImageIcon, Layout, Info, Phone } from 'lucide-react';

const ContentManagement = () => {
  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tighter">Content</h1>
          <p className="text-zinc-500 text-sm mt-1">Customize your website's text and images.</p>
        </div>
        <button className="px-6 py-3 bg-[#C5A059] text-white text-sm font-bold rounded-xl hover:bg-[#B48F48] transition-all flex items-center">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation */}
        <div className="lg:col-span-1 space-y-4">
          {[
            { id: 'hero', name: 'Hero Section', icon: Layout },
            { id: 'about', name: 'About Us', icon: Info },
            { id: 'contact', name: 'Contact Info', icon: Phone },
          ].map((section) => (
            <button
              key={section.id}
              className="w-full flex items-center space-x-3 px-6 py-4 rounded-2xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white hover:border-[#C5A059]/30 transition-all"
            >
              <section.icon className="h-5 w-5" />
              <span className="font-bold text-sm">{section.name}</span>
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 space-y-8">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Layout className="h-5 w-5 mr-3 text-[#C5A059]" />
              Hero Section
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Main Title</label>
                <input 
                  type="text" 
                  defaultValue="Elevate Your Signature Style."
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Tagline</label>
                <textarea 
                  rows={3}
                  defaultValue="Experience the pinnacle of luxury grooming at JK Salon. Our expert stylists combine traditional techniques with modern trends to craft your perfect look."
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] outline-none transition-all resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Hero Background Image</label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-xl bg-zinc-800 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=200" alt="" className="w-full h-full object-cover" />
                  </div>
                  <button className="px-4 py-2 bg-zinc-800 text-white text-xs font-bold rounded-lg hover:bg-zinc-700 transition-all flex items-center">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Change Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
