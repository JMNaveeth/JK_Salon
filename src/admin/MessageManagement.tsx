import React, { useEffect, useState } from 'react';
import { Mail, Trash2, CheckCircle, Clock, Search, Filter, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { format } from 'date-fns';
import { cn } from '@/src/utils/cn';

const CustomSelect = ({ value, onChange, options, placeholder = "Select..." }: { value: string, onChange: (val: string) => void, options: {label: string, value: string}[], placeholder?: string }) => {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || placeholder;

  return (
    <div className="relative w-full sm:w-auto min-w-[140px]">
      <button 
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full pl-10 pr-4 py-2 bg-black border border-white/10 rounded-xl text-sm text-white focus:border-[#C5A059]/50 outline-none transition-all flex items-center justify-between"
      >
        <span className="truncate mr-2">{selectedLabel}</span>
        <svg className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-xl shadow-2xl border border-zinc-200 overflow-hidden py-1 max-h-60 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={cn(
                  "w-full text-left px-4 py-3 text-sm transition-colors",
                  value === opt.value ? "font-bold" : "text-zinc-700 hover:bg-zinc-50"
                )}
                style={value === opt.value ? { backgroundColor: 'rgba(197,160,89,0.15)', color: '#000000' } : {}}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const MessageManagement = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await api.getMessages();
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = 
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'All') return matchesSearch;
    return matchesSearch && msg.status === filter;
  });

  const handleMarkRead = async (id: string) => {
    try {
      await api.markMessageRead(id);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'Read' } : m)));
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error('Failed to delete message:', error);
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Inquiries & Messages</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-black border border-white/10 rounded-xl text-sm text-white focus:border-[#C5A059] outline-none w-full sm:w-64"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 z-10 pointer-events-none" />
            <CustomSelect
              value={filter}
              onChange={setFilter}
              options={[
                { label: 'All Status', value: 'All' },
                { label: 'Unread', value: 'Unread' },
                { label: 'Read', value: 'Read' }
              ]}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredMessages.map((msg) => (
          <div 
            key={msg.id}
            className={`p-6 rounded-2xl border transition-all ${
              msg.status === 'Unread' 
                ? 'bg-[#C5A059]/5 border-[#C5A059]/20' 
                : 'bg-zinc-900/50 border-white/5'
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-4 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      msg.status === 'Unread' ? 'bg-[#C5A059]/20 text-[#C5A059]' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white truncate">{msg.name}</h3>
                      <p className="text-xs text-zinc-500 truncate">{msg.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-zinc-500 shrink-0">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(new Date(msg.created_at), 'MMM dd, yyyy HH:mm')}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-[#C5A059] mb-1">{msg.subject}</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">{msg.message}</p>
                </div>
              </div>

              <div className="flex md:flex-col justify-end gap-2">
                {msg.status === 'Unread' && (
                  <button onClick={() => handleMarkRead(msg.id)} className="p-2 rounded-lg bg-[#C5A059]/10 text-[#C5A059] hover:bg-[#C5A059] hover:text-white transition-all" title="Mark as Read">
                    <CheckCircle className="h-5 w-5" />
                  </button>
                )}
                <button onClick={() => handleDelete(msg.id)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all" title="Delete">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="text-center py-12 bg-zinc-900/50 border border-white/5 rounded-3xl">
            <Mail className="h-12 w-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-500">No messages found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageManagement;
