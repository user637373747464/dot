import { ImageResponse } from '@vercel/og';
export const config = { runtime: 'edge' };

const h = (type, style, children) => ({ type, props: { style, children } });

export default function handler(req) {
  const q = new URL(req.url).searchParams;
  const W = +q.get('w') || 1179;
  const H = +q.get('h') || 2556;

  const END = Date.UTC(2027, 5, 10);
  const now = new Date(Date.now() - 4 * 3600 * 1000);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const n = Math.max(0, Math.round((END - today) / 86400000) + 1);

  const COLS = 14;
  const pitch = Math.floor((W - 200) / COLS);
  const d = Math.round(pitch * 0.5);

  const rows = [];
  for (let i = 0; i < n; i += COLS) {
    const dots = [];
    for (let j = i; j < Math.min(i + COLS, n); j++) {
      dots.push(h('div', {
        width: d, height: d, borderRadius: d,
        background: 'white', margin: (pitch - d) / 2,
      }));
    }
    rows.push(h('div', { display: 'flex' }, dots));
  }

  const gridTop = Math.round(H * 0.4);
  const page = h('div', {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    width: W, height: H, background: 'black',
  }, [
    h('div', {
      marginTop: 190, fontSize: 64, color: 'white', letterSpacing: 8,
    }, 'MP*'),
    h('div', {
      display: 'flex', flexDirection: 'column',
      marginTop: gridTop - 270, width: COLS * pitch,
    }, rows),
  ]);

  return new ImageResponse(page, {
    width: W, height: H,
    headers: { 'cache-control': 'no-store' },
  });
}
