import {UserInput} from "../../src/users/entities/UserInput";
import {User} from "../../src/users/entities/User";
import { expect } from "chai";
import {Md5} from "ts-md5";

const USERNAME = "username";
const PASSWORD = "password";

const getDefaultUserInput = (): UserInput => {
    const user = new UserInput();
    user.username = USERNAME;
    user.password = PASSWORD;
    return user;
};

describe("User", () => {

    context("user password security", () => {

        it("password is not plain text when creating model", () => {
            const user = new User(getDefaultUserInput());
            expect(user["password"]).to.not.eq(PASSWORD);
        });

        it("password is hashed when creating model", () => {
            const user = new User(getDefaultUserInput());
            const hash = Md5.hashStr(PASSWORD);
            expect(user["password"]).to.eq(hash);
        });
    });
});