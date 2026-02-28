export default function ReportCard({ icon, title, children, variant = 'default', className = '' }) {
  const variantClasses = {
    default: 'bg-white border border-neutral-100',
    primary: 'bg-primary-50 border border-primary-100',
    secondary: 'bg-secondary-50 border border-secondary-100',
    feedback: 'bg-feedback-50 border border-yellow-200',
    warning: 'bg-orange-50 border border-orange-200',
  };

  const iconBg = {
    default: 'bg-neutral-100',
    primary: 'bg-primary-100',
    secondary: 'bg-green-100',
    feedback: 'bg-yellow-100',
    warning: 'bg-orange-100',
  };

  return (
    <div className={`rounded-2xl p-5 shadow-sm ${variantClasses[variant]} ${className}`}>
      {(icon || title) && (
        <div className="flex items-center gap-3 mb-4">
          {icon && (
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${iconBg[variant]}`}>
              {icon}
            </div>
          )}
          {title && <h3 className="font-semibold text-neutral-800 text-base">{title}</h3>}
        </div>
      )}
      {children}
    </div>
  );
}
