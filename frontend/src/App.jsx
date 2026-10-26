import { useEffect, useState } from 'react';
import { getHealth } from './api/client.js';

export default function App() {
  const [connection, setConnection] = useState('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setConnection('loading');
    getHealth({ signal: controller.signal })
      .then(() => { if (!controller.signal.aborted) setConnection('connected'); })
      .catch(() => { if (!controller.signal.aborted) setConnection('error'); });
    return () => controller.abort();
  }, [attempt]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="BuildLog 홈">
          <span className="brand-mark" aria-hidden="true">B<span>_</span></span>
          BuildLog
        </a>
        <span className="header-caption">작은 배움이 쌓이는 곳</span>
      </header>
      <main>
        <section className="intro" aria-labelledby="intro-title">
          <p className="eyebrow">나의 학습 아카이브</p>
          <h1 id="intro-title">오늘의 배움을,<br />내일의 발판으로.</h1>
          <p className="intro-description">공부한 내용부터 해결한 오류까지.<br />흩어져 있던 기록을 BuildLog에 차곡차곡 모아보세요.</p>
        </section>
        <section className="connection-card" aria-labelledby="connection-title">
          <div className="card-heading">
            <div><p className="eyebrow">시작 준비</p><h2 id="connection-title">BuildLog 연결 상태</h2></div>
            <span className="phase-label">준비 중</span>
          </div>
          <div className={`connection-status ${connection}`} role="status" aria-live="polite">
            <span className="status-dot" aria-hidden="true" />
            <div>
              <strong>{connection === 'loading' ? '서버에 연결하고 있어요' : connection === 'connected' ? '서버와 연결되었어요' : '서버에 연결하지 못했어요'}</strong>
              <p>{connection === 'loading' ? '잠시만 기다려 주세요.' : connection === 'connected' ? 'BuildLog를 시작할 기본 준비가 되었습니다.' : '잠시 후 다시 시도해 주세요.'}</p>
            </div>
          </div>
          <button type="button" disabled={connection === 'loading'} onClick={() => setAttempt(value => value + 1)}>
            {connection === 'loading' ? '확인 중…' : connection === 'error' ? '다시 시도' : '연결 다시 확인'}
          </button>
        </section>
        <p className="preparation-note">지금은 서비스를 준비하고 있어요. 기록 기능은 순서대로 열릴 예정입니다.</p>
      </main>
      <footer>BuildLog <span>하루의 기록이 나의 성장이 되도록.</span></footer>
    </div>
  );
}
