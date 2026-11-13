import { CheckCircle2, GraduationCap, Printer, X } from 'lucide-react';
import { formatCurrency, getTodayIso } from '../data/seedData';
import { FeeInvoice, Student } from '../types/school';

interface FeeReceiptModalProps {
  invoice: FeeInvoice | null;
  student: Student | null;
  onClose: () => void;
}

export function FeeReceiptModal({
  invoice,
  student,
  onClose,
}: FeeReceiptModalProps) {
  if (!invoice || !student) return null;

  const isPaid = invoice.status === 'Paid';

  return (
    <div
      className="print-only-container fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/45 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fee-receipt-title"
    >
      <div className="print-sheet w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 md:p-8">
        {/* Non-print action bar */}
        <div className="no-print mb-6 flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2
              id="fee-receipt-title"
              className="text-base font-semibold text-slate-900"
            >
              {isPaid ? 'Official Tuition Fee Receipt' : 'Tuition Fee Invoice Statement'}
            </h2>
            <p className="text-xs text-slate-500">
              Print or save this {isPaid ? 'payment receipt' : 'invoice statement'} as a PDF
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
              aria-label="Close receipt preview"
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
                  Bursar &amp; Student Accounts Office
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-sm font-semibold text-slate-900">
                {isPaid ? 'Payment Receipt' : 'Tuition Invoice'}
              </div>
              <div className="font-mono text-xs text-slate-600 tabular-nums">
                {invoice.receiptNo}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 border-b border-slate-200 pb-5 text-sm">
            <div>
              <div className="text-xs text-slate-500">Billed To (Student)</div>
              <div className="font-semibold text-slate-900">{student.name}</div>
              <div className="font-mono text-xs text-slate-500 tabular-nums">
                {student.code} · {student.className}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Parent / Guardian</div>
              <div className="font-medium text-slate-900">
                {student.guardian}
              </div>
              <div className="font-mono text-xs text-slate-500 tabular-nums">
                {student.phone}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Due Date</div>
              <div className="font-mono text-slate-900 tabular-nums">
                {invoice.dueDate}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Payment Status</div>
              <div className="mt-0.5 flex items-center gap-1.5 font-semibold">
                {isPaid ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Paid on {invoice.paidAt ?? getTodayIso()}
                  </span>
                ) : (
                  <span className="text-red-700">Payment Due</span>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                  <th className="px-4 py-2.5">Description</th>
                  <th className="px-4 py-2.5">Academic Term</th>
                  <th className="px-4 py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-4 font-medium text-slate-900">
                    {invoice.title}
                  </td>
                  <td className="px-4 py-4 text-slate-600">2026–2027</td>
                  <td className="px-4 py-4 text-right font-mono font-medium text-slate-900 tabular-nums">
                    {formatCurrency(invoice.amount)}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-200 bg-slate-50">
                  <td
                    colSpan={2}
                    className="px-4 py-3 text-right text-sm font-semibold text-slate-700"
                  >
                    {isPaid ? 'Total Paid' : 'Total Balance Due'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-lg font-bold text-slate-900 tabular-nums">
                    {formatCurrency(invoice.amount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8 text-xs text-slate-600">
            <div className="border-t border-slate-300 pt-2">
              <div className="font-medium text-slate-900">Bopha Nhem</div>
              <div>School Accountant / Cashier</div>
            </div>
            <div className="border-t border-slate-300 pt-2">
              <div className="font-medium text-slate-900">Document Reference</div>
              <div className="font-mono tabular-nums">
                {invoice.receiptNo} · Printed {getTodayIso()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
