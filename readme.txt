docker compose up --build -d


#migr
docker compose exec app bash
yarn sequelize db:migrate 



