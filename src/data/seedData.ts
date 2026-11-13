import { ClassSection, NavTab, SchoolData, UserRole } from '../types/school';

export const STORAGE_KEY = 'northbridge_sms_demo_v2';

export const CLASS_SECTIONS: ClassSection[] = [
  'Grade 10A',
  'Grade 10B',
  'Grade 11A',
  'Grade 12A',
];

export const ROLE_META: Record<
  UserRole,
  {
    label: string;
    personName: string;
    department: string;
    allowedTabs: NavTab[];
  }
> = {
  admin: {
    label: 'Admin',
    personName: 'Dr. Sopheaktra Meas',
    department: 'Principal & Administration',
    allowedTabs: ['dashboard', 'students', 'attendance', 'grades', 'fees'],
  },
  teacher: {
    label: 'Teacher',
    personName: 'Visal Ros',
    department: 'Mathematics & Science Faculty',
    allowedTabs: ['dashboard', 'students', 'attendance', 'grades'],
  },
  accountant: {
    label: 'Accountant',
    personName: 'Bopha Nhem',
    department: 'Bursar & Tuition Office',
    allowedTabs: ['dashboard', 'students', 'fees'],
  },
  student: {
    label: 'Student',
    personName: 'Student Portal',
    department: 'Academic & Fee Self-Service',
    allowedTabs: ['dashboard', 'attendance', 'grades', 'fees'],
  },
};

export function getTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getRelativeIso(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createSeedData(): SchoolData {
  const today = getTodayIso();
  const yesterday = getRelativeIso(1);
  const twoDaysAgo = getRelativeIso(2);

  return {
    activeRole: 'admin',
    activeStudentId: 101,
    students: [
      {
        id: 101,
        code: 'STU-101',
        name: 'Sokha Chan',
        gender: 'Female',
        className: 'Grade 10A',
        guardian: 'Chan Vanna',
        phone: '012 889 101',
        enrolledDate: '2026-09-01',
      },
      {
        id: 102,
        code: 'STU-102',
        name: 'Dara Pich',
        gender: 'Male',
        className: 'Grade 10A',
        guardian: 'Pich Sophea',
        phone: '017 445 202',
        enrolledDate: '2026-09-01',
      },
      {
        id: 103,
        code: 'STU-103',
        name: 'Malis Keo',
        gender: 'Female',
        className: 'Grade 10B',
        guardian: 'Keo Rithy',
        phone: '092 331 303',
        enrolledDate: '2026-09-02',
      },
      {
        id: 104,
        code: 'STU-104',
        name: 'Vireak Sok',
        gender: 'Male',
        className: 'Grade 11A',
        guardian: 'Sok Piseth',
        phone: '015 712 404',
        enrolledDate: '2026-09-02',
      },
      {
        id: 105,
        code: 'STU-105',
        name: 'Kanya Lim',
        gender: 'Female',
        className: 'Grade 11A',
        guardian: 'Lim Sotheary',
        phone: '077 624 505',
        enrolledDate: '2026-09-03',
      },
      {
        id: 106,
        code: 'STU-106',
        name: 'Ratanak Chhim',
        gender: 'Male',
        className: 'Grade 12A',
        guardian: 'Chhim Narith',
        phone: '089 518 606',
        enrolledDate: '2026-09-04',
      },
      {
        id: 107,
        code: 'STU-107',
        name: 'Chenda Tep',
        gender: 'Female',
        className: 'Grade 12A',
        guardian: 'Tep Kunthea',
        phone: '011 902 707',
        enrolledDate: '2026-09-04',
      },
      {
        id: 108,
        code: 'STU-108',
        name: 'Narith Heng',
        gender: 'Male',
        className: 'Grade 10B',
        guardian: 'Heng Borey',
        phone: '096 204 808',
        enrolledDate: '2026-09-05',
      },
    ],
    attendance: [
      { id: 1, date: today, studentId: 101, status: 'Present' },
      { id: 2, date: today, studentId: 102, status: 'Present' },
      { id: 3, date: today, studentId: 103, status: 'Late' },
      { id: 4, date: today, studentId: 104, status: 'Present' },
      { id: 5, date: today, studentId: 105, status: 'Present' },
      { id: 6, date: today, studentId: 106, status: 'Absent' },
      { id: 7, date: today, studentId: 107, status: 'Present' },
      { id: 8, date: today, studentId: 108, status: 'Excused' },
      { id: 9, date: yesterday, studentId: 101, status: 'Present' },
      { id: 10, date: yesterday, studentId: 102, status: 'Late' },
      { id: 11, date: yesterday, studentId: 103, status: 'Present' },
      { id: 12, date: yesterday, studentId: 104, status: 'Present' },
      { id: 13, date: yesterday, studentId: 105, status: 'Present' },
      { id: 14, date: yesterday, studentId: 106, status: 'Present' },
      { id: 15, date: twoDaysAgo, studentId: 101, status: 'Present' },
      { id: 16, date: twoDaysAgo, studentId: 102, status: 'Present' },
    ],
    grades: [
      { id: 201, studentId: 101, subject: 'Mathematics', exam: 'Midterm 2026', score: 94, date: '2026-10-20' },
      { id: 202, studentId: 101, subject: 'English Literature', exam: 'Midterm 2026', score: 88, date: '2026-10-21' },
      { id: 203, studentId: 101, subject: 'Physics', exam: 'Midterm 2026', score: 91, date: '2026-10-22' },
      { id: 204, studentId: 101, subject: 'History', exam: 'Midterm 2026', score: 85, date: '2026-10-23' },
      { id: 205, studentId: 102, subject: 'Mathematics', exam: 'Midterm 2026', score: 76, date: '2026-10-20' },
      { id: 206, studentId: 102, subject: 'English Literature', exam: 'Midterm 2026', score: 82, date: '2026-10-21' },
      { id: 207, studentId: 102, subject: 'Physics', exam: 'Midterm 2026', score: 69, date: '2026-10-22' },
      { id: 208, studentId: 103, subject: 'Mathematics', exam: 'Midterm 2026', score: 84, date: '2026-10-20' },
      { id: 209, studentId: 103, subject: 'Chemistry', exam: 'Midterm 2026', score: 90, date: '2026-10-22' },
      { id: 210, studentId: 104, subject: 'Computer Science', exam: 'Midterm 2026', score: 95, date: '2026-10-21' },
      { id: 211, studentId: 105, subject: 'Biology', exam: 'Midterm 2026', score: 87, date: '2026-10-22' },
      { id: 212, studentId: 106, subject: 'Economics', exam: 'Midterm 2026', score: 46, date: '2026-10-23' },
      { id: 213, studentId: 107, subject: 'Mathematics', exam: 'Midterm 2026', score: 92, date: '2026-10-20' },
    ],
    fees: [
      {
        id: 301,
        receiptNo: 'REC-2026-0301',
        studentId: 101,
        title: 'Term 1 Tuition & Lab Fee',
        amount: 320,
        dueDate: '2026-10-15',
        status: 'Paid',
        paidAt: '2026-10-10',
      },
      {
        id: 302,
        receiptNo: 'REC-2026-0302',
        studentId: 101,
        title: 'Science Examination Fee',
        amount: 45,
        dueDate: '2026-11-30',
        status: 'Unpaid',
        paidAt: null,
      },
      {
        id: 303,
        receiptNo: 'REC-2026-0303',
        studentId: 102,
        title: 'Term 1 Tuition & Lab Fee',
        amount: 320,
        dueDate: '2026-10-15',
        status: 'Unpaid',
        paidAt: null,
      },
      {
        id: 304,
        receiptNo: 'REC-2026-0304',
        studentId: 103,
        title: 'Term 1 Tuition & Lab Fee',
        amount: 320,
        dueDate: '2026-10-15',
        status: 'Paid',
        paidAt: '2026-10-12',
      },
      {
        id: 305,
        receiptNo: 'REC-2026-0305',
        studentId: 104,
        title: 'Term 1 Tuition & Technology Fee',
        amount: 360,
        dueDate: '2026-10-15',
        status: 'Paid',
        paidAt: '2026-10-14',
      },
      {
        id: 306,
        receiptNo: 'REC-2026-0306',
        studentId: 105,
        title: 'Term 1 Tuition & Technology Fee',
        amount: 360,
        dueDate: '2026-10-15',
        status: 'Unpaid',
        paidAt: null,
      },
      {
        id: 307,
        receiptNo: 'REC-2026-0307',
        studentId: 106,
        title: 'Senior Term 1 Tuition',
        amount: 410,
        dueDate: '2026-10-15',
        status: 'Unpaid',
        paidAt: null,
      },
      {
        id: 308,
        receiptNo: 'REC-2026-0308',
        studentId: 107,
        title: 'Senior Term 1 Tuition',
        amount: 410,
        dueDate: '2026-10-15',
        status: 'Paid',
        paidAt: '2026-10-08',
      },
    ],
  };
}

export function loadSchoolData(): SchoolData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = createSeedData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw) as Partial<SchoolData>;
    if (!Array.isArray(parsed.students) || !Array.isArray(parsed.attendance) || !Array.isArray(parsed.grades) || !Array.isArray(parsed.fees)) {
      const seed = createSeedData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return {
      students: parsed.students,
      attendance: parsed.attendance,
      grades: parsed.grades,
      fees: parsed.fees,
      activeRole: parsed.activeRole ?? 'admin',
      activeStudentId: parsed.activeStudentId ?? (parsed.students[0]?.id ?? 0),
    };
  } catch {
    const seed = createSeedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
}

export function saveSchoolData(data: SchoolData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetSchoolData(): SchoolData {
  const seed = createSeedData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

export function calcLetterGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'E' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  if (score >= 50) return 'E';
  return 'F';
}

export function calcGpaFromScore(score: number): number {
  if (score >= 90) return 4.0;
  if (score >= 80) return 3.3;
  if (score >= 70) return 2.7;
  if (score >= 60) return 2.0;
  if (score >= 50) return 1.0;
  return 0.0;
}

export function formatCurrency(amount: number): string {
  return `$${Number(amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
