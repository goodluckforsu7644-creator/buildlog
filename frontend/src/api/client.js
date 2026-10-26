const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api')
  .replace(/\/+$/, '');

export async function getHealth({ signal } = {}) {
  const response = await fetch(`${API_BASE_URL}/health`, {
    credentials: 'include',
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(5000)])
      : AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error('서버 응답을 확인할 수 없습니다.');
  const result = await response.json();
  if (result.status !== 'ok' || result.service !== 'BuildLog') {
    throw new Error('올바른 서버 응답이 아닙니다.');
  }
  return result;
}
