export default function StatusBar({ status, message }) {
  if (!status) return null

  const config = {
    idle: {
      wrapper: 'bg-slate-50/80 border-slate-200/60 ring-slate-900/[0.03]',
      text:    'text-slate-500',
      iconBg:  'bg-slate-200/60',
      icon: (
        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    loading: {
      wrapper: 'bg-primary-50/60 border-primary-200/50 ring-primary-500/[0.06]',
      text:    'text-primary-700',
      iconBg:  'bg-primary-100',
      icon: (
        <svg className="w-3.5 h-3.5 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ),
    },
    success: {
      wrapper: 'bg-success-50/60 border-success-200/50 ring-success-500/[0.06]',
      text:    'text-success-700',
      iconBg:  'bg-success-100',
      icon: (
        <svg className="w-3.5 h-3.5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    error: {
      wrapper: 'bg-error-50/60 border-error-200/50 ring-error-500/[0.06]',
      text:    'text-error-700',
      iconBg:  'bg-error-100',
      icon: (
        <svg className="w-3.5 h-3.5 text-error-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      ),
    },
  }

  const c = config[status] || config.idle

  return (
    <div className={`fade-in flex items-center gap-3 px-4 py-3 rounded-xl border ring-1 ${c.wrapper}`}>
      <div className={`w-7 h-7 rounded-lg ${c.iconBg} flex items-center justify-center shrink-0`}>
        {c.icon}
      </div>
      <span className={`text-[13px] font-medium leading-snug ${c.text}`}>{message}</span>
    </div>
  )
}
