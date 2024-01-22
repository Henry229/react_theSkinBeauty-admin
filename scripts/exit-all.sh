cd /home/ubuntu/react_theSkinBeauty-admin/backend

docker-compose -f docker-compose.yml --env-file ../config/.server.env down && npx pm2 delete all