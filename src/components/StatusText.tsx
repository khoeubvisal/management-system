import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileCheck2,
  MinusCircle,
  XCircle,
} from 'lucide-react';
import { AttendanceStatus, FeeStatus } from '../types/school';

export function AttendanceStatusText({
  status,
}: {
  status: AttendanceStatus | 'Not Marked';
}) {
  switch (status) {
    case 'Present':
      return (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 whitespace-nowrap">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          Present
        </span>
      );
    case 'Late':
      return (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 whitespace-nowrap">
          <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
          Late
        </span>
      );
    case 'Absent':
      return (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-700 whitespace-nowrap">
          <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          Absent
        </span>
      );
    case 'Excused':
      return (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 whitespace-nowrap">
          <FileCheck2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          Excused
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-sm font-normal text-slate-500 whitespace-nowrap">
          <MinusCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          Not Marked
        </span>
      );
  }
}

export function FeeStatusText({ status }: { status: FeeStatus }) {
  if (status === 'Paid') {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 whitespace-nowrap">
        <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
        Paid
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-700 whitespace-nowrap">
      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
      Unpaid
    </span>
  );
}

export function LetterGradeText({ letter }: { letter: string }) {
  const colorClass =
    letter === 'A' || letter === 'B'
      ? 'text-emerald-700'
      : letter === 'C' || letter === 'D'
        ? 'text-amber-700'
        : 'text-red-700';

  return (
    <span className={`font-mono font-semibold tabular-nums ${colorClass}`}>
      {letter}
    </span>
  );
}
