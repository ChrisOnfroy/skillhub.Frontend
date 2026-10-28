import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { api } from '../services/api';
import { IdentificationType, IdentificationTypeLabels } from '../types/api';
import {
  LogIn,
  UserPlus,
  X,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Clock,
  AtSign,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';

export type AuthTab = 'login' | 'register' | 'forgot-password';
export type RecoveryStep = 'request' | 'verify' | 'reset';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: AuthTab;
  initialEmail?: string;
  initialToken?: string;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
  initialEmail = '',
  initialToken = '',
  onSuccess,
}) => {
  const [tab, setTab] = useState<AuthTab>(defaultTab);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Register state
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regIdType, setRegIdType] = useState<number>(IdentificationType.NationalIdentity);
  const [regIdNumber, setRegIdNumber] = useState('');
  const [regPhoneCode, setRegPhoneCode] = useState('+57');
  const [regPhone, setRegPhone] = useState('');
  const [regStreet, setRegStreet] = useState('');
  const [regCity, setRegCity] = useState('Bogotá');
  const [regState, setRegState] = useState('Cundinamarca');
  const [regPostal, setRegPostal] = useState('110111');
  const [regCountry, setRegCountry] = useState('Colombia');

  // Recovery 3-step wizard state
  const [recoveryStep, setRecoveryStep] = useState<RecoveryStep>('request');
  const [forgotIdNumber, setForgotIdNumber] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [sixDigitCode, setSixDigitCode] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState(initialEmail);
  const [verifiedResetToken, setVerifiedResetToken] = useState(initialToken);
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');

  useEffect(() => {
    if (initialToken && initialEmail) {
      setVerifiedEmail(initialEmail);
      setVerifiedResetToken(initialToken);
      setTab('forgot-password');
      setRecoveryStep('reset');
    }
  }, [initialToken, initialEmail]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Campos incompletos', 'Ingresa tu correo y contraseña.');
      return;
    }
    setLoading(true);
    try {
      await login({ email: loginEmail.trim(), password: loginPassword });
      toast.success('Acceso Autorizado', 'Has ingresado correctamente a la plataforma.');
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Credenciales inválidas';
      toast.error('Error de Acceso', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFirstName || !regLastName || !regEmail || !regPassword || !regIdNumber || !regPhone) {
      toast.error('Campos requeridos', 'Por favor llena todos los campos marcados.');
      return;
    }
    setLoading(true);
    try {
      await register({
        firstName: regFirstName.trim(),
        lastName: regLastName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        identificationType: regIdType as IdentificationType,
        identificationNumber: regIdNumber.trim(),
        phoneCountryCode: regPhoneCode.trim(),
        phoneNumber: regPhone.trim(),
        street: regStreet.trim() || 'Avenida Principal 10 # 20-30',
        city: regCity.trim(),
        state: regState.trim(),
        postalCode: regPostal.trim(),
        country: regCountry.trim(),
      });
      toast.success(
        'Matrícula Exitosa',
        'Tu registro ha sido formalizado. Bienvenido a la institución.'
      );
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrar';
      toast.error('Fallo en matrícula', msg);
    } finally {
      setLoading(false);
    }
  };

  // STEP 1: Request 6-digit code with identificationNumber
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdNumber.trim()) {
      toast.error('Documento requerido', 'Ingresa tu número de identificación oficial.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.forgotPassword({ identificationNumber: forgotIdNumber.trim() });
      setMaskedEmail(res.maskedEmail || '');
      toast.success(
        'Código Emitido',
        res.maskedEmail ? `Revisa tu correo: ${res.maskedEmail}` : res.message
      );
      setRecoveryStep('verify');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al solicitar código';
      toast.error('No se pudo enviar el código', msg);
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify 6-digit code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sixDigitCode.trim()) {
      toast.error('Código requerido', 'Ingresa el código de 6 dígitos recibido.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.verifyResetCode({
        identificationNumber: forgotIdNumber.trim(),
        code: sixDigitCode.trim(),
      });

      if (res.isValid) {
        setVerifiedEmail(res.email);
        setVerifiedResetToken(res.resetToken);
        toast.success('Código Verificado', 'Ahora define tu nueva contraseña.');
        setRecoveryStep('reset');
      } else {
        toast.error('Código Inválido', res.message || 'El código no es correcto.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Código incorrecto o expirado';
      toast.error('Verificación Fallida', msg);
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Set new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetNewPassword || !resetConfirmPassword) {
      toast.error('Campos incompletos', 'Escribe y confirma tu nueva contraseña.');
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      toast.error('Contraseñas no coinciden', 'La contraseña nueva y la confirmación no son iguales.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.resetPassword({
        email: verifiedEmail,
        token: verifiedResetToken,
        identificationNumber: forgotIdNumber.trim() || undefined,
        code: sixDigitCode.trim() || undefined,
        newPassword: resetNewPassword,
        confirmPassword: resetConfirmPassword,
      });

      toast.success(
        'Contraseña Actualizada',
        res.message || 'Tu contraseña ha sido restablecida exitosamente.'
      );
      setLoginEmail(verifiedEmail);
      setTab('login');
      // Reset wizard
      setRecoveryStep('request');
      setForgotIdNumber('');
      setSixDigitCode('');
      setResetNewPassword('');
      setResetConfirmPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar contraseña';
      toast.error('Fallo en la operación', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#18181b] border border-[#e2e8f0] dark:border-[#27272a] text-[#0f172a] dark:text-white rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 text-[#64748b] hover:text-[#0f172a] dark:text-[#a1a1aa] dark:hover:text-white p-2 rounded-lg hover:bg-[#f1f5f9] dark:hover:bg-[#27272a] transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Main Card Content */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {/* Card Title & Subtitle */}
          <div className="mb-5 pr-8">
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-[#0f172a] dark:text-white tracking-tight mb-1">
              {tab === 'login' ? 'Iniciar Sesión' : tab === 'register' ? 'Registrarse' : 'Recuperar Acceso'}
            </h1>
            <p className="text-sm text-[#475569] dark:text-[#a1a1aa]">
              {tab === 'login'
                ? 'Accede a tus proyectos, talleres inscritos y certificaciones.'
                : tab === 'register'
                ? 'Formaliza tu matrícula institucional para acceder al aula virtual y registrarte en cátedras.'
                : 'Restablece tu contraseña mediante verificación institucional de identidad.'}
            </p>
          </div>

          {/* Segmented Tab Switcher (Login / Register) */}
          {(tab === 'login' || tab === 'register') && (
            <div className="grid grid-cols-2 p-1 bg-[#f1f5f9] dark:bg-[#121214] rounded-lg gap-1 mb-6" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'login'}
                onClick={() => setTab('login')}
                className={`py-2.5 px-3 rounded-md text-sm font-headline transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
                  tab === 'login'
                    ? 'bg-white dark:bg-[#18181b] text-[#d9251d] dark:text-[#ff5252] shadow-sm font-bold'
                    : 'text-[#475569] dark:text-[#a1a1aa] hover:text-[#0f172a] dark:hover:text-white font-semibold'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Iniciar Sesión</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'register'}
                onClick={() => setTab('register')}
                className={`py-2.5 px-3 rounded-md text-sm font-headline transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
                  tab === 'register'
                    ? 'bg-white dark:bg-[#18181b] text-black dark:text-white shadow-sm font-bold'
                    : 'text-[#475569] dark:text-[#a1a1aa] hover:text-[#0f172a] dark:hover:text-white font-semibold'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Registrarse</span>
              </button>
            </div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1.5" htmlFor="user-email">
                  Correo Institucional o Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white">
                    <AtSign className="w-5 h-5" />
                  </div>
                  <input
                    id="user-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="usuario@skillhub.edu.co"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#121214] border border-[#cbd5e1] dark:border-[#27272a] rounded-lg text-sm text-[#0f172a] dark:text-white placeholder:text-[#94a3b8] dark:placeholder:text-[#71717a] focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#0f172a] dark:text-white" htmlFor="user-password">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setTab('forgot-password');
                      setRecoveryStep('request');
                      setForgotIdNumber('');
                      setSixDigitCode('');
                    }}
                    className="text-xs text-white hover:text-white/80 hover:underline transition-colors font-medium cursor-pointer"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="user-password"
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-11 pr-12 py-3 bg-white dark:bg-[#121214] border border-[#cbd5e1] dark:border-[#27272a] rounded-lg text-sm text-[#0f172a] dark:text-white placeholder:text-[#94a3b8] dark:placeholder:text-[#71717a] focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20 transition-all font-mono"
                  />
                  <button
                    type="button"
                    aria-label="Mostrar u ocultar contraseña"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94a3b8] dark:text-[#71717a] hover:text-[#0f172a] dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-lg bg-[#d9251d] hover:bg-[#b51b14] active:translate-y-px text-white font-headline text-sm font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <span>{loading ? 'Ingresando...' : 'Ingresar al Aula Virtual'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                    Nombres *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-white absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                      placeholder="Nombres"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#121214] border border-[#cbd5e1] dark:border-[#27272a] rounded-xl focus:border-black dark:focus:border-white outline-none text-[#0f172a] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#71717a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    placeholder="Apellidos"
                    required
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#121214] border border-[#cbd5e1] dark:border-[#27272a] rounded-xl focus:border-black dark:focus:border-white outline-none text-[#0f172a] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#71717a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-white absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="estudiante@dominio.com"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#121214] border border-[#cbd5e1] dark:border-[#27272a] rounded-xl focus:border-black dark:focus:border-white outline-none text-[#0f172a] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#71717a] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                    Contraseña * (mín. 6 car.)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-white absolute left-3 top-2.5" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••••"
                      required
                      className="w-full pl-9 pr-9 py-2 text-xs bg-white dark:bg-[#121214] border border-[#cbd5e1] dark:border-[#27272a] rounded-lg focus:border-black dark:focus:border-white outline-none text-[#0f172a] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#71717a] font-mono"
                    />
                    <button
                      type="button"
                      aria-label="Mostrar u ocultar contraseña"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#94a3b8] dark:text-[#71717a] hover:text-[#0f172a] dark:hover:text-white transition-colors cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                    Tipo de Documento *
                  </label>
                  <select
                    value={regIdType}
                    onChange={(e) => setRegIdType(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#121214] border border-[#cbd5e1] dark:border-[#27272a] rounded-xl text-[#0f172a] dark:text-white focus:border-black dark:focus:border-white outline-none"
                  >
                    <option value={IdentificationType.NationalIdentity}>
                      {IdentificationTypeLabels[IdentificationType.NationalIdentity]}
                    </option>
                    <option value={IdentificationType.ForeignerIdentity}>
                      {IdentificationTypeLabels[IdentificationType.ForeignerIdentity]}
                    </option>
                    <option value={IdentificationType.Passport}>
                      {IdentificationTypeLabels[IdentificationType.Passport]}
                    </option>
                    <option value={IdentificationType.TaxId}>
                      {IdentificationTypeLabels[IdentificationType.TaxId]}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    value={regIdNumber}
                    onChange={(e) => setRegIdNumber(e.target.value)}
                    placeholder="1001001001"
                    required
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#121214] border border-[#cbd5e1] dark:border-[#27272a] rounded-xl focus:border-black dark:focus:border-white outline-none text-[#0f172a] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#71717a] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                    Cód. País
                  </label>
                  <input
                    type="text"
                    value={regPhoneCode}
                    onChange={(e) => setRegPhoneCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#121214] border border-[#cbd5e1] dark:border-[#27272a] rounded-xl focus:border-black dark:focus:border-white outline-none text-[#0f172a] dark:text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                    Teléfono Móvil *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-white absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="300 123 4567"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#121214] border border-[#cbd5e1] dark:border-[#27272a] rounded-xl focus:border-black dark:focus:border-white outline-none text-[#0f172a] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#71717a] font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                    Dirección
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-white absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={regStreet}
                      onChange={(e) => setRegStreet(e.target.value)}
                      placeholder="Calle 10 # 20-30"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#121214] border border-[#cbd5e1] dark:border-[#27272a] rounded-xl focus:border-black dark:focus:border-white outline-none text-[#0f172a] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#71717a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                    Ciudad / Departamento
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      placeholder="Ciudad"
                      className="w-1/2 px-3 py-2 text-xs bg-white dark:bg-[#121214] border border-[#cbd5e1] dark:border-[#27272a] rounded-xl focus:border-black dark:focus:border-white outline-none text-[#0f172a] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#71717a]"
                    />
                    <input
                      type="text"
                      value={regState}
                      onChange={(e) => setRegState(e.target.value)}
                      placeholder="Dpto."
                      className="w-1/2 px-3 py-2 text-xs bg-white dark:bg-[#121214] border border-[#cbd5e1] dark:border-[#27272a] rounded-xl focus:border-black dark:focus:border-white outline-none text-[#0f172a] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#71717a]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    value={regPostal}
                    onChange={(e) => setRegPostal(e.target.value)}
                    placeholder="110111"
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#121214] border border-[#cbd5e1] dark:border-[#27272a] rounded-xl focus:border-black dark:focus:border-white outline-none text-[#0f172a] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#71717a] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                    País
                  </label>
                  <input
                    type="text"
                    value={regCountry}
                    onChange={(e) => setRegCountry(e.target.value)}
                    placeholder="Colombia"
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#121214] border border-[#cbd5e1] dark:border-[#27272a] rounded-xl focus:border-black dark:focus:border-white outline-none text-[#0f172a] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#71717a]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-lg bg-[#d9251d] hover:bg-[#b30006] active:translate-y-px text-white font-headline text-sm font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{loading ? 'Formalizando...' : 'Formalizar Matrícula'}</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD - NEW EFFICIENT 3-STEP WIZARD */}
          {tab === 'forgot-password' && (
            <div className="space-y-5 animate-in fade-in">
              {/* Back to login */}
              <button
                type="button"
                onClick={() => setTab('login')}
                className="inline-flex items-center gap-1.5 text-xs text-[#334155] hover:text-[#0f172a] dark:text-[#a1a1aa] dark:hover:text-white font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver al inicio de sesión</span>
              </button>

              {/* Wizard Steps Progress Indicator */}
              <div className="grid grid-cols-3 gap-2 py-1 text-center font-mono text-[10px]">
                <div
                  className={`p-2 rounded-xl border transition-all ${
                    recoveryStep === 'request'
                      ? 'bg-[#ffdad5] dark:bg-[#450a0a] border-[#d9251d] text-[#b30006] dark:text-[#fca5a5] font-bold'
                      : 'bg-[#f1f5f9] dark:bg-[#121214] border-[#cbd5e1] dark:border-[#27272a] text-[#475569] dark:text-[#71717a]'
                  }`}
                >
                  1. Documento
                </div>
                <div
                  className={`p-2 rounded-xl border transition-all ${
                    recoveryStep === 'verify'
                      ? 'bg-[#ffdad5] dark:bg-[#450a0a] border-[#d9251d] text-[#b30006] dark:text-[#fca5a5] font-bold'
                      : 'bg-[#f1f5f9] dark:bg-[#121214] border-[#cbd5e1] dark:border-[#27272a] text-[#475569] dark:text-[#71717a]'
                  }`}
                >
                  2. Código 6 dígitos
                </div>
                <div
                  className={`p-2 rounded-xl border transition-all ${
                    recoveryStep === 'reset'
                      ? 'bg-[#ffdad5] dark:bg-[#450a0a] border-[#d9251d] text-[#b30006] dark:text-[#fca5a5] font-bold'
                      : 'bg-[#f1f5f9] dark:bg-[#121214] border-[#cbd5e1] dark:border-[#27272a] text-[#475569] dark:text-[#71717a]'
                  }`}
                >
                  3. Nueva clave
                </div>
              </div>

              {/* STEP 1: SOLICITAR CÓDIGO CON DOCUMENTO */}
              {recoveryStep === 'request' && (
                <form onSubmit={handleRequestCode} className="space-y-4">
                  <div>
                    <h3 className="font-headline text-base font-bold text-[#0f172a] dark:text-white">
                      Solicitar Código de Seguridad
                    </h3>
                    <p className="text-xs text-[#334155] dark:text-[#cbd5e1] mt-1">
                      Ingresa tu número de documento de identidad para recibir un código de 6 dígitos en tu correo registrado.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                      Número de Documento de Identidad *
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-white absolute left-3 top-3" />
                      <input
                        type="text"
                        value={forgotIdNumber}
                        onChange={(e) => setForgotIdNumber(e.target.value)}
                        placeholder="ej: 1001001001"
                        required
                        className="w-full pl-9 pr-3 py-2.5 text-xs font-mono bg-white dark:bg-[#121214] border border-[#cbd5e1] dark:border-[#27272a] rounded-xl focus:border-black dark:focus:border-white outline-none text-[#0f172a] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#71717a]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-lg bg-[#d9251d] hover:bg-[#b51b14] active:translate-y-px text-white font-headline text-sm font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <KeyRound className="w-5 h-5 text-white" />
                    <span>{loading ? 'Consultando expediente...' : 'Enviar Código de 6 Dígitos'}</span>
                  </button>
                </form>
              )}

              {/* STEP 2: VERIFICAR CÓDIGO DE 6 DÍGITOS */}
              {recoveryStep === 'verify' && (
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div>
                    <h3 className="font-headline text-base font-bold text-[#0f172a] dark:text-white">
                      Ingresa el Código de Verificación
                    </h3>
                    <p className="text-xs text-[#334155] dark:text-[#cbd5e1] mt-1">
                      Hemos enviado un código de 6 dígitos a tu bandeja de correo:
                    </p>
                    {maskedEmail && (
                      <p className="text-xs font-mono text-white bg-[#f8fafc] dark:bg-[#121214] p-2.5 rounded-lg border border-[#cbd5e1] dark:border-[#27272a] mt-2 text-center font-bold">
                        {maskedEmail}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#ffddb4]/40 dark:bg-[#451a03]/50 border border-[#f6b800]/50 dark:border-[#f59e0b]/50 text-[#573700] dark:text-[#fef08a] text-xs font-mono">
                    <Clock className="w-4 h-4 shrink-0 text-[#f6b800]" />
                    <span>El código expira en 15 minutos (máximo 5 intentos).</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                      Código de 6 Dígitos *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={sixDigitCode}
                      onChange={(e) => setSixDigitCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      required
                      className="w-full px-4 py-3 text-center text-lg tracking-[0.5em] font-mono font-bold bg-white dark:bg-[#121214] border-2 border-[#cbd5e1] dark:border-[#27272a] rounded-xl focus:border-[#d9251d] dark:focus:border-[#ff5252] outline-none text-[#d9251d] dark:text-[#ff5252]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || sixDigitCode.length < 6}
                    className="w-full py-3.5 px-6 rounded-lg bg-[#d9251d] hover:bg-[#b51b14] active:translate-y-px text-white font-headline text-sm font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <ShieldCheck className="w-5 h-5 text-white" />
                    <span>{loading ? 'Validando código...' : 'Verificar Código de Seguridad'}</span>
                  </button>

                  <div className="flex items-center justify-between text-xs text-[#475569] dark:text-[#a1a1aa] pt-1">
                    <button
                      type="button"
                      onClick={() => setRecoveryStep('request')}
                      className="hover:text-white underline font-mono text-[11px] cursor-pointer"
                    >
                      ← Cambiar documento
                    </button>
                    <button
                      type="button"
                      onClick={handleRequestCode}
                      disabled={loading}
                      className="text-white hover:underline font-mono text-[11px] cursor-pointer"
                    >
                      Reenviar código
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: DEFINIR NUEVA CONTRASEÑA */}
              {recoveryStep === 'reset' && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="p-3 bg-[#d6ffdc]/50 dark:bg-[#052e16]/60 border border-[#008144]/40 dark:border-[#16a34a]/40 rounded-xl text-xs space-y-1">
                    <div className="flex items-center gap-2 text-[#006534] dark:text-[#86efac] font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Identidad verificada exitosamente</span>
                    </div>
                    {verifiedEmail && (
                      <p className="text-[#334155] dark:text-[#cbd5e1] text-[11px] font-mono">
                        Cuenta: <strong className="text-[#0f172a] dark:text-white">{verifiedEmail}</strong>
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-headline text-base font-bold text-[#0f172a] dark:text-white">
                      Establecer Nueva Contraseña
                    </h3>
                    <p className="text-xs text-[#334155] dark:text-[#cbd5e1] mt-0.5">
                      Ingresa tu nueva clave de acceso para actualizar tu cuenta.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                      Nueva Contraseña *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-white absolute left-3 top-2.5" />
                      <input
                        type="password"
                        value={resetNewPassword}
                        onChange={(e) => setResetNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#121214] border border-[#cbd5e1] dark:border-[#27272a] rounded-xl focus:border-black dark:focus:border-white outline-none text-[#0f172a] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#71717a] font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] dark:text-white mb-1">
                      Confirmar Nueva Contraseña *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-white absolute left-3 top-2.5" />
                      <input
                        type="password"
                        value={resetConfirmPassword}
                        onChange={(e) => setResetConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#121214] border border-[#cbd5e1] dark:border-[#27272a] rounded-xl focus:border-black dark:focus:border-white outline-none text-[#0f172a] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#71717a] font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-6 rounded-lg bg-[#d9251d] hover:bg-[#b51b14] active:translate-y-px text-white font-headline text-sm font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>{loading ? 'Actualizando...' : 'Guardar Nueva Contraseña'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
