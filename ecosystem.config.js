module.exports = {
  apps: [
    {
      name: 'hettautomotive',
      script: 'npm',
      args: 'start:3002',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
