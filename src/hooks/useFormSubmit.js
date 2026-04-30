import { useState, useCallback, useRef, useEffect } from 'react'
import { downloadFromResponse } from '../utils/download'

/**
 * 通用表单提交 Hook —— 封装 loading 状态、AbortController 防竞态、
 * 防重入锁、组件卸载自动取消，以及统一的文件下载调用。
 *
 * @param {Object}   config
 * @param {string}   config.apiUrl            - 后端接口地址
 * @param {Function} config.buildFormData      - (files) => FormData，构造请求体
 * @param {Function} config.canSubmit          - () => boolean，前置校验
 * @param {string}   config.fallbackFilename   - 下载兜底文件名
 * @param {string}   config.idleMessage        - 初始状态提示
 * @param {string}   config.successMessage     - 成功提示
 * @param {string}   config.errorPrefix        - 错误提示前缀
 */
export default function useFormSubmit({
  apiUrl,
  buildFormData,
  canSubmit,
  fallbackFilename = '下载文件.xlsx',
  idleMessage = '请上传文件',
  successMessage = '处理完成！文件已自动下载。',
  errorPrefix = '处理失败',
}) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('idle')       // idle | loading | success | error
  const [message, setMessage] = useState(idleMessage)

  // AbortController 引用，用于取消进行中的请求
  const abortRef = useRef(null)
  // 防重入锁
  const submittingRef = useRef(false)

  // 组件卸载时自动取消正在进行的请求
  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort()
      }
    }
  }, [])

  const handleSubmit = useCallback(async () => {
    // 双重防护：UI 层 disabled + 逻辑层锁
    if (!canSubmit() || submittingRef.current) return

    // 取消上一次未完成的请求（如有）
    if (abortRef.current) {
      abortRef.current.abort()
    }
    const controller = new AbortController()
    abortRef.current = controller

    submittingRef.current = true
    setLoading(true)
    setStatus('loading')
    setMessage('正在处理中，请稍候…')

    try {
      const formData = buildFormData()

      const res = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })

      if (!res.ok) {
        const errorText = await res.text().catch(() => '')
        throw new Error(errorText || `服务器错误 (${res.status})`)
      }

      await downloadFromResponse(res, fallbackFilename)

      setStatus('success')
      setMessage(successMessage)
    } catch (err) {
      // 被 abort 的请求不显示错误
      if (err.name === 'AbortError') return

      setStatus('error')
      setMessage(`${errorPrefix}：${err.message || '网络错误，请检查接口连接'}`)
    } finally {
      submittingRef.current = false
      setLoading(false)
      abortRef.current = null
    }
  }, [apiUrl, buildFormData, canSubmit, fallbackFilename, successMessage, errorPrefix])

  return { loading, status, message, handleSubmit }
}
