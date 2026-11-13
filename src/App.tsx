import {
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  Menu,
  RotateCcw,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { AttendanceView } from './components/AttendanceView';
import { ConfirmDialog } from './components/ConfirmDialog';
import { DashboardView } from './components/DashboardView';
import { FeeReceiptModal } from './components/FeeReceiptModal';
import { FeesView } from './components/FeesView';
import { GradesView } from './components/GradesView';
import { ReportCardModal } from './components/ReportCardModal';
import { StudentsView } from './components/StudentsView';
import {
  getTodayIso,
  loadSchoolData,
  resetSchoolData,
  ROLE_META,
  saveSchoolData,
} from './data/seedData';
import {
  AttendanceStatus,
  FeeInvoice,
  GradeRecord,
  NavTab,
  SchoolData,
  Student,
  UserRole,
} from './types/school';

const NAV_ITEMS: { id: NavTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { id: 'grades', label: 'Exams & Grades', icon: BookOpen },
  { id: 'fees', label: 'Tuition Fees', icon: CreditCard },
];

const ROLES: UserRole[] = ['admin', 'teacher', 'accountant', 'student'];

export default function App() {
  const [data, setData] = useState<SchoolData>(() => loadSchoolData());
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [reportCardStudent, setReportCardStudent] = useState<Student | null>(
    null
  );
  const [receiptInvoice, setReceiptInvoice] = useState<FeeInvoice | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    saveSchoolData(data);
  }, [data]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const role = data.activeRole;
  const roleInfo = ROLE_META[role];
  const allowedTabs = roleInfo.allowedTabs;
  const currentTab = allowedTabs.includes(activeTab) ? activeTab : 'dashboard';

  const activeStudent =
    data.students.find((s) => s.id === data.activeStudentId) ??
    data.students[0] ??
    null;

  function showToast(message: string) {
    setToast(message);
  }

  function handleRoleChange(nextRole: UserRole) {
    const nextAllowed = ROLE_META[nextRole].allowedTabs;
    setData((prev) => ({
      ...prev,
      activeRole: nextRole,
      activeStudentId:
        prev.activeStudentId &&
        prev.students.some((s) => s.id === prev.activeStudentId)
          ? prev.activeStudentId
          : (prev.students[0]?.id ?? 0),
    }));
    if (!nextAllowed.includes(activeTab)) {
      setActiveTab('dashboard');
    }
    showToast(`Switched to ${ROLE_META[nextRole].label} view`);
  }

  function handleSaveStudent(
    studentInput: Omit<Student, 'id'>,
    editId?: number
  ) {
    if (editId !== undefined) {
      setData((prev) => ({
        ...prev,
        students: prev.students.map((s) =>
          s.id === editId ? { ...studentInput, id: editId } : s
        ),
      }));
      showToast(`Updated record for ${studentInput.name}`);
    } else {
      const newId = Date.now();
      setData((prev) => ({
        ...prev,
        students: [{ ...studentInput, id: newId }, ...prev.students],
      }));
      showToast(`Enrolled ${studentInput.name} (${studentInput.code})`);
    }
  }

  function confirmDeleteStudent() {
    if (!studentToDelete) return;
    const id = studentToDelete.id;
    const deletedName = studentToDelete.name;
    setData((prev) => {
      const remainingStudents = prev.students.filter((s) => s.id !== id);
      return {
        ...prev,
        students: remainingStudents,
        attendance: prev.attendance.filter((a) => a.studentId !== id),
        grades: prev.grades.filter((g) => g.studentId !== id),
        fees: prev.fees.filter((f) => f.studentId !== id),
        activeStudentId:
          prev.activeStudentId === id
            ? (remainingStudents[0]?.id ?? 0)
            : prev.activeStudentId,
      };
    });
    setStudentToDelete(null);
    showToast(`Removed ${deletedName} and associated records`);
  }

  function handleSetAttendance(
    studentId: number,
    date: string,
    status: AttendanceStatus
  ) {
    setData((prev) => {
      const existing = prev.attendance.find(
        (a) => a.date === date && a.studentId === studentId
      );
      if (existing) {
        return {
          ...prev,
          attendance: prev.attendance.map((a) =>
            a.id === existing.id ? { ...a, status } : a
          ),
        };
      }
      return {
        ...prev,
        attendance: [
          ...prev.attendance,
          { id: Date.now() + Math.floor(Math.random() * 1000), date, studentId, status },
        ],
      };
    });
  }

  function handleMarkVisiblePresent(studentIds: number[], date: string) {
    setData((prev) => {
      const updated = [...prev.attendance];
      studentIds.forEach((studentId, index) => {
        const idx = updated.findIndex(
          (a) => a.date === date && a.studentId === studentId
        );
        if (idx !== -1) {
          updated[idx] = { ...updated[idx], status: 'Present' };
        } else {
          updated.push({
            id: Date.now() + index,
            date,
            studentId,
            status: 'Present',
          });
        }
      });
      return { ...prev, attendance: updated };
    });
    showToast(`Marked ${studentIds.length} visible students Present for ${date}`);
  }

  function handleAddGrade(gradeInput: Omit<GradeRecord, 'id'>) {
    setData((prev) => ({
      ...prev,
      grades: [{ ...gradeInput, id: Date.now() }, ...prev.grades],
    }));
    showToast(`Saved ${gradeInput.subject} score (${gradeInput.score}/100)`);
  }

  function handleDeleteGrade(gradeId: number) {
    setData((prev) => ({
      ...prev,
      grades: prev.grades.filter((g) => g.id !== gradeId),
    }));
    showToast('Deleted exam score record');
  }

  function handleCreateInvoice(
    invoiceInput: Omit<FeeInvoice, 'id' | 'receiptNo'>
  ) {
    const id = Date.now();
    const shortNum = String(id).slice(-4);
    const receiptNo = `REC-2026-${shortNum}`;
    setData((prev) => ({
      ...prev,
      fees: [{ ...invoiceInput, id, receiptNo }, ...prev.fees],
    }));
    showToast(`Created invoice ${receiptNo}`);
  }

  function handleToggleFeeStatus(invoiceId: number) {
    setData((prev) => ({
      ...prev,
      fees: prev.fees.map((f) => {
        if (f.id !== invoiceId) return f;
        const nextStatus = f.status === 'Paid' ? 'Unpaid' : 'Paid';
        return {
          ...f,
          status: nextStatus,
          paidAt: nextStatus === 'Paid' ? getTodayIso() : null,
        };
      }),
    }));
    showToast('Updated invoice payment status');
  }

  function handleDeleteInvoice(invoiceId: number) {
    setData((prev) => ({
      ...prev,
      fees: prev.fees.filter((f) => f.id !== invoiceId),
    }));
    showToast('Removed tuition invoice');
  }

  function confirmResetDemo() {
    const fresh = resetSchoolData();
    setData(fresh);
    setActiveTab('dashboard');
    setResetConfirmOpen(false);
    showToast('Demo data restored to initial academic records');
  }

  const currentTabLabel =
    NAV_ITEMS.find((item) => item.id === currentTab)?.label ?? 'Dashboard';

  const receiptStudent = receiptInvoice
    ? data.students.find((s) => s.id === receiptInvoice.studentId) ?? null
    : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="no-print flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
          <div className="flex h-16 items-center gap-2.5 border-b border-slate-200 px-5">
            <GraduationCap className="h-5 w-5 text-blue-700 shrink-0" aria-hidden="true" />
            <span className="font-display text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
              Northbridge Academy
            </span>
          </div>

          <nav className="flex-1 space-y-1 p-3" aria-label="Primary Navigation">
            {NAV_ITEMS.filter((item) => allowedTabs.includes(item.id)).map(
              (item) => {
                const Icon = item.icon;
                const active = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-blue-700 text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                );
              }
            )}
          </nav>

          <div className="border-t border-slate-200 p-4">
            <div className="mb-3 text-xs text-slate-500">
              <div className="font-medium text-slate-900">
                {role === 'student' && activeStudent
                  ? activeStudent.name
                  : roleInfo.personName}
              </div>
              <div>
                {role === 'student' && activeStudent
                  ? `${activeStudent.className} · ${activeStudent.code}`
                  : roleInfo.department}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setResetConfirmOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset Demo Data
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/40"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <aside className="relative z-10 flex w-64 flex-col border-r border-slate-200 bg-white">
              <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
                <span className="font-display text-base font-bold text-slate-900 whitespace-nowrap">
                  Northbridge Academy
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 p-3">
                {NAV_ITEMS.filter((item) => allowedTabs.includes(item.id)).map(
                  (item) => {
                    const Icon = item.icon;
                    const active = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                          active
                            ? 'bg-blue-700 text-white'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{item.label}</span>
                      </button>
                    );
                  }
                )}
              </nav>
              <div className="border-t border-slate-200 p-4">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setResetConfirmOpen(true);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Reset Demo Data
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Workspace */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* 3-Zone Top Bar */}
          <header className="flex h-16 items-center justify-between gap-8 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 text-sm text-slate-500 truncate">
                <span className="font-medium text-slate-900 whitespace-nowrap">
                  Northbridge
                </span>
                <span aria-hidden="true">/</span>
                <span className="truncate">{currentTabLabel}</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4 text-xs text-slate-500 whitespace-nowrap shrink-0">
              <span>{roleInfo.label} Portal</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{getTodayIso()}</span>
            </div>

            <div className="flex items-center shrink-0">
              {activeStudent && role !== 'accountant' ? (
                <button
                  type="button"
                  onClick={() => setReportCardStudent(activeStudent)}
                  className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
                >
                  Sample Report Card
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setResetConfirmOpen(true)}
                  className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
                >
                  Reset Demo
                </button>
              )}
            </div>
          </header>

          {/* Workspace Role Switcher Toolbar */}
          <div className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                  Switch Role:
                </span>
                <div
                  className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1"
                  role="group"
                  aria-label="Role Switcher"
                >
                  {ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleChange(r)}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        role === r
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {ROLE_META[r].label}
                    </button>
                  ))}
                </div>
              </div>

              {role === 'student' && data.students.length > 0 && (
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="student-preview-select"
                    className="text-xs font-medium text-slate-500 whitespace-nowrap"
                  >
                    Viewing Student:
                  </label>
                  <select
                    id="student-preview-select"
                    value={activeStudent?.id ?? ''}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        activeStudentId: Number(e.target.value),
                      }))
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 focus:border-blue-700 focus:outline-none"
                  >
                    {data.students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code} · {s.name} ({s.className})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Container */}
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              {currentTab === 'dashboard' && (
                <DashboardView
                  data={data}
                  role={role}
                  activeStudent={activeStudent}
                  onNavigate={setActiveTab}
                  onOpenReportCard={setReportCardStudent}
                  onOpenFeeReceipt={setReceiptInvoice}
                />
              )}

              {currentTab === 'students' && (
                <StudentsView
                  students={data.students}
                  role={role}
                  onSaveStudent={handleSaveStudent}
                  onDeleteStudent={setStudentToDelete}
                  onOpenReportCard={setReportCardStudent}
                />
              )}

              {currentTab === 'attendance' && (
                <AttendanceView
                  students={data.students}
                  attendance={data.attendance}
                  role={role}
                  activeStudent={activeStudent}
                  onSetAttendance={handleSetAttendance}
                  onMarkVisiblePresent={handleMarkVisiblePresent}
                />
              )}

              {currentTab === 'grades' && (
                <GradesView
                  students={data.students}
                  grades={data.grades}
                  role={role}
                  activeStudent={activeStudent}
                  onAddGrade={handleAddGrade}
                  onDeleteGrade={handleDeleteGrade}
                  onOpenReportCard={setReportCardStudent}
                />
              )}

              {currentTab === 'fees' && (
                <FeesView
                  students={data.students}
                  fees={data.fees}
                  role={role}
                  activeStudent={activeStudent}
                  onCreateInvoice={handleCreateInvoice}
                  onToggleStatus={handleToggleFeeStatus}
                  onDeleteInvoice={handleDeleteInvoice}
                  onOpenReceipt={setReceiptInvoice}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={Boolean(studentToDelete)}
        title="Delete Student Record"
        description={
          studentToDelete
            ? `Remove ${studentToDelete.name} (${studentToDelete.code}) and all of their attendance, exam grades, and tuition invoices?`
            : ''
        }
        confirmLabel="Delete Student"
        tone="danger"
        onConfirm={confirmDeleteStudent}
        onCancel={() => setStudentToDelete(null)}
      />

      <ConfirmDialog
        open={resetConfirmOpen}
        title="Reset Demo Data"
        description="Restore all students, attendance logs, exam grades, and tuition invoices back to the initial demonstration dataset? Any changes saved in this browser will be replaced."
        confirmLabel="Reset Demo Data"
        tone="primary"
        onConfirm={confirmResetDemo}
        onCancel={() => setResetConfirmOpen(false)}
      />

      {/* Printable Modals */}
      <ReportCardModal
        student={reportCardStudent}
        grades={data.grades}
        attendance={data.attendance}
        onClose={() => setReportCardStudent(null)}
      />

      <FeeReceiptModal
        invoice={receiptInvoice}
        student={receiptStudent}
        onClose={() => setReceiptInvoice(null)}
      />

      {/* Non-intrusive Action Toast */}
      {toast && (
        <div
          className="no-print fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
