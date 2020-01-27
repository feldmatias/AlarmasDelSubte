import {User} from "../../src/users/entities/User";
import {expect} from "chai";
import {Md5} from "ts-md5";
import {UserFixture} from "./UserFixture";

describe("User", () => {

    context("user password security", () => {

        it("password is not plain text when creating model", () => {
            const password = "password";
            const user = new User(new UserFixture().withPassword(password).getUserInput());
            expect(user).to.have.property("password");
            expect(user).to.not.have.property("password", password);
        });

        it("password is hashed when creating model", () => {
            const password = "password";
            const user = new User(new UserFixture().withPassword(password).getUserInput());
            const hash = Md5.hashStr(password);
            expect(user).to.have.property("password", hash);
        });
    });
});