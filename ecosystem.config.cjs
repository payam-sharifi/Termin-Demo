/**
 * PM2 config — run from repo root after `npm install && npm run build`:
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 * (Run `pm2 startup` once on the server so processes survive reboot.)
 */
module.exports = {
  apps: [
    {
      name: "Termin-Demo",
      cwd: __dirname,
      script: "npm",
      args: "run start",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
