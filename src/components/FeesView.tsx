import { Plus, Receipt, Search, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { formatCurrency, getTodayIso } from '../data/seedData';
import { FeeInvoice, FeeStatus, Student, UserRole } from '../types/school';
import { FeeStatusText } from './StatusText';

interface FeesViewProps {
  students: Student[];
  fees: FeeInvoice[];
  role: UserRole;
  activeStudent: Student | null;
  onCreateInvoice: (invoice: Omit<FeeInvoice, 'id' | 'receiptNo'>) => void;
  onToggleStatus: (invoiceId: number) => void;
  onDeleteInvoice: (invoiceId: number) => void;
  onOpenReceipt: (invoice: FeeInvoice) => void;
}

export function FeesView({
  students,
  fees,
  role,
  activeStudent,
  onCreateInvoice,
  onToggleStatus,
  onDeleteInvoice,
  onOpenReceipt,
}: FeesViewProps) {
  const canEdit = role === 'admin' || role === 'accountant';
  const [studentId, setStudentId] = useState<number>(students[0]?.id ?? 0);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(getTodayIso());
  const [statusFilter, setStatusFilter] = useState<'ALL' | FeeStatus>('ALL');
  const [search, setSearch] = useState('');

  const scopedFees =
    role === 'student' && activeStudent
      ? fees.filter((f) => f.studentId === activeStudent.id)
      : fees;

  const filtered = scopedFees.filter((f) => {
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    const st = students.find((s) => s.id === f.studentId);
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      f.title.toLowerCase().includes(q) ||
      f.receiptNo.toLowerCase().includes(q) ||
      (st?.name.toLowerCase().includes(q) ?? false);
    return matchesStatus && matchesSearch;
  });

  const totalCollected = scopedFees
    .filter((f) => f.status === 'Paid')
    .reduce((sum, f) => sum + Number(f.amount), 0);
  const totalUnpaid = scopedFees
    .filter((f) => f.status === 'Unpaid')
    .reduce((sum, f) => sum + Number(f.amount), 0);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const numericAmount = Number(amount);
    const targetStudentId = studentId || students[0]?.id;
    if (!targetStudentId || !title.trim() || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return;
    }

    onCreateInvoice({
      studentId: targetStudentId,
      title: title.trim(),
      amount: numericAmount,
      dueDate: dueDate || getTodayIso(),
      status: 'Unpaid',
      paidAt: null,
    });
    setTitle('');
    setAmount('');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {role === 'student'
              ? 'My Tuition Invoices & Receipts'
              : 'Tuition Fees & Billing'}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {canEdit
              ? 'Issue tuition invoices, record fee payments, and print official student receipts.'
              : 'Review your tuition payment status and download official fee receipts.'}
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm tabular-nums">
          <div>
            <span className="text-slate-500">Collected: </span>
            <strong className="font-mono text-emerald-700">
              {formatCurrency(totalCollected)}
            </strong>
          </div>
          <div>
            <span className="text-slate-500">Outstanding: </span>
            <strong className="font-mono text-red-700">
              {formatCurrency(totalUnpaid)}
            </strong>
          </div>
        </div>
      </div>

      {canEdit && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-900">
            Create Tuition Invoice
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
                Invoice Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Term 2 Tuition"
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Amount (USD)
              </label>
              <input
                type="number"
                min={1}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="250.00"
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
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
                Create Invoice
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
            {(['ALL', 'Paid', 'Unpaid'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  statusFilter === status
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status === 'ALL' ? 'All Invoices' : status}
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
              placeholder="Search receipt #, student, or title..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                <th className="px-5 py-3">Receipt #</th>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Due Date</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length > 0 ? (
                filtered.map((f) => {
                  const st = students.find((s) => s.id === f.studentId);
                  const isPaid = f.status === 'Paid';
                  return (
                    <tr key={f.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-mono text-xs text-slate-600 tabular-nums">
                        {f.receiptNo}
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-900">
                        {st?.name ?? 'Unknown'}
                      </td>
                      <td className="px-5 py-3 text-slate-700">{f.title}</td>
                      <td className="px-5 py-3 font-mono text-xs text-slate-600 tabular-nums">
                        {f.dueDate}
                      </td>
                      <td className="px-5 py-3 text-right font-mono font-medium text-slate-900 tabular-nums">
                        {formatCurrency(f.amount)}
                      </td>
                      <td className="px-5 py-3">
                        <FeeStatusText status={f.status} />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenReceipt(f)}
                            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
                          >
                            <Receipt
                              className="h-3.5 w-3.5 text-blue-700"
                              aria-hidden="true"
                            />
                            {isPaid ? 'View Receipt' : 'Invoice'}
                          </button>

                          {canEdit && (
                            <>
                              <button
                                type="button"
                                onClick={() => onToggleStatus(f.id)}
                                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                                  isPaid
                                    ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                    : 'bg-emerald-700 text-white hover:bg-emerald-800'
                                }`}
                              >
                                {isPaid ? 'Mark Unpaid' : 'Mark Paid'}
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteInvoice(f.id)}
                                className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50 whitespace-nowrap shrink-0"
                                aria-label={`Delete invoice ${f.receiptNo}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                              </button>
                            </>
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
                    No invoices match your filter.
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
