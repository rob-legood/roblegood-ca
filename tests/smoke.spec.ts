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
    await expect(page).toHaveURL(/about/);

    await page.click('a[href="boardgames.html"]');
    await expect(page).toHaveURL(/boardgames/);

    await page.click('a[href="blog.html"]');
    await expect(page).toHaveURL(/blog/);

    await page.click('a[href="recommendations.html"]');
    await expect(page).toHaveURL(/recommendations/);
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
    await expect(page.locator('.rl-timeline-marker')).toHaveCount(5);
  });

  test('timeline sections exist', async ({ page }) => {
    await page.goto('/about.html');
    await expect(page.locator('#almost-a-teacher')).toBeVisible();
    await expect(page.locator('#junior-years')).toBeAttached();
    await expect(page.locator('#ic-to-manager')).toBeAttached();
    await expect(page.locator('#director-years')).toBeAttached();
    await expect(page.locator('#accidental-sabbatical')).toBeAttached();
  });

  test('contact section has LinkedIn link', async ({ page }) => {
    await page.goto('/about.html');
    const linkedInLink = page.locator('a[href="https://www.linkedin.com/in/rob-legood/"]');
    await expect(linkedInLink).toBeVisible();
  });
});

test.describe('Blog Filter Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog.html');
    await page.waitForSelector('.rl-blog-nav-item');
  });

  test('filter button is visible', async ({ page }) => {
    await expect(page.locator('.rl-blog-filter-btn')).toBeVisible();
  });

  test('filter modal opens on click', async ({ page }) => {
    await page.click('.rl-blog-filter-btn');
    await expect(page.locator('.rl-blog-modal-overlay')).toBeVisible();
    await expect(page.locator('.rl-blog-search')).toBeVisible();
    await expect(page.locator('.rl-blog-modal-close')).toBeVisible();
  });

  test('filter modal has tag buttons', async ({ page }) => {
    await page.click('.rl-blog-filter-btn');
    const tagCount = await page.locator('.rl-blog-filter-tag').count();
    expect(tagCount).toBeGreaterThan(0);
  });

  test('modal closes via close button', async ({ page }) => {
    await page.click('.rl-blog-filter-btn');
    await expect(page.locator('.rl-blog-modal-overlay')).toBeVisible();
    await page.click('.rl-blog-modal-close');
    await expect(page.locator('.rl-blog-modal-overlay')).toBeHidden();
  });

  test('modal closes via overlay click', async ({ page }) => {
    await page.click('.rl-blog-filter-btn');
    await expect(page.locator('.rl-blog-modal-overlay')).toBeVisible();
    await page.click('.rl-blog-modal-overlay', { position: { x: 10, y: 10 } });
    await expect(page.locator('.rl-blog-modal-overlay')).toBeHidden();
  });

  test('search input filters posts', async ({ page }) => {
    const initialCount = await page.locator('.rl-blog-nav-item').count();
    await page.click('.rl-blog-filter-btn');
    await page.fill('.rl-blog-search', 'xyznonexistent');
    await page.waitForTimeout(400); // Wait for debounce
    const filteredCount = await page.locator('.rl-blog-nav-item').count();
    expect(filteredCount).toBeLessThan(initialCount);
  });

  test('tag selection toggles active state', async ({ page }) => {
    await page.click('.rl-blog-filter-btn');
    const firstTag = page.locator('.rl-blog-filter-tag').first();
    await firstTag.click();
    await expect(page.locator('.rl-blog-filter-tag.active').first()).toBeVisible();
  });

  test('filter count badge shows when filters active', async ({ page }) => {
    await page.click('.rl-blog-filter-btn');
    await page.locator('.rl-blog-filter-tag').first().click();
    await expect(page.locator('.rl-blog-filter-count')).toBeVisible();
  });

  test('clear button appears when filters active', async ({ page }) => {
    await page.click('.rl-blog-filter-btn');
    await page.locator('.rl-blog-filter-tag').first().click();
    await expect(page.locator('.rl-blog-clear-btn')).toBeVisible();
  });

  test('clear button resets all filters', async ({ page }) => {
    const initialCount = await page.locator('.rl-blog-nav-item').count();
    await page.click('.rl-blog-filter-btn');
    await page.locator('.rl-blog-filter-tag').first().click();
    await page.click('.rl-blog-modal-close');
    await page.click('.rl-blog-clear-btn');
    await expect(page.locator('.rl-blog-filter-count')).toBeHidden();
    await expect(page.locator('.rl-blog-clear-btn')).toBeHidden();
    await expect(page.locator('.rl-blog-nav-item')).toHaveCount(initialCount);
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
