import {UserInput} from "../../src/users/entities/UserInput";
import {UserService} from "../../src/users/UserService";
import {Container} from "typedi";
import {expect} from "chai";
import {UserRepository} from "../../src/users/UserRepository";
import {UserValidator} from "../../src/users/UserValidator";

const USERNAME = "username";
const PASSWORD = "password";

const getDefaultUserInput = (index?: number): UserInput => {
    const user = new UserInput();
    user.username = USERNAME + (index ? index : "");
    user.password = PASSWORD;
    return user;
};

describe("User Service", () => {

    let service: UserService;

    beforeEach(async () => {
        service = Container.get(UserService);
    });

    context("register user", () => {

        it("created user should be stored in db", async () => {
            const user = getDefaultUserInput();
            const savedUser = await service.registerUser(user);
            const userFromDb = await Container.get(UserRepository).findByToken(savedUser.getData().token);
            expect(userFromDb).to.not.be.undefined;
        });

        context("user data", () => {
            it("created user should have id", async () => {
                const user = getDefaultUserInput();
                const savedUser = await service.registerUser(user);
                expect(savedUser.getData().id).to.not.be.undefined;
            });

            it("created user should have correct username", async () => {
                const user = getDefaultUserInput();
                const savedUser = await service.registerUser(user);
                expect(savedUser.getData().username).to.eq(USERNAME);
            });

            it("created user should have correct password", async () => {
                const user = getDefaultUserInput();
                const savedUser = await service.registerUser(user);
                expect(savedUser.getData().checkPassword(PASSWORD)).to.be.true;
            });

            it("created user should have token", async () => {
                const user = getDefaultUserInput();
                const savedUser = await service.registerUser(user);
                expect(savedUser.getData().token).to.not.be.undefined;
            });

            it("two different users should have different tokens", async () => {
                const user1 = getDefaultUserInput(1);
                const user2 = getDefaultUserInput(2);
                const savedUser1 = await service.registerUser(user1);
                const savedUser2 = await service.registerUser(user2);
                expect(savedUser1.getData().token).to.not.eq(savedUser2.getData().token);
            });

            it("15 different users should have different tokens", async () => {
                const usersAmount = 15;
                const tokens = new Set();

                for (let i = 0; i < usersAmount; i++) {
                    const user = getDefaultUserInput(i);
                    const savedUser = await service.registerUser(user);
                    tokens.add(savedUser.getData().token);
                }

                expect(tokens.size).to.eq(usersAmount);
            });
        });

        context("password validation", () => {
            it("can not create user with empty password", async () => {
                const user = getDefaultUserInput();
                user.password = "";

                const savedUser = await service.registerUser(user);
                expect(savedUser.isSuccessful()).to.be.false;
                expect(savedUser.getError()).to.eq(UserValidator.INVALID_PASSWORD_ERROR);
            });

            it("can not create user with password length 5", async () => {
                const user = getDefaultUserInput();
                user.password = "12345";

                const savedUser = await service.registerUser(user);
                expect(savedUser.isSuccessful()).to.be.false;
                expect(savedUser.getError()).to.eq(UserValidator.INVALID_PASSWORD_ERROR);
            });

            it("can create user with password length 6", async () => {
                const user = getDefaultUserInput();
                user.password = "123456";

                const savedUser = await service.registerUser(user);
                expect(savedUser.isSuccessful()).to.be.true;
            });
        });

        context("username validation", () => {
            it("can not create 2 users with same username", async () => {
                const user = getDefaultUserInput();

                await service.registerUser(user);
                const result = await service.registerUser(user);
                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(UserValidator.NOT_UNIQUE_USERNAME_ERROR);
            });

            it("can not create user with empty username", async () => {
                const user = getDefaultUserInput();
                user.username = "";

                const result = await service.registerUser(user);
                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(UserInput.INVALID_USERNAME_ERROR);
            });
        });
    });

});