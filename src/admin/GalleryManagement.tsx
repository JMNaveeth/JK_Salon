import React, { useEffect, useState, useRef } from 'react';
import { Plus, Trash2, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import { api } from '../services/api';

const GalleryManagement = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchGallery = async () => {
    try {
      const data = await api.getGallery();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();

    const source = new EventSource('/api/gallery/stream');
    source.onmessage = (event) => {
      if (event.data === 'updated') {
        fetchGallery();
      }
    };
    return () => source.close();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Upload to storage
      const uploadRes = await api.uploadImage(file);
      if (uploadRes.success) {
        // 2. Save to gallery db
        await api.uploadMedia({
          url: uploadRes.imageUrl,
          type: 'image',
          category: 'Styling' // Default category
        });
        fetchGallery();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this image from gallery?')) return;
    try {
      await api.deleteGalleryItem(id);
      fetchGallery();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-[#C5A059] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tighter">Gallery</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage salon photos and videos. Add photos directly from your device.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
            <img 
              src={item.url} 
              alt="" 
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
              <div className="flex space-x-2">
                <button 
                  onClick={(e) => handleDelete(item.id, e)}
                  className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white mt-4 ring-1 ring-white/20 px-2 py-0.5 rounded-full">{item.category}</span>
            </div>
            <div className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-lg">
              {item.type === 'image' ? <ImageIcon className="h-4 w-4 text-white" /> : <Video className="h-4 w-4 text-white" />}
            </div>
          </div>
        ))}

        {/* Upload Placeholder */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileUpload}
        />
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-zinc-500 hover:border-[#C5A059]/50 hover:text-[#C5A059] transition-all bg-white/5 relative group"
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-[#C5A059]" />
          ) : (
            <>
              <Plus className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">Add New</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GalleryManagement;
