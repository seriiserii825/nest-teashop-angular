# API-тестирование через kulala.nvim

Вместо Postman для этого проекта используется `kulala.nvim` (`.http`-файлы в папке `http/`).

## Файлы

- `http/api.http` — текущая коллекция запросов (auth, store, category, color). Планируется разбить на `auth.http`, `stores.http`, `color.http`.
- `http/http-client.env.json` — окружение `dev` (`baseUrl`). Коммитится в git.
- `http/http-client.private.env.json` — тестовые `email`/`password` (реальный пользователь `seriiburduja@gmail.com` / `123456`, он же в Postman-коллекции `auth`). **В `.gitignore`, не коммитится.**

## Маппинги (см. `~/.config/nvim/modules/kulala.vim`)

Префикс `<leader>k` (не `<leader>r` — конфликтовал с другими плагинами: `ri`/`rn`/`rs` были перекрыты):

- `<leader>kr` — выполнить запрос под курсором
- `<leader>ka` — выполнить все запросы в файле
- `<leader>ke` — выбрать окружение (обязательно выбрать `dev` в начале сессии, иначе `{{baseUrl}}` не резолвится)
- `<leader>kT` — toggle body/headers
- `<leader>kn` / `<leader>kp` — следующий/предыдущий запрос
- `<leader>kb` — scratchpad
- `<leader>kq` — закрыть окно результата

В окне результата (`kulala_ui`) добавлены `<C-h>/<C-j>/<C-k>/<C-l>` для перехода в соседние окна (перекрывали дефолтные `<C-w>h/j/k/l`).

## Как писать скрипты (важно, чтобы не ловить баги)

1. **Переменные — только через `client.global.set("name", value)` / `client.global.get("name")`.**
   Прямое присваивание `client.global.name = value` НЕ работает — это просто мутирует объект в памяти текущего запроса и не сохраняется между запросами (несмотря на то, что показано в некоторых примерах официальной документации `kulala.lua-scripts.txt`). Именно `.set()`/`.get()` пишут в persistent SQLite-хранилище kulala-core (см. `kulala.client-reference.txt`) — оно живёт на уровне **всего проекта** (не файла/буфера) и переживает перезапуск Neovim.

2. **Всегда оборачивать `client.global.set(..., response.body.id)` проверкой на наличие поля**, например:
   ```js
   if (response.body && response.body.id) {
     client.global.set("storeId", response.body.id);
   }
   ```
   Если запрос упал (4xx/5xx) и в ответе нет `id`, `response.body.id` будет `undefined`. Прямой `client.global.set("x", undefined)` роняет весь плагин с ошибкой `NOT NULL constraint failed: variables.value_json` (внутренняя SQLite-БД kulala-core не принимает `undefined`/`null`).

3. **`response.body`** — это уже распарсенный JS-объект/массив, если ответ JSON (НЕ строка, несмотря на то что написано в `kulala.lua-scripts.txt`). Правильный источник истины — `kulala.response-reference.txt`: *"The response body, as a string, or json object if the response is json"*. Поэтому `response.body.accessToken`, `response.body.id`, `response.body[0].id` — работают напрямую, `JSON.parse(response.body)` — **не работает** (упадёт с `Unexpected identifier "object"`, т.к. body уже объект).

4. Переменные, сохранённые через `client.global.set` в одном `.http`-файле (например `login` в будущем `auth.http`), доступны через `{{name}}` в **любом другом** `.http`-файле проекта (`stores.http`, `color.http` и т.д.) — хранилище общее для всего проекта, не привязано к файлу. Нужно просто один раз выполнить `login`/`findAllStores` и т.п. в текущей сессии Neovim до того, как использовать зависимые запросы.

5. Диагностика: `client.log(...)` выводится не в `Verbose`, а во вкладку **Script Output (O)** в окне результата.

## Известные баги в самом приложении (уже исправлены в этой сессии)

- `color.entity.ts` и `category.entity.ts` раньше имели одновременно `@Column({ unique: true })` (глобальный unique) и `@Unique(['storeId', 'name'/'title'])` (составной) — конфликт. Убрали `unique: true` с колонки, оставили только составной. Миграции: `ColorUniquePerStore`, `CategoryTitleUniquePerStore` — уже применены (`npm run migration:run`).
- `ColorService`/`CategoryService`/`ColorController`/`CategoryController` переведены на паттерн: `@Auth()` + `@CurrentUser('id')` + `storeService.findOne(storeId, userId)` для проверки владения стором (по аналогии с `StoreService`). `StoreModule` теперь экспортирует `StoreService`.
- `main.ts` — включён `ValidationPipe({ whitelist: true })` глобально.

## TODO на завтра

- Разбить `http/api.http` на `http/auth.http`, `http/stores.http`, `http/color.http` (категории можно добавить туда же или отдельным файлом `category.http`).
- Проверить, что `{{storeId}}`/`{{accessToken}}` корректно шарятся между новыми файлами (должно работать "из коробки", см. пункт 4 выше).
