module.exports = {
  apps: [
    {
      name: 'hettautomotive',
      script: 'npm',
      args: 'run start:3003',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
