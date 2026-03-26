import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  X,
  Clock,
  DollarSign,
  Scissors,
  Image as ImageIcon,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  AlertCircle,
  FileText,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { api } from '../services/api';

const GOLD = '#C5A059';
const GOLD_LIGHT = '#E8C97A';

const CATEGORIES = ['Hair', 'Beard', 'Facial', 'Spa', 'Nails', 'Massage', 'Skincare', 'Other'];

interface ServiceForm {
  name: string;
  category: string;
  price: string;
  duration: string;
  status: string;
  description: string;
  imageUrl: string;
}

const emptyForm: ServiceForm = {
  name: '',
  category: 'Hair',
  price: '',
  duration: '',
  status: 'Active',
  description: '',
  imageUrl: '',
};

const ServiceManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Open modal for Add
  const openAddModal = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  // Open modal for Edit
  const openEditModal = (service: any) => {
    setForm({
      name: service.name,
      category: service.category,
      price: service.price.toString(),
      duration: service.duration.toString(),
      status: service.status,
      description: service.description || '',
      imageUrl: service.imageUrl || '',
    });
    setEditingId(service.id);
    setShowModal(true);
  };

  // Save (Create or Update)
  const handleSave = async () => {
    if (!form.name || !form.price || !form.duration) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseInt(form.price),
        duration: parseInt(form.duration),
      };
      if (editingId) {
        await api.updateService(editingId, payload);
        showToast('Service updated successfully!');
      } else {
        await api.createService(payload);
        showToast('Service added successfully!');
      }
      setShowModal(false);
      await fetchServices();
    } catch (err) {
      showToast('Failed to save service.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    try {
      await api.deleteService(id);
      showToast('Service deleted.');
      setDeleteId(null);
      await fetchServices();
    } catch (err) {
      showToast('Failed to delete service.', 'error');
    }
  };

  // Toggle status
  const handleToggleStatus = async (id: string) => {
    try {
      await api.toggleServiceStatus(id);
      await fetchServices();
    } catch (err) {
      showToast('Failed to toggle status.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin" style={{ color: GOLD }} />
          <p className="text-zinc-500 text-sm">Loading services…</p>
        </div>
      </div>
    );
  }

  const activeCount = services.filter((s) => s.status === 'Active').length;
  const inactiveCount = services.filter((s) => s.status === 'Inactive').length;

  return (
    <div className="space-y-8 relative">
      {/* Toast notification */}
      {toast && (
        <div
          className={cn(
            'fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold shadow-2xl border animate-in slide-in-from-right',
            toast.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          )}
        >
          {toast.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4" style={{ color: GOLD }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: GOLD }}>
              Service Management
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tighter">Services</h1>
          <p className="text-zinc-500 text-sm mt-1.5">
            {services.length} services · {activeCount} active · {inactiveCount} inactive
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.03] hover:shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
            boxShadow: `0 8px 24px rgba(197,160,89,0.3)`,
          }}
        >
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
          <input
            type="text"
            placeholder="Search services…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900/40 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:border-[#C5A059]/50 outline-none transition-all placeholder:text-zinc-600"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-zinc-900/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-[#C5A059]/50 outline-none transition-all min-w-[160px]"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Services Table */}
      <div className="bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden">
        {filteredServices.length === 0 ? (
          <div className="p-16 text-center">
            <Scissors className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">No services found</p>
            <button onClick={openAddModal} className="mt-4 text-xs font-bold hover:underline" style={{ color: GOLD }}>
              Add your first service →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 border-b border-white/5">
                  <th className="px-5 py-3.5">Service</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5">Duration</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredServices.map((service) => (
                  <tr
                    key={service.id}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                          style={{
                            background: service.imageUrl ? 'transparent' : 'rgba(197,160,89,0.08)',
                            border: '1px solid rgba(197,160,89,0.15)',
                          }}
                        >
                          {service.imageUrl ? (
                            <img
                              src={service.imageUrl}
                              alt={service.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Scissors className="h-4 w-4" style={{ color: GOLD }} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{service.name}</p>
                          {service.description && (
                            <p className="text-[11px] text-zinc-600 truncate max-w-[200px]">{service.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: 'rgba(197,160,89,0.08)', color: GOLD, border: '1px solid rgba(197,160,89,0.15)' }}
                      >
                        {service.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-white">Rs. {Number(service.price).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-zinc-400">
                        <Clock className="h-3.5 w-3.5 text-zinc-600" />
                        {service.duration} mins
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleStatus(service.id)}
                        className={cn(
                          'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-105',
                          service.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-zinc-500/10 text-zinc-500'
                        )}
                      >
                        {service.status === 'Active' ? (
                          <ToggleRight className="h-3.5 w-3.5" />
                        ) : (
                          <ToggleLeft className="h-3.5 w-3.5" />
                        )}
                        {service.status}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(service)}
                          className="p-2 rounded-lg hover:bg-[#C5A059]/10 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" style={{ color: GOLD }} />
                        </button>
                        <button
                          onClick={() => setDeleteId(service.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          ADD / EDIT MODAL
      ═══════════════════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.2)' }}
                >
                  <Scissors className="h-5 w-5" style={{ color: GOLD }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{editingId ? 'Edit Service' : 'Add New Service'}</h2>
                  <p className="text-[11px] text-zinc-500">
                    {editingId ? 'Update service details' : 'This will appear on the customer services page'}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <X className="h-5 w-5 text-zinc-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">
                  Service Name *
                </label>
                <div className="relative">
                  <Scissors className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Classic Haircut"
                    className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-[#C5A059]/50 transition-all placeholder:text-zinc-700"
                  />
                </div>
              </div>

              {/* Category + Status row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C5A059]/50 transition-all"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C5A059]/50 transition-all"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Price + Duration row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">
                    Price (LKR) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="2500"
                      className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-[#C5A059]/50 transition-all placeholder:text-zinc-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">
                    Duration (mins) *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <input
                      type="number"
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      placeholder="45"
                      className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-[#C5A059]/50 transition-all placeholder:text-zinc-700"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">
                  Description
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-600" />
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief description of the service…"
                    rows={3}
                    className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-[#C5A059]/50 transition-all placeholder:text-zinc-700 resize-none"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">
                  Image URL
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-[#C5A059]/50 transition-all placeholder:text-zinc-700"
                  />
                </div>
                {form.imageUrl && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-white/5 h-32">
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-zinc-400 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                  boxShadow: `0 6px 20px rgba(197,160,89,0.3)`,
                }}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>{editingId ? 'Update Service' : 'Add Service'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
      ═══════════════════════════════════════════════════════════ */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-5">
              <Trash2 className="h-7 w-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Service?</h3>
            <p className="text-zinc-500 text-sm mb-6">
              This will permanently remove the service. Customers will no longer see it.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-zinc-400 bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
