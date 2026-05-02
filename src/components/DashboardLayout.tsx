import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  MessageSquare, 
  BookMarked, 
  Files, 
  Calendar, 
  Award, 
  Bell, 
  Search,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/src/store/useAuthStore';
import { logout } from '@/src/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, user } = useAuthStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Feed', icon: Home, path: '/' },
    { label: 'Groups', icon: Users, path: '/groups' },
    { label: 'Q&A', icon: MessageSquare, path: '/qa' },
    { label: 'Notes', icon: BookMarked, path: '/notes' },
    { label: 'Resources', icon: Files, path: '/resources' },
    { label: 'Events', icon: Calendar, path: '/events' },
    { label: 'Mentorship', icon: Award, path: '/mentorship' },
  ];

  return (
    <div className="flex h-screen bg-[#F5F5F7]">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-zinc-200">
        <div className="p-6">
          <div className="flex items-center space-x-2 text-blue-600 font-bold text-xl uppercase tracking-wider">
            <BookMarked className="w-8 h-8" />
            <span>Connect</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-100">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="w-full flex items-center justify-start space-x-3 px-3 h-12 rounded-xl">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={profile?.profilePhotoUrl || user?.photoURL || ''} />
                  <AvatarFallback>{profile?.fullName?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold truncate">{profile?.fullName}</p>
                  <p className="text-xs text-zinc-400 capitalize">{profile?.role}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(`/profile/${user?.uid}`)}>
                <User className="w-4 h-4 mr-2" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </Button>

          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search resources, notes, or groups..." 
                className="w-full pl-10 pr-4 py-2 bg-zinc-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-zinc-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Button>
            <Button className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-4 text-sm font-medium">
              Create
            </Button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)}></div>
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            className="relative w-64 bg-white h-full flex flex-col"
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-blue-600 font-bold text-xl uppercase tracking-wider">
                <BookMarked className="w-8 h-8" />
                <span>Connect</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            
            <nav className="flex-1 px-4 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-zinc-600 hover:bg-zinc-100'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </motion.div>
        </div>
      )}
    </div>
  );
};
