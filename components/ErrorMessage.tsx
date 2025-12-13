import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border-4 border-error rounded-xl p-6 shadow-brutal-md flex items-start gap-4">
      <AlertCircle className="w-6 h-6 text-error flex-shrink-0 mt-1" />
      <div className="flex-1">
        <p className="text-base font-semibold text-text mb-3">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-error border-3 border-text rounded-lg px-5 py-2.5 text-sm font-bold text-white shadow-brutal-sm cursor-pointer transition-all hover:bg-red-600 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_rgba(10,10,10,1)] active:translate-x-0 active:translate-y-0 active:shadow-brutal-sm"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
