
# Modx сборка

Modx сборка для быстрого старта разработки
## Установка

Должены быть предустановлены: Docker, NodeJs (Если планируете использовать tailwindcss в верстке)

Переходите в рабочую директорию и клонируете проект выполнив следующую команду в терминале:

```bash
  git clone https://github.com/aleks-web/docker-modx-blank.git
```

Переходите в проект:
```bash
  cd docker-modx-blank
```

Поднимаете окружение через Docker:
```bash
  docker compose up -d --build
```

В корне проекта есть дамп базы данных (modx.sql). После того, как окружение поднялось, переходите по ссылке:
[http://localhost:8090](http://localhost:8090) - это phpMyAdmin. Вы можете импортировать дамп здесь, в таблицу modx.

Либо, вы можете выполнить команду:
```bash
  npm run bd-dump-import
```
Эта команда импортирует дамп в таблицу modx автоматически

После этого, вы можете начать разработку сайта.

#### Логин | пароль. От входа в админку ([http://localhost/manager](http://localhost/manager)):
admin | 123456789na

### Как использовать TailwindCss?
Достаточно выполнить команду в терминале:
```bash
  npm run tw
```

### Локальный сайт
Локальный сайт доступен по: [http://localhost](http://localhost)

### phpMyAdmin
phpMyAdmin [http://localhost:8090](http://localhost:8090)

## Контакты автора сборки
- Telegram: [https://t.me/webalexey](https://t.me/webalexey)
- GitHub: [https://github.com/aleks-web](https://github.com/aleks-web)