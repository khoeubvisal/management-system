import { GraduationCap, Printer, X } from 'lucide-react';
import {
  calcGpaFromScore,
  calcLetterGrade,
  getTodayIso,
} from '../data/seedData';
import { AttendanceRecord, GradeRecord, Student } from '../types/school';

interface ReportCardModalProps {
  student: Student | null;
  grades: GradeRecord[];
  attendance: AttendanceRecord[];
  onClose: () => void;
}

export function ReportCardModal({
  student,
  grades,
  attendance,
  onClose,
}: ReportCardModalProps) {
  if (!student) return null;

  const studentGrades = grades.filter((g) => g.studentId === student.id);
  const studentAttendance = attendance.filter((a) => a.studentId === student.id);

  const averageScore = studentGrades.length
    ? studentGrades.reduce((sum, g) => sum + g.score, 0) / studentGrades.length
    : 0;

  const gpa = studentGrades.length
    ? studentGrades.reduce((sum, g) => sum + calcGpaFromScore(g.score), 0) /
      studentGrades.length
    : 0;

  const presentDays = studentAttendance.filter(
    (a) => a.status === 'Present'
  ).length;
  const lateDays = studentAttendance.filter((a) => a.status === 'Late').length;
  const absentDays = studentAttendance.filter(
    (a) => a.status === 'Absent'
  ).length;
  const excusedDays = studentAttendance.filter(
    (a) => a.status === 'Excused'
  ).length;
  const attendancePct = studentAttendance.length
    ? Math.round(
        ((presentDays + lateDays + excusedDays) / studentAttendance.length) *
          100
      )
    : 100;

  const standingText = !studentGrades.length
    ? 'Pending Assessments'
    : averageScore >= 85
      ? 'Honors Standing'
      : averageScore >= 70
        ? 'Good Standing'
        : averageScore >= 50
          ? 'Satisfactory'
          : 'Academic Support Recommended';

  return (
    <div
      className="print-only-container fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/45 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-card-title"
    >
      <div className="print-sheet w-full max-w-3xl rounded-xl border border-slate-200 bg-white p-6 md:p-8">
        {/* Non-print action bar */}
        <div className="no-print mb-6 flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2
              id="report-card-title"
              className="text-base font-semibold text-slate-900"
            >
              Student Academic Report Card
            </h2>
            <p className="text-xs text-slate-500">
              Preview official transcript layout before printing or saving as PDF
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 whitespace-nowrap"
            >
              <Printer className="h-4 w-4" aria-hidden="true" />
              Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              aria-label="Close report card preview"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-slate-900 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-blue-700">
                <GraduationCap className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <div className="font-display text-xl font-bold tracking-tight text-slate-900">
                  Northbridge Academy
                </div>
                <div className="text-xs text-slate-600">
                  Office of the Registrar · Academic Year 2026–2027
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-sm font-semibold text-slate-900">
                Official Progress Report
              </div>
              <div className="font-mono text-xs text-slate-500 tabular-nums">
                Issued {getTodayIso()}
              </div>
            </div>
          </div>

          {/* Student Details Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 border-b border-slate-200 pb-5 text-sm sm:grid-cols-3">
            <div>
              <div className="text-xs text-slate-500">Student Name</div>
              <div className="font-semibold text-slate-900">{student.name}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Student Code</div>
              <div className="font-mono font-medium text-slate-900 tabular-nums">
                {student.code}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Class Section</div>
              <div className="font-medium text-slate-900">
                {student.className}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Parent / Guardian</div>
              <div className="font-medium text-slate-900">
                {student.guardian}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Guardian Contact</div>
              <div className="font-mono text-slate-900 tabular-nums">
                {student.phone}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Academic Standing</div>
              <div className="font-medium text-slate-900">{standingText}</div>
            </div>
          </div>

          {/* Summary KPI Row */}
          <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-5 sm:grid-cols-4">
            <div>
              <div className="text-xs text-slate-500">Subjects Graded</div>
              <div className="mt-1 font-mono text-xl font-semibold text-slate-900 tabular-nums">
                {studentGrades.length}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Overall Average</div>
              <div className="mt-1 font-mono text-xl font-semibold text-slate-900 tabular-nums">
                {studentGrades.length ? `${averageScore.toFixed(1)}%` : '—'}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Term GPA (4.0)</div>
              <div className="mt-1 font-mono text-xl font-semibold text-blue-700 tabular-nums">
                {studentGrades.length ? gpa.toFixed(2) : '—'}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Attendance Rate</div>
              <div className="mt-1 font-mono text-xl font-semibold text-slate-900 tabular-nums">
                {attendancePct}%
              </div>
            </div>
          </div>

          {/* Academic Scores Table */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Subject Examination Results
            </h3>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                    <th className="px-4 py-2.5">Subject</th>
                    <th className="px-4 py-2.5">Assessment</th>
                    <th className="px-4 py-2.5">Date</th>
                    <th className="px-4 py-2.5 text-right">Score</th>
                    <th className="px-4 py-2.5 text-right">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {studentGrades.length > 0 ? (
                    studentGrades.map((g) => {
                      const letter = calcLetterGrade(g.score);
                      return (
                        <tr key={g.id}>
                          <td className="px-4 py-2.5 font-medium text-slate-900">
                            {g.subject}
                          </td>
                          <td className="px-4 py-2.5 text-slate-600">
                            {g.exam}
                          </td>
                          <td className="px-4 py-2.5 font-mono text-xs text-slate-500 tabular-nums">
                            {g.date}
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono font-medium text-slate-900 tabular-nums">
                            {g.score} / 100
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono font-semibold text-slate-900 tabular-nums">
                            {letter}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-sm text-slate-500"
                      >
                        No examination scores recorded for this student yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attendance Breakdown */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-4 text-xs text-slate-600">
            <div className="flex flex-wrap items-center gap-3 tabular-nums">
              <span>
                Present: <strong className="text-slate-900">{presentDays}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Late: <strong className="text-slate-900">{lateDays}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Excused: <strong className="text-slate-900">{excusedDays}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Absent: <strong className="text-slate-900">{absentDays}</strong>
              </span>
            </div>
            <div className="text-slate-500">
              Grading Scale: A (90–100) · B (80–89) · C (70–79) · D (60–69) · E (50–59) · F (&lt;50)
            </div>
          </div>

          {/* Signature Footer */}
          <div className="grid grid-cols-2 gap-8 pt-8 text-xs text-slate-600">
            <div className="border-t border-slate-300 pt-2">
              <div className="font-medium text-slate-900">Homeroom Advisor</div>
              <div>Northbridge Academy Faculty</div>
            </div>
            <div className="border-t border-slate-300 pt-2">
              <div className="font-medium text-slate-900">Dr. Sopheaktra Meas</div>
              <div>Principal &amp; Academic Registrar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
