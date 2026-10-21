import { test, expect } from "@playwright/test";

test("all fifteen zones, responsive layouts, navigation, sources and reload", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type()))
      errors.push(message.text());
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("main > section")).toHaveCount(15);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator(".chapter-rail a")).toHaveCount(15);
  for (const [width, height] of [
    [1440, 900],
    [1512, 982],
    [1920, 1080],
    [768, 1024],
    [390, 844],
    [360, 800],
  ]) {
    await page.setViewportSize({ width, height });
    await page.locator('.chapter-rail a[href="#opening"]').press("Enter");
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    const button = await page.locator(".cover-motion").boundingBox();
    expect(button!.y + button!.height).toBeLessThan(height);
    if ([1440, 390].includes(width))
      await page.screenshot({ path: info.outputPath(`hero-${width}.png`) });
  }
  const menu = page.locator(".menu-button");
  await menu.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await page.getByRole("link", { name: "Источник 1", exact: true }).click();
  await expect(page).toHaveURL(/#source-1$/);
  await page.locator("#source-1 .source-back").click();
  await expect(page).toHaveURL(/#ref-/);
  await page.reload();
  await expect(page.locator("h1")).toBeAttached();
  expect(errors).toEqual([]);
});

test("both perception attempts use real elapsed time without running hints", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-10-19T09:00:00Z") });
  await page.goto("/#perception");
  await page.clock.pauseAt(new Date("2026-10-19T10:00:00Z"));
  const first = page.locator('[data-timer="first"]');
  await first.getByRole("button", { name: "Начать", exact: true }).click();
  await expect(first.locator(".result-value")).toHaveCount(0);
  await expect(first.locator(".linear-progress,.spinner")).toHaveCount(0);
  await page.clock.runFor(13400);
  await first.getByRole("button", { name: "Остановить", exact: true }).click();
  await expect(first.locator(".result-value")).toContainText("13,4");
  const second = page.locator('[data-timer="second"]');
  await second.getByRole("button", { name: "Попробовать снова" }).click();
  await page.clock.runFor(9000);
  await second.getByRole("button", { name: "Остановить", exact: true }).click();
  await expect(second).toContainText("По таймеру в начале — 13,4 с.");
  await expect(second.locator(".result-value")).toContainText("9,0");
  await expect(second).toContainText("не доказывают");
  await first.getByRole("button", { name: "Повторить", exact: true }).click();
  await expect(first.locator(".result-value")).toHaveCount(0);
});

test("control bridge permits skip and its deadline enables continue", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-10-19T09:00:00Z") });
  await page.goto("/#control-bridge");
  await page.clock.pauseAt(new Date("2026-10-19T10:00:00Z"));
  const bridge = page.locator("#control-bridge");
  await bridge.getByRole("button", { name: "Продолжить", exact: true }).click();
  await expect(
    bridge.getByRole("button", { name: "Продолжить", exact: true }),
  ).toBeDisabled();
  await page.clock.runFor(10000);
  await expect(
    bridge.getByRole("button", { name: "Продолжить", exact: true }),
  ).toBeEnabled();
  await bridge.getByRole("button", { name: "Продолжить", exact: true }).click();
  // Selecting an answer replaces the question, so assert the resulting screen
  // rather than the checked state of a radio that has already been unmounted.
  await bridge.getByRole("radio", { name: "Разницы почти не было" }).click();
  await expect(bridge.getByRole("status")).toContainText(
    "Это ещё и вопрос контроля",
  );
});

test("A/B/C each use ten seconds, pause between variants, choices persist", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-10-19T09:00:00Z") });
  await page.goto("/#comparison");
  await page.clock.pauseAt(new Date("2026-10-19T10:00:00Z"));
  const section = page.locator("#comparison");
  await section
    .getByRole("button", { name: "Начать сравнение", exact: true })
    .click();
  for (const [i, variant] of ["А", "Б", "В"].entries()) {
    await expect(page.locator(".comparison-stage")).toHaveAttribute(
      "data-variant",
      variant,
    );
    await page.clock.runFor(9900);
    await expect(page.locator(".comparison-stage")).toHaveAttribute(
      "data-variant",
      variant,
    );
    await page.clock.runFor(100);
    await expect(page.locator(".comparison-stage")).toHaveAttribute(
      "data-variant",
      i === 2 ? "survey" : "between",
    );
    if (i < 2) {
      await page.clock.runFor(60000);
      await expect(page.locator(".comparison-stage")).toHaveAttribute(
        "data-variant",
        "between",
      );
      await section
        .getByRole("button", {
          name: `Начать вариант ${["А", "Б", "В"][i + 1]}`,
        })
        .click();
    }
  }
  await page
    .locator(".comparison-survey fieldset")
    .nth(0)
    .getByRole("radio", { name: "А", exact: true })
    .check();
  await page
    .locator(".comparison-survey fieldset")
    .nth(1)
    .getByRole("radio", { name: "В", exact: true })
    .check();
  await page
    .getByRole("link", { name: "Кому принадлежит пауза — к началу" })
    .click();
  await expect(
    page
      .locator(".comparison-survey fieldset")
      .nth(0)
      .getByRole("radio", { name: "А", exact: true }),
  ).toBeChecked();
});

test("background processing survives scrolling, mode changes and reload; cancellation wins", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-10-19T09:00:00Z") });
  await page.goto("/");
  await page.clock.pauseAt(new Date("2026-10-19T10:00:00Z"));
  await page.getByRole("button", { name: "Добавить ясность" }).click();
  await page
    .locator("#uncertainty")
    .getByRole("button", { name: "Читать дальше" })
    .click();
  await page.clock.runFor(11000);
  await expect(page.locator(".global-status")).toContainText("Файл готов.");
  await page.reload();
  await expect(page.locator("#uncertainty")).toContainText("Файл готов.");
  await page
    .getByRole("button", { name: "Запустить процесс", exact: true })
    .click();
  await page.clock.runFor(5000);
  await page.getByRole("button", { name: "Смотреть анимацию" }).click();
  await page.clock.runFor(5000);
  await page.getByRole("button", { name: "Следить за индикатором" }).click();
  await page
    .getByRole("button", { name: "Читать дальше", exact: true })
    .last()
    .click();
  await page.clock.runFor(10100);
  await expect(page.locator(".waiting-choice")).toHaveAttribute(
    "data-status",
    "complete",
  );
  await page
    .getByRole("button", { name: "Запустить снова", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Отменить запрос", exact: true })
    .click();
  await page.clock.runFor(30000);
  await expect(page.locator(".waiting-choice")).toHaveAttribute(
    "data-status",
    "cancelled",
  );
});

test("99% is work, countdown consequences differ, voluntary pause never traps scroll", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-10-19T09:00:00Z") });
  await page.goto("/");
  await page.clock.pauseAt(new Date("2026-10-19T10:00:00Z"));
  await page.getByRole("button", { name: "Посмотреть ожидание" }).click();
  await page.clock.runFor(1500);
  await expect(page.locator(".huge-percent")).toHaveText("99%");
  await page.clock.runFor(3000);
  await expect(page.locator(".huge-percent")).toHaveText("99%");
  await page.clock.runFor(1000);
  await expect(page.locator(".checking-label")).toContainText("Проверяем");
  await page.getByRole("button", { name: "Запустить оба таймера" }).click();
  await page.clock.runFor(10100);
  await expect(page.locator(".countdown-display").nth(0)).toHaveText("00:00");
  await expect(page.locator(".countdown-display").nth(1)).toHaveText("00:10");
  await page.getByRole("button", { name: "Побыть здесь 10 секунд" }).click();
  await page
    .getByRole("button", { name: "Продолжить чтение", exact: true })
    .click();
  await page.clock.runFor(10100);
  await expect(page.locator(".global-status")).toContainText(
    "Десять секунд прошли.",
  );
  await expect(page).toHaveURL(/#rest$/);
});

test("ETA, two models, mobile accordion, reduced motion and final page pause", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".eta-current .afterimage-original")).toHaveText("9");
  await expect(page.locator(".eta-ghost")).toHaveText("7");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await expect(page.locator(".cover-field")).toHaveAttribute("data-motion", "reduced");
  await page.locator("#diagnostic-question-3").click();
  await expect(page.locator("#diagnostic-answer-3")).toBeVisible();
  await page.getByRole("button", { name: "Отменить подготовку" }).click();
  await expect(page.locator(".diagnostic-object")).toContainText(
    "Подготовка отменена",
  );
  await page.getByRole("button", { name: "Убрать всё" }).click();
  await expect(page.locator(".overload-noise")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Поставить страницу на паузу" })
    .click();
  await expect(page.locator(".page-pause")).toContainText(
    "Эту паузу выбрали вы.",
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});
