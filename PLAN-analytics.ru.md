# План: Google Analytics 4 для сайта dark-kitchen

## Контекст

Сайт (`clients/dark-kitchen/site`, Next.js) сам ничего не продаёт: он отправляет посетителей в Wolt, foodora и Bolt Food. Владельцу нужно знать, откуда приходят посетители (посты в Telegram-канале, Instagram, TikTok, поиск Google, профиль в Google, QR-карточка в пакете), что они нажимают и какой канал даёт «конверсии». На этом сайте конверсия — это переход в приложение доставки, плюс подписка на рассылку.

Сейчас `components/analytics/TrackClicks.tsx` отправляет событие `App tap` в Plausible. Plausible платный. Владелец не хочет платных инструментов, поэтому **GA4 заменяет Plausible**. Стандартный GA4 бесплатный; платная версия, GA360, рассчитана на крупные компании и здесь не нужна. Баннер согласия делаем сами, поэтому он тоже бесплатный.

Решения по итогам вопросов:
- Только GA4. Plausible убираем.
- Свой баннер согласия, без платного сервиса согласий (CMP).
- Платной рекламы пока нет. Все каналы — бесплатные посты с UTM-метками, поэтому без связки с Google Ads и без Meta Pixel. И то и другое можно добавить позже.

Известное ограничение, сразу: в ЕС GA4 можно запускать только после согласия посетителя. Тех, кто отказался или проигнорировал баннер, не считаем (basic consent mode — самый безопасный вариант с юридической точки зрения). Поэтому цифры — это выборка из согласившихся посетителей. Сравнения при этом остаются верными: доля переходов по каналу и Telegram против Instagram по-прежнему имеют смысл. Реальные заказы видны только в партнёрских кабинетах (бриф, «Success metrics»).

## 1. Загрузка GA4 (basic Consent Mode v2)

Новый серверный компонент `components/analytics/Analytics.tsx`, подключается в `app/[locale]/layout.tsx` вместо `<Script>` Plausible (строка 88):
- Рендерится только когда задан `NEXT_PUBLIC_GA_ID` (`G-XXXXXXX`), чтобы превью и локальные запуски не засоряли данные. Повторяет текущую схему с `NEXT_PUBLIC_ANALYTICS_DOMAIN`.
- Через `InlineScript` (`components/ui/InlineScript/InlineScript.tsx`) объявляет `window.dataLayer` и `gtag` и задаёт согласие по умолчанию: `ad_storage`, `ad_user_data`, `ad_personalization` и `analytics_storage` — все `denied`.
- Загружает `https://www.googletagmanager.com/gtag/js?id=…` только после согласия: если сохранённый выбор `granted` или когда посетитель нажимает «Принять». Загрузчик — небольшая функция в `lib/analytics.ts`.
- При загрузке: `consent update { analytics_storage: granted }`, затем `config` с `page_location`, равным **URL входа**, сохранённому в sessionStorage. Если посетитель соглашается уже после прокрутки или переходов по якорям, визит всё равно сохраняет свои `utm_*` и реферер. Остальные настройки: `allow_google_signals: false`, `allow_ad_personalization_signals: false` и `debug_mode: true`, когда в URL есть `?debug`.

Новый `lib/analytics.ts` — единственное место, откуда отправляются события:
- `track(event, params)` вызывает `window.gtag?.('event', …)`, а с `?debug` ещё и пишет в консоль, как сейчас делает `TrackClicks`. Никогда не бросает исключений.
- Хранение согласия: ключ `localStorage` `consent-analytics` = `{ value: "granted" | "denied", at }`. Чтение обёрнуто в try/catch. Через 12 месяцев спрашиваем снова.
- Сохраняет URL входа при первом просмотре страницы за визит (sessionStorage, вместо сегодняшнего `tr-src`).
- Убрать глобальный тип `window.plausible` и добавить `gtag` / `dataLayer`.

## 2. Баннер согласия

Новый клиентский компонент `components/analytics/ConsentBanner.tsx` плюс `ConsentBanner.module.scss`:
- Показывается только когда GA настроен и выбор ещё не сохранён. Небольшая нижняя панель, которая никогда не закрывает кнопки заказа на первом экране: она стоит над мобильной панелью заказа (`components/overlays/OrderBar`) и не блокирует страницу — в духе правила 6, «sell first».
- **Принять** и **Отклонить** одинаково заметны, плюс ссылка на политику конфиденциальности (сейчас это заглушка `#privacy` в футере).
- Оформление на существующих токенах (`app/styles/tokens.scss`) и стилях кнопок. Визуальный ориентир — вид Chooser и диалогов.
- Ссылка «Настройки cookie» в футере (`components/sections/Footer/Footer.tsx`, рядом со ссылкой на политику) снова открывает баннер.
- Тексты — в `messages/cs.json`, `en.json` и `ru.json`, в новом пространстве имён `consent`.

## 3. События (что значит «клики»)

Расширяем единственный делегированный обработчик в `components/analytics/TrackClicks.tsx`; отдельные компоненты на каждую кнопку не добавляем. Это следует `.claude/skills/nextjs/references/scripts-analytics.md`. Ссылки остаются серверными `<a>` с атрибутами `data-track-*`.

| Событие | Когда | Параметры | Ключевое событие |
|---|---|---|---|
| `app_tap` | нажатие на любую ссылку Wolt / foodora / Bolt (`a[data-app]`, уже есть в `components/ui/AppLinks/AppLinks.tsx`) | `app`, `cuisine`, `section` (hero / pizza / sushi / chooser / chooser-combos), `lang` | **да**: главная конверсия |
| `generate_lead` | подписка прошла успешно (`state.status === "ok"` в `components/sections/Signup/SignupForm.tsx`) | `lang` | **да** |
| `directions_tap` | «Google Maps» в блоке Pickup (`components/sections/Pickup/Pickup.tsx`) | `section: pickup` | да (намерение забрать самому) |
| `contact_tap` | ссылки на телефон / e-mail (Footer, Combos) | `method: phone|email`, `section` | нет |
| `social_tap` | Instagram / TikTok в футере | `network` | нет |
| `chooser_open` | панель заказа открывает выбор приложения (`DialogButton dialog="chooser"`) | `opener` (bar / header) | нет, это шаг воронки |

- Атрибуты: `data-track-event="contact_tap" data-track-method="phone" data-track-section="footer"` и так далее. Обработчик собирает все атрибуты `data-track-*` в параметры. Ссылки на приложения сохраняют текущие атрибуты `data-app` / `data-cuisine` / `data-track`, и обработчик превращает их в `app_tap`.
- GA4 сам привязывает каждое событие к источнику, каналу и кампании сессии, поэтому отдельный параметр `source` больше не нужен.
- Уход со страницы сразу после нажатия безопасен: gtag отправляет события через `sendBeacon`.
- Расширенная статистика (enhanced measurement) GA4 также автоматически записывает просмотры страниц, глубину прокрутки и исходящие клики.

## 4. Откуда приходят посетители: соглашение по UTM

Новый файл `clients/dark-kitchen/UTM.md` для того, кто публикует посты. В нём таблица готовых ссылок и правила именования: строчные буквы, дефисы и новый `utm_campaign` для каждого поста или сторис, чтобы у каждого поста был свой счётчик конверсий.

| Канал | Метки ссылки | Заметки |
|---|---|---|
| Пост в Telegram-канале | `utm_source=telegram&utm_medium=social&utm_campaign=2026-11-weekend-combo` | Telegram часто не передаёт реферер, поэтому без меток визит попадает в «Direct» |
| Ссылка в профиле Instagram | `utm_source=instagram&utm_medium=social&utm_campaign=bio` | ссылки в подписях к постам в Instagram не кликабельны |
| Сторис Instagram (стикер-ссылка) | `utm_source=instagram&utm_medium=social&utm_campaign=<story-name>&utm_content=story` | так атрибутируется отдельный «пост» |
| Ссылка в профиле TikTok | `utm_source=tiktok&utm_medium=social&utm_campaign=bio` | |
| Ссылка «Сайт» в профиле Google (Карты) | `utm_source=google-profile&utm_medium=organic` | попадает в Organic Search, но отделяется от поиска |
| Поиск Google (органика) | без меток, автоматически (`google / organic`) | подробности — в Search Console, связывается с GA4 бесплатно |
| QR-карточка в пакете | `utm_source=qr-bag&utm_medium=offline&utm_campaign=bag-card` | совпадает с `qr-bag` из брифа |

Позже для платной рекламы — `utm_medium=paid_social` или `cpc`, плюс автопометка Google Ads.

## 5. Настройки GA4 (вручную, в аккаунте Google владельца)

Добавить чек-лист в `clients/dark-kitchen/site/README.md` («Analytics»):
- Создать ресурс с часовым поясом Europe/Prague и валютой CZK, затем веб-поток. Скопировать его `G-…` ID в `NEXT_PUBLIC_GA_ID` в Vercel Production.
- Расширенная статистика включена. Хранение данных — 14 месяцев. Google signals выключены.
- Зарегистрировать специальные параметры уровня события: `app`, `cuisine`, `section`, `method`, `network`, `lang`.
- Отметить ключевые события: `app_tap`, `generate_lead`, `directions_tap`.
- Создать свою группу каналов: Telegram, Instagram, TikTok, Google search, Google profile, QR bag, Direct, Other (правила по источнику и каналу). Для канала `offline` у QR в GA4 нет стандартной группы, поэтому своя группа нужна.
- Сохранить отчёт в разделе «Исследования»: строки — источник / канал / кампания сессии, значения — `app_tap` по `app` и `generate_lead`. Этот отчёт отвечает на вопрос «какой канал и какой пост дают переходы и в какое приложение».
- Связать Search Console (бесплатно), чтобы видеть поисковые запросы Google.

## 6. Уборка и документация

- Убрать `<Script>` Plausible и `NEXT_PUBLIC_ANALYTICS_DOMAIN` из `app/[locale]/layout.tsx`, `.env.example` и таблицы переменных в README. Добавить `NEXT_PUBLIC_GA_ID`.
- `lib/required-env.ts`: добавить `NEXT_PUBLIC_GA_ID` в `REQUIRED_ENV`, чтобы продакшен-сборка не ушла без аналитики. Превью-сборки проходят через `ALLOW_PLACEHOLDERS`.
- `clients/dark-kitchen/TODO-OWNER.md`: создать ресурс GA4; в политике конфиденциальности указать Google Analytics как обработчика, cookie `_ga` / `_ga_<id>`, их назначение и срок хранения, и передачу данных в США (EU-US Data Privacy Framework); убрать упоминание Plausible.
- `clients/dark-kitchen/brief.md`, раздел «Analytics»: заменить на «GA4 со своим баннером согласия (бесплатно); Plausible убран». То же изменение — в шапке-комментарии `TrackClicks` и в карте кода README.
- `.claude/skills/nextjs/references/scripts-analytics.md`: записать вариант «бесплатный GA4: basic consent mode, свой баннер, `page_location` = URL входа» рядом с вариантом по умолчанию (Plausible).

## Проверка

1. `npm run check` (lint, typecheck, build). Сборка по-прежнему должна показывать все страницы как `○`: баннер — клиентский компонент-лист и не требует API времени запроса.
2. Запустить `next dev` с заданным `NEXT_PUBLIC_GA_ID` и открыть `/?utm_source=telegram&utm_medium=social&utm_campaign=test&debug`:
   - До согласия: ни одного запроса к `googletagmanager.com` или `google-analytics.com` (сетевой лог Playwright) и нет cookie `_ga`.
   - После «Отклонить»: по-прежнему ничего, и после перезагрузки баннер не появляется.
   - После «Принять»: gtag загружается, `page_view` несёт UTM-метки. Нажатие на Wolt в hero пишет в консоль `app_tap { app: wolt, cuisine: pizza, section: hero }` и отправляет запрос `collect` с `en=app_tap`.
   - Согласие после прокрутки: `page_location` по-прежнему равен размеченному URL входа.
3. Скриншоты баннера на телефоне и на десктопе, на CS, EN и RU, через `screenshot.mjs --section`. Проверить, что он не закрывает кнопки в hero и панель заказа.
4. После деплоя с настоящим ID открыть DebugView в GA4 с `?debug` и проверить каждое событие из таблицы и специальные параметры.
