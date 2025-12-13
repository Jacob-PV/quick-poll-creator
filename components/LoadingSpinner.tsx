interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 gap-6">
      <div className="w-[60px] h-[60px] border-[5px] border-gray-300 border-t-primary rounded-full animate-spin" />
      <p className="text-lg font-semibold text-text-muted">{message}</p>
    </div>
  );
}
