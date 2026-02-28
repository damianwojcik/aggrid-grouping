import { test } from '@ubs.hive.toolchain/playwright'

test('authenticate and cache session', async ({ page }) => {
  // Perform login using your enterprise helper
  await hive.uiLogin(page, 'fi:rates-sales', {
    url: '/axion',     // Use relative path (baseURL is in config)
    timeout: 120_000,
  })

  // Wait until authenticated (optional but safer)
  await page.waitForURL('**/axion**')
  await page.waitForLoadState('domcontentloaded')

  // IMPORTANT: Save authenticated browser state
  await page.context().storageState({
    path: '.auth/user.json',
  })
})