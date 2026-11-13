import { FileText, Plus, Search, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { calcLetterGrade, getTodayIso } from '../data/seedData';
import { GradeRecord, Student, UserRole } from '../types/school';
import { LetterGradeText } from './StatusText';

interface GradesViewProps {
  students: Student[];
  grades: GradeRecord[];
  role: UserRole;
  activeStudent: Student | null;
  onAddGrade: (grade: Omit<GradeRecord, 'id'>) => void;
  onDeleteGrade: (gradeId: number) => void;
  onOpenReportCard: (student: Student) => void;
}

export function GradesView({
  students,
  grades,
  role,
  activeStudent,
  onAddGrade,
  onDeleteGrade,
  onOpenReportCard,
}: GradesViewProps) {
  const canEdit = role === 'admin' || role === 'teacher';
  const [studentId, setStudentId] = useState<number>(students[0]?.id ?? 0);
  const [subject, setSubject] = useState('');
  const [exam, setExam] = useState('Midterm 2026');
  const [score, setScore] = useState('');
  const [search, setSearch] = useState('');

  const scopedGrades =
    role === 'student' && activeStudent
      ? grades.filter((g) => g.studentId === activeStudent.id)
      : grades;

  const filtered = scopedGrades.filter((g) => {
    const st = students.find((s) => s.id === g.studentId);
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      g.subject.toLowerCase().includes(q) ||
      g.exam.toLowerCase().includes(q) ||
      (st?.name.toLowerCase().includes(q) ?? false) ||
      (st?.className.toLowerCase().includes(q) ?? false)
    );
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const numericScore = Number(score);
    const targetStudentId = studentId || students[0]?.id;
    if (!targetStudentId || !subject.trim() || !exam.trim()) return;
    if (Number.isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
      return;
    }

    onAddGrade({
      studentId: targetStudentId,
      subject: subject.trim(),
      exam: exam.trim(),
      score: Math.round(numericScore),
      date: getTodayIso(),
    });
    setSubject('');
    setScore('');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {role === 'student' ? 'My Exam Grades & Transcript' : 'Exams & Grading'}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {canEdit
              ? 'Record subject examination scores and generate printable academic report cards.'
              : 'Review your subject assessment scores and print your official report card.'}
          </p>
        </div>

        {role === 'student' && activeStudent && (
          <button
            type="button"
            onClick={() => onOpenReportCard(activeStudent)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 whitespace-nowrap shrink-0"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Print Report Card
          </button>
        )}
      </div>

      {canEdit && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-900">
            Record Exam Score
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
          >
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Student
              </label>
              <select
                value={studentId || students[0]?.id || ''}
                onChange={(e) => setStudentId(Number(e.target.value))}
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-700 focus:outline-none"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} · {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Mathematics"
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Exam Name
              </label>
              <input
                type="text"
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                placeholder="e.g. Final Exam 2026"
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Score (0–100)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="85"
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-700 focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={students.length === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 disabled:opacity-50 whitespace-nowrap"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Save Score
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            Grade Ledger ({filtered.length})
          </h2>
          <div className="relative w-full sm:w-72">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by student, subject, or exam..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Class</th>
                <th className="px-5 py-3">Subject</th>
                <th className="px-5 py-3">Assessment</th>
                <th className="px-5 py-3 text-right">Score</th>
                <th className="px-5 py-3 text-right">Grade</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length > 0 ? (
                filtered.map((g) => {
                  const st = students.find((s) => s.id === g.studentId);
                  const letter = calcLetterGrade(g.score);
                  return (
                    <tr key={g.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-slate-900">
                        {st?.name ?? 'Unknown'}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {st?.className ?? '—'}
                      </td>
                      <td className="px-5 py-3 text-slate-800">{g.subject}</td>
                      <td className="px-5 py-3 text-slate-600">{g.exam}</td>
                      <td className="px-5 py-3 text-right font-mono font-medium text-slate-900 tabular-nums">
                        {g.score} / 100
                      </td>
                      <td className="px-5 py-3 text-right">
                        <LetterGradeText letter={letter} />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {st && (
                            <button
                              type="button"
                              onClick={() => onOpenReportCard(st)}
                              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
                            >
                              <FileText
                                className="h-3.5 w-3.5 text-blue-700"
                                aria-hidden="true"
                              />
                              Report Card
                            </button>
                          )}
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => onDeleteGrade(g.id)}
                              className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50 whitespace-nowrap shrink-0"
                              aria-label={`Delete ${g.subject} score`}
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No exam scores match your search.
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
