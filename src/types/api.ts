export const IdentificationType = {
  NationalIdentity: 1,   // Cédula de Ciudadanía
  ForeignerIdentity: 2,  // Cédula de Extranjería
  TaxId: 3,              // NIT / RUT
  Passport: 4            // Pasaporte
} as const;

export type IdentificationType = typeof IdentificationType[keyof typeof IdentificationType];

export const IdentificationTypeLabels: Record<number, string> = {
  [IdentificationType.NationalIdentity]: "Cédula de Ciudadanía (CC)",
  [IdentificationType.ForeignerIdentity]: "Cédula de Extranjería (CE)",
  [IdentificationType.TaxId]: "NIT / Tributario",
  [IdentificationType.Passport]: "Pasaporte"
};

export interface AuthResponseDto {
  token: string | null;
  userId: string;
  fullName: string | null;
  email: string | null;
  role: 'Employee' | 'Participant' | string | null;
  expiresAt: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface ForgotPasswordRequestDto {
  identificationNumber: string;
}

export interface ForgotPasswordResponseDto {
  message: string;
  maskedEmail?: string | null;
}

export interface VerifyResetCodeRequestDto {
  identificationNumber: string;
  code: string;
}

export interface VerifyResetCodeResponseDto {
  isValid: boolean;
  message: string;
  email: string;
  resetToken: string;
}

export interface ResetPasswordRequestDto {
  email?: string;
  token?: string;
  identificationNumber?: string;
  code?: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponseDto {
  message: string;
}

export interface ChangePasswordRequestDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RegisterParticipantRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  identificationType: IdentificationType;
  identificationNumber: string;
  phoneCountryCode: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface WorkshopResponseDto {
  id: string;
  code: string | null;
  title: string | null;
  description: string | null;
  instructorId: string;
  instructorName: string | null;
  instructorEmail: string | null;
  instructorSpecialty: string | null;
  startAt: string;
  endAt: string;
  maxCapacity: number;
  activeEnrollmentsCount: number;
  availableSpots: number;
}

export interface CreateWorkshopRequestDto {
  code: string;
  title: string;
  description: string;
  instructorEmail: string;
  startAt: string;
  endAt: string;
  maxCapacity: number;
}

export interface WorkshopEnrollmentItemDto {
  enrollmentId: string;
  participantId: string;
  participantFullName: string | null;
  participantEmail: string | null;
  identification: string | null;
  status: 'Active' | 'Cancelled' | string | null;
  enrolledAt: string;
  cancelledAt: string | null;
  cancelledByUserId: string | null;
  cancelledByEmail: string | null;
}

export interface EnrollmentResponseDto {
  id: string;
  participantId: string;
  participantFullName: string | null;
  participantEmail: string | null;
  workshopId: string;
  workshopCode: string | null;
  workshopTitle: string | null;
  workshopStartAt: string;
  workshopEndAt: string;
  status: 'Active' | 'Cancelled' | string | null;
  createdAt: string;
  cancelledAt: string | null;
  cancelledByUserId: string | null;
}

export interface CreateEnrollmentRequestDto {
  workshopId: string;
}

export interface BulkEnrollmentRejectedRowDto {
  rowNumber: number;
  participantEmail: string | null;
  workshopCode: string | null;
  reason: string | null;
}

export interface BulkEnrollmentResponseDto {
  enrolledCount: number;
  rejectedCount: number;
  rejectedRows: BulkEnrollmentRejectedRowDto[] | null;
}

export interface TopWorkshopReportItemDto {
  workshopId: string;
  code: string | null;
  title: string | null;
  instructorName: string | null;
  instructorEmail: string | null;
  startAt: string;
  endAt: string;
  maxCapacity: number;
  activeEnrollmentsCount: number;
  availableSpots: number;
  occupancyPercentage: number;
}
