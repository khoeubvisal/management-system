import { FileText, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { CLASS_SECTIONS, getTodayIso } from '../data/seedData';
import { ClassSection, Student, UserRole } from '../types/school';

interface StudentsViewProps {
  students: Student[];
  role: UserRole;
  onSaveStudent: (student: Omit<Student, 'id'>, editId?: number) => void;
  onDeleteStudent: (student: Student) => void;
  onOpenReportCard: (student: Student) => void;
}

export function StudentsView({
  students,
  role,
  onSaveStudent,
  onDeleteStudent,
  onOpenReportCard,
}: StudentsViewProps) {
  const canEdit = role === 'admin';
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState<string>('ALL');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Female');
  const [className, setClassName] = useState<ClassSection>('Grade 10A');
  const [guardian, setGuardian] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const filtered = students.filter((s) => {
    const matchesClass = classFilter === 'ALL' || s.className === classFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.guardian.toLowerCase().includes(q) ||
      s.className.toLowerCase().includes(q);
    return matchesClass && matchesSearch;
  });

  function openNewForm() {
    setEditingId(null);
    const nextNum = 100 + students.length + 1;
    setCode(`STU-${nextNum}`);
    setName('');
    setGender('Female');
    setClassName('Grade 10A');
    setGuardian('');
    setPhone('');
    setErrorMsg('');
    setFormOpen(true);
  }

  function openEditForm(s: Student) {
    setEditingId(s.id);
    setCode(s.code);
    setName(s.name);
    setGender(s.gender);
    setClassName(s.className);
    setGuardian(s.guardian);
    setPhone(s.phone);
    setErrorMsg('');
    setFormOpen(true);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmedCode = code.trim().toUpperCase();
    const trimmedName = name.trim();
    const trimmedGuardian = guardian.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedCode || !trimmedName || !trimmedGuardian || !trimmedPhone) {
      setErrorMsg('Please complete all required student fields.');
      return;
    }

    const duplicate = students.find(
      (s) =>
        s.code.toUpperCase() === trimmedCode &&
        (editingId === null || s.id !== editingId)
    );
    if (duplicate) {
      setErrorMsg(`Student code ${trimmedCode} is already assigned.`);
      return;
    }

    const existing = editingId
      ? students.find((s) => s.id === editingId)
      : undefined;

    onSaveStudent(
      {
        code: trimmedCode,
        name: trimmedName,
        gender,
        className,
        guardian: trimmedGuardian,
        phone: trimmedPhone,
        enrolledDate: existing?.enrolledDate ?? getTodayIso(),
      },
      editingId ?? undefined
    );
    setFormOpen(false);
    setEditingId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Student Directory &amp; Admissions
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {canEdit
              ? 'Enroll new students, update guardian records, or open academic report cards.'
              : 'Read-only student roster for academic and billing reference.'}
          </p>
        </div>
        {canEdit && (
          <button
            type="button"
            onClick={openNewForm}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 whitespace-nowrap shrink-0"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Enroll Student
          </button>
        )}
      </div>

      {/* Collapsible Enroll / Edit Panel */}
      {canEdit && formOpen && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-base font-semibold text-slate-900">
              {editingId ? 'Edit Student Record' : 'New Student Enrollment'}
            </h2>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close enrollment form"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Student Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="STU-109"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Borey Vann"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) =>
                    setGender(e.target.value as 'Male' | 'Female')
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-700 focus:outline-none"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Class Section
                </label>
                <select
                  value={className}
                  onChange={(e) => setClassName(e.target.value as ClassSection)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-700 focus:outline-none"
                >
                  {CLASS_SECTIONS.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Parent / Guardian
                </label>
                <input
                  type="text"
                  value={guardian}
                  onChange={(e) => setGuardian(e.target.value)}
                  placeholder="Guardian full name"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="012 345 678"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 whitespace-nowrap"
              >
                {editingId ? 'Save Changes' : 'Complete Enrollment'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search + Segmented Class Filter + Table */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
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

          <div className="relative w-full sm:w-72">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, code, or guardian..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Gender</th>
                <th className="px-5 py-3">Class</th>
                <th className="px-5 py-3">Guardian</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length > 0 ? (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-mono text-xs font-medium text-slate-700 tabular-nums">
                      {s.code}
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-900">
                      {s.name}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{s.gender}</td>
                    <td className="px-5 py-3 text-slate-700">{s.className}</td>
                    <td className="px-5 py-3 text-slate-700">{s.guardian}</td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-600 tabular-nums">
                      {s.phone}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {role !== 'accountant' && (
                          <button
                            type="button"
                            onClick={() => onOpenReportCard(s)}
                            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
                          >
                            <FileText className="h-3.5 w-3.5 text-blue-700" aria-hidden="true" />
                            Report Card
                          </button>
                        )}
                        {canEdit && (
                          <>
                            <button
                              type="button"
                              onClick={() => openEditForm(s)}
                              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
                              aria-label={`Edit ${s.name}`}
                            >
                              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteStudent(s)}
                              className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50 whitespace-nowrap shrink-0"
                              aria-label={`Delete ${s.name}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No students match your current filter.
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
