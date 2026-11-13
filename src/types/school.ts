export type UserRole = 'admin' | 'teacher' | 'accountant' | 'student';

export type NavTab = 'dashboard' | 'students' | 'attendance' | 'grades' | 'fees';

export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Excused';

export type FeeStatus = 'Paid' | 'Unpaid';

export type ClassSection = 'Grade 10A' | 'Grade 10B' | 'Grade 11A' | 'Grade 12A';

export interface Student {
  id: number;
  code: string;
  name: string;
  gender: 'Male' | 'Female';
  className: ClassSection;
  guardian: string;
  phone: string;
  enrolledDate: string;
}

export interface AttendanceRecord {
  id: number;
  date: string;
  studentId: number;
  status: AttendanceStatus;
}

export interface GradeRecord {
  id: number;
  studentId: number;
  subject: string;
  exam: string;
  score: number;
  date: string;
}

export interface FeeInvoice {
  id: number;
  receiptNo: string;
  studentId: number;
  title: string;
  amount: number;
  dueDate: string;
  status: FeeStatus;
  paidAt: string | null;
}

export interface SchoolData {
  students: Student[];
  attendance: AttendanceRecord[];
  grades: GradeRecord[];
  fees: FeeInvoice[];
  activeRole: UserRole;
  activeStudentId: number;
}
