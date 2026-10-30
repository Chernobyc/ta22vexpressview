# ta22vlearnexpress fork

## How to run
Install depends
```sh
npm install
```

Run migrations (may need to start app once to init db)
```sh
npx sequelize-cli db:migrate
```

init seeders
```sh
npx sequelize-cli db:seed:all
```

Run server via nodemon
```sh
npm run start
```