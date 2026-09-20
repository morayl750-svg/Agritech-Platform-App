import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AgriSmart Uncaught Error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">Khalad ayaa ka dhacay nidaamka</h2>
              <p className="text-xs text-gray-500 mt-1">
                Fadlan riix badhanka hoose si aad dub loogu furo nidaamka.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-left">
                <p className="text-[11px] font-mono text-red-600 break-all">
                  {this.state.error.message || 'Unknown render error'}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Cusboonaysii Nidaamka (Reload)</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
