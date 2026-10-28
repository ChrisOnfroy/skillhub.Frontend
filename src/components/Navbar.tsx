import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';
import {
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  UserPlus,
} from 'lucide-react';

export type NavigationTab = 'home' | 'catalog' | 'my-enrollments' | 'instructor' | 'reports';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenAuth: (tab: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAuth,
}) => {
  const { user, isAuthenticated, isEmployee, isParticipant, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#ffffff]/95 dark:bg-[#121214]/95 backdrop-blur-md border-b border-[#e2e8f0] dark:border-[#27272a] shadow-sm transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-12 flex items-center justify-between h-20 max-w-7xl mx-auto">
        {/* Brand & Identity */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-lg text-[#334155] dark:text-[#cbd5e1] hover:bg-[#f0edea] dark:hover:bg-[#22221f] transition-colors"
            title="Menú de navegación"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => handleNavClick('home')}
            className="text-left focus:outline-none"
          >
            <Logo size="md" />
          </button>
        </div>

        {/* Navigation Links - Epilogue SemiBold */}
        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-semibold">
          <button
            onClick={() => onSelectTab('home')}
            className={`transition-colors duration-150 cursor-pointer ${
              currentTab === 'home'
                ? 'text-[#d9251d] dark:text-[#ffb4a9] border-b-2 border-[#d9251d] pb-1'
                : 'text-[#334155] dark:text-white hover:text-[#d9251d] dark:hover:text-[#ffb4a9]'
            }`}
          >
            Inicio
          </button>

          <button
            onClick={() => onSelectTab('catalog')}
            className={`transition-colors duration-150 cursor-pointer ${
              currentTab === 'catalog'
                ? 'text-[#d9251d] dark:text-[#ffb4a9] border-b-2 border-[#d9251d] pb-1'
                : 'text-[#334155] dark:text-white hover:text-[#d9251d] dark:hover:text-[#ffb4a9]'
            }`}
          >
            Talleres
          </button>

          {isParticipant && (
            <button
              onClick={() => onSelectTab('my-enrollments')}
              className={`transition-colors duration-150 cursor-pointer ${
                currentTab === 'my-enrollments'
                  ? 'text-[#d9251d] dark:text-[#ffb4a9] border-b-2 border-[#d9251d] pb-1'
                  : 'text-[#334155] dark:text-white hover:text-[#d9251d] dark:hover:text-[#ffb4a9]'
              }`}
            >
              Mi Aula Virtual
            </button>
          )}

          {isEmployee && (
            <button
              onClick={() => onSelectTab('instructor')}
              className={`transition-colors duration-150 cursor-pointer ${
                currentTab === 'instructor'
                  ? 'text-[#d9251d] dark:text-[#ffb4a9] border-b-2 border-[#d9251d] pb-1'
                  : 'text-[#334155] dark:text-white hover:text-[#d9251d] dark:hover:text-[#ffb4a9]'
              }`}
            >
              Gestión Docente
            </button>
          )}

          {isEmployee && (
            <button
              onClick={() => onSelectTab('reports')}
              className={`transition-colors duration-150 cursor-pointer ${
                currentTab === 'reports'
                  ? 'text-[#d9251d] dark:text-[#ffb4a9] border-b-2 border-[#d9251d] pb-1'
                  : 'text-[#334155] dark:text-white hover:text-[#d9251d] dark:hover:text-[#ffb4a9]'
              }`}
            >
              Métricas
            </button>
          )}
        </nav>

        {/* Trailing Actions: Auth */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* User Profile or Login CTA */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-[#0f172a] dark:text-white">
                  {user.fullName}
                </span>
                <span className="text-[10px] font-mono text-[#d9251d] dark:text-[#ff5252] font-bold">
                  {isEmployee ? 'DOCENTE' : 'ESTUDIANTE'}
                </span>
              </div>

              <div className="w-9 h-9 rounded-lg bg-[#2c657b] text-white flex items-center justify-center font-bold text-xs shadow-caribe-sm">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>

              <button
                onClick={logout}
                title="Cerrar sesión"
                className="p-2 rounded-lg text-[#334155] dark:text-[#a1a1aa] hover:text-[#d9251d] dark:hover:text-[#ff5252] hover:bg-[#ffdad5]/50 dark:hover:bg-[#450a0a]/50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#0f172a] dark:text-white hover:text-[#d9251d] dark:hover:text-[#ff5252] hover:bg-[#f1f5f9] dark:hover:bg-[#27272a] rounded-lg transition-colors cursor-pointer border border-[#cbd5e1] dark:border-[#27272a]"
              >
                <LogIn className="w-3.5 h-3.5 text-white" />
                <span>Iniciar Sesión</span>
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="flex items-center gap-1.5 bg-[#d9251d] hover:bg-[#b30006] text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-caribe-sm hover:shadow-caribe-md active:translate-y-[1px] transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Registrarse</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 py-3 bg-[#ffffff] dark:bg-[#121214] border-t border-[#e2e8f0] dark:border-[#27272a] space-y-2 animate-in fade-in duration-150">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
              currentTab === 'home'
                ? 'bg-[#ffdad5]/40 text-[#d9251d] dark:text-[#ff5252]'
                : 'text-[#0f172a] dark:text-white'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => handleNavClick('catalog')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
              currentTab === 'catalog'
                ? 'bg-[#ffdad5]/40 text-[#d9251d] dark:text-[#ff5252]'
                : 'text-[#334155] dark:text-white'
            }`}
          >
            Talleres
          </button>

          {isParticipant && (
            <button
              onClick={() => handleNavClick('my-enrollments')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                currentTab === 'my-enrollments'
                  ? 'bg-[#ffdad5]/40 text-[#d9251d] dark:text-[#ff5252]'
                  : 'text-[#334155] dark:text-[#cbd5e1]'
              }`}
            >
              Mi Aula Virtual
            </button>
          )}

          {isEmployee && (
            <button
              onClick={() => handleNavClick('instructor')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                currentTab === 'instructor'
                  ? 'bg-[#ffdad5]/40 text-[#d9251d] dark:text-[#ff5252]'
                  : 'text-[#334155] dark:text-[#cbd5e1]'
              }`}
            >
              Gestión Docente
            </button>
          )}

          {isEmployee && (
            <button
              onClick={() => handleNavClick('reports')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                currentTab === 'reports'
                  ? 'bg-[#ffdad5]/40 text-[#d9251d] dark:text-[#ff5252]'
                  : 'text-[#334155] dark:text-[#cbd5e1]'
              }`}
            >
              Métricas
            </button>
          )}

          {/* Mobile Auth Actions */}
          <div className="pt-2 border-t border-[#e2e8f0] dark:border-[#27272a] space-y-2">
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-[#cbd5e1] dark:border-[#27272a] text-xs font-bold text-[#0f172a] dark:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#27272a]"
                >
                  <LogIn className="w-3.5 h-3.5 text-white" />
                  <span>Iniciar Sesión</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('register');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#d9251d] hover:bg-[#b30006] text-white text-xs font-bold shadow-caribe-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Registrarse</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2 pt-1">
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#0f172a] dark:text-white">{user?.fullName}</p>
                    <p className="text-[10px] font-mono text-[#d9251d] dark:text-[#ff5252] font-bold">{isEmployee ? 'DOCENTE' : 'ESTUDIANTE'}</p>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-1 text-xs text-[#d9251d] dark:text-[#ff5252] font-bold p-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Salir</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
