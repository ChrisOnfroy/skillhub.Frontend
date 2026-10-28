import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { TopWorkshopReportItemDto } from '../types/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import {
  TrendingUp,
  Users,
  Award,
  RefreshCw,
  BarChart3,
  Shield,
  LogIn,
} from 'lucide-react';

interface ReportsViewProps {
  onOpenAuth: (tab: 'login' | 'register') => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onOpenAuth }) => {
  const { isEmployee } = useAuth();
  const toast = useToast();

  const [report, setReport] = useState<TopWorkshopReportItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    if (!isEmployee) return;
    setLoading(true);
    try {
      const data = await api.getTopWorkshopsReport();
      setReport(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al obtener reporte analítico';
      toast.error('Error de Estadísticas', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEmployee) {
      fetchReport();
    } else {
      setLoading(false);
    }
  }, [isEmployee]);

  if (!isEmployee) {
    return (
      <div className="max-w-md mx-auto py-20 px-8 text-center bg-white dark:bg-[#1e1e1b] rounded-2xl border border-[#e6bdb7] dark:border-[#332f2c] space-y-5 animate-in fade-in shadow-caribe-sm">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#ffdad5] dark:bg-[#930004] flex items-center justify-center text-[#d9251d] dark:text-[#ffdad5]">
          <Shield className="w-7 h-7" />
        </div>
        <h2 className="font-headline text-xl font-bold text-[#0f172a] dark:text-white">
          Métricas de Acceso Restringido
        </h2>
        <p className="text-xs text-[#334155] dark:text-[#cbd5e1] leading-relaxed">
          El panel analítico de demanda y aforo institucional está disponible únicamente para el personal docente acreditado.
        </p>
        <button
          onClick={() => onOpenAuth('login')}
          className="px-6 py-2.5 rounded-xl bg-[#d9251d] hover:bg-[#b30006] text-white font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-caribe-sm cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          <span>Acceder como Docente</span>
        </button>
      </div>
    );
  }

  const totalCapacity = report.reduce((acc, curr) => acc + curr.maxCapacity, 0);
  const totalEnrolled = report.reduce((acc, curr) => acc + curr.activeEnrollmentsCount, 0);
  const averageOccupancy =
    report.length > 0
      ? Math.round(
          report.reduce((acc, curr) => acc + curr.occupancyPercentage, 0) / report.length
        )
      : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#1e1e1b] rounded-2xl border border-[#e6bdb7] dark:border-[#332f2c] shadow-caribe-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono text-white uppercase tracking-widest font-semibold">
            Observatorio Institucional
          </span>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#0f172a] dark:text-white mt-0.5">
            Analítica de Demanda & Aforos
          </h1>
          <p className="text-xs text-[#334155] dark:text-[#cbd5e1] mt-1">
            Telemetría en tiempo real de inscripciones y porcentaje de ocupación por cátedra.
          </p>
        </div>

        <button
          onClick={fetchReport}
          className="p-2.5 text-[#334155] dark:text-[#cbd5e1] hover:text-[#d9251d] dark:hover:text-white rounded-xl bg-[#f0edea] dark:bg-[#22221f] border border-[#e6bdb7] dark:border-[#332f2c] flex items-center gap-2 text-xs font-mono font-bold self-start sm:self-auto transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 text-[#d9251d] ${loading ? 'animate-spin' : ''}`} />
          <span>Sincronizar</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1e1e1b] rounded-2xl p-5 border border-[#e6bdb7] dark:border-[#332f2c] shadow-caribe-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-black dark:bg-[#27272a] flex items-center justify-center text-white">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#334155] dark:text-[#cbd5e1]">
              Ocupación Promedio
            </p>
            <p className="text-2xl font-bold font-mono text-[#0f172a] dark:text-white mt-0.5">
              {averageOccupancy}%
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e1e1b] rounded-2xl p-5 border border-[#e6bdb7] dark:border-[#332f2c] shadow-caribe-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#ffdad5] dark:bg-[#930004] flex items-center justify-center text-[#d9251d] dark:text-[#ffdad5]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#334155] dark:text-[#cbd5e1]">
              Matriculados Totales
            </p>
            <p className="text-2xl font-bold font-mono text-[#0f172a] dark:text-white mt-0.5">
              {totalEnrolled} <span className="text-xs text-[#475569] font-normal">/ {totalCapacity}</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e1e1b] rounded-2xl p-5 border border-[#e6bdb7] dark:border-[#332f2c] shadow-caribe-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#87faaa]/40 dark:bg-[#005229] flex items-center justify-center text-[#006534] dark:text-[#87faaa]">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#334155] dark:text-[#cbd5e1]">
              Cátedras Analizadas
            </p>
            <p className="text-2xl font-bold font-mono text-[#0f172a] dark:text-white mt-0.5">
              {report.length}
            </p>
          </div>
        </div>
      </div>

      {/* Rankings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white dark:bg-[#1e1e1b] rounded-2xl animate-pulse border border-[#e6bdb7] dark:border-[#332f2c]" />
          ))}
        </div>
      ) : report.length === 0 ? (
        <div className="text-center py-20 px-6 bg-white dark:bg-[#1e1e1b] rounded-2xl border border-[#e6bdb7] dark:border-[#332f2c] max-w-lg mx-auto space-y-3 shadow-caribe-sm">
          <BarChart3 className="w-10 h-10 text-[#475569] mx-auto" />
          <h3 className="font-headline text-lg font-bold text-[#0f172a] dark:text-white">
            Sin datos de ocupación disponibles
          </h3>
          <p className="text-xs text-[#334155] dark:text-[#cbd5e1]">
            Las estadísticas se calcularán automáticamente conforme los alumnos se inscriban.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {report.map((item, index) => {
            return (
              <div
                key={item.workshopId}
                className="bg-white dark:bg-[#1e1e1b] rounded-2xl border border-[#e6bdb7] dark:border-[#332f2c] shadow-caribe-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-black dark:hover:border-[#52525b] transition-all"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-black dark:bg-[#22221f] border border-[#e6bdb7] dark:border-[#332f2c] flex items-center justify-center font-mono font-bold text-sm text-white shrink-0">
                    #{index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-[11px] font-bold text-white bg-black dark:bg-[#27272a] px-2 py-0.5 rounded border border-black dark:border-[#332f2c]">
                        {item.code || 'CÁTEDRA'}
                      </span>
                      <span className="text-xs text-[#334155] dark:text-[#cbd5e1]">
                        Docente: <strong className="text-[#0f172a] dark:text-white">{item.instructorName || item.instructorEmail}</strong>
                      </span>
                    </div>

                    <h3 className="font-headline text-base font-bold text-[#0f172a] dark:text-white truncate">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-[#334155] dark:text-[#cbd5e1] font-mono mt-1">
                      <span>{item.activeEnrollmentsCount} inscritos</span>
                      <span>•</span>
                      <span>{item.availableSpots} cupos libres</span>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-56 space-y-1.5 shrink-0">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[#334155] dark:text-[#cbd5e1]">Aforo:</span>
                    <span className="font-bold text-[#0f172a] dark:text-white">
                      {Math.round(item.occupancyPercentage)}%
                    </span>
                  </div>

                  <div className="w-full bg-[#f0edea] dark:bg-[#22221f] h-2.5 rounded-full overflow-hidden border border-[#e6bdb7]/60 dark:border-[#332f2c]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.occupancyPercentage >= 100
                          ? 'bg-[#ba1a1a]'
                          : item.occupancyPercentage >= 75
                          ? 'bg-[#f6b800]'
                          : 'bg-[#2c657b]'
                      }`}
                      style={{ width: `${Math.min(100, item.occupancyPercentage)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
