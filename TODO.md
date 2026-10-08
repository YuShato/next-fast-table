# Исправление seed: полная перезапись при расхождении количества

## Проблема
- `prisma db seed` падал: `Client has encountered a connection error and is not queryable`
  — один гигантский `createMany` (415 788 строк) на нестабильной сети до Neon (us-east-1).
- Требование: **каждый раз перезаписывать базу, если count в БД != count в data.json**.

## Решение
Переписать `prisma/seed.js`:
- Excel → data.json (как раньше).
- Сравнение `COUNT(*)` и `MAX(id)` в БД с data.json.
- При расхождении → `TRUNCATE "Payment" RESTART IDENTITY` + полная перезапись.
- Вставка пачками по 50 через `INSERT ... SELECT * FROM unnest(...)`.
- Переподключение + экспоненциальный backoff при обрыве соединения.
- Чекпоинт `prisma/seed-checkpoint.json` для возобновления после сбоя.
- Финальная проверка `COUNT(*) === total` + сброс sequence.

## Задачи
- [x] Создать TODO.md
- [x] Переписать `prisma/seed.js`
- [x] Обновить `brainstorm_plan.md`
- [x] Запустить `node prisma/seed.js` — ошибка "connection error is not queryable" ИСПРАВЛЕНА
- [x] Заливка завершена: 415 788 записей
- [x] Проверить: `node count-rows.js` → 415 788 ✅
- [x] Проверить: `node check-missing.js` → missing: 0 ✅
- [x] Добавить `prisma/data.json` в `.gitignore` (превышает лимит GitHub 100 MB)
- [x] Закоммитить и запушить изменения
- [x] Открыть Pull Request — https://github.com/YuShato/next-fast-table/pull/83
- [ ] Удалить диагностические скрипты (test-*.js, count-*.js, check-*.js, fix-*.js, find-*.js, inspect-*.js, cleanup-test-rows.js)

