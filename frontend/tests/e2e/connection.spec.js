import { test, expect } from '@playwright/test';

test('React connects to the running FastAPI server', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByText('서버와 연결되었어요')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('desktop.png'), fullPage: true });
  await page.getByRole('button', { name: '연결 다시 확인' }).click();
  await expect(page.getByText('서버와 연결되었어요')).toBeVisible();
});

test('connection failures offer a working retry', async ({ page }) => {
  await page.route('**/api/health', route => route.abort('connectionrefused'));
  await page.goto('/');
  await expect(page.getByText('서버에 연결하지 못했어요')).toBeVisible();
  await page.unroute('**/api/health');
  await page.getByRole('button', { name: '다시 시도' }).click();
  await expect(page.getByText('서버와 연결되었어요')).toBeVisible();
});

test('the 360px layout stays within the viewport', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  await expect(page.getByText('서버와 연결되었어요')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('mobile.png'), fullPage: true });
});
