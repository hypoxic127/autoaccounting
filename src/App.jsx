import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import ReconcileTab from './components/ReconcileTab'
import InvoiceTab from './components/InvoiceTab'

const TABS = [
  { key: 'reconcile', label: '自动对账' },
  { key: 'invoice',   label: '开票模板导出' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('reconcile')
  const [indicatorStyle, setIndicatorStyle] = useState({})
  const tabsRef = useRef({})
  // 首次渲染标记：跳过初始滑块 transition 避免闪烁
  const isInitialRef = useRef(true)

  // 计算滑块位置
  useLayoutEffect(() => {
    const el = tabsRef.current[activeTab]
    if (el) {
      setIndicatorStyle({
        width:     el.offsetWidth,
        transform: `translateX(${el.offsetLeft}px)`,
      })
    }
  }, [activeTab])

  // 首帧渲染后开启 transition
  useEffect(() => {
    // 等一帧再开启过渡，避免从 (0,0) 飞入
    requestAnimationFrame(() => {
      isInitialRef.current = false
    })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="fade-in-up w-full max-w-lg">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-lg shadow-gray-200/50 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/25">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">财务智能工具平台</h1>
                <p className="text-xs text-gray-400 mt-0.5">自动对账 · 开票模板导出</p>
              </div>
            </div>
          </div>

          {/* ── iOS 风格分段控制器 ── */}
          <div className="px-8 pb-5">
            <div className="relative flex bg-gray-100 rounded-xl p-1">
              {/* 滑块 */}
              <div
                className={`absolute top-1 bottom-1 rounded-lg bg-white shadow-sm ${
                  isInitialRef.current ? '' : 'transition-all duration-300 ease-in-out'
                }`}
                style={indicatorStyle}
              />

              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  ref={(el) => { tabsRef.current[tab.key] = el }}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    relative z-10 flex-1 py-2 text-sm font-medium rounded-lg
                    transition-colors duration-300 ease-in-out
                    ${activeTab === tab.key
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Tab Content with fade transition ── */}
          <div className="px-8 pb-8 flex flex-col gap-5">
            <div key={activeTab} className="fade-in">
              {activeTab === 'reconcile' && <ReconcileTab />}
              {activeTab === 'invoice'   && <InvoiceTab />}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-5">
          数据仅用于财务处理，不会被存储或泄露
        </p>
      </div>
    </div>
  )
}
