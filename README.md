# Кому принадлежит пауза

Интерактивное эссе из 15 смысловых зон о длительности, внимании, прогнозе, срочности и праве распоряжаться своим временем. Доработка существующего React 19 / TypeScript / Vite проекта. Обложка следует эталону «экран 1.png»: три смещённые строки внизу, приглушённое серо-зелёное поле. Весь текст — на единой тёмной зернистой поверхности. Manrope Medium 500 + Cormorant Light Italic 300 + IBM Plex Mono Regular 400. Шрифты локальные. CSS/SVG и один декоративный Canvas; Lenis только для desktop wheel. Без сервера ответов, аналитики и WebGL.

## Запуск

Нужен Node.js 24.

```sh
npm ci
npm run dev
```

Dev: адрес из вывода Vite, обычно http://127.0.0.1:5173/. Внутренний StyleGuide: `/?styleguide`, только в dev.

```sh
npm run lint
npm run typecheck
npm run test:unit
npm run test:e2e
npm run build
npm run preview
```

Локальные e2e используют установленный Google Chrome; в CI — Playwright Chromium. `tests/state.test.ts` запускается встроенным node:test; большой framework не добавлен. Браузерные сценарии в `tests/longread.spec.ts` используют уже существующий Playwright.

## Архитектура

- `src/content/longread.ts`: исходные авторские фрагменты, подписи интерактивов, инструкции, варианты ответов и номера источников.
- `src/content/editorial.ts`: вручную составленные смысловые абзацы и типы текстовых блоков; это источник редакционного чтения.
- `EditorialText.tsx`: семантические p, blockquote, ol/ul; `TextSources.tsx` сохраняет источники и возврат к цитате.
- `src/state/LongreadStore.ts`: стабильный Context и hook.
- `src/state/LongreadContext.tsx`: provider, deadline scheduler, системное reduced motion, сохранение демонстрационного файла.
- `src/state/longreadReducer.ts`: переходы timer/process/comparison, защита от запоздалых завершений.
- `src/hooks/timing.ts`, `useElapsedTimer.ts`: монотонное время, countdown, прямое обновление CSS progress через ref.
- `src/components/`: существующие шесть зон переработаны, добавлены остальные; общие Actions, SectionShell, SourceMarker и GlobalProcessStatus.
- `src/styles/tokens.css`: девять ролей текста, цвета, сетка, spacing, motion.
- `src/styles.css`: функциональные состояния и базовая геометрия.
- `src/styles/art-direction.css`: композиции пяти актов, декоративные сцены, mobile и reduced motion.
- `src/styles/editorial.css`: единые текстовые роли, естественные абзацы и порядок слоёв. Типографические роли имеют приоритет над прежними локальными размерами сцен.
- `src/content/scenes.ts`, `Atmosphere.tsx`: декларативная карта сцен и фон через CSS variables.
- `CoverField.tsx`, `coverMotion.ts`: независимое время света, торможение за 0.8s и возврат после 1.3s без движения курсора. Ручная пауза имеет приоритет. Финал использует общий ровный фон.
- `src/styles/reference-cover.css`: текущая обложка, единый материал, фиксированная навигация по 15 разделам и мобильные размеры.
- `ElasticETA.tsx`, `OverloadField.tsx`, `AccelerationFork.tsx`: существующие интерактивные сцены.
- `ReadingScroll.tsx`: короткая desktop-инерция, native scroll на touch и при отключённом движении.

Функциональные процессы существуют независимо от viewport. Сравнение А/Б/В — по 10000ms с добровольным промежутком между вариантами. Смена режима отдельного 20-секундного ожидания не перезапускает процесс. Отмена блокирует последующее завершение этого run. Результаты двух субъективных замеров хранятся отдельно и не интерпретируются как улучшение.

Только демонстрационный файл сохраняется в localStorage (`pause-demo-file-v1`) для возврата после закрытия/обновления; ответы и личные замеры не сохраняются и никуда не отправляются. Реальный файл на сервере не создаётся.

## GitHub Pages

Существующий адрес сохраняется: https://iammariadrach-max.github.io/-WhoOwnsThePause/

`.github/workflows/deploy.yml` запускается после push в `main`: npm ci → lint/typecheck/unit → установка Chromium → e2e → сборка с base `/-WhoOwnsThePause/` → upload/deploy Pages. Если проверка падает, публикация не заменяется. В Settings → Pages источник должен оставаться GitHub Actions.

Проверка именно Pages-сборки локально:

```sh
npm run build -- --base=/-WhoOwnsThePause/
npm run preview -- --port 4173 --base=/-WhoOwnsThePause/
```

Открыть http://127.0.0.1:4173/-WhoOwnsThePause/. У preview должен быть тот же base, что у проверяемой сборки. Маршрутизация якорная, без History API routes; reload по URL с hash не требует server fallback.

Публикация после ревью изменений:

```sh
git add .
git commit -m "Match the reference cover and add continuous field motion"
git push origin main
```

## Документация и проверка

- `docs/reference-cover.md` — текущая спецификация и QA, 21 октября 2026
- `docs/design-system.md`
- `docs/interaction-spec.md`
- `docs/decision-log.md`
- `docs/content-map.md`
- `docs/qa.md`
- `docs/editorial-correction.md`
- `docs/art-direction.md`
- `docs/motion-map.md`

В исходном проекте не было библиографии. Маркеры сохранены как настоящие ссылки с возвратом, но сведения об источниках должен предоставить автор. Публикация явно обозначает эти места; вымышленные записи не добавлены.
