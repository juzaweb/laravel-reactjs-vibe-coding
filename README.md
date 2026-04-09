## Install

- Run migration
```
php artisan migrate
```

- Make admin user

```
php artisan user:make --name=Admin --email=admin@gmail.com --pass=password --super-admin
```

- Config Passport

```
php artisan passport:keys
php artisan passport:client --password --name="Users" --provider=users
```

Set `AUTH_API_CLIENT_ID` and `AUTH_API_CLIENT_SECRET` in `.env` file id and secret from above command
