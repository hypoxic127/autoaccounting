import { useRef, useState, useCallback, useEffect } from 'react'

const ACCEPTED_TYPES = [
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
]
const ACCEPTED_EXT = ['.csv', '.xlsx', '.xls']

function matchFile(file) {
  if (!file) return false
  if (ACCEPTED_TYPES.includes(file.type)) return true
  const name = file.name.toLowerCase()
  return ACCEPTED_EXT.some((ext) => name.endsWith(ext))
}

/** 格式化文件大小 */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** 获取文件扩展名（大写） */
function getExt(name) {
  const parts = name.split('.')
  return parts.length > 1 ? parts.pop().toUpperCase() : '?'
}

export default function FileUploadZone({ label, file, onFileChange, id }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  // 拖拽计数器：解决子元素 dragLeave 冒泡导致的高亮闪烁
  const dragCounterRef = useRef(0)

  // 错误提示 3 秒自动消失
  useEffect(() => {
    if (!error) return
    const timer = setTimeout(() => setError(''), 3000)
    return () => clearTimeout(timer)
  }, [error])

  const handleFile = useCallback(
    (f) => {
      if (matchFile(f)) {
        onFileChange(f)
        setError('')
      } else {
        onFileChange(null)
        setError(`不支持的文件格式"${f.name.split('.').pop()}"，仅支持 .csv / .xlsx`)
      }
    },
    [onFileChange],
  )

  const onDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current += 1
    if (dragCounterRef.current === 1) {
      setIsDragging(true)
    }
  }
  const onDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const onDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current -= 1
    if (dragCounterRef.current === 0) {
      setIsDragging(false)
    }
  }
  const onDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current = 0
    setIsDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }
  const onClick = () => inputRef.current?.click()
  const onInputChange = (e) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
    e.target.value = ''
  }

  const removeFile = (e) => {
    e.stopPropagation()
    onFileChange(null)
    setError('')
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Label */}
      <label className="text-[13px] font-semibold text-slate-600 tracking-wide" htmlFor={id}>
        {label}
      </label>

      {/* Drop Zone */}
      <div
        id={id}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`
          relative group cursor-pointer rounded-2xl border-2 border-dashed
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${file ? 'p-4' : 'p-8'}
          ${
            isDragging
              ? 'upload-zone-drag border-primary-400 bg-primary-50/60 scale-[1.02] shadow-lg shadow-primary-500/10'
              : file
                ? 'border-success-500/30 bg-success-50/40 hover:border-success-500/50'
                : error
                  ? 'border-error-500/40 bg-error-50/30'
                  : 'border-slate-200 bg-slate-50/50 hover:border-primary-300 hover:bg-primary-50/20 hover:shadow-md hover:shadow-primary-500/5'
          }
        `}
      >
        {file ? (
          /* ── File Card (selected state) ── */
          <div className="flex items-center gap-3.5">
            {/* File type badge */}
            <div className="w-11 h-11 rounded-xl bg-success-500/10 ring-1 ring-success-500/20 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-success-700 tracking-wider">{getExt(file.name)}</span>
            </div>
            {/* File info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">
                {file.name}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {formatSize(file.size)} · 已就绪
              </p>
            </div>
            {/* Remove button */}
            <button
              type="button"
              onClick={removeFile}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-error-50 flex items-center justify-center text-slate-400 hover:text-error-500 transition-all duration-200 shrink-0 ring-1 ring-slate-200/60 hover:ring-error-200"
              aria-label="移除文件"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          /* ── Empty state (upload prompt) ── */
          <div className="flex flex-col items-center justify-center gap-3">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isDragging
                ? 'bg-primary-500/10 scale-110'
                : 'bg-slate-100 group-hover:bg-primary-100/60 group-hover:scale-105'
            }`}>
              <svg className={`w-6 h-6 transition-colors duration-300 ${
                isDragging ? 'text-primary-500' : 'text-slate-400 group-hover:text-primary-400'
              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
            </div>
            {/* Text */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-medium text-slate-500">
                {isDragging ? '松开以上传文件' : (
                  <>拖拽文件到此处，或<span className="text-primary-500 font-semibold">点击上传</span></>
                )}
              </span>
              <span className="text-[11px] text-slate-400">支持 .csv / .xlsx 格式</span>
            </div>
          </div>
        )}

        {/* Hidden input */}
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={onInputChange}
        />
      </div>

      {/* Inline error message */}
      {error && (
        <div className="fade-in flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-error-50/80 border border-error-200/60 ring-1 ring-error-500/10">
          <svg className="w-4 h-4 text-error-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span className="text-xs font-medium text-error-600">{error}</span>
        </div>
      )}
    </div>
  )
}
