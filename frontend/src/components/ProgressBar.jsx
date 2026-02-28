export default function ProgressBar({ value = 0, max = 100, label, color = 'primary', showValue = true }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary-500',
    feedback: 'bg-feedback',
    green: 'bg-green-400',
    red: 'bg-red-400',
  };

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm font-medium text-neutral-600">{label}</span>}
          {showValue && (
            <span className="text-sm font-semibold text-neutral-700">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color] || colorClasses.primary} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
