import {Db} from "../src/db/Db";
import {before} from "mocha"
import {getConnection} from "typeorm";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);


before(async () => {
    await Db.create();
});

beforeEach(async () => {
    await getConnection().dropDatabase();
    await getConnection().runMigrations();
})
