import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv( process.env.NODE_ENV || "development", process.cwd() );

module.exports = defineConfig( {
    projectConfig: {
        databaseUrl: process.env.DATABASE_URL,
        redisUrl: process.env.REDIS_URL,
        http: {
            storeCors: process.env.STORE_CORS!,
            adminCors: process.env.ADMIN_CORS!,
            authCors: process.env.AUTH_CORS!,
            jwtSecret: process.env.JWT_SECRET || "supersecret",
            cookieSecret: process.env.COOKIE_SECRET || "supersecret",
        },
    },
    modules: [
        {
            resolve: "./src/modules/vendor",
        },
        {
            resolve: "./src/modules/lowstock",
        },
        {
            resolve: "@medusajs/medusa/notification",
            options: {
                providers: [
                    {
                        resolve: "@medusajs/medusa/notification-local",
                        id: "local",
                        options: {
                            channels: [ "email", "feed" ],
                        },
                    },
                ],
            },
        },
    ],
} );
