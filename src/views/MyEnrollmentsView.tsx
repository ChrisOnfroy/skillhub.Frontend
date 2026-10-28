import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { EnrollmentResponseDto } from '../types/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import {
  GraduationCap,
  Download,
  XCircle,
  FileCheck,
  RefreshCw,
  LogIn,
  School,
  Calendar,
} from 'lucide-react';

interface MyEnrollmentsViewProps {
  onOpenAuth: (tab: 'login' | 'register') => void;
  onNavigateToCatalog: () => void;
}

export const MyEnrollmentsView: React.FC<MyEnrollmentsViewProps> = ({
  onOpenAuth,
  onNavigateToCatalog,
}) => {
  const { isAuthenticated, isParticipant, isEmployee, user } = useAuth();
  const toast = useToast();

  const [enrollments, setEnrollments] = useState<EnrollmentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchMyEnrollments = async () => {
    if (!isAuthenticated || !isParticipant) return;
    setLoading(true);
    try {
      const data = await api.getMyEnrollments();
      setEnrollments(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al consultar inscripciones';
      toast.error('Error de Consulta', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyEnrollments();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleCancel = async (enrollment: EnrollmentResponseDto) => {
    const confirmCancel = window.confirm(
      `¿Deseas cancelar formalmente tu matrícula en "${enrollment.workshopTitle}"? Esta acción liberará tu cupo en el sistema.`
    );
    if (!confirmCancel) return;

    setCancellingId(enrollment.id);
    try {
      await api.cancelEnrollment(enrollment.id);
      toast.info('Matrícula Cancelada', `Has liberado tu cupo en: ${enrollment.workshopTitle}`);
      fetchMyEnrollments();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cancelar';
      toast.error('Fallo de operación', msg);
    } finally {
      setCancellingId(null);
    }
  };

  const handleDownloadCertificate = async (enrollment: EnrollmentResponseDto) => {
    setDownloadingId(enrollment.id);
    try {
      await api.downloadCertificate(enrollment.id, enrollment.workshopCode || 'ACADEMIA');
      toast.success(
        'Certificado Descargado',
        `Se ha generado el documento oficial para: ${enrollment.workshopTitle}`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo descargar el certificado';
      toast.error('Error al generar PDF', msg);
    } finally {
      setDownloadingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20 px-6 bg-white dark:bg-[#1e1e1b] rounded-3xl border border-[#e6bdb7] dark:border-[#332f2c] max-w-lg mx-auto space-y-4 shadow-caribe-sm">
        <School className="w-12 h-12 text-white mx-auto" />
        <h2 className="font-headline text-2xl font-bold text-[#0f172a] dark:text-white">
          Aula Virtual SkillHub
        </h2>
        <p className="text-sm text-[#334155] dark:text-[#cbd5e1]">
          Inicia sesión con tus credenciales oficiales para consultar tus talleres matriculados y descargar tus certificados oficiales en PDF.
        </p>
        <button
          onClick={() => onOpenAuth('login')}
          className="px-6 py-2.5 rounded-xl bg-[#d9251d] hover:bg-[#b30006] text-white font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-caribe-sm cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          <span>Acceder a mi Cuenta</span>
        </button>
      </div>
    );
  }

  if (isEmployee) {
    return (
      <div className="text-center py-20 px-6 bg-white dark:bg-[#1e1e1b] rounded-3xl border border-[#e6bdb7] dark:border-[#332f2c] max-w-lg mx-auto space-y-4 shadow-caribe-sm">
        <School className="w-12 h-12 text-white mx-auto" />
        <h2 className="font-headline text-2xl font-bold text-[#0f172a] dark:text-white">
          Acceso Exclusivo para Estudiantes
        </h2>
        <p className="text-sm text-[#334155] dark:text-[#cbd5e1]">
          Como docente o instructor, tu gestión académica, cátedras y listas de matriculados se administran desde el panel de Gestión Docente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#1e1e1b] rounded-2xl border border-[#e6bdb7] dark:border-[#332f2c] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-caribe-sm">
        <div>
          <span className="text-xs uppercase tracking-widest text-white font-bold">
            Expediente Académico
          </span>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#0f172a] dark:text-white mt-0.5">
            Mi Aula Virtual & Talleres
          </h1>
          <p className="text-xs text-[#334155] dark:text-[#cbd5e1] mt-1">
            Estudiante: <strong className="text-[#0f172a] dark:text-white">{user?.fullName}</strong> ({user?.email})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchMyEnrollments}
            className="p-2.5 text-[#334155] dark:text-[#cbd5e1] hover:text-[#d9251d] dark:hover:text-[#ffb4a9] rounded-xl bg-[#f6f3ef] dark:bg-[#22221f] border border-[#e6bdb7] dark:border-[#332f2c] transition-colors cursor-pointer"
            title="Actualizar inscripciones"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onNavigateToCatalog}
            className="px-4 py-2.5 rounded-xl bg-[#d9251d] hover:bg-[#b30006] text-white text-xs font-bold transition-all shadow-caribe-sm cursor-pointer"
          >
            + Explorar más cátedras
          </button>
        </div>
      </div>

      {/* Enrollments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white dark:bg-[#1e1e1b] rounded-2xl animate-pulse border border-[#e6bdb7] dark:border-[#332f2c]" />
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <div className="text-center py-20 px-6 bg-white dark:bg-[#1e1e1b] rounded-3xl border border-[#e6bdb7] dark:border-[#332f2c] max-w-lg mx-auto space-y-4 shadow-caribe-sm">
          <GraduationCap className="w-10 h-10 text-[#475569] mx-auto" />
          <h3 className="font-headline text-lg font-bold text-[#0f172a] dark:text-white">
            Sin matrículas registradas
          </h3>
          <p className="text-xs text-[#334155] dark:text-[#cbd5e1]">
            Aún no te has inscrito en ningún taller activo este período.
          </p>
          <button
            onClick={onNavigateToCatalog}
            className="px-5 py-2.5 rounded-xl bg-[#d9251d] hover:bg-[#b30006] text-white font-bold text-xs shadow-caribe-sm transition-all cursor-pointer"
          >
            Consultar Oferta Formativa
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((e) => {
            const isActive = e.status === 'Active' || e.status === 'Activo';

            return (
              <div
                key={e.id}
                className="bg-white dark:bg-[#1e1e1b] rounded-2xl border border-[#e6bdb7] dark:border-[#332f2c] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-caribe-sm hover:border-black dark:hover:border-[#52525b] transition-all"
              >
                {/* Left Info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-white bg-black dark:bg-[#27272a] px-2 py-0.5 rounded border border-black dark:border-[#332f2c]">
                      {e.workshopCode || 'TALLER'}
                    </span>

                    {isActive ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006534] dark:text-[#6bdd90] bg-[#d6ffdc]/60 dark:bg-[#005229]/40 px-2.5 py-0.5 rounded-full border border-[#008144]/30">
                        <FileCheck className="w-3 h-3" />
                        MATRÍCULA ACTIVA
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#b30006] dark:text-[#ffb4a9] bg-[#ffdad5]/60 dark:bg-[#410001]/40 px-2.5 py-0.5 rounded-full border border-[#d9251d]/30">
                        <XCircle className="w-3 h-3" />
                        CANCELADA
                      </span>
                    )}

                    <span className="text-[11px] text-[#475569] dark:text-[#cbd5e1] font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-white" />
                      Inscrito el {new Date(e.createdAt).toLocaleDateString('es-CO')}
                    </span>
                  </div>

                  <h3 className="font-headline text-base font-bold text-[#0f172a] dark:text-white">
                    {e.workshopTitle}
                  </h3>
                  <p className="text-xs text-[#334155] dark:text-[#cbd5e1]">
                    Cátedra: {e.workshopCode} • Inicio: {new Date(e.workshopStartAt).toLocaleDateString('es-CO')}
                  </p>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2.5 shrink-0">
                  {isActive && (
                    <>
                      <button
                        onClick={() => handleDownloadCertificate(e)}
                        disabled={downloadingId === e.id}
                        className="px-3.5 py-2 rounded-xl bg-black dark:bg-[#27272a] hover:bg-[#18181b] text-white text-xs font-bold transition-all shadow-caribe-sm flex items-center gap-1.5 border border-black dark:border-[#332f2c] disabled:opacity-50 cursor-pointer"
                        title="Descargar Certificado Oficial en PDF"
                      >
                        <Download className="w-3.5 h-3.5 text-white" />
                        <span>{downloadingId === e.id ? 'Generando PDF...' : 'Certificado PDF'}</span>
                      </button>

                      <button
                        onClick={() => handleCancel(e)}
                        disabled={cancellingId === e.id}
                        className="px-3 py-2 rounded-xl text-[#d9251d] hover:bg-[#ffdad5]/50 dark:hover:bg-[#410001]/50 border border-[#d9251d]/30 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
                        title="Cancelar matrícula"
                      >
                        {cancellingId === e.id ? 'Cancelando...' : 'Cancelar'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
