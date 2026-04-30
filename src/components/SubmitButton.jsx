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
        w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide
        flex items-center justify-center gap-2
        transition-all duration-300 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        ${canSubmit
          ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30 hover:scale-[1.01] active:scale-[0.99]'
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
