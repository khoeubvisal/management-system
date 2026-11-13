import { ArrowRight, FileText, Receipt } from 'lucide-react';
import {
  calcGpaFromScore,
  calcLetterGrade,
  CLASS_SECTIONS,
  formatCurrency,
  getTodayIso,
} from '../data/seedData';
import {
  FeeInvoice,
  NavTab,
  SchoolData,
  Student,
  UserRole,
} from '../types/school';
import {
  AttendanceStatusText,
  FeeStatusText,
  LetterGradeText,
} from './StatusText';

interface DashboardViewProps {
  data: SchoolData;
  role: UserRole;
  activeStudent: Student | null;
  onNavigate: (tab: NavTab) => void;
  onOpenReportCard: (student: Student) => void;
  onOpenFeeReceipt: (invoice: FeeInvoice) => void;
}

export function DashboardView({
  data,
  role,
  activeStudent,
  onNavigate,
  onOpenReportCard,
  onOpenFeeReceipt,
}: DashboardViewProps) {
  const today = getTodayIso();

  if (role === 'student' && activeStudent) {
    const myGrades = data.grades.filter((g) => g.studentId === activeStudent.id);
    const myAttendance = data.attendance
      .filter((a) => a.studentId === activeStudent.id)
      .sort((a, b) => b.date.localeCompare(a.date));
    const myFees = data.fees.filter((f) => f.studentId === activeStudent.id);

    const avgScore = myGrades.length
      ? myGrades.reduce((s, g) => s + g.score, 0) / myGrades.length
      : 0;
    const gpa = myGrades.length
      ? myGrades.reduce((s, g) => s + calcGpaFromScore(g.score), 0) /
        myGrades.length
      : 0;
    const presentCount = myAttendance.filter(
      (a) => a.status === 'Present' || a.status === 'Late' || a.status === 'Excused'
    ).length;
    const attPct = myAttendance.length
      ? Math.round((presentCount / myAttendance.length) * 100)
      : 100;
    const unpaidTotal = myFees
      .filter((f) => f.status === 'Unpaid')
      .reduce((s, f) => s + f.amount, 0);

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 text-balance">
              Welcome back, {activeStudent.name}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              <span className="font-mono">{activeStudent.code}</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>{activeStudent.className}</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>Guardian: {activeStudent.guardian}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenReportCard(activeStudent)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 whitespace-nowrap shrink-0"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Print Report Card
          </button>
        </div>

        {/* 4-column KPI strip */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-medium text-slate-500">Term GPA</div>
            <div className="mt-2 font-mono text-3xl font-semibold text-blue-700 tabular-nums">
              {myGrades.length ? gpa.toFixed(2) : '—'}
            </div>
            <div className="mt-1 text-xs text-slate-500 tabular-nums">
              Avg score {myGrades.length ? `${avgScore.toFixed(1)}%` : 'N/A'}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-medium text-slate-500">Attendance Rate</div>
            <div className="mt-2 font-mono text-3xl font-semibold text-slate-900 tabular-nums">
              {attPct}%
            </div>
            <div className="mt-1 text-xs text-slate-500 tabular-nums">
              {presentCount} of {myAttendance.length} logged days
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-medium text-slate-500">Exams Recorded</div>
            <div className="mt-2 font-mono text-3xl font-semibold text-slate-900 tabular-nums">
              {myGrades.length}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Academic Year 2026–2027
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-medium text-slate-500">Balance Due</div>
            <div className="mt-2 font-mono text-3xl font-semibold text-slate-900 tabular-nums">
              {formatCurrency(unpaidTotal)}
            </div>
            <div className="mt-1 text-xs text-slate-500 tabular-nums">
              {myFees.filter((f) => f.status === 'Unpaid').length} unpaid invoice(s)
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Grades */}
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Recent Exam Results
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('grades')}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline whitespace-nowrap"
              >
                All Grades
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                    <th className="px-5 py-2.5">Subject</th>
                    <th className="px-5 py-2.5">Exam</th>
                    <th className="px-5 py-2.5 text-right">Score</th>
                    <th className="px-5 py-2.5 text-right">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {myGrades.length > 0 ? (
                    myGrades.slice(0, 5).map((g) => (
                      <tr key={g.id} className="hover:bg-slate-50">
                        <td className="px-5 py-2.5 font-medium text-slate-900">
                          {g.subject}
                        </td>
                        <td className="px-5 py-2.5 text-slate-600">{g.exam}</td>
                        <td className="px-5 py-2.5 text-right font-mono tabular-nums text-slate-900">
                          {g.score}/100
                        </td>
                        <td className="px-5 py-2.5 text-right">
                          <LetterGradeText letter={calcLetterGrade(g.score)} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-slate-500">
                        No exam results recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Personal Invoices & Attendance */}
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Tuition Invoices &amp; Attendance
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('fees')}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline whitespace-nowrap"
              >
                Fee Ledger
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                    <th className="px-5 py-2.5">Invoice</th>
                    <th className="px-5 py-2.5 text-right">Amount</th>
                    <th className="px-5 py-2.5">Status</th>
                    <th className="px-5 py-2.5 text-right">Document</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {myFees.length > 0 ? (
                    myFees.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50">
                        <td className="px-5 py-2.5">
                          <div className="font-medium text-slate-900">{f.title}</div>
                          <div className="font-mono text-xs text-slate-500 tabular-nums">
                            Due {f.dueDate}
                          </div>
                        </td>
                        <td className="px-5 py-2.5 text-right font-mono tabular-nums text-slate-900">
                          {formatCurrency(f.amount)}
                        </td>
                        <td className="px-5 py-2.5">
                          <FeeStatusText status={f.status} />
                        </td>
                        <td className="px-5 py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => onOpenFeeReceipt(f)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline whitespace-nowrap"
                          >
                            <Receipt className="h-3.5 w-3.5" aria-hidden="true" />
                            {f.status === 'Paid' ? 'Receipt' : 'Invoice'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-slate-500">
                        No tuition invoices on file.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {myAttendance[0] && (
              <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-xs text-slate-600">
                <span>Latest attendance ({myAttendance[0].date}):</span>
                <AttendanceStatusText status={myAttendance[0].status} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Staff Roles: Admin, Teacher, Accountant
  const totalStudents = data.students.length;
  const activeClasses = new Set(data.students.map((s) => s.className)).size;

  const todayAttendance = data.attendance.filter((a) => a.date === today);
  const todayPresent = todayAttendance.filter(
    (a) => a.status === 'Present' || a.status === 'Late'
  ).length;
  const attendanceRate = totalStudents
    ? Math.round((todayPresent / totalStudents) * 100)
    : 0;

  const paidFees = data.fees
    .filter((f) => f.status === 'Paid')
    .reduce((sum, f) => sum + Number(f.amount), 0);
  const unpaidFees = data.fees
    .filter((f) => f.status === 'Unpaid')
    .reduce((sum, f) => sum + Number(f.amount), 0);

  const avgClassScore = data.grades.length
    ? data.grades.reduce((sum, g) => sum + g.score, 0) / data.grades.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 text-balance">
            {role === 'admin' && 'School Operations Overview'}
            {role === 'teacher' && 'Faculty Academic Overview'}
            {role === 'accountant' && 'Tuition & Billing Overview'}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Academic Year 2026–2027
            <span className="mx-2" aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{today}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(role === 'admin' || role === 'teacher') && (
            <button
              type="button"
              onClick={() => onNavigate('attendance')}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
            >
              Take Attendance
            </button>
          )}
          {role === 'accountant' && (
            <button
              type="button"
              onClick={() => onNavigate('fees')}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 whitespace-nowrap shrink-0"
            >
              Manage Invoices
            </button>
          )}
        </div>
      </div>

      {/* 4-Column KPI Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="text-xs font-medium text-slate-500">Enrolled Students</div>
          <div className="mt-2 font-mono text-3xl font-semibold text-slate-900 tabular-nums">
            {totalStudents}
          </div>
          <div className="mt-1 text-xs text-slate-500 tabular-nums">
            Across {activeClasses} active class sections
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="text-xs font-medium text-slate-500">Today&apos;s Attendance</div>
          <div className="mt-2 font-mono text-3xl font-semibold text-slate-900 tabular-nums">
            {attendanceRate}%
          </div>
          <div className="mt-1 text-xs text-slate-500 tabular-nums">
            {todayPresent} present or late out of {totalStudents}
          </div>
        </div>

        {role === 'teacher' ? (
          <>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-medium text-slate-500">School Exam Average</div>
              <div className="mt-2 font-mono text-3xl font-semibold text-blue-700 tabular-nums">
                {data.grades.length ? `${avgClassScore.toFixed(1)}%` : '—'}
              </div>
              <div className="mt-1 text-xs text-slate-500 tabular-nums">
                {data.grades.length} graded assessments
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-medium text-slate-500">Honors Performers</div>
              <div className="mt-2 font-mono text-3xl font-semibold text-emerald-700 tabular-nums">
                {data.grades.filter((g) => g.score >= 90).length}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Scores 90% and above (Grade A)
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-medium text-slate-500">Tuition Collected</div>
              <div className="mt-2 font-mono text-3xl font-semibold text-emerald-700 tabular-nums">
                {formatCurrency(paidFees)}
              </div>
              <div className="mt-1 text-xs text-slate-500 tabular-nums">
                {data.fees.filter((f) => f.status === 'Paid').length} paid receipts issued
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-medium text-slate-500">Outstanding Fees</div>
              <div className="mt-2 font-mono text-3xl font-semibold text-red-700 tabular-nums">
                {formatCurrency(unpaidFees)}
              </div>
              <div className="mt-1 text-xs text-slate-500 tabular-nums">
                {data.fees.filter((f) => f.status === 'Unpaid').length} unpaid invoice(s)
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Students / Quick Report Cards */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold text-slate-900">
              Recent Enrolled Students
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('students')}
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline whitespace-nowrap"
            >
              View Directory
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                  <th className="px-5 py-2.5">Code</th>
                  <th className="px-5 py-2.5">Name</th>
                  <th className="px-5 py-2.5">Class</th>
                  <th className="px-5 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.students.slice(0, 6).map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-5 py-2.5 font-mono text-xs text-slate-600 tabular-nums">
                      {s.code}
                    </td>
                    <td className="px-5 py-2.5 font-medium text-slate-900">
                      {s.name}
                    </td>
                    <td className="px-5 py-2.5 text-slate-600">{s.className}</td>
                    <td className="px-5 py-2.5 text-right">
                      {role !== 'accountant' ? (
                        <button
                          type="button"
                          onClick={() => onOpenReportCard(s)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline whitespace-nowrap"
                        >
                          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                          Report Card
                        </button>
                      ) : (
                        <span className="font-mono text-xs text-slate-500 tabular-nums">
                          {s.phone}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel: Pending Invoices for Admin/Accountant OR Class Attendance for Teacher */}
        {role === 'teacher' ? (
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Class Attendance Summary ({today})
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('attendance')}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline whitespace-nowrap"
              >
                Open Roll Call
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                    <th className="px-5 py-2.5">Class Section</th>
                    <th className="px-5 py-2.5 text-right">Enrolled</th>
                    <th className="px-5 py-2.5 text-right">Present / Late</th>
                    <th className="px-5 py-2.5 text-right">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {CLASS_SECTIONS.map((cls) => {
                    const clsStudents = data.students.filter(
                      (s) => s.className === cls
                    );
                    const clsPresent = clsStudents.filter((s) => {
                      const rec = todayAttendance.find(
                        (a) => a.studentId === s.id
                      );
                      return rec?.status === 'Present' || rec?.status === 'Late';
                    }).length;
                    const rate = clsStudents.length
                      ? Math.round((clsPresent / clsStudents.length) * 100)
                      : 0;
                    return (
                      <tr key={cls} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-slate-900">
                          {cls}
                        </td>
                        <td className="px-5 py-3 text-right font-mono tabular-nums text-slate-600">
                          {clsStudents.length}
                        </td>
                        <td className="px-5 py-3 text-right font-mono tabular-nums text-slate-900">
                          {clsPresent}
                        </td>
                        <td className="px-5 py-3 text-right font-mono font-semibold tabular-nums text-slate-900">
                          {rate}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Recent Tuition Invoices
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('fees')}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline whitespace-nowrap"
              >
                All Invoices
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                    <th className="px-5 py-2.5">Student</th>
                    <th className="px-5 py-2.5 text-right">Amount</th>
                    <th className="px-5 py-2.5">Status</th>
                    <th className="px-5 py-2.5 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.fees.slice(0, 6).map((f) => {
                    const st = data.students.find((s) => s.id === f.studentId);
                    return (
                      <tr key={f.id} className="hover:bg-slate-50">
                        <td className="px-5 py-2.5">
                          <div className="font-medium text-slate-900">
                            {st?.name ?? 'Unknown'}
                          </div>
                          <div className="text-xs text-slate-500">{f.title}</div>
                        </td>
                        <td className="px-5 py-2.5 text-right font-mono tabular-nums text-slate-900">
                          {formatCurrency(f.amount)}
                        </td>
                        <td className="px-5 py-2.5">
                          <FeeStatusText status={f.status} />
                        </td>
                        <td className="px-5 py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => onOpenFeeReceipt(f)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline whitespace-nowrap"
                          >
                            <Receipt className="h-3.5 w-3.5" aria-hidden="true" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
