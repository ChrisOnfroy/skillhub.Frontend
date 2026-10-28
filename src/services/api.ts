import type {
  AuthResponseDto,
  BulkEnrollmentResponseDto,
  ChangePasswordRequestDto,
  CreateEnrollmentRequestDto,
  CreateWorkshopRequestDto,
  EnrollmentResponseDto,
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
  LoginRequestDto,
  RegisterParticipantRequestDto,
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
  TopWorkshopReportItemDto,
  VerifyResetCodeRequestDto,
  VerifyResetCodeResponseDto,
  WorkshopEnrollmentItemDto,
  WorkshopResponseDto,
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5246';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('skillhub_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.title) {
          errorMessage = errorData.title;
        } else if (errorData.errors) {
          const detailMessages = Object.values(errorData.errors)
            .flat()
            .join(' | ');
          errorMessage = detailMessages || errorMessage;
        }
      } catch {
        const text = await response.text().catch(() => '');
        if (text) errorMessage = text;
      }
      throw new Error(errorMessage);
    }

    // 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // --- Auth Endpoints ---
  async login(payload: LoginRequestDto): Promise<AuthResponseDto> {
    return this.request<AuthResponseDto>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async register(payload: RegisterParticipantRequestDto): Promise<AuthResponseDto> {
    return this.request<AuthResponseDto>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async forgotPassword(payload: ForgotPasswordRequestDto): Promise<ForgotPasswordResponseDto> {
    return this.request<ForgotPasswordResponseDto>('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async verifyResetCode(payload: VerifyResetCodeRequestDto): Promise<VerifyResetCodeResponseDto> {
    return this.request<VerifyResetCodeResponseDto>('/api/v1/auth/verify-reset-code', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async resetPassword(payload: ResetPasswordRequestDto): Promise<ResetPasswordResponseDto> {
    return this.request<ResetPasswordResponseDto>('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async changePassword(payload: ChangePasswordRequestDto): Promise<ResetPasswordResponseDto> {
    return this.request<ResetPasswordResponseDto>('/api/v1/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // --- Workshops Endpoints ---
  async getWorkshops(): Promise<WorkshopResponseDto[]> {
    return this.request<WorkshopResponseDto[]>('/api/v1/workshops', {
      method: 'GET',
    });
  }

  async getWorkshopById(id: string): Promise<WorkshopResponseDto> {
    return this.request<WorkshopResponseDto>(`/api/v1/workshops/${id}`, {
      method: 'GET',
    });
  }

  async createWorkshop(payload: CreateWorkshopRequestDto): Promise<WorkshopResponseDto> {
    return this.request<WorkshopResponseDto>('/api/v1/workshops', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getWorkshopEnrollments(workshopId: string): Promise<WorkshopEnrollmentItemDto[]> {
    return this.request<WorkshopEnrollmentItemDto[]>(`/api/v1/workshops/${workshopId}/enrollments`, {
      method: 'GET',
    });
  }

  // --- Enrollments Endpoints ---
  async enrollInWorkshop(payload: CreateEnrollmentRequestDto): Promise<EnrollmentResponseDto> {
    return this.request<EnrollmentResponseDto>('/api/v1/enrollments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getMyEnrollments(): Promise<EnrollmentResponseDto[]> {
    return this.request<EnrollmentResponseDto[]>('/api/v1/enrollments/mine', {
      method: 'GET',
    });
  }

  async cancelEnrollment(enrollmentId: string): Promise<void> {
    return this.request<void>(`/api/v1/enrollments/${enrollmentId}/cancel`, {
      method: 'POST',
    });
  }

  async downloadCertificate(enrollmentId: string, workshopCode: string = 'CATEDRA'): Promise<void> {
    const token = this.getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/enrollments/${enrollmentId}/certificate`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No se pudo descargar el certificado.');
      throw new Error(errorText || 'Error al obtener el certificado.');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificado-SkillHub-${workshopCode}-${enrollmentId.substring(0, 8)}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async importBulkEnrollments(file: File): Promise<BulkEnrollmentResponseDto> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<BulkEnrollmentResponseDto>('/api/v1/enrollments/import', {
      method: 'POST',
      body: formData,
    });
  }

  // --- Reports Endpoints ---
  async getTopWorkshopsReport(): Promise<TopWorkshopReportItemDto[]> {
    return this.request<TopWorkshopReportItemDto[]>('/api/v1/reports/top-workshops', {
      method: 'GET',
    });
  }
}

export const api = new ApiService();
