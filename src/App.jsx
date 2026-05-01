import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import ReconcileTab from './components/ReconcileTab'
import InvoiceTab from './components/InvoiceTab'

const TABS = [
  { key: 'reconcile', label: '自动对账',     icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  )},
  { key: 'invoice',   label: '开票模板导出', icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )},
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
    requestAnimationFrame(() => {
      isInitialRef.current = false
    })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="fade-in-up w-full max-w-xl">
        {/* ── Main Card ── */}
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20 ring-1 ring-primary-500/10">
                <svg className="w-5.5 h-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">财务智能工具平台</h1>
                <p className="text-xs text-slate-400 mt-0.5 tracking-wide">自动对账 · 开票模板导出</p>
              </div>
            </div>
          </div>

          {/* ── Segmented Control ── */}
          <div className="px-8 pb-6">
            <div className="relative flex bg-slate-100/80 rounded-xl p-1 ring-1 ring-slate-900/[0.04]">
              {/* Sliding indicator */}
              <div
                className={`absolute top-1 bottom-1 rounded-[10px] bg-white shadow-sm ring-1 ring-slate-900/[0.04] ${
                  isInitialRef.current ? '' : 'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]'
                }`}
                style={indicatorStyle}
              />

              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  ref={(el) => { tabsRef.current[tab.key] = el }}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    relative z-10 flex-1 py-2.5 text-[13px] font-semibold rounded-[10px]
                    flex items-center justify-center gap-1.5 cursor-pointer
                    transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                    ${activeTab === tab.key
                      ? 'text-primary-700'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-white/50 hover:shadow-sm'
                    }
                  `}
                >
                  <span className={`transition-colors duration-300 ${activeTab === tab.key ? 'text-primary-500' : ''}`}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="mx-8 border-t border-slate-100" />

          {/* ── Tab Content ── */}
          <div className="px-8 py-7 flex flex-col gap-5">
            <div key={activeTab} className="fade-in">
              {activeTab === 'reconcile' && <ReconcileTab />}
              {activeTab === 'invoice'   && <InvoiceTab />}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-xs text-slate-400 tracking-wide">
            数据仅用于财务处理，不会被存储或泄露
          </p>
        </div>
      </div>
    </div>
  )
}
