import AppDataSource from "$lib/server/database/ormconfig";
import type { DataSource } from "typeorm";

if (AppDataSource.isInitialized === false) {
    await AppDataSource.initialize();
}

AppDataSource.query(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);