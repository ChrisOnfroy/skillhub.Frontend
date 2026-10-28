import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import type { NavigationTab } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import type { AuthTab } from './components/AuthModal';
import { HomeView } from './views/HomeView';
import { WorkshopsCatalogView } from './views/WorkshopsCatalogView';
import { MyEnrollmentsView } from './views/MyEnrollmentsView';
import { InstructorManagementView } from './views/InstructorManagementView';
import { ReportsView } from './views/ReportsView';
import { MapPin, ShieldCheck, Award } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { isEmployee, isParticipant } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>('login');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryToken, setRecoveryToken] = useState('');

  // Redirect if currentTab is forbidden for role
  useEffect(() => {
    if (isEmployee && currentTab === 'my-enrollments') {
      setCurrentTab('instructor');
    } else if (isParticipant && (currentTab === 'instructor' || currentTab === 'reports')) {
      setCurrentTab('home');
    }
  }, [isEmployee, isParticipant, currentTab]);

  // Handle direct recovery link from email: ?email=...&token=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    const tokenParam = params.get('token');

    if (emailParam || tokenParam) {
      if (emailParam) setRecoveryEmail(emailParam);
      if (tokenParam) setRecoveryToken(tokenParam);
      setAuthTab('forgot-password');
      setAuthModalOpen(true);
    }
  }, []);

  const handleOpenAuth = (tab: AuthTab) => {
    setAuthTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#121212] text-[#0f172a] dark:text-[#ffffff] flex flex-col selection:bg-[#d9251d] selection:text-white transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Canvas with subtle pattern */}
      <main className="flex-1 bg-caribe-pattern w-full min-w-0">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-12">
          {currentTab === 'home' && (
            <HomeView
              onNavigateToCatalog={() => setCurrentTab('catalog')}
              onOpenAuth={handleOpenAuth}
              onNavigateToInstructor={() => setCurrentTab('instructor')}
              onNavigateToMyEnrollments={() => setCurrentTab('my-enrollments')}
            />
          )}

          {currentTab === 'catalog' && (
            <WorkshopsCatalogView
              onOpenAuth={handleOpenAuth}
              onNavigateToMyEnrollments={() => setCurrentTab('my-enrollments')}
              onNavigateToInstructor={() => setCurrentTab('instructor')}
            />
          )}

          {currentTab === 'my-enrollments' && (
            <MyEnrollmentsView
              onOpenAuth={handleOpenAuth}
              onNavigateToCatalog={() => setCurrentTab('catalog')}
            />
          )}

          {currentTab === 'instructor' && (
            <InstructorManagementView onOpenAuth={handleOpenAuth} />
          )}

          {currentTab === 'reports' && (
            <ReportsView onOpenAuth={handleOpenAuth} />
          )}
        </div>
      </main>

      {/* FOOTER INSTITUCIONAL - SKILLHUB CARIBE ERUDITO */}
      <footer className="bg-[#f6f3ef] dark:bg-[#181816] border-t border-[#e6bdb7]/60 dark:border-[#332f2c] transition-colors duration-200">
        <div className="w-full px-6 lg:px-12 py-12 max-w-7xl mx-auto flex flex-col gap-10">
          {/* Top Grid: Brand & Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand column */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.svg"
                  alt="SkillHub Diablo Arlequín"
                  className="w-10 h-10 object-contain rounded-md"
                />
                <div className="flex flex-col">
                  <span className="font-headline text-lg font-bold text-[#0f172a] dark:text-[#ffffff]">
                    Skill<span className="text-[#d9251d] dark:text-[#ffb4a9]">Hub</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase text-white tracking-wider">
                    Plataforma Académica del Caribe
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#334155] dark:text-[#cbd5e1] max-w-sm leading-relaxed">
                Formación práctica y continua con rigor técnico y vocación territorial. Elevamos el potencial productivo y creativo del Caribe colombiano.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#334155] dark:text-[#cbd5e1] mt-1">
                <MapPin className="w-4 h-4 text-white shrink-0" />
                <span>Carrera 54 # 72-142, Barrio Prado · Barranquilla, Atlántico</span>
              </div>
            </div>

            {/* Columna 1: Programas */}
            <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Áreas Formativas
              </span>
              <button
                onClick={() => setCurrentTab('catalog')}
                className="text-left text-[#334155] dark:text-[#cbd5e1] hover:text-[#d9251d] dark:hover:text-[#ffb4a9] transition-colors cursor-pointer"
              >
                Tecnología & IA
              </button>
              <button
                onClick={() => setCurrentTab('catalog')}
                className="text-left text-[#334155] dark:text-[#cbd5e1] hover:text-[#d9251d] dark:hover:text-[#ffb4a9] transition-colors cursor-pointer"
              >
                Arquitectura Tropical
              </button>
              <button
                onClick={() => setCurrentTab('catalog')}
                className="text-left text-[#334155] dark:text-[#cbd5e1] hover:text-[#d9251d] dark:hover:text-[#ffb4a9] transition-colors cursor-pointer"
              >
                Diseño & Creatividad
              </button>
              <button
                onClick={() => setCurrentTab('catalog')}
                className="text-left text-[#334155] dark:text-[#cbd5e1] hover:text-[#d9251d] dark:hover:text-[#ffb4a9] transition-colors cursor-pointer"
              >
                Negocios & Comercio
              </button>
            </div>

            {/* Columna 2: Comunidad */}
            <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Comunidad
              </span>
              <button
                onClick={() => handleOpenAuth('login')}
                className="text-left text-[#334155] dark:text-[#cbd5e1] hover:text-[#d9251d] dark:hover:text-[#ffb4a9] transition-colors cursor-pointer"
              >
                Aula Virtual
              </button>
              <button
                onClick={() => handleOpenAuth('register')}
                className="text-left text-[#334155] dark:text-[#cbd5e1] hover:text-[#d9251d] dark:hover:text-[#ffb4a9] transition-colors cursor-pointer"
              >
                Convocatoria Docente
              </button>
              <span className="text-[#334155] dark:text-[#cbd5e1]">Acreditación Institucional</span>
              <span className="text-[#334155] dark:text-[#cbd5e1]">Sedes Prado & Alto Prado</span>
            </div>

            {/* Columna 3: Institucional */}
            <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Institucional
              </span>
              <span className="text-[#334155] dark:text-[#cbd5e1]">Preguntas Frecuentes</span>
              <span className="text-[#334155] dark:text-[#cbd5e1]">Términos y Condiciones</span>
              <span className="text-[#334155] dark:text-[#cbd5e1]">Política de Tratamiento de Datos</span>
              <span className="text-[#334155] dark:text-[#cbd5e1]">Mesa de Ayuda Académica</span>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Sello */}
          <div className="pt-6 border-t border-[#e6bdb7]/60 dark:border-[#332f2c] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#475569] dark:text-[#94a3b8]">
            <p>© 2024 SkillHub · Sistema de Formación Continua del Caribe. Barranquilla, Colombia.</p>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-white font-bold">
                <ShieldCheck className="w-4 h-4 text-[#d9251d] dark:text-[#ffb4a9]" />
                <span>Certificación Digital con Firma Institucional</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[#006534] dark:text-[#6bdd90] font-bold">
                <Award className="w-4 h-4" />
                <span>Sello de Calidad Educativa</span>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Real Authentication & Password Reset Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authTab}
        initialEmail={recoveryEmail}
        initialToken={recoveryToken}
        onSuccess={() => setCurrentTab('home')}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <MainLayout />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
