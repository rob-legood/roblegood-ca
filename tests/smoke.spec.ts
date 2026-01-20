import { test, expect } from '@playwright/test';

test.describe('Page Load Tests', () => {
  test('home page loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Rob LeGood/);
    await expect(page.locator('.rl-hero h1')).toHaveText('Rob LeGood');
    await expect(page.locator('.rl-hero-title')).toHaveText('Culture. Code. Cardboard');
  });

  test('about page loads correctly', async ({ page }) => {
    await page.goto('/about.html');
    await expect(page).toHaveTitle(/My Journey.*Rob LeGood/);
    await expect(page.locator('.rl-timeline-section h2').first()).toBeVisible();
  });

  test('blog page loads correctly', async ({ page }) => {
    await page.goto('/blog.html');
    await expect(page).toHaveTitle(/Blog.*Rob LeGood/);
    await expect(page.locator('.rl-blog-sidebar h2')).toHaveText('Posts');
  });

  test('boardgames page loads correctly', async ({ page }) => {
    await page.goto('/boardgames.html');
    await expect(page).toHaveTitle(/Boardgames.*Rob LeGood/);
    await expect(page.locator('.rl-page-header h1')).toHaveText('Boardgames');
  });

  test('recommendations page loads correctly', async ({ page }) => {
    await page.goto('/recommendations.html');
    await expect(page).toHaveTitle(/Rob LeGood/);
  });
});

test.describe('Navigation Tests', () => {
  test('nav bar is visible on all pages', async ({ page }) => {
    const pages = ['/', '/about.html', '/blog.html', '/boardgames.html', '/recommendations.html'];

    for (const url of pages) {
      await page.goto(url);
      await expect(page.locator('nav')).toBeVisible();
      await expect(page.locator('.rl-nav-logo')).toHaveText('Rob LeGood');
    }
  });

  test('nav links work correctly', async ({ page }) => {
    await page.goto('/');

    await page.click('a[href="about.html"]');
    await expect(page).toHaveURL(/about\.html/);

    await page.click('a[href="boardgames.html"]');
    await expect(page).toHaveURL(/boardgames\.html/);

    await page.click('a[href="blog.html"]');
    await expect(page).toHaveURL(/blog\.html/);

    await page.click('a[href="recommendations.html"]');
    await expect(page).toHaveURL(/recommendations\.html/);

    await page.click('.rl-nav-logo');
    await expect(page).toHaveURL(/index\.html|\/$/);
  });
});

test.describe('Home Page Elements', () => {
  test('hero section displays correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.rl-hero-headshot')).toBeVisible();
    await expect(page.locator('.rl-hero-tagline')).toBeVisible();
    await expect(page.locator('.rl-cta-button')).toHaveText('Learn More About Me');
  });

  test('weather widget is present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.rl-weather-widget')).toBeVisible();
    await expect(page.locator('.rl-weather-location')).toHaveText('Kitchener, ON');
  });

  test('highlight cards are present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.rl-highlight-card')).toHaveCount(3);
  });
});

test.describe('About Page Elements', () => {
  test('timeline navigation is visible', async ({ page }) => {
    await page.goto('/about.html');
    await expect(page.locator('.rl-timeline-nav')).toBeVisible();
    await expect(page.locator('.rl-timeline-marker')).toHaveCount(4);
  });

  test('timeline sections exist', async ({ page }) => {
    await page.goto('/about.html');
    await expect(page.locator('#almost-a-teacher')).toBeVisible();
    await expect(page.locator('#junior-years')).toBeAttached();
    await expect(page.locator('#ic-to-manager')).toBeAttached();
    await expect(page.locator('#director-years')).toBeAttached();
  });

  test('contact section has LinkedIn link', async ({ page }) => {
    await page.goto('/about.html');
    const linkedInLink = page.locator('a[href="https://www.linkedin.com/in/rob-legood/"]');
    await expect(linkedInLink).toBeVisible();
  });
});

test.describe('Footer Tests', () => {
  test('footer is visible on all pages', async ({ page }) => {
    const pages = ['/', '/about.html', '/blog.html', '/boardgames.html'];

    for (const url of pages) {
      await page.goto(url);
      await expect(page.locator('footer')).toBeVisible();
      await expect(page.locator('footer')).toContainText('Rob LeGood');
    }
  });
});
