import { Link, useNavigate } from 'react-router-dom';
import { Zap, LayoutDashboard, PenTool, Lightbulb, Calendar, BookOpen, LogOut, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/appStore';
import { authService } from '@/services/authService';
import { Badge } from '@/components/ui/badge';

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, setUser } = useAppStore();

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    navigate('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: PenTool, label: 'Hooks Viraux', path: '/tools/hooks' },
    { icon: PenTool, label: 'Scripts Vidéo', path: '/tools/script' },
    { icon: Lightbulb, label: 'Banque d\'Idées', path: '/tools/ideas' },
    { icon: Calendar, label: 'Calendrier 30 Jours', path: '/tools/calendar' },
    { icon: Zap, label: 'Recharger les crédits', path: '/pricing' },
    { icon: BookOpen, label: 'Guide Créateur', path: '/guide' },
    { icon: HelpCircle, label: 'Aide & Contact', path: '/contact' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-[#1E1E3A] bg-[#0A0A14] h-screen sticky top-0">
      <div className="p-6 flex items-center gap-2">
        <Zap className="w-8 h-8 text-[#7C3AED] fill-[#7C3AED]" />
        <span className="text-lg font-bold tracking-tight">Creator Booster</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              window.location.pathname === item.path
                ? 'bg-[#7C3AED]/10 text-[#7C3AED]'
                : 'text-[#94A3B8] hover:bg-[#12121F] hover:text-[#F1F5F9]'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* ================= SECTION BAS DE PAGE DYNAMIQUE ================= */}
      <div className="p-4 border-t border-[#1E1E3A] space-y-4">
        {user ? (
          /* 🔓 CAS 1 : L'utilisateur est connecté */
          <>
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center text-xs font-bold text-white">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-white">{user?.name}</p>
                <p className="text-xs text-[#94A3B8] truncate">{user?.email}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="w-full justify-start text-[#94A3B8] hover:text-red-400 hover:bg-red-400/10"
            >
              <LogOut className="w-5 h-5 mr-3" /> Déconnexion
            </Button>
          </>
        ) : (
          /* 🔒 CAS 2 : Le visiteur est anonyme (Page Tarifs ou Contact) */
          <Button 
            onClick={() => navigate('/login')}
            className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium py-2.5 rounded-xl transition-all shadow-lg shadow-[#7C3AED]/10"
          >
            Se connecter / S'inscrire
          </Button>
        )}

        <div className="text-center pt-2">
          <Badge variant="outline" className="border-[#1E1E3A] text-[#94A3B8] text-[10px]">
            by NexiumAgency
          </Badge>
        </div>
      </div>
    </aside>
  );
}