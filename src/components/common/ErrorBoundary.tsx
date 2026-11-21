import { AlertTriangle, RotateCcw, Trash2 } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { getDiagnosticLog, recordDiagnosticError } from '../../utils/diagnostics';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
  errorStack: string;
  componentStack: string;
}

const LESSON_STORAGE_KEY = 'kiberone_vibe_coding_lab_v1';

/**
 * Защита от белого экрана: перехватывает необработанные ошибки компонентов React,
 * записывает их в console.error и показывает понятный экран восстановления.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
      errorStack: '',
      componentStack: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      errorMessage: error?.message || 'Непредвиденная ошибка интерфейса',
      errorStack: error?.stack || '',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    recordDiagnosticError('runtime', error?.message || 'React ErrorBoundary catch', info.componentStack || '');
    console.error('React ErrorBoundary caught error:', error, info);
    this.setState({
      componentStack: info.componentStack || '',
    });
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleResetStorageAndReload = (): void => {
    try {
      localStorage.removeItem(LESSON_STORAGE_KEY);
    } catch (err) {
      console.error('Не удалось очистить localStorage:', err);
    }
    window.location.reload();
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const diagnostics = getDiagnosticLog();

    return (
      <div className="min-h-screen bg-[#F4F8FB] text-[#26313B] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-xl bg-white border-2 border-rose-300 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-rose-600">
                Защита мастерской
              </p>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#26313B] mt-0.5">
                Упс! Возникла ошибка экрана
              </h1>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                Не переживай — твой браузер перехватил ошибку вместо белого экрана. Нажми «Перезагрузить
                приложение». Если ошибка повторяется из-за повреждённого сохранения, можно безопасно начать заново.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#06B8BE] hover:bg-[#04959A] text-white text-sm font-extrabold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Перезагрузить приложение</span>
            </button>

            <button
              type="button"
              onClick={this.handleResetStorageAndReload}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 text-xs sm:text-sm font-bold cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Сбросить повреждённое сохранение</span>
            </button>
          </div>

          <details className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-700">
            <summary className="font-extrabold cursor-pointer text-[#26313B]">
              Диагностическая информация
            </summary>
            <div className="mt-3 space-y-2 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap break-words">
              <p>
                <strong>Ошибка:</strong> {this.state.errorMessage}
              </p>
              <p>
                <strong>URL:</strong> {window.location.href}
              </p>
              {this.state.errorStack && (
                <div>
                  <strong>Stack:</strong>
                  <pre className="mt-1 text-slate-600">{this.state.errorStack}</pre>
                </div>
              )}
              {this.state.componentStack && (
                <div>
                  <strong>Component stack:</strong>
                  <pre className="mt-1 text-slate-600">{this.state.componentStack}</pre>
                </div>
              )}
              {diagnostics.length > 0 && (
                <div>
                  <strong>Журнал ({diagnostics.length}):</strong>
                  <pre className="mt-1 text-slate-600">
                    {diagnostics.map((d) => `[${d.source}] ${d.message} ${d.detail || ''}`).join('\n')}
                  </pre>
                </div>
              )}
            </div>
          </details>
        </div>
      </div>
    );
  }
}
