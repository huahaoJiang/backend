module.exports = {
  apps: [
    {
      name: 'backend',
      script: './backend/src/main.js',
      instances: 1,
      env_test: {
        NODE_ENV: 'development'
      },
      env_prod: {
        NODE_ENV: 'production'
      },
      exec_mode: 'cluster',
      combine_logs: true
    }
  ]
}
