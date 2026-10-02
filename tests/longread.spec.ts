import { test, expect } from "@playwright/test";

test("desktop/mobile layouts, navigation, clarity and refresh", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("main > section")).toHaveCount(6);
  await page.screenshot({ path: testInfo.outputPath("desktop-hero.png") });
  await page.getByRole("button", { name: "СОДЕРЖАНИЕ" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: "Добавить ясность" }).click();
  await expect(
    page.getByRole("heading", { name: "Файл обрабатывается." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Вернуть неопределённость" }).click();
  await expect(page.getByRole("heading", { name: "Подождите." })).toBeVisible();
  for (const width of [1920, 1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 769 ? 844 : 1000 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    const overflow = await page.evaluate(() => ({
      viewport: window.innerWidth,
      actual: document.documentElement.scrollWidth,
      offenders: [...document.querySelectorAll("main *")]
        .filter(
          (e) =>
            e.getBoundingClientRect().right > innerWidth + 1 &&
            getComputedStyle(e).position !== "absolute",
        )
        .map((e) => ({
          tag: e.tagName,
          cls: e.className,
          right: e.getBoundingClientRect().right,
        }))
        .slice(0, 15),
    }));
    expect(overflow.actual, JSON.stringify(overflow)).toBeLessThanOrEqual(
      width,
    );
    if (width === 390) {
      await page.screenshot({ path: testInfo.outputPath("mobile-hero.png") });
      await page.screenshot({
        path: testInfo.outputPath("mobile-full.png"),
        fullPage: true,
      });
    }
  }
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(errors).toEqual([]);
});

test("perception measures actual time, shows no running clock and resets", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/#perception");
  await page.getByRole("button", { name: "Начать", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Остановить", exact: false }),
  ).toBeVisible();
  await expect(page.locator(".result-value")).toHaveCount(0);
  await page.clock.runFor(13400);
  await page.getByRole("button", { name: "Остановить", exact: false }).click();
  const firstResult = Number(
    (await page.locator(".result-value").innerText())
      .replace(",", ".")
      .match(/\d+\.\d+/)?.[0],
  );
  expect(firstResult).toBeGreaterThanOrEqual(13.4);
  expect(firstResult).toBeLessThan(13.8);
  await page
    .getByRole("button", { name: "Повторить", exact: false })
    .first()
    .click();
  await expect(
    page.getByRole("button", { name: "Начать", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".result-value")).toHaveCount(0);
  await page.getByRole("button", { name: "Начать", exact: true }).click();
  await page.clock.runFor(2000);
  await page.getByRole("button", { name: "Остановить", exact: false }).click();
  const secondResult = Number(
    (await page.locator(".result-value").innerText())
      .replace(",", ".")
      .match(/\d+\.\d+/)?.[0],
  );
  expect(secondResult).toBeGreaterThanOrEqual(2);
  expect(secondResult).toBeLessThan(2.4);
});

test("A/B/C each last ten real seconds; choices persist; modes do not reset; cancel prevents completion", async ({
  page,
}) => {
  await page.goto("/#comparison");
  await page.evaluate(() => {
    const transitions: { variant: string; time: number }[] = [];
    Object.assign(window, { transitions });
    let previous = "";
    const observer = new MutationObserver(() => {
      const variant =
        document
          .querySelector(".comparison-stage")
          ?.getAttribute("data-variant") ??
        (document.querySelector(".comparison-survey") ? "survey" : "");
      if (variant && variant !== previous) {
        transitions.push({ variant, time: performance.now() });
        previous = variant;
      }
    });
    observer.observe(document.querySelector(".experiment-console")!, {
      childList: true,
      subtree: true,
    });
  });
  await page.getByRole("button", { name: "Начать сравнение" }).click();
  await expect(page.locator(".comparison-stage")).toHaveAttribute(
    "data-variant",
    "А",
  );
  await expect(page.locator(".comparison-stage")).toHaveAttribute(
    "data-variant",
    "Б",
    { timeout: 12000 },
  );
  await expect(page.locator(".spinner")).toBeVisible();
  await expect(page.locator(".comparison-stage")).toHaveAttribute(
    "data-variant",
    "В",
    { timeout: 12000 },
  );
  await expect(
    page.locator(".comparison-stage .linear-progress"),
  ).toBeVisible();
  await expect(page.locator(".comparison-survey")).toBeVisible({
    timeout: 12000,
  });
  const transitions = await page.evaluate(
    () =>
      (
        window as unknown as {
          transitions: { variant: string; time: number }[];
        }
      ).transitions,
  );
  expect(transitions.map((t) => t.variant)).toEqual(["А", "Б", "В", "survey"]);
  for (let i = 1; i < transitions.length; i++) {
    const elapsed = transitions[i].time - transitions[i - 1].time;
    expect(elapsed).toBeGreaterThanOrEqual(9990);
    expect(elapsed).toBeLessThan(10200);
  }
  console.log(
    "Measured A/B/C intervals (ms):",
    transitions
      .slice(1)
      .map((t, i) => Math.round(t.time - transitions[i].time)),
  );
  await page.clock.install();
  await page
    .locator(".comparison-survey fieldset")
    .nth(0)
    .getByText("А", { exact: true })
    .click();
  await page
    .locator(".comparison-survey fieldset")
    .nth(1)
    .getByText("В", { exact: true })
    .click();
  await expect(page.locator(".choice-wait")).toHaveAttribute(
    "data-status",
    "running",
  );
  await page.clock.runFor(5000);
  await page.getByRole("button", { name: "Смотреть анимацию" }).click();
  await page.clock.runFor(5000);
  await page.getByRole("button", { name: "Следить за индикатором" }).click();
  const width = await page
    .locator(".choice-progress")
    .evaluate(
      (e) =>
        e.firstElementChild!.getBoundingClientRect().width /
        e.getBoundingClientRect().width,
    );
  expect(width).toBeGreaterThan(0.48);
  expect(width).toBeLessThan(0.55);
  await page.getByRole("button", { name: "ПОЧЕМУ НУЖНО ЖДАТЬ?" }).click();
  await expect(page.locator("#wait-explanation")).toBeVisible();
  await page
    .getByRole("button", { name: "Читать дальше", exact: false })
    .click();
  await page.clock.runFor(10100);
  await expect(page.locator(".completion-toast")).toContainText(
    "Готово. Процесс завершён.",
  );
  await expect(page.locator(".choice-wait")).toHaveAttribute(
    "data-status",
    "complete",
  );
  await page.getByRole("button", { name: "Запустить снова" }).click();
  await page.clock.runFor(1000);
  await page.getByRole("button", { name: "ОТМЕНИТЬ ЗАПРОС" }).click();
  await expect(page.locator(".choice-wait")).toHaveAttribute(
    "data-status",
    "cancelled",
  );
  await page.clock.runFor(21000);
  await expect(page.locator(".choice-wait")).toHaveAttribute(
    "data-status",
    "cancelled",
  );
  await expect(page.locator(".completion-toast")).not.toHaveClass(/visible/);
});

test("mobile experiments and 99% pause work with reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.goto("/#ninety-nine");
  await page.locator(".ninety-stage").scrollIntoViewIfNeeded();
  await page.clock.runFor(1500);
  await expect(page.locator(".huge-percent")).toHaveText("99%");
  await page.clock.runFor(3000);
  await expect(page.locator(".huge-percent")).toHaveText("99%");
  await page.clock.runFor(1000);
  await expect(page.locator(".checking-label")).toContainText("Проверяем");
  await page.getByRole("button", { name: "ПОЧУВСТВОВАТЬ ЕЩЁ РАЗ" }).click();
  await expect(page.locator(".huge-percent")).toHaveText("99%");
  await page.getByRole("button", { name: "Начать сравнение" }).click();
  await page.clock.runFor(30200);
  await expect(page.locator(".comparison-survey")).toBeVisible();
  await page
    .locator(".comparison-survey fieldset")
    .nth(0)
    .getByText("Не могу сравнить", { exact: true })
    .click();
  await page
    .locator(".comparison-survey fieldset")
    .nth(1)
    .getByText("Ни в одном", { exact: true })
    .click();
  await expect(page.locator(".choice-wait")).toHaveAttribute(
    "data-status",
    "running",
  );
  await page.getByRole("button", { name: "ОТМЕНИТЬ ЗАПРОС" }).click();
  await expect(page.locator(".choice-wait")).toHaveAttribute(
    "data-status",
    "cancelled",
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});
