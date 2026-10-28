import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  GraduationCap,
  Building2,
  CheckCircle,
  ArrowRight,
  School,
  Brain,
  Wifi,
  Coffee,
  Monitor,
  BadgeCheck,
  Sparkles,
} from 'lucide-react';

interface HomeViewProps {
  onNavigateToCatalog: () => void;
  onOpenAuth: (tab: 'login' | 'register') => void;
  onNavigateToInstructor?: () => void;
  onNavigateToMyEnrollments?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateToCatalog,
  onOpenAuth,
  onNavigateToInstructor,
  onNavigateToMyEnrollments,
}) => {
  const { isEmployee, isParticipant } = useAuth();
  return (
    <div className="space-y-16 animate-in fade-in duration-300">
      {/* 2. HERO SECTION: PUJANZA CARIBE ERUDITO */}
      <section className="relative pt-6 pb-12 lg:pt-10 lg:pb-16 overflow-hidden border-b border-[#e6bdb7]/60 dark:border-[#332f2c]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text Content (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Cultural Academic Badge */}

              <h1 className="font-headline text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#0f172a] dark:text-white tracking-tight leading-[1.12]">
                La excelencia formativa de {' '}
                <span className="text-[#d9251d] dark:text-[#ffb4a9] relative inline-block">
                  Barranquilla
                  <svg
                    className="absolute left-0 -bottom-1.5 w-full h-2.5 text-[#f6b800]"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 12"
                  >
                    <path d="M0,7 Q40,0 100,8" fill="none" stroke="currentColor" strokeWidth="4" />
                  </svg>
                </span>{' '}
                convergen en Skill{''}
                <span className="text-[#d9251d] dark:text-[#ffb4a9] relative inline-block">
                Hub.
                  <svg
                    className="absolute left-0 -bottom-1.5 w-full h-2.5 text-[#f6b800]"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 12"
                  >
                    <path d="M0,7 Q40,0 100,8" fill="none" stroke="currentColor" strokeWidth="4" />
                  </svg>
                </span>{' '}
              </h1>

              <p className="text-base sm:text-lg text-[#334155] dark:text-[#cbd5e1] max-w-2xl leading-relaxed">
                Plataforma de talleres prácticos intensivos y formación continua liderada por destacados profesionales de la región Caribe. Conectamos rigor técnico, cultura viva e inserción en el ecosistema productivo.
              </p>

              {/* Action Cluster */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onNavigateToCatalog}
                  className="flex items-center gap-2 bg-white dark:bg-[#18181b] text-[#0f172a] dark:text-white border-2 border-[#cbd5e1] dark:border-[#27272a] hover:border-black dark:hover:border-[#52525b] hover:bg-[#f8fafc] dark:hover:bg-[#27272a] px-6 py-3.5 rounded-lg text-sm font-bold transition-all active:translate-y-[1px] cursor-pointer shadow-sm"
                >
                  <Compass className="w-5 h-5 text-white" />
                  <span>Explorar Talleres Abiertos</span>
                </button>
                {isEmployee ? (
                  <button
                    onClick={onNavigateToInstructor}
                    className="flex items-center gap-2 bg-[#d9251d] hover:bg-[#b30006] text-white px-6 py-3.5 rounded-lg text-sm font-bold shadow-caribe-sm hover:shadow-caribe-md active:translate-y-[1px] transition-all cursor-pointer"
                  >
                    <GraduationCap className="w-5 h-5 text-white" />
                    <span>Panel de Gestión Docente</span>
                  </button>
                ) : isParticipant ? (
                  <button
                    onClick={onNavigateToMyEnrollments}
                    className="flex items-center gap-2 bg-[#d9251d] hover:bg-[#b30006] text-white px-6 py-3.5 rounded-lg text-sm font-bold shadow-caribe-sm hover:shadow-caribe-md active:translate-y-[1px] transition-all cursor-pointer"
                  >
                    <GraduationCap className="w-5 h-5 text-white" />
                    <span>Mi Aula Virtual</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="flex items-center gap-2 bg-[#d9251d] hover:bg-[#b30006] text-white px-6 py-3.5 rounded-lg text-sm font-bold shadow-caribe-sm hover:shadow-caribe-md active:translate-y-[1px] transition-all cursor-pointer"
                  >
                    <GraduationCap className="w-5 h-5 text-white" />
                    <span>Matricularse como Estudiante</span>
                  </button>
                )}
              </div>

              {/* Proof Metrics Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-6 border-t border-[#e6bdb7]/60 dark:border-[#332f2c]">
                <div className="flex flex-col">
                  <span className="font-headline text-2xl font-extrabold text-white">
                     Talleres Activos
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline text-2xl font-extrabold text-[#d9251d] dark:text-[#ffb4a9]">
                    Egresados Atlántico
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline text-2xl font-extrabold text-[#006534] dark:text-[#6bdd90]">
                    Instructores Expertos
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline text-2xl font-extrabold text-white">
                    Sedes Presenciales
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Graphic (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#e6bdb7]/80 dark:border-[#332f2c] shadow-caribe-md bg-white dark:bg-[#1e1e1b] p-2">
                <img
                  className="w-full h-[400px] object-cover rounded-xl"
                  alt="Taller Académico en Barranquilla"
                  src="https://www.utadeo.edu.co/sites/tadeo/files/node/news/field_images/539254b58cd07e4f749f150091dcc1f2.jpg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
            <br></br>
            <br></br>
            <br></br>
      {/* 3. ROLE PANELS ("DISEÑADO PARA NUESTRA COMUNIDAD") */}
      <section className="py-12 bg-[#f6f3ef] dark:bg-[#181816] rounded-2xl p-6 sm:p-10 border border-[#e6bdb7]/60 dark:border-[#332f2c]" id="roles">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-[#d9251d] dark:text-[#ffb4a9] font-bold">
              Comunidad Académica
            </span>
            <h2 className="font-headline text-2xl sm:text-4xl font-extrabold text-[#0f172a] dark:text-white tracking-tight mt-1">
              Diseñado para nuestra comunidad
            </h2>
            <p className="text-sm text-[#334155] dark:text-[#cbd5e1] mt-2">
              Un ecosistema donde el rigor técnico convive con la calidez y el empuje innovador de Barranquilla.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card Para Estudiantes */}
            <div className="bg-white dark:bg-[#1e1e1b] p-8 rounded-2xl border border-[#e6bdb7]/80 dark:border-[#332f2c] shadow-caribe-sm relative overflow-hidden group hover:border-[#d9251d] dark:hover:border-[#ffb4a9] transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 dark:bg-white/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-black dark:bg-[#27272a] flex items-center justify-center text-white">
                  <School className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    Ruta de Formación
                  </span>
                  <h3 className="font-headline text-xl font-bold text-[#0f172a] dark:text-white">
                    Para Estudiantes
                  </h3>
                </div>
              </div>
              <p className="text-sm text-[#334155] dark:text-[#cbd5e1] mb-6 leading-relaxed">
                Desarrolla habilidades aplicables desde el primer día con metodología orientada a casos de la región Caribe y certificación digital avalada.
              </p>
              <ul className="space-y-2.5 mb-8 text-xs sm:text-sm text-[#0f172a] dark:text-white">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#006534] dark:text-[#6bdd90] shrink-0" />
                  <span>Portafolio con proyectos reales del Atlántico</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#006534] dark:text-[#6bdd90] shrink-0" />
                  <span>Acceso al Campus Prado, talleres y laboratorios</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#006534] dark:text-[#6bdd90] shrink-0" />
                  <span>Certificación digital oficial en formato PDF</span>
                </li>
              </ul>
              <button
                onClick={onNavigateToCatalog}
                className="inline-flex items-center gap-2 text-white font-bold hover:text-[#d9251d] dark:hover:text-[#ffb4a9] group-hover:translate-x-1 transition-all text-sm cursor-pointer"
              >
                <span>Descubrir talleres disponibles</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card Para Instructores */}
            <div className="bg-white dark:bg-[#1e1e1b] p-8 rounded-2xl border border-[#e6bdb7]/80 dark:border-[#332f2c] shadow-caribe-sm relative overflow-hidden group hover:border-[#d9251d] dark:hover:border-[#ffb4a9] transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d9251d]/5 dark:bg-[#ffb4a9]/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#ffdad5] dark:bg-[#930004] flex items-center justify-center text-[#d9251d] dark:text-[#ffdad5]">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#d9251d] dark:text-[#ffb4a9] uppercase tracking-wider">
                    Cuerpo Docente
                  </span>
                  <h3 className="font-headline text-xl font-bold text-[#0f172a] dark:text-white">
                    Para Instructores
                  </h3>
                </div>
              </div>
              <p className="text-sm text-[#334155] dark:text-[#cbd5e1] mb-6 leading-relaxed">
                Lidera cohortes formativas, comparte tu experiencia profesional activa y potencia el talento local con autonomía y soporte curricular.
              </p>
              <ul className="space-y-2.5 mb-8 text-xs sm:text-sm text-[#0f172a] dark:text-white">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#d9251d] dark:text-[#ffb4a9] shrink-0" />
                  <span>Plataforma ágil para control de aforos e inscritos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#d9251d] dark:text-[#ffb4a9] shrink-0" />
                  <span>Importación masiva de participantes vía CSV</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#d9251d] dark:text-[#ffb4a9] shrink-0" />
                  <span>Dashboard de métricas y ocupación en tiempo real</span>
                </li>
              </ul>
              <button
                onClick={() => onOpenAuth('register')}
                className="inline-flex items-center gap-2 text-[#d9251d] dark:text-[#ffb4a9] font-bold hover:text-white group-hover:translate-x-1 transition-all text-sm cursor-pointer"
              >
                <span>Acceder como instructor o postular programa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. METODOLOGÍA CON RIGOR Y CALIDEZ */}
      <section className="py-12 border-y border-[#e6bdb7]/60 dark:border-[#332f2c]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-white font-bold">
              Modelo Formativo
            </span>
            <h2 className="font-headline text-2xl sm:text-4xl font-extrabold text-[#0f172a] dark:text-white tracking-tight mt-1">
              Metodología con Rigor y Calidez
            </h2>
            <p className="text-sm text-[#334155] dark:text-[#cbd5e1] mt-2">
              Conectamos el estándar académico de alto impacto con las oportunidades reales de la región.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pilar 1 */}
            <div className="bg-white dark:bg-[#1e1e1b] p-8 rounded-2xl border border-[#e6bdb7]/80 dark:border-[#332f2c] shadow-caribe-sm flex flex-col items-start hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-[#ffdad5] dark:bg-[#930004] text-[#d9251d] dark:text-[#ffdad5] flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold text-[#d9251d] dark:text-[#ffb4a9] tracking-wider uppercase mb-1">
                Pilar 01
              </span>
              <h3 className="font-headline text-lg font-bold text-[#0f172a] dark:text-white mb-3">
                Aprendizaje en Casos Reales
              </h3>
              <p className="text-xs sm:text-sm text-[#334155] dark:text-[#cbd5e1] leading-relaxed">
                Ejercicios basados en retos vigentes: el puerto de Barranquilla, las dinámicas del río Magdalena, las industrias creativas y la competitividad empresarial del Caribe.
              </p>
            </div>

            {/* Pilar 2 */}
            <div className="bg-white dark:bg-[#1e1e1b] p-8 rounded-2xl border border-[#e6bdb7]/80 dark:border-[#332f2c] shadow-caribe-sm flex flex-col items-start hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-black dark:bg-[#27272a] text-white flex items-center justify-center mb-6">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="text-[10px] font-bold text-white tracking-wider uppercase mb-1">
                Pilar 02
              </span>
              <h3 className="font-headline text-lg font-bold text-[#0f172a] dark:text-white mb-3">
                Mentorías y Acompañamiento
              </h3>
              <p className="text-xs sm:text-sm text-[#334155] dark:text-[#cbd5e1] leading-relaxed">
                Sesiones guiadas con retroalimentación personalizada por docentes en ejercicio para asegurar que cada entrega cumpla estándares de calidad profesional.
              </p>
            </div>

            {/* Pilar 3 */}
            <div className="bg-white dark:bg-[#1e1e1b] p-8 rounded-2xl border border-[#e6bdb7]/80 dark:border-[#332f2c] shadow-caribe-sm flex flex-col items-start hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-[#87faaa]/40 dark:bg-[#005229] text-[#006534] dark:text-[#87faaa] flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold text-[#006534] dark:text-[#6bdd90] tracking-wider uppercase mb-1">
                Pilar 03
              </span>
              <h3 className="font-headline text-lg font-bold text-[#0f172a] dark:text-white mb-3">
                Vinculación y Certificación
              </h3>
              <p className="text-xs sm:text-sm text-[#334155] dark:text-[#cbd5e1] leading-relaxed">
                Conexión con redes de egresados y emisión inmediata de certificados oficiales con firma digital institucional en formato PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SEDES & INFRAESTRUCTURA */}
      <section className="max-w-7xl mx-auto" id="comunidad">
        <div className="bg-[#f6f3ef] dark:bg-[#1e1e1b] rounded-2xl p-8 lg:p-14 relative overflow-hidden border border-[#e6bdb7] dark:border-[#332f2c] shadow-caribe-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <h2 className="font-headline text-2xl sm:text-4xl font-extrabold text-[#0f172a] dark:text-white tracking-tight leading-tight">
                Instalaciones diseñadas para la concentración y el intercambio
              </h2>
              <p className="text-sm sm:text-base text-[#334155] dark:text-[#cbd5e1] max-w-xl leading-relaxed">
                Ambientes de aprendizaje dotados de conectividad de alta velocidad, laboratorios de cómputo y espacios integrados para clases presenciales y virtuales.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={onNavigateToCatalog}
                  className="bg-white dark:bg-[#121212] hover:bg-[#f0edea] dark:hover:bg-[#22221f] text-[#0f172a] dark:text-white px-6 py-3 rounded-lg text-sm font-bold transition-all border border-black dark:border-[#332f2c] active:translate-y-[1px] cursor-pointer"
                >
                  Explorar Cátedras Disponibles
                </button>
                {isEmployee ? (
                  <button
                    onClick={onNavigateToInstructor}
                    className="bg-[#d9251d] hover:bg-[#b30006] text-white px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-caribe-sm active:translate-y-[1px] cursor-pointer"
                  >
                    Gestionar mis Cátedras
                  </button>
                ) : isParticipant ? (
                  <button
                    onClick={onNavigateToMyEnrollments}
                    className="bg-[#d9251d] hover:bg-[#b30006] text-white px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-caribe-sm active:translate-y-[1px] cursor-pointer"
                  >
                    Ver mis Matrículas
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="bg-[#d9251d] hover:bg-[#b30006] text-white px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-caribe-sm active:translate-y-[1px] cursor-pointer"
                  >
                    Matricularse Ahora
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-[#121212] p-5 rounded-xl border border-[#e6bdb7] dark:border-[#332f2c] shadow-caribe-sm">
                <Wifi className="w-7 h-7 text-white mb-2" />
                <h4 className="font-headline text-base font-bold text-[#0f172a] dark:text-white mb-1">Fibra Óptica</h4>
                <p className="text-xs text-[#334155] dark:text-[#cbd5e1]">Conexión dedicada en aulas y espacios comunes.</p>
              </div>
              <div className="bg-white dark:bg-[#121212] p-5 rounded-xl border border-[#e6bdb7] dark:border-[#332f2c] shadow-caribe-sm">
                <Coffee className="w-7 h-7 text-[#f6b800] mb-2" />
                <h4 className="font-headline text-base font-bold text-[#0f172a] dark:text-white mb-1">Café & Coworking</h4>
                <p className="text-xs text-[#334155] dark:text-[#cbd5e1]">Áreas de estudio individual y colaborativo.</p>
              </div>
              <div className="bg-white dark:bg-[#121212] p-5 rounded-xl border border-[#e6bdb7] dark:border-[#332f2c] shadow-caribe-sm">
                <Monitor className="w-7 h-7 text-white mb-2" />
                <h4 className="font-headline text-base font-bold text-[#0f172a] dark:text-white mb-1">Laboratorios</h4>
                <p className="text-xs text-[#334155] dark:text-[#cbd5e1]">Estaciones de trabajo de alto rendimiento.</p>
              </div>
              <div className="bg-white dark:bg-[#121212] p-5 rounded-xl border border-[#e6bdb7] dark:border-[#332f2c] shadow-caribe-sm">
                <BadgeCheck className="w-7 h-7 text-[#006534] dark:text-[#6bdd90] mb-2" />
                <h4 className="font-headline text-base font-bold text-[#0f172a] dark:text-white mb-1">Acreditación</h4>
                <p className="text-xs text-[#334155] dark:text-[#cbd5e1]">Certificación verificable con validez institucional.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
