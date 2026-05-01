/**
 * 通用提交按钮 —— 统一样式、Loading 状态、disabled 逻辑。
 *
 * @param {Object} props
 * @param {string}  props.id           - 按钮 DOM id
 * @param {boolean} props.canSubmit    - 是否可点击
 * @param {boolean} props.loading      - 是否 loading 状态
 * @param {string}  props.label        - 默认按钮文案
 * @param {string}  props.loadingLabel - loading 时的文案
 * @param {React.ReactNode} props.icon - 默认状态图标
 * @param {Function} props.onClick     - 点击回调
 */
export default function SubmitButton({
  id,
  canSubmit,
  loading,
  label,
  loadingLabel,
  icon,
  onClick,
}) {
  return (
    <button
      id={id}
      type="button"
      disabled={!canSubmit}
      onClick={onClick}
      className={`
        btn-glow w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide
        flex items-center justify-center gap-2
        transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        ${canSubmit
          ? loading
            ? 'shimmer text-white shadow-lg shadow-primary-500/20 cursor-wait'
            : 'bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/25 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md cursor-pointer'
          : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
        }
      `}
    >
      {loading ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          {loadingLabel}
        </>
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </button>
  )
}
