import {Db} from "../src/db/Db";
import {before} from "mocha"
import {getConnection} from "typeorm";


before(async () => {
    await Db.create();
});

beforeEach(async () => {
    await getConnection().dropDatabase();
    await getConnection().runMigrations();
})
