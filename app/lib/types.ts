// All 29 Academic Disciplines of Khulna University
export const KU_DISCIPLINES = [
  'Architecture',
  'Computer Science and Engineering',
  'Urban and Rural Planning',
  'Electronics and Communication Engineering',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Statistics',
  'Forestry and Wood Technology',
  'Fisheries and Marine Resource Technology',
  'Agrotechnology',
  'Biotechnology and Genetic Engineering',
  'Environmental Science',
  'Pharmacy',
  'Soil, Water and Environment',
  'Business Administration',
  'Human Resource Management',
  'Economics',
  'Sociology',
  'Development Studies',
  'Mass Communication and Journalism',
  'Bangla Language and Literature',
  'English',
  'History and Civilization',
  'Law',
  'Education',
  'Drawing and Painting',
  'Printmaking',
  'Sculpture'
] as const;

export type DisciplineType = typeof KU_DISCIPLINES[number];

export type Gender = 'male' | 'female' ;
export type PaymentMethod = 'bkash' | 'nagad' | 'ambassador';
export type PaymentStatus = 'pending' | 'approved' | 'rejected';

// Full registration database row entity
export interface RegistrationRecord {
  id: string;
  reg_code: string;
  full_name: string;
  email: string;
  phone: string;
  student_id: string;
  discipline: DisciplineType;
  gender: Gender;
  batch_year: string;
  is_continuing_26: boolean;
  fee_amount: number;
  payment_method: PaymentMethod;
  transaction_id: string | null;
  sender_number: string | null;
  ambassador_name: string | null;
  payment_status: PaymentStatus;
  checked_in: boolean;
  checked_in_at: string | null;
  checked_in_by: string | null;
  created_at: string;
}

// Multi-step registration form payload
export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  studentId: string;
  discipline: DisciplineType | '';
  gender: Gender | '';
  batchYear: string;
  isContinuing26: boolean;
  feeAmount: number;
  paymentMethod: PaymentMethod | '';
  transactionId: string;
  senderNumber: string;
  ambassadorName: string;
}

// Minimal success payload
export interface RegistrationSuccessData {
  fullName: string;
  regCode: string;
  trackingUrl: string;
}

// Universal Server Action response shape
export interface ActionResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
export type AdminRole = 'super_admin' | 'volunteer';

export interface AdminUser {
  id: number;
  username: string;
  role: AdminRole;
  created_at: string | Date;
}