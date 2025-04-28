module.exports = {
  apps: [
    {
      name: "directus",
      script: "npx",
      args: "directus start",
      cwd: "/home/ubuntu/SSLOJ_Game/directus-cms",
      env: {
        HOST: "0.0.0.0",
        PORT: 8055,

        PUBLIC_URL: "https://admin.ssloj.com",
        APP_URL: "https://admin.ssloj.com",

        DB_CLIENT: "sqlite3",
        DB_FILENAME: "./data.db",

        CORS_ENABLED: "true",
        CORS_ORIGIN: "true",

        STORAGE_LOCATIONS: "local",
        STORAGE_LOCAL_DRIVER: "local",
        STORAGE_LOCAL_ROOT: "./uploads",

        EMAIL_FROM: "no-reply@example.com",
        EMAIL_TRANSPORT: "sendmail",

        EXTENSIONS_PATH: "./extensions",
        EXTENSIONS_AUTO_RELOAD: "false",

        SECRET: "ccaj94EjWKxKgm3vVSAv2HxJXUKCCF04",

        NODE_ENV: "production"
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
    },
  ],
};
