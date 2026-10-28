import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type {
  BulkEnrollmentResponseDto,
  CreateWorkshopRequestDto,
  WorkshopEnrollmentItemDto,
  WorkshopResponseDto,
} from '../types/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import {
  PlusCircle,
  Users,
  UploadCloud,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  RefreshCw,
  Mail,
  Hash,
  Shield,
  LogIn,
} from 'lucide-react';

interface InstructorManagementViewProps {
  onOpenAuth: (tab: 'login' | 'register') => void;
}

export const InstructorManagementView: React.FC<InstructorManagementViewProps> = ({
  onOpenAuth,
}) => {
  const { user, isEmployee } = useAuth();
  const toast = useToast();

  const [activeSubTab, setActiveSubTab] = useState<'create' | 'list' | 'import'>('create');
  const [workshops, setWorkshops] = useState<WorkshopResponseDto[]>([]);

  // Form state
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructorEmail, setInstructorEmail] = useState(user?.email || '');
  const [startAt, setStartAt] = useState(
    new Date(Date.now() + 86400000 * 7).toISOString().substring(0, 16)
  );
  const [endAt, setEndAt] = useState(
    new Date(Date.now() + 86400000 * 28).toISOString().substring(0, 16)
  );
  const [maxCapacity, setMaxCapacity] = useState(20);
  const [creating, setCreating] = useState(false);

  // Enrollments list
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>('');
  const [enrollmentsList, setEnrollmentsList] = useState<WorkshopEnrollmentItemDto[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);

  // Bulk import
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<BulkEnrollmentResponseDto | null>(null);

  const fetchWorkshops = async () => {
    try {
      const data = await api.getWorkshops();
      setWorkshops(data);
      if (data.length > 0 && !selectedWorkshopId) {
        setSelectedWorkshopId(data[0].id);
      }
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    if (isEmployee) {
      fetchWorkshops();
    }
  }, [isEmployee]);

  useEffect(() => {
    if (user?.email && !instructorEmail) {
      setInstructorEmail(user.email);
    }
  }, [user, instructorEmail]);

  // Load participants for selected workshop
  useEffect(() => {
    if (selectedWorkshopId && activeSubTab === 'list') {
      loadEnrollments(selectedWorkshopId);
    }
  }, [selectedWorkshopId, activeSubTab]);

  const loadEnrollments = async (workshopId: string) => {
    setLoadingEnrollments(true);
    try {
      const data = await api.getWorkshopEnrollments(workshopId);
      setEnrollmentsList(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar inscritos';
      toast.error('Error', msg);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  // 1. Create Workshop
  const handleCreateWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim() || !description.trim() || !instructorEmail.trim()) {
      toast.error('Campos requeridos', 'Por favor diligencia todos los campos obligatorios.');
      return;
    }

    setCreating(true);
    try {
      const dto: CreateWorkshopRequestDto = {
        code: code.trim().toUpperCase(),
        title: title.trim(),
        description: description.trim(),
        instructorEmail: instructorEmail.trim(),
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
        maxCapacity: Number(maxCapacity),
      };

      await api.createWorkshop(dto);
      toast.success('Cátedra Creada', `Se ha registrado exitosamente: ${dto.title}`);

      // Reset form
      setCode('');
      setTitle('');
      setDescription('');
      setMaxCapacity(20);

      await fetchWorkshops();
      setActiveSubTab('list');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al crear taller';
      toast.error('Fallo en la creación', msg);
    } finally {
      setCreating(false);
    }
  };

  // 2. Import CSV
  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) {
      toast.error('Archivo no seleccionado', 'Selecciona un archivo CSV para proceder con la importación.');
      return;
    }

    setImporting(true);
    setImportResult(null);
    try {
      const res = await api.importBulkEnrollments(importFile);
      setImportResult(res);

      if (res.rejectedCount === 0) {
        toast.success(
          'Importación Exitosa',
          `Se procesaron ${res.enrolledCount} inscripciones sin errores.`
        );
      } else {
        toast.info(
          'Importación Parcial',
          `${res.enrolledCount} inscripciones creadas, ${res.rejectedCount} filas omitidas.`
        );
      }

      fetchWorkshops();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error en la importación masiva';
      toast.error('Error al procesar archivo', msg);
    } finally {
      setImporting(false);
    }
  };

  if (!isEmployee) {
    return (
      <div className="max-w-md mx-auto py-20 px-8 text-center bg-[#ffffff] dark:bg-[#1e1e1b] rounded-2xl border border-[#e6bdb7] dark:border-[#332f2c] space-y-5 animate-in fade-in shadow-caribe-sm">
        <Shield className="w-12 h-12 text-[#d9251d] mx-auto" />
        <h2 className="font-headline text-xl font-bold text-[#0f172a] dark:text-white">
          Acceso Restringido a Docentes
        </h2>
        <p className="text-xs text-[#334155] dark:text-[#cbd5e1] leading-relaxed">
          Esta vista está reservada para el claustro docente y la administración académica. Por favor inicia sesión con una cuenta de rol Instructor.
        </p>
        <button
          onClick={() => onOpenAuth('login')}
          className="px-6 py-2.5 rounded-xl bg-[#d9251d] hover:bg-[#b30006] text-white font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-caribe-sm cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          <span>Iniciar Sesión como Docente</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-[#ffffff] dark:bg-[#1e1e1b] rounded-2xl border border-[#e6bdb7] dark:border-[#332f2c] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-caribe-sm">
        <div>
          <span className="text-[11px] font-mono text-white uppercase tracking-widest font-semibold">
            Portal del Claustro Docente
          </span>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#0f172a] dark:text-white mt-0.5">
            Gestión Académica & Cátedras
          </h1>
          <p className="text-xs text-[#334155] dark:text-[#cbd5e1] mt-1">
            Docente activo: <strong className="text-[#0f172a] dark:text-white">{user?.fullName}</strong> ({user?.email})
          </p>
        </div>

        {/* Subtab Selector */}
        <div className="flex items-center bg-[#f0edea] dark:bg-[#22221f] p-1 rounded-xl border border-[#e6bdb7]/60 dark:border-[#332f2c] text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('create')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'create'
                ? 'bg-[#d9251d] text-white font-bold shadow-caribe-sm'
                : 'text-[#334155] dark:text-[#cbd5e1] hover:text-[#d9251d]'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nueva Cátedra</span>
          </button>
          <button
            onClick={() => setActiveSubTab('list')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'list'
                ? 'bg-[#d9251d] text-white font-bold shadow-caribe-sm'
                : 'text-[#334155] dark:text-[#cbd5e1] hover:text-[#d9251d]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Lista de Inscritos</span>
          </button>
          <button
            onClick={() => setActiveSubTab('import')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'import'
                ? 'bg-[#d9251d] text-white font-bold shadow-caribe-sm'
                : 'text-[#334155] dark:text-[#cbd5e1] hover:text-[#d9251d]'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Importación CSV</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: CREATE WORKSHOP */}
      {activeSubTab === 'create' && (
        <div className="bg-[#ffffff] dark:bg-[#1e1e1b] rounded-2xl border border-[#e6bdb7] dark:border-[#332f2c] p-6 sm:p-8 max-w-3xl shadow-caribe-sm">
          <div className="border-b border-[#e6bdb7]/60 dark:border-[#332f2c] pb-4 mb-6">
            <h2 className="font-headline text-lg font-bold text-[#0f172a] dark:text-white">
              Apertura de Nueva Cátedra
            </h2>
            <p className="text-xs text-[#334155] dark:text-[#cbd5e1] mt-0.5">
              Registra una nueva asignatura oficial en el catálogo académico institucional.
            </p>
          </div>

          <form onSubmit={handleCreateWorkshop} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                  Código de Cátedra *
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-[#475569] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="ej: TEC-IA-01"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-mono bg-white dark:bg-[#121212] border border-[#e6bdb7] dark:border-[#332f2c] rounded-xl focus:border-black dark:focus:border-white outline-none text-[#0f172a] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                  Título de la Asignatura *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ej: Inteligencia Artificial Aplicada a los Negocios"
                  required
                  className="w-full px-3 py-2.5 text-xs bg-white dark:bg-[#121212] border border-[#e6bdb7] dark:border-[#332f2c] rounded-xl focus:border-black dark:focus:border-white outline-none text-[#0f172a] dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                Descripción & Objetivos Pedagógicos *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Detalla las competencias técnicas, metodología y temario del taller..."
                required
                className="w-full px-3 py-2.5 text-xs bg-white dark:bg-[#121212] border border-[#e6bdb7] dark:border-[#332f2c] rounded-xl focus:border-black dark:focus:border-white outline-none text-[#0f172a] dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                  Correo Electrónico del Docente *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#475569] absolute left-3 top-3" />
                  <input
                    type="email"
                    value={instructorEmail}
                    onChange={(e) => setInstructorEmail(e.target.value)}
                    placeholder="docente@skillhub.edu.co"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white dark:bg-[#121212] border border-[#e6bdb7] dark:border-[#332f2c] rounded-xl focus:border-black dark:focus:border-white outline-none font-mono text-[#0f172a] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                  Aforo Máximo de Cupos *
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-[#475569] absolute left-3 top-3" />
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(Number(e.target.value))}
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white dark:bg-[#121212] border border-[#e6bdb7] dark:border-[#332f2c] rounded-xl focus:border-black dark:focus:border-white outline-none text-[#0f172a] dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                  Fecha & Hora de Inicio *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#475569] absolute left-3 top-3" />
                  <input
                    type="datetime-local"
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#121212] border border-[#e6bdb7] dark:border-[#332f2c] rounded-xl focus:border-black dark:focus:border-white outline-none text-[#0f172a] dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                  Fecha & Hora de Culminación *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#475569] absolute left-3 top-3" />
                  <input
                    type="datetime-local"
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#121212] border border-[#e6bdb7] dark:border-[#332f2c] rounded-xl focus:border-black dark:focus:border-white outline-none text-[#0f172a] dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={creating}
                className="px-6 py-2.5 bg-[#d9251d] hover:bg-[#b30006] text-white font-bold text-xs rounded-xl shadow-caribe-sm transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{creating ? 'Guardando...' : 'Crear & Publicar Cátedra'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUBTAB 2: LIST OF ENROLLMENTS */}
      {activeSubTab === 'list' && (
        <div className="bg-[#ffffff] dark:bg-[#1e1e1b] rounded-2xl border border-[#e6bdb7] dark:border-[#332f2c] p-6 space-y-6 shadow-caribe-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6bdb7]/60 dark:border-[#332f2c] pb-4">
            <div>
              <h2 className="font-headline text-lg font-bold text-[#0f172a] dark:text-white">
                Registro Oficial de Participantes
              </h2>
              <p className="text-xs text-[#334155] dark:text-[#cbd5e1] mt-0.5">
                Consulta los estudiantes formalmente matriculados en cada cátedra.
              </p>
            </div>

            {/* Select workshop dropdown */}
            <div className="w-full sm:w-72">
              <label className="block text-[11px] font-mono text-[#334155] dark:text-[#cbd5e1] mb-1">
                Seleccionar Asignatura:
              </label>
              <select
                value={selectedWorkshopId}
                onChange={(e) => setSelectedWorkshopId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#f6f3ef] dark:bg-[#121212] border border-[#e6bdb7] dark:border-[#332f2c] rounded-xl text-[#0f172a] dark:text-white focus:border-black dark:focus:border-white outline-none"
              >
                {workshops.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.code} - {w.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loadingEnrollments ? (
            <div className="py-12 text-center text-[#334155] dark:text-[#cbd5e1] flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-[#d9251d]" />
              <span className="text-xs font-mono">Cargando nómina de participantes...</span>
            </div>
          ) : enrollmentsList.length === 0 ? (
            <div className="py-12 text-center text-[#334155] dark:text-[#cbd5e1] bg-[#f6f3ef] dark:bg-[#121212] rounded-xl border border-dashed border-[#e6bdb7] dark:border-[#332f2c]">
              <Users className="w-8 h-8 mx-auto text-[#475569] mb-2" />
              <p className="text-xs font-semibold text-[#334155] dark:text-[#cbd5e1]">Sin inscripciones registradas aún.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#e6bdb7] dark:border-[#332f2c]">
              <table className="w-full text-left text-xs text-[#0f172a] dark:text-white">
                <thead className="bg-[#f0edea] dark:bg-[#22221f] text-white font-mono uppercase text-[10px] tracking-wider border-b border-[#e6bdb7] dark:border-[#332f2c]">
                  <tr>
                    <th className="px-4 py-3">Estudiante</th>
                    <th className="px-4 py-3">Correo Institucional</th>
                    <th className="px-4 py-3">Documento</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Fecha de Registro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6bdb7]/60 dark:divide-[#332f2c]">
                  {enrollmentsList.map((item) => (
                    <tr key={item.enrollmentId} className="hover:bg-[#f6f3ef] dark:hover:bg-[#22221f] transition-colors">
                      <td className="px-4 py-3.5 font-bold text-[#0f172a] dark:text-white">
                        {item.participantFullName}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[#334155] dark:text-[#cbd5e1] text-[11px]">
                        {item.participantEmail}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[#334155] dark:text-[#cbd5e1] text-[11px]">
                        {item.identification || 'N/A'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[#475569] dark:text-[#cbd5e1] text-[11px] font-mono">
                        {new Date(item.enrolledAt).toLocaleDateString('es-CO')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: BULK IMPORT CSV */}
      {activeSubTab === 'import' && (
        <div className="bg-[#ffffff] dark:bg-[#1e1e1b] rounded-2xl border border-[#e6bdb7] dark:border-[#332f2c] p-6 sm:p-8 max-w-3xl space-y-6 shadow-caribe-sm">
          <div className="border-b border-[#e6bdb7]/60 dark:border-[#332f2c] pb-4">
            <h2 className="font-headline text-lg font-bold text-[#0f172a] dark:text-white">
              Importación Masiva de Matrículas (CSV)
            </h2>
            <p className="text-xs text-[#334155] dark:text-[#cbd5e1] mt-0.5">
              Carga un archivo CSV estructurado con encabezados: <code>WorkshopCode,ParticipantEmail</code>.
            </p>
          </div>

          <form onSubmit={handleImportSubmit} className="space-y-4">
            <div className="border-2 border-dashed border-[#e6bdb7] dark:border-[#332f2c] rounded-2xl p-8 text-center bg-[#f6f3ef] dark:bg-[#121212] hover:border-black dark:hover:border-[#52525b] transition-colors">
              <FileSpreadsheet className="w-12 h-12 mx-auto text-white mb-2" />
              <p className="text-sm font-bold text-[#0f172a] dark:text-white">
                Arrastra o selecciona el archivo CSV con las matrículas
              </p>
              <p className="text-xs text-[#475569] dark:text-[#cbd5e1] font-mono mt-1">
                Formato admitido: .csv (máximo 5MB por lote)
              </p>

              <input
                type="file"
                accept=".csv"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="mt-4 text-xs text-[#334155] dark:text-[#cbd5e1] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-[#27272a] cursor-pointer"
              />

              {importFile && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#1e1e1b] rounded-lg border border-[#e6bdb7] dark:border-[#332f2c] text-xs font-mono text-[#006534] dark:text-[#6bdd90]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Archivo cargado: {importFile.name}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={importing || !importFile}
                className="px-6 py-2.5 bg-[#d9251d] hover:bg-[#b30006] text-white font-bold text-xs rounded-xl shadow-caribe-sm transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{importing ? 'Procesando archivo CSV...' : 'Ejecutar Importación Masiva'}</span>
              </button>
            </div>
          </form>

          {/* Results Summary */}
          {importResult && (
            <div className="mt-6 p-5 rounded-2xl bg-[#f6f3ef] dark:bg-[#121212] border border-[#e6bdb7] dark:border-[#332f2c] space-y-4 animate-in fade-in">
              <h3 className="font-headline font-bold text-sm text-[#0f172a] dark:text-white flex items-center gap-2">
                <span>Resultado del Procesamiento Masivo</span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-[#1e1e1b] rounded-xl border border-emerald-300 dark:border-emerald-800">
                  <p className="text-xs font-mono text-[#006534] dark:text-[#6bdd90] uppercase font-bold">
                    Inscripciones Exitosas
                  </p>
                  <p className="text-2xl font-bold font-headline text-emerald-700 dark:text-emerald-400 mt-1">
                    {importResult.enrolledCount}
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-[#1e1e1b] rounded-xl border border-rose-300 dark:border-rose-800">
                  <p className="text-xs font-mono text-[#b30006] dark:text-[#ffb4a9] uppercase font-bold">
                    Registros con Error
                  </p>
                  <p className="text-2xl font-bold font-headline text-rose-700 dark:text-rose-400 mt-1">
                    {importResult.rejectedCount}
                  </p>
                </div>
              </div>

              {importResult.rejectedRows && importResult.rejectedRows.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#b30006] dark:text-[#ffb4a9] flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Detalle de Filas Omitidas:</span>
                  </h4>
                  <div className="overflow-x-auto max-h-48 border border-[#e6bdb7] dark:border-[#332f2c] rounded-lg">
                    <table className="w-full text-[11px] text-left text-[#334155] dark:text-[#cbd5e1]">
                      <thead className="bg-[#f0edea] dark:bg-[#22221f] text-[#0f172a] dark:text-white font-mono">
                        <tr>
                          <th className="px-3 py-1.5">Fila</th>
                          <th className="px-3 py-1.5">Correo</th>
                          <th className="px-3 py-1.5">Cátedra</th>
                          <th className="px-3 py-1.5">Motivo del Fallo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e6bdb7]/60 dark:divide-[#332f2c]">
                        {importResult.rejectedRows.map((r, i) => (
                          <tr key={i} className="hover:bg-rose-50/40 dark:hover:bg-rose-950/20">
                            <td className="px-3 py-1 font-mono text-[#475569]">{r.rowNumber}</td>
                            <td className="px-3 py-1 font-mono text-[#0f172a] dark:text-white">{r.participantEmail}</td>
                            <td className="px-3 py-1 font-mono text-[#0f172a] dark:text-white">{r.workshopCode}</td>
                            <td className="px-3 py-1 text-rose-600 dark:text-rose-400">{r.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
