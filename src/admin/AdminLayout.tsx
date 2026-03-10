import React from 'react';
import { Link, useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Scissors, 
  Calendar, 
  Image as ImageIcon, 
  Star, 
  Settings, 
  LogOut,
  Menu,
  X,
  Mail
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../firebase/firebase';
import { cn } from '@/src/utils/cn';
import DashboardOverview from './DashboardOverview';
import ServiceManagement from './ServiceManagement';
import BookingManagement from './BookingManagement';
import GalleryManagement from './GalleryManagement';
import ReviewManagement from './ReviewManagement';
import MessageManagement from './MessageManagement';
import ContentManagement from './ContentManagement';

const AdminLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/admin/login" />;

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Services', icon: Scissors, path: '/admin/services' },
    { name: 'Bookings', icon: Calendar, path: '/admin/bookings' },
    { name: 'Gallery', icon: ImageIcon, path: '/admin/gallery' },
    { name: 'Reviews', icon: Star, path: '/admin/reviews' },
    { name: 'Messages', icon: Mail, path: '/admin/messages' },
    { name: 'Content', icon: Settings, path: '/admin/content' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-white/5 transition-transform duration-300 lg:translate-x-0 lg:static",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center space-x-2 mb-12">
            <Scissors className="h-8 w-8 text-[#C5A059]" />
            <span className="text-xl font-bold tracking-tighter text-white uppercase">Admin Panel</span>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive(item.path) 
                    ? "bg-[#C5A059] text-white shadow-lg shadow-[#C5A059]/20" 
                    : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all mt-auto"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-zinc-950 border-b border-white/5 flex items-center justify-between px-6 lg:px-10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-zinc-400 p-2"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white">{user.email}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Salon Manager</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center text-white font-bold">
              {user.email?.[0].toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <Routes>
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="services" element={<ServiceManagement />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="gallery" element={<GalleryManagement />} />
            <Route path="reviews" element={<ReviewManagement />} />
            <Route path="messages" element={<MessageManagement />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="*" element={<Navigate to="dashboard" />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
