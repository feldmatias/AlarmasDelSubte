// File used only to generate migrations

module.exports = {
    type: "sqlite",
    database: "dev.db",
    entities: ["./**/entities/**/*.ts"],
    migrations: ["./src/db/migration/*.ts"],
    cli: {
        migrationsDir: "./src/db/migration"
    }
};