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
      <label className="text-sm font-semibold text-gray-700 tracking-wide" htmlFor={id}>
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
          relative group cursor-pointer rounded-xl border-2 border-dashed p-8
          flex flex-col items-center justify-center gap-3
          transition-all duration-300 ease-in-out
          ${
            isDragging
              ? 'upload-zone-drag border-primary-400 bg-primary-50 scale-[1.02]'
              : file
                ? 'border-success-500/40 bg-success-50/50 hover:border-success-500/60'
                : error
                  ? 'border-error-500/40 bg-error-50/30'
                  : 'border-gray-200 bg-gray-50/50 hover:border-primary-300 hover:bg-primary-50/30'
          }
        `}
      >
        {/* Icon */}
        {file ? (
          <div className="w-12 h-12 rounded-full bg-success-500/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${isDragging ? 'bg-primary-500/10' : 'bg-gray-100 group-hover:bg-primary-100/60'}`}>
            <svg className={`w-6 h-6 transition-colors duration-300 ${isDragging ? 'text-primary-500' : 'text-gray-400 group-hover:text-primary-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
          </div>
        )}

        {/* Text */}
        {file ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium text-success-600 truncate max-w-[260px]">
              {file.name}
            </span>
            <span className="text-xs text-gray-400">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium text-gray-500">
              {isDragging ? '松开以上传文件' : '拖拽文件到此处，或点击上传'}
            </span>
            <span className="text-xs text-gray-400">支持 .csv / .xlsx 格式</span>
          </div>
        )}

        {/* Remove button */}
        {file && (
          <button
            type="button"
            onClick={removeFile}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-error-500 hover:border-error-300 transition-colors duration-200"
            aria-label="移除文件"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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

      {/* Inline error message (replaces alert()) */}
      {error && (
        <div className="fade-in flex items-center gap-2 px-3 py-2 rounded-lg bg-error-50 border border-error-500/20">
          <svg className="w-3.5 h-3.5 text-error-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-medium text-error-600">{error}</span>
        </div>
      )}
    </div>
  )
}
