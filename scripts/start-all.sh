# Print message on console.
echo "[info] Starting server and client..."

# OS variable
CHECK_OS="`uname -s`"

# Check OS and then RUN the services
if [[ ${CHECK_OS} = "Darwin"* ]]; then
  npm run build --prefix ./server/app && docker-compose -f ./server/docker-compose.yml --env-file ./config/.server.env up -d && npm run start:client
elif [[ "$CHECK_OS" = "Linux"* ]]; then
  # pm2 start /home/ubuntu/react_theSkinBeauty-admin/backend/server.js --name backend-theSkinBeauty && \
  # docker-compose -f /home/ubuntu/react_theSkinBeauty-admin/backend/docker-compose.yml --env-file /home/ubuntu/react_theSkinBeauty-admin/config/.server.env up -d && \
  # npm run start:client && \
  # echo "All services have been started."
  npm run build --prefix ./backend && docker-compose -f ./backend/docker-compose.yml --env-file ./config/.server.env up -d && npm run start:client
  # npm start --prefix ./backend && docker-compose -f ./backend/docker-compose.yml --env-file ./config/.server.env up -d && npm run start:client
elif [[ ${CHECK_OS} = "MINGW32"* ]]; then
  npm run start:windows
elif [[ ${CHECK_OS} = "MINGW64"* ]]; then
  npm run start:windows
elif [[ ${CHECK_OS} = "CYGWIN"* ]]; then
  npm run start:windows
fi

# Print message on console.
echo "[info] Make a big money with this app!!"