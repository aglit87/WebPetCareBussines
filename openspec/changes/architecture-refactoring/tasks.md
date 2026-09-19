## 1. Инфраструктура тестов (Фаза 0 — красная зона)

- [x] 1.1 Добавить Vitest: `vitest.config.ts`, devDependency и скрипты `test` / `test:watch`; проверить, что `npm run test` запускается и завершается успешно на пустом наборе.
- [x] 1.2 Покрыть unit-тестами `entities/schedule/model/date.ts` (addDays, addMonths, weekOfDate, getWeekDays, getMonthGrid, formatScheduleDate, formatWeekLabel, toISODate/parseISODate); проверить зелёные тесты на граничных датах (пн/вс, переход месяца, високосный февраль).
- [x] 1.3 Покрыть `getErrorMessage` (ZodError, FetchBaseQueryError с data.message, Error, неизвестный тип); проверить зелёные тесты.
- [x] 1.4 Покрыть автомат auth-слайса (credentialsRequested → otpVerified → tokensRefreshed → loggedOut → passwordResetCompleted, загрузка/запись localStorage через фейковое хранилище); проверить зелёные тесты на все переходы и персист.
- [x] 1.5 Покрыть реал-логику: параллельные 401 делят один refresh, неуспешный refresh разлогинивает, повторный запрос после refresh проходит; проверить зелёные тесты до рефакторинга (красная зона).
- [x] 1.6 Покрыть zod-схемы request/response всех entity (валидные фикстуры парсятся, невалидные — отклоняются; особый кейс — условные поля RoomFormModal для статуса occupied); проверить зелёные тесты.

## 2. Реал без инверсий и сброс кэша (Фаза 1)

- [x] 2.1 Вынести фабрику `createBaseQueryWithReauth(deps)` в `shared/api` без импортов из `app/` и `entities/` (только RTK); проверить grep'ом отсутствие таких импортов в shared/api и зелёный тест 1.5.
- [x] 2.2 Провести провода в `app/store`: инъекция селекторов токенов, действий `tokensRefreshed`/`loggedOut` и `api.util.resetApiState`; проверить, что attach токена и refresh работают в dev (401 от мок-бэкенда по истечении 5-минутного access-токена).
- [x] 2.3 Сброс кэша RTK Query только при потере авторизации: logout/неуспешный refresh очищает все reducerPath'и, при обычном refresh кэш сохраняется; проверить тестом на тестовом store (утвердить состояние кэша) и вручную: выход → вход под другим пользователем → нет мгновенного показа чужих данных.

## 3. Моки, seam и единые источники (Фаза 2)

- [x] 3.1 Переместить мок-бэкенд из `shared/api/mock` в `src/mocks/`, обновить импорты (`enableMocking`, `.storybook/preview.tsx`); проверить `npm run dev` и Storybook, grep'ом убедиться, что ссылок на `shared/api/mock` не осталось.
- [x] 3.2 Гейтить запуск MSW флагом `VITE_USE_MOCKS === '1'` (по умолчанию в dev) или `?mock=1`; проверить, что без флага `worker.start` не вызывается, с флагом — работает.
- [x] 3.3 Валидировать тела запросов в мок-хэндлерах через zod (`parse` → 400 при несоответствии); проверить: невалидный POST `/clients` → 400, валидный → 201.
- [x] 3.4 Единый `SCHEDULE_HOURS` в `entities/schedule/model/config.ts`, используемый мок-бэкендом и `ScheduleWidget`; проверить grep'ом отсутствие второго списка часов (TIME_SLOTS/HOURS).
- [x] 3.5 Единый `OtpPurpose` из `entities/auth/model/types`, мок импортирует его; проверить grep'ом отсутствие дублирующего объявления типа в `src/mocks/`.
- [x] 3.6 Убрать хардкод «вторник, 24 июня» в `CabinetPage`: subtitle берётся из `dashboard.subtitle`, до данных — fallback `config.label`; проверить, что кабинет показывает реальный subtitle из ответа.

## 4. UI-состояния и персист (Фаза 3)

- [x] 4.1 Добавить `WidgetError` и `WidgetSkeleton` в `shared/ui`; проверить рендер на данных виджета и в Storybook-стори.
- [x] 4.2 Заменить дубли в Dashboard, Income, Reviews, Clients, Map, Schedule, Services, Records, Rooms, Drivers на общие компоненты; проверить grep'ом, что «Нет соединения с сервером» встречается только в общем компоненте, списки виджетов рендерятся.
- [x] 4.3 Хелпер `shared/lib/storage.ts`: версионированные ключи (`petcare.v1.*`), try/catch, хук миграции; проверить unit-тестами и: в редукторах не осталось прямых `localStorage.setItem` (grep).
- [x] 4.4 Перенести персист auth/business из редукторов в app-слой (`store.subscribe`), редукторы сделать чистыми; проверить: тесты слайсов без мока localStorage, перезагрузка восстанавливает сессию, несовпадение версии ключа очищает состояние.

## 5. Каркас качества и документы (Фаза 4)

- [x] 5.1 Добавить ESLint (flat config + typescript-eslint + react-hooks) и скрипт `lint`; проверить `npm run lint` на всём коде после правок.
- [x] 5.2 Добавить CI `.github/workflows/ci.yml`: install → lint → `tsc -b` → vitest run; проверить, что файл присутствует и команды корректны (при возможности — локальный прогон `act`).
- [x] 5.3 Обновить `CLAUDE.md`: новый слой `src/mocks/`, флаг моков, команды test/lint; проверить, что документация отражает структуру.
- [x] 5.4 Финальная верификация: `openspec validate` проходит, `npm run build` и `npm run test` зелёные, ручной smoke в dev: register → OTP → кабинет → CRUD → logout → login без чужих данных.