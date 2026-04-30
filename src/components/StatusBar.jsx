export default function StatusBar({ status, message }) {
  if (!status) return null

  const config = {
    idle: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-500',
      icon: (
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    loading: {
      bg: 'bg-primary-50',
      border: 'border-primary-200',
      text: 'text-primary-700',
      icon: (
        <svg className="w-4 h-4 text-primary-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ),
    },
    success: {
      bg: 'bg-success-50',
      border: 'border-success-500/30',
      text: 'text-success-600',
      icon: (
        <svg className="w-4 h-4 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    error: {
      bg: 'bg-error-50',
      border: 'border-error-500/30',
      text: 'text-error-600',
      icon: (
        <svg className="w-4 h-4 text-error-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  }

  const c = config[status] || config.idle

  return (
    <div className={`fade-in flex items-center gap-2.5 px-4 py-3 rounded-lg border ${c.bg} ${c.border}`}>
      {c.icon}
      <span className={`text-sm font-medium ${c.text}`}>{message}</span>
    </div>
  )
}
