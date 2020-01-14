import {Db} from "../src/db/Db";
import {before} from "mocha"
import {getConnection} from "typeorm";
import {Subway} from "../src/subways/entities/Subway";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);


before(async () => {
    await Db.create();
});

beforeEach(async () => {
    await getConnection().dropDatabase();
    await getConnection().runMigrations();
    await getConnection().getRepository(Subway).clear(); // Clear all default generated subways
});
