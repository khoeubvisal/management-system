import { CheckCheck } from 'lucide-react';
import { useState } from 'react';
import { CLASS_SECTIONS, getTodayIso } from '../data/seedData';
import {
  AttendanceRecord,
  AttendanceStatus,
  Student,
  UserRole,
} from '../types/school';
import { AttendanceStatusText } from './StatusText';

interface AttendanceViewProps {
  students: Student[];
  attendance: AttendanceRecord[];
  role: UserRole;
  activeStudent: Student | null;
  onSetAttendance: (
    studentId: number,
    date: string,
    status: AttendanceStatus
  ) => void;
  onMarkVisiblePresent: (studentIds: number[], date: string) => void;
}

const STATUS_OPTIONS: AttendanceStatus[] = [
  'Present',
  'Late',
  'Absent',
  'Excused',
];

export function AttendanceView({
  students,
  attendance,
  role,
  activeStudent,
  onSetAttendance,
  onMarkVisiblePresent,
}: AttendanceViewProps) {
  const [selectedDate, setSelectedDate] = useState(getTodayIso());
  const [classFilter, setClassFilter] = useState<string>('ALL');

  if (role === 'student' && activeStudent) {
    const myLogs = attendance
      .filter((a) => a.studentId === activeStudent.id)
      .sort((a, b) => b.date.localeCompare(a.date));

    const presentDays = myLogs.filter((a) => a.status === 'Present').length;
    const lateDays = myLogs.filter((a) => a.status === 'Late').length;
    const absentDays = myLogs.filter((a) => a.status === 'Absent').length;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Attendance Record
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {activeStudent.name} · <span className="font-mono">{activeStudent.code}</span> · {activeStudent.className}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-medium text-slate-500">Present Days</div>
            <div className="mt-2 font-mono text-2xl font-semibold text-emerald-700 tabular-nums">
              {presentDays}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-medium text-slate-500">Late Arrivals</div>
            <div className="mt-2 font-mono text-2xl font-semibold text-amber-700 tabular-nums">
              {lateDays}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-medium text-slate-500">Absences</div>
            <div className="mt-2 font-mono text-2xl font-semibold text-red-700 tabular-nums">
              {absentDays}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Class Section</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {myLogs.length > 0 ? (
                myLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-mono text-slate-900 tabular-nums">
                      {log.date}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {activeStudent.className}
                    </td>
                    <td className="px-5 py-3">
                      <AttendanceStatusText status={log.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center text-slate-500">
                    No attendance records logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const visibleStudents = students.filter(
    (s) => classFilter === 'ALL' || s.className === classFilter
  );

  const presentCount = visibleStudents.filter((s) => {
    const rec = attendance.find(
      (a) => a.date === selectedDate && a.studentId === s.id
    );
    return rec?.status === 'Present';
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Daily Attendance Roll Call
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Record daily attendance by class section. Changes update dashboard metrics immediately.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            onMarkVisiblePresent(
              visibleStudents.map((s) => s.id),
              selectedDate
            )
          }
          disabled={visibleStudents.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:opacity-50 whitespace-nowrap shrink-0"
        >
          <CheckCheck className="h-4 w-4" aria-hidden="true" />
          Mark Visible Present
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label
                htmlFor="attendance-date"
                className="text-xs font-medium text-slate-600"
              >
                Date
              </label>
              <input
                id="attendance-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-sm text-slate-900 focus:border-blue-700 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1">
              {['ALL', ...CLASS_SECTIONS].map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setClassFilter(cls)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    classFilter === cls
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cls === 'ALL' ? 'All Classes' : cls}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-600 tabular-nums">
            Present: <strong className="text-slate-900">{presentCount}</strong> /{' '}
            {visibleStudents.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Class</th>
                <th className="px-5 py-3">Current Status</th>
                <th className="px-5 py-3 text-right">Mark Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {visibleStudents.length > 0 ? (
                visibleStudents.map((s) => {
                  const rec = attendance.find(
                    (a) => a.date === selectedDate && a.studentId === s.id
                  );
                  const currentStatus = rec?.status ?? 'Not Marked';
                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-mono text-xs text-slate-600 tabular-nums">
                        {s.code}
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-900">
                        {s.name}
                      </td>
                      <td className="px-5 py-3 text-slate-600">{s.className}</td>
                      <td className="px-5 py-3">
                        <AttendanceStatusText status={currentStatus} />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {STATUS_OPTIONS.map((opt) => {
                            const active = currentStatus === opt;
                            const activeStyle =
                              opt === 'Present'
                                ? 'border-emerald-700 bg-emerald-700 text-white'
                                : opt === 'Late'
                                  ? 'border-amber-600 bg-amber-600 text-white'
                                  : opt === 'Absent'
                                    ? 'border-red-600 bg-red-600 text-white'
                                    : 'border-blue-700 bg-blue-700 text-white';
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() =>
                                  onSetAttendance(s.id, selectedDate, opt)
                                }
                                className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                                  active
                                    ? activeStyle
                                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No students enrolled in this class section.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
