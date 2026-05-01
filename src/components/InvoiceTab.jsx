import { useState, useCallback } from 'react'
import FileUploadZone from './FileUploadZone'
import StatusBar from './StatusBar'
import SubmitButton from './SubmitButton'
import useFormSubmit from '../hooks/useFormSubmit'

const API_URL = 'https://n8n.hypoxisc.com/webhook/upload-invoice'

export default function InvoiceTab() {
  const [sourceFile, setSourceFile] = useState(null)

  const canSubmit = useCallback(() => !!sourceFile, [sourceFile])

  const buildFormData = useCallback(() => {
    const fd = new FormData()
    fd.append('source_file', sourceFile)
    return fd
  }, [sourceFile])

  const { loading, status, message, handleSubmit } = useFormSubmit({
    apiUrl: API_URL,
    buildFormData,
    canSubmit,
    fallbackFilename: '开票模板导出结果.xlsx',
    idleMessage: '请上传未开票账单数据文件',
    successMessage: '导出完成！文件已自动下载。',
    errorPrefix: '导出失败',
  })

  return (
    <>
      <FileUploadZone
        id="upload-invoice-source"
        label="上传未开票账单数据"
        file={sourceFile}
        onFileChange={setSourceFile}
      />

      <StatusBar status={status} message={message} />

      <SubmitButton
        id="btn-invoice"
        canSubmit={canSubmit() && !loading}
        loading={loading}
        onClick={handleSubmit}
        label="开始导出开票模板"
        loadingLabel="正在导出中…"
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      />
    </>
  )
}
