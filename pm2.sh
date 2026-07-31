echo "[PM2] starting devtube..."


pm2 delete devtube || true

echo "[PM2] Waiting for port cleanup..."
sleep 1

echo "[PM2] Starting new process..."
pm2 start bun --name devtube -- src/index.js

# Persist the process list
# pm2 save
#
# echo "[PM2]  Backend is up and running."
