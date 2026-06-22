# PetCare Бизнес — Web

Кабинет для бизнеса PetCare. При регистрации владелец выбирает **тип бизнеса**
(ветеринария · груминг · передержка · зоотакси) — и весь кабинет (тема, навигация,
названия разделов, услуги, данные дашборда) подстраивается под выбор.

## Стек

- **React 18 + Vite + TypeScript**
- **SCSS** (CSS-модули, токены в `app/styles`, тема через CSS custom properties)
- **Redux Toolkit** — состояние бизнеса (`entities/business`)
- **RTK Query** — загрузка данных дашборда (`entities/dashboard`)
- **MSW** — мок API (`shared/api/mock`)

## Архитектура — Feature-Sliced Design

```
src/
├─ app/            # инициализация: store, router, providers, глобальные стили
├─ pages/          # registration (3 шага), cabinet (адаптивный дашборд)
├─ widgets/        # Sidebar, Topbar, CabinetLayout, DashboardWidget
├─ features/       # business-type-select
├─ entities/       # business (slice + selectors), dashboard (RTK Query api)
└─ shared/         # config (businessTypes), ui (кит), lib (hooks, theme), api/mock
```

Зависимости направлены строго вниз: `app → pages → widgets → features → entities → shared`.

## Ключевая идея — адаптивность под тип бизнеса

`shared/config/businessTypes.ts` — единый источник правды. Для каждого типа задаются
тема, набор пунктов навигации, иконка и услуги. Выбор типа:

1. сохраняется в `entities/business` (Redux + localStorage);
2. `useBusinessTheme` раскрывает тему в CSS-переменные `--accent*` на корне кабинета;
3. `Sidebar` строит навигацию из `config.nav`;
4. `DashboardWidget` запрашивает данные по типу через RTK Query → MSW отдаёт свой набор.

## Запуск

```bash
npm install        # postinstall MSW скопирует public/mockServiceWorker.js
npm run dev
```

Если воркер MSW не появился автоматически:

```bash
npm run msw:init   # = npx msw init public/ --save
```

Открыть `http://localhost:5173`. Без регистрации `/` редиректит на `/register`.

## Состояния

`DashboardWidget` показывает skeleton при загрузке (MSW задерживает ответ на 500мс),
экран ошибки соединения с кнопкой «Повторить» и пустое состояние списка заявок.
