import { useState, useCallback } from 'react'
import FileUploadZone from './FileUploadZone'
import StatusBar from './StatusBar'
import SubmitButton from './SubmitButton'
import useFormSubmit from '../hooks/useFormSubmit'

const API_URL = 'https://n8n.hypoxisc.com/webhook/upload-reconcile'

export default function ReconcileTab() {
  const [bankFile, setBankFile] = useState(null)
  const [billFile, setBillFile] = useState(null)

  const canSubmit = useCallback(() => !!bankFile && !!billFile, [bankFile, billFile])

  const buildFormData = useCallback(() => {
    const fd = new FormData()
    fd.append('bank_file', bankFile)
    fd.append('bill_file', billFile)
    return fd
  }, [bankFile, billFile])

  const { loading, status, message, handleSubmit } = useFormSubmit({
    apiUrl: API_URL,
    buildFormData,
    canSubmit,
    fallbackFilename: '自动对账结果.xlsx',
    idleMessage: '请上传银行流水和系统账单文件',
    successMessage: '对账完成！文件已自动下载。',
    errorPrefix: '对账失败',
  })

  return (
    <>
      <FileUploadZone
        id="upload-bank"
        label="上传银行流水"
        file={bankFile}
        onFileChange={setBankFile}
      />

      <FileUploadZone
        id="upload-bill"
        label="上传系统账单"
        file={billFile}
        onFileChange={setBillFile}
      />

      <StatusBar status={status} message={message} />

      <SubmitButton
        id="btn-reconcile"
        canSubmit={canSubmit() && !loading}
        loading={loading}
        onClick={handleSubmit}
        label="开始自动对账"
        loadingLabel="正在对账中…"
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        }
      />
    </>
  )
}
