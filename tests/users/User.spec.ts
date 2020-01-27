import {User} from "../../src/users/entities/User";
import {expect} from "chai";
import {Md5} from "ts-md5";
import {UserFixture} from "./UserFixture";

describe("User", () => {

    context("user password security", () => {

        it("password is not plain text when creating model", () => {
            const user = new User(new UserFixture().getUserInput());
            expect(user).to.have.property("password");
            expect(user).to.not.have.property("password", UserFixture.PASSWORD);
        });

        it("password is hashed when creating model", () => {
            const user = new User(new UserFixture().getUserInput());
            const hash = Md5.hashStr(UserFixture.PASSWORD);
            expect(user).to.have.property("password", hash);
        });
    });
});