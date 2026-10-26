import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from '../src/App.jsx';

describe('server connection', () => {
  it('shows the actual health result and sends credentialed requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ status: 'ok', service: 'BuildLog' }) });
    vi.stubGlobal('fetch', fetchMock);
    render(<App />);
    expect(await screen.findByText('서버와 연결되었어요')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/api/health', expect.objectContaining({ credentials: 'include', signal: expect.anything() }));
  });

  it('announces pending work and disables retries while loading', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
    render(<App />);
    expect(screen.getByText('서버에 연결하고 있어요')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '확인 중…' })).toBeDisabled();
  });

  it('recovers when the user retries after a network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new TypeError('Failed to fetch')).mockResolvedValueOnce({ ok: true, json: async () => ({ status: 'ok', service: 'BuildLog' }) }));
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: '다시 시도' }));
    expect(await screen.findByText('서버와 연결되었어요')).toBeInTheDocument();
  });

  it.each([
    { ok: false },
    { ok: true, json: async () => ({ status: 'down', service: 'BuildLog' }) },
    { ok: true, json: async () => { throw new SyntaxError('Invalid JSON'); } },
  ])('shows a useful error for an invalid server response', async response => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
    render(<App />);
    expect(await screen.findByText('서버에 연결하지 못했어요')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다시 시도' })).toBeEnabled();
  });
});
