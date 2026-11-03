module.exports = {
  apps: [
    {
      name: 'brumm-tg-bot',
      script: 'apps/bot/src/index.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
};
