/**
 * 从 Response 的 Content-Disposition 头中提取文件名并触发浏览器下载。
 * 包含完整的防乱码正则解析和 requestAnimationFrame 延迟清理逻辑。
 *
 * @param {Response} res        - fetch 返回的 Response 对象
 * @param {string} fallbackName - 提取不到文件名时的兜底名称
 */
export async function downloadFromResponse(res, fallbackName = '下载文件.xlsx') {
  // ── 1. 从 Content-Disposition 提取文件名 ──
  const disposition = res.headers.get('Content-Disposition') || ''
  let filename = fallbackName

  // 优先匹配 filename*=UTF-8''xxx（RFC 5987），再匹配 filename="xxx"
  const utf8Match = disposition.match(/filename\*\s*=\s*UTF-8''(.+?)(?:;|$)/i)
  const plainMatch = disposition.match(/filename\s*=\s*"?([^";]+)"?/i)

  if (utf8Match) {
    filename = decodeURIComponent(utf8Match[1])
  } else if (plainMatch) {
    filename = decodeURIComponent(plainMatch[1])
  }

  // ── 2. 下载二进制流为 Excel 文件 ──
  const rawBlob = await res.blob()
  // 用正确的 MIME type 重新包装 Blob，避免类型推断干扰
  const blob = new Blob([rawBlob], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  // ── 3. 优先使用 showSaveFilePicker（彻底避免 UUID 文件名问题） ──
  if (typeof window.showSaveFilePicker === 'function') {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'Excel 文件',
          accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
        }],
      })
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
      return // 成功，直接返回
    } catch (pickerErr) {
      // 用户取消了保存对话框，不算错误，直接返回
      if (pickerErr.name === 'AbortError') return
      // 其他错误回退到 <a> 标签方式
    }
  }

  // ── 4. Fallback：使用隐藏的 <a> 标签触发下载 ──
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.download = filename
  document.body.appendChild(a)

  // 用 requestAnimationFrame 确保 DOM 渲染完成后再触发点击
  requestAnimationFrame(() => {
    a.click()
    // 延迟 3 秒清理，给浏览器下载模块足够时间读取 download 属性
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 3000)
  })
}
