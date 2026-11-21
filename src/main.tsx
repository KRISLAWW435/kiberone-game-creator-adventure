import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';
import './index.css';

const rootEl = document.getElementById('root');

if (!rootEl) {
  console.error('Критическая ошибка инициализации: элемент #root не найден в DOM.');
  document.body.innerHTML =
    '<div style="font-family:sans-serif;padding:24px;color:#26313B"><h2>Не удалось запустить приложение</h2><p>Не найден контейнер #root. Попробуйте обновить страницу.</p></div>';
} else {
  createRoot(rootEl).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
