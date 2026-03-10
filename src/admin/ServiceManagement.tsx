import React, { useEffect, useState } from 'react';
import { Plus, Search, MoreVertical, Edit2, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { api } from '../services/api';

const ServiceManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.getServices();
        setServices(data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-white tracking-tighter">Services</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage your salon's service offerings.</p>
        </div>
        <button className="px-6 py-3 bg-[#C5A059] text-white text-sm font-bold rounded-xl hover:bg-[#B48F48] transition-all flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900/50 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-white focus:border-[#C5A059] outline-none transition-all"
          />
        </div>
        <select className="bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] outline-none transition-all min-w-[150px]">
          <option value="all">All Categories</option>
          <option value="hair">Hair</option>
          <option value="beard">Beard</option>
          <option value="facial">Facial</option>
        </select>
      </div>

      {/* Services Table */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-b border-white/5">
                <th className="px-6 py-4">Service Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-zinc-400">
              {filteredServices.map((service) => (
                <tr key={service.id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex-shrink-0" />
                      <span className="font-bold text-white">{service.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-lg bg-zinc-800 text-[10px] font-bold uppercase tracking-widest">
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white">Rs. {service.price}</td>
                  <td className="px-6 py-4">{service.duration} mins</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      service.status === 'Active' ? "bg-[#C5A059]/10 text-[#C5A059]" : "bg-zinc-500/10 text-zinc-500"
                    )}>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-[#C5A059]/10 hover:text-[#C5A059] rounded-lg transition-all">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;
