import {UserInput} from "../../src/users/entities/UserInput";
import {UserService} from "../../src/users/UserService";
import {Container} from "typedi";
import {expect} from "chai";

const USERNAME = "username";
const PASSWORD = "password";

const getDefaultUserInput = (): UserInput => {
    const user = new UserInput();
    user.username = USERNAME;
    user.password = PASSWORD;
    return user;
};

describe("User Service", () => {

    let service: UserService;

    beforeEach(async () => {
        service = Container.get(UserService);
    });

    context("register user", () => {

        it("should create user", async () => {
            const user = getDefaultUserInput();
            const savedUser = await service.registerUser(user);
            expect(savedUser.id).to.not.be.undefined;
        });
    });

});