docker-compose -f ./backend/docker-compose.yml --env-file ./config/.server.env down && npx pm2 delete all