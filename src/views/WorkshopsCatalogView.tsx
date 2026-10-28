import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import type { WorkshopResponseDto } from '../types/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import {
  Search,
  Calendar,
  Users,
  RefreshCw,
  BookOpen,
} from 'lucide-react';

interface WorkshopsCatalogViewProps {
  onOpenAuth: (tab: 'login' | 'register') => void;
  onNavigateToMyEnrollments: () => void;
  onNavigateToInstructor?: () => void;
}

export const WorkshopsCatalogView: React.FC<WorkshopsCatalogViewProps> = ({
  onOpenAuth,
  onNavigateToMyEnrollments,
  onNavigateToInstructor,
}) => {
  const [workshops, setWorkshops] = useState<WorkshopResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedModality, setSelectedModality] = useState<string>('all');

  const { isAuthenticated, isParticipant, isEmployee, user } = useAuth();
  const toast = useToast();

  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const data = await api.getWorkshops();
      setWorkshops(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar talleres';
      toast.error('Error de Conexión', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const handleEnroll = async (workshop: WorkshopResponseDto) => {
    if (!isAuthenticated) {
      onOpenAuth('login');
      return;
    }

    if (isEmployee) {
      toast.error('Restricción de Perfil', 'Los instructores no pueden inscribirse en cátedras.');
      return;
    }

    setEnrollingId(workshop.id);
    try {
      await api.enrollInWorkshop({ workshopId: workshop.id });
      toast.success(
        'Inscripción Confirmada',
        `Has sido matriculado formalmente en: ${workshop.title}`
      );
      fetchWorkshops();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al formalizar matrícula';
      toast.error('No se pudo completar la inscripción', msg);
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredWorkshops = useMemo(() => {
    return workshops.filter((w) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (w.title || '').toLowerCase().includes(q) ||
        (w.code || '').toLowerCase().includes(q) ||
        (w.description || '').toLowerCase().includes(q) ||
        (w.instructorName || '').toLowerCase().includes(q) ||
        (w.instructorSpecialty || '').toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (selectedCategory !== 'all') {
        const spec = (w.instructorSpecialty || '').toLowerCase();
        const title = (w.title || '').toLowerCase();
        if (!spec.includes(selectedCategory) && !title.includes(selectedCategory)) {
          return false;
        }
      }

      return true;
    });
  }, [workshops, searchQuery, selectedCategory]);

  const getInitials = (name?: string | null) => {
    if (!name) return 'SK';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // Top border accent tracks: Rojo Carnaval, Negro, Verde Palmera, Amarillo Solar
  const trackColors = [
    { border: 'border-t-[#d9251d]' },
    { border: 'border-t-black dark:border-t-black' },
    { border: 'border-t-[#006534]' },
    { border: 'border-t-[#f6b800]' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* 4. CATÁLOGO PRINCIPAL DE TALLERES ACADÉMICOS */}
      <section className="max-w-7xl mx-auto" id="catalogo">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="font-headline text-2xl sm:text-4xl font-extrabold text-[#0f172a] dark:text-white tracking-tight">
              Catálogo de Talleres & Cátedras
            </h2>
            <p className="text-sm text-[#334155] dark:text-[#cbd5e1] mt-1 max-w-2xl">
              Cátedras intensivas orientadas a la práctica, con control estricto de aforos y certificación oficial con validez institucional.
            </p>
            {isAuthenticated && isParticipant && (
              <div className="pt-2">
                <button
                  onClick={onNavigateToMyEnrollments}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d9251d] dark:text-[#ffb4a9] hover:underline cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Ver mis talleres matriculados →</span>
                </button>
              </div>
            )}
            {isAuthenticated && isEmployee && onNavigateToInstructor && (
              <div className="pt-2">
                <button
                  onClick={onNavigateToInstructor}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#d9251d] hover:underline cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Ir a Gestión Docente y Cátedras →</span>
                </button>
              </div>
            )}
          </div>

          {/* Search and Modality Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-[#475569] dark:text-[#94a3b8] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar taller o instructor..."
                className="w-full bg-[#ffffff] dark:bg-[#1e1e1b] border border-[#e6bdb7] dark:border-[#332f2c] pl-10 pr-4 py-2 rounded-lg text-xs sm:text-sm focus:border-[#2c657b] dark:focus:border-[#98cee7] focus:ring-1 focus:ring-[#2c657b] outline-none text-[#0f172a] dark:text-white placeholder:text-[#64748b] shadow-xs"
              />
            </div>

            {/* Modality Selector */}
            <select
              value={selectedModality}
              onChange={(e) => setSelectedModality(e.target.value)}
              className="bg-[#ffffff] dark:bg-[#1e1e1b] border border-[#e6bdb7] dark:border-[#332f2c] px-3 py-2 rounded-lg text-xs sm:text-sm text-[#0f172a] dark:text-white focus:border-black dark:focus:border-white outline-none shadow-xs"
            >
              <option value="all">Todas las Modalidades</option>
              <option value="presencial">Presencial (Sedes Prado)</option>
              <option value="virtual">100% Aula Virtual</option>
              <option value="hibrido">Modalidad Híbrida</option>
            </select>

            <button
              onClick={fetchWorkshops}
              title="Actualizar catálogo"
              className="p-2 text-[#334155] dark:text-[#cbd5e1] hover:text-[#d9251d] dark:hover:text-white rounded-lg hover:bg-[#f0edea] dark:hover:bg-[#22221f] transition-colors border border-[#e6bdb7] dark:border-[#332f2c] cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Category Filter Pills (Caribe Erudito) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {[
            { id: 'all', label: 'Todos los Talleres' },
            { id: 'tecnologia', label: 'Tecnología & IA' },
            { id: 'arquitectura', label: 'Arquitectura & Urbanismo' },
            { id: 'diseno', label: 'Diseño & Creatividad' },
            { id: 'negocios', label: 'Negocios & Comercio' },
            { id: 'comunicacion', label: 'Comunicación & Narrativas' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#d9251d] text-white shadow-caribe-sm'
                  : 'bg-[#ffffff] dark:bg-[#1e1e1b] hover:bg-[#f6f3ef] dark:hover:bg-[#22221f] text-[#334155] dark:text-[#cbd5e1] border border-[#e6bdb7] dark:border-[#332f2c]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Workshop Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-[#ffffff] dark:bg-[#1e1e1b] border border-[#e6bdb7] dark:border-[#332f2c] animate-pulse"
              />
            ))}
          </div>
        ) : filteredWorkshops.length === 0 ? (
          <div className="text-center py-20 px-6 bg-[#ffffff] dark:bg-[#1e1e1b] rounded-2xl border border-[#e6bdb7] dark:border-[#332f2c] max-w-lg mx-auto space-y-3 shadow-caribe-sm">
            <BookOpen className="w-10 h-10 text-[#475569] mx-auto" />
            <h3 className="font-headline text-lg font-bold text-[#0f172a] dark:text-white">
              No se encontraron cátedras activas
            </h3>
            <p className="text-xs text-[#334155] dark:text-[#cbd5e1]">
              Intenta con otro término de búsqueda o limpia los filtros de categoría.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorkshops.map((w, index) => {
              const isFull = w.availableSpots <= 0;
              const track = trackColors[index % trackColors.length];

              return (
                <div
                  key={w.id}
                  className={`bg-[#ffffff] dark:bg-[#1e1e1b] rounded-2xl border border-[#e6bdb7]/80 dark:border-[#332f2c] border-t-4 ${track.border} shadow-caribe-sm hover:shadow-caribe-md hover:border-black dark:hover:border-[#52525b] transition-all duration-200 flex flex-col justify-between overflow-hidden group`}
                >
                  <div className="p-6">
                    <h3 className="font-headline text-lg font-bold text-[#0f172a] dark:text-white group-hover:text-[#d9251d] dark:group-hover:text-[#ffb4a9] transition-colors mb-2 leading-snug">
                      {w.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#334155] dark:text-[#cbd5e1] line-clamp-3 mb-6 leading-relaxed">
                      {w.description || 'Formación intensiva orientada a la práctica con mentoría personalizada y desarrollo de portafolio aplicable.'}
                    </p>

                    {/* Metadata specs */}
                    <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#e6bdb7]/50 dark:border-[#332f2c] text-xs text-[#334155] dark:text-[#cbd5e1] mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-white" />
                        <span>Inicio Próximo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#d9251d] dark:text-[#ffb4a9]" />
                        <span>{w.availableSpots} cupos libres</span>
                      </div>
                    </div>

                    {/* Instructor block */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#f0edea] dark:bg-[#181816] flex items-center justify-center text-white font-bold text-xs border border-black dark:border-[#332f2c]">
                        {getInitials(w.instructorName)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#0f172a] dark:text-white">
                          {w.instructorName || 'Docente Asignado'}
                        </span>
                        <span className="text-[11px] text-[#475569] dark:text-[#cbd5e1]">
                          {w.instructorSpecialty || 'Cuerpo Docente Caribe'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Footer */}
                  <div className="bg-[#f6f3ef] dark:bg-[#181816] px-6 py-4 border-t border-[#e6bdb7]/60 dark:border-[#332f2c] flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#475569] dark:text-[#cbd5e1] uppercase font-bold tracking-wider">
                        Aforo
                      </span>
                      <span className="font-headline text-sm font-bold text-[#0f172a] dark:text-white">
                        {w.activeEnrollmentsCount} / {w.maxCapacity} Inscritos
                      </span>
                    </div>

                    {isEmployee ? (
                      <span className="text-xs font-mono font-bold text-white bg-black dark:bg-[#22221f] px-3 py-1.5 rounded-lg border border-[#cbd5e1] dark:border-[#332f2c]">
                        {w.instructorEmail === user?.email ? 'Tu Cátedra Asignada' : 'Vista Docente'}
                      </span>
                    ) : isFull ? (
                      <span className="text-xs font-bold text-[#334155] dark:text-[#cbd5e1] bg-[#f0edea] dark:bg-[#22221f] px-3 py-1.5 rounded-lg border border-[#e6bdb7] dark:border-[#332f2c]">
                        Aforo Completo
                      </span>
                    ) : !isAuthenticated ? (
                      <button
                        onClick={() => onOpenAuth('login')}
                        className="bg-[#d9251d] hover:bg-[#b30006] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-caribe-sm active:translate-y-[1px] cursor-pointer"
                      >
                        Acceder para Inscribirme
                      </button>
                    ) : isParticipant ? (
                      <button
                        onClick={() => handleEnroll(w)}
                        disabled={enrollingId === w.id}
                        className="bg-[#d9251d] hover:bg-[#b30006] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-caribe-sm hover:shadow-caribe-md active:translate-y-[1px] disabled:opacity-50 cursor-pointer"
                      >
                        {enrollingId === w.id ? 'Inscribiendo...' : 'Inscribirme en Cátedra'}
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
