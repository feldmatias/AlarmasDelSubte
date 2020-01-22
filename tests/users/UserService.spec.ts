import {UserService} from "../../src/users/UserService";
import {Container} from "typedi";
import {expect} from "chai";
import {UserRepository} from "../../src/users/UserRepository";
import {UserValidator} from "../../src/users/validation/UserValidator";
import {UserFixture} from "./UserFixture";
import {UserUsernameValidation} from "../../src/users/validation/UserUsernameValidation";
import {UserPasswordValidation} from "../../src/users/validation/UserPasswordValidation";


describe("User Service", () => {

    let service: UserService;

    beforeEach(async () => {
        service = Container.get(UserService);
    });

    context("register user", () => {

        it("created user should be stored in db", async () => {
            const user = UserFixture.getDefaultUserInput();
            const savedUser = await service.registerUser(user);
            const userFromDb = await Container.get(UserRepository).findByToken(savedUser.getData().token);
            expect(userFromDb).to.not.be.undefined;
        });

        context("user data", () => {
            it("created user should have id", async () => {
                const user = UserFixture.getDefaultUserInput();
                const savedUser = await service.registerUser(user);
                expect(savedUser.getData()).to.have.property("id");
            });

            it("created user should have correct username", async () => {
                const user = UserFixture.getDefaultUserInput();
                const savedUser = await service.registerUser(user);
                expect(savedUser.getData().username).to.eq(UserFixture.USERNAME);
            });

            it("created user should have correct password", async () => {
                const user = UserFixture.getDefaultUserInput();
                const savedUser = await service.registerUser(user);
                expect(savedUser.getData().checkPassword(UserFixture.PASSWORD)).to.be.true;
            });

            it("created user should have token", async () => {
                const user = UserFixture.getDefaultUserInput();
                const savedUser = await service.registerUser(user);
                expect(savedUser.getData().token).to.not.be.undefined;
            });

            it("two different users should have different tokens", async () => {
                const user1 = UserFixture.getDefaultUserInput(1);
                const user2 = UserFixture.getDefaultUserInput(2);
                const savedUser1 = await service.registerUser(user1);
                const savedUser2 = await service.registerUser(user2);
                expect(savedUser1.getData().token).to.not.eq(savedUser2.getData().token);
            });

            it("15 different users should have different tokens", async () => {
                const usersAmount = 15;
                const tokens = new Set();

                for (let i = 0; i < usersAmount; i++) {
                    const user = UserFixture.getDefaultUserInput(i);
                    const savedUser = await service.registerUser(user);
                    tokens.add(savedUser.getData().token);
                }

                expect(tokens.size).to.eq(usersAmount);
            });
        });

        context("password validation", () => {
            it("can not create user with empty password", async () => {
                const user = UserFixture.getDefaultUserInput();
                user.password = "";

                const savedUser = await service.registerUser(user);
                expect(savedUser.isSuccessful()).to.be.false;
                expect(savedUser.getError()).to.eq(UserPasswordValidation.ERROR);
            });

            it("can not create user with password length 5", async () => {
                const user = UserFixture.getDefaultUserInput();
                user.password = "12345";

                const savedUser = await service.registerUser(user);
                expect(savedUser.isSuccessful()).to.be.false;
                expect(savedUser.getError()).to.eq(UserPasswordValidation.ERROR);
            });

            it("can create user with password length 6", async () => {
                const user = UserFixture.getDefaultUserInput();
                user.password = "123456";

                const savedUser = await service.registerUser(user);
                expect(savedUser.isSuccessful()).to.be.true;
            });
        });

        context("username validation", () => {
            it("can not create 2 users with same username", async () => {
                const user = UserFixture.getDefaultUserInput();

                await service.registerUser(user);
                const result = await service.registerUser(user);
                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(UserValidator.NOT_UNIQUE_USERNAME_ERROR);
            });

            it("can not create user with empty username", async () => {
                const user = UserFixture.getDefaultUserInput();
                user.username = "";

                const result = await service.registerUser(user);
                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(UserUsernameValidation.ERROR);
            });
        });
    });


    context("login user", () => {

        context("valid login", () => {

            const userInput = UserFixture.getDefaultUserInput();

            it("can login with correct credentials", async () => {
                await UserFixture.createUser(userInput);
                const login = await service.login(userInput);
                expect(login.isSuccessful()).to.be.true;
            });

            it("logged in user has correct username", async () => {
                await UserFixture.createUser(userInput);
                const login = await service.login(userInput);
                expect(login.getData().username).to.eq(userInput.username);
            });

            it("logged in user has correct password", async () => {
                await UserFixture.createUser(userInput);
                const login = await service.login(userInput);
                expect(login.getData().checkPassword(userInput.password)).to.be.true;
            });
        });

        context("invalid login", () => {

            it("can not login unexistant user", async () => {
                const login = await service.login(UserFixture.getDefaultUserInput());
                expect(login.isSuccessful()).to.be.false;
                expect(login.getError()).to.eq(UserService.LOGIN_ERROR);
            });

            it("can not login with invalid password", async () => {
                const userInput = UserFixture.getDefaultUserInput();
                await UserFixture.createUser(userInput);

                userInput.password = UserFixture.PASSWORD + "other password";
                const login = await service.login(userInput);

                expect(login.isSuccessful()).to.be.false;
                expect(login.getError()).to.eq(UserService.LOGIN_ERROR);
            });
        });
    });

});