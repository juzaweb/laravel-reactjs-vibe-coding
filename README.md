## Install

- Run migration
```
php artisan migrate
```

- Config Passport

```
php artisan passport:keys
php artisan passport:client --password --name="Users" --provider=users
```

Set `AUTH_API_CLIENT_ID` and `AUTH_API_CLIENT_SECRET` in `.env` file id and secret from above command
