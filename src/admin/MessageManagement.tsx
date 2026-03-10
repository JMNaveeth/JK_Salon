import React, { useEffect, useState } from 'react';
import { Mail, Trash2, CheckCircle, Clock, Search, Filter, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { format } from 'date-fns';

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
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-black border border-white/10 rounded-xl text-sm text-white focus:border-[#C5A059] outline-none appearance-none w-full sm:w-auto"
            >
              <option value="All">All Status</option>
              <option value="Unread">Unread</option>
              <option value="Read">Read</option>
            </select>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      msg.status === 'Unread' ? 'bg-[#C5A059]/20 text-[#C5A059]' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{msg.name}</h3>
                      <p className="text-xs text-zinc-500">{msg.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-zinc-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(new Date(msg.createdAt), 'MMM dd, yyyy HH:mm')}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-[#C5A059] mb-1">{msg.subject}</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">{msg.message}</p>
                </div>
              </div>

              <div className="flex md:flex-col justify-end gap-2">
                {msg.status === 'Unread' && (
                  <button className="p-2 rounded-lg bg-[#C5A059]/10 text-[#C5A059] hover:bg-[#C5A059] hover:text-white transition-all">
                    <CheckCircle className="h-5 w-5" />
                  </button>
                )}
                <button className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
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
