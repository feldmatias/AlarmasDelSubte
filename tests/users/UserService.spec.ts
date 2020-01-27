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
            const user = new UserFixture().getUserInput();
            const savedUser = await service.registerUser(user);
            const userFromDb = await Container.get(UserRepository).findByToken(savedUser.getData().token);
            expect(userFromDb).to.not.be.undefined;
        });

        context("user data", () => {
            it("created user should have id", async () => {
                const user = new UserFixture().getUserInput();
                const savedUser = await service.registerUser(user);
                expect(savedUser.getData()).to.have.property("id");
            });

            it("created user should have correct username", async () => {
                const username = "username";
                const user = new UserFixture().withUsername(username).getUserInput();
                const savedUser = await service.registerUser(user);
                expect(savedUser.getData().username).to.eq(username);
            });

            it("created user should have correct password", async () => {
                const password = "password";
                const user = new UserFixture().withPassword(password).getUserInput();
                const savedUser = await service.registerUser(user);
                expect(savedUser.getData().checkPassword(password)).to.be.true;
            });

            it("created user should have token", async () => {
                const user = new UserFixture().getUserInput();
                const savedUser = await service.registerUser(user);
                expect(savedUser.getData().token).to.not.be.undefined;
            });

            it("two different users should have different tokens", async () => {
                const user1 = new UserFixture().withUsername("1").getUserInput();
                const user2 = new UserFixture().withUsername("2").getUserInput();
                const savedUser1 = await service.registerUser(user1);
                const savedUser2 = await service.registerUser(user2);
                expect(savedUser1.getData().token).to.not.eq(savedUser2.getData().token);
            });

            it("15 different users should have different tokens", async () => {
                const usersAmount = 15;
                const tokens = new Set();

                for (let i = 0; i < usersAmount; i++) {
                    const user = new UserFixture().withUsername(i.toString()).getUserInput();
                    const savedUser = await service.registerUser(user);
                    tokens.add(savedUser.getData().token);
                }

                expect(tokens.size).to.eq(usersAmount);
            });
        });

        context("password validation", () => {
            it("can not create user with empty password", async () => {
                const user = new UserFixture().withPassword("").getUserInput();

                const savedUser = await service.registerUser(user);
                expect(savedUser.isSuccessful()).to.be.false;
                expect(savedUser.getError()).to.eq(UserPasswordValidation.ERROR);
            });

            it("can not create user with password length 5", async () => {
                const user = new UserFixture().withPassword("12345").getUserInput();

                const savedUser = await service.registerUser(user);
                expect(savedUser.isSuccessful()).to.be.false;
                expect(savedUser.getError()).to.eq(UserPasswordValidation.ERROR);
            });

            it("can create user with password length 6", async () => {
                const user = new UserFixture().withPassword("123456").getUserInput();

                const savedUser = await service.registerUser(user);
                expect(savedUser.isSuccessful()).to.be.true;
            });
        });

        context("username validation", () => {
            it("can not create 2 users with same username", async () => {
                const user = new UserFixture().getUserInput();

                await service.registerUser(user);
                const result = await service.registerUser(user);
                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(UserValidator.NOT_UNIQUE_USERNAME_ERROR);
            });

            it("can not create user with empty username", async () => {
                const user = new UserFixture().withUsername("").getUserInput();

                const result = await service.registerUser(user);
                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(UserUsernameValidation.ERROR);
            });
        });
    });


    context("login user", () => {

        context("valid login", () => {

            const userInput = new UserFixture().getUserInput();

            it("can login with correct credentials", async () => {
                await new UserFixture().withInput(userInput).createUser();
                const login = await service.login(userInput);
                expect(login.isSuccessful()).to.be.true;
            });

            it("logged in user has correct username", async () => {
                await new UserFixture().withInput(userInput).createUser();
                const login = await service.login(userInput);
                expect(login.getData().username).to.eq(userInput.username);
            });

            it("logged in user has correct password", async () => {
                await new UserFixture().withInput(userInput).createUser();
                const login = await service.login(userInput);
                expect(login.getData().checkPassword(userInput.password)).to.be.true;
            });
        });

        context("invalid login", () => {

            it("can not login unexistant user", async () => {
                const login = await service.login(new UserFixture().getUserInput());
                expect(login.isSuccessful()).to.be.false;
                expect(login.getError()).to.eq(UserService.LOGIN_ERROR);
            });

            it("can not login with invalid password", async () => {
                const userInput = new UserFixture().getUserInput();
                await new UserFixture().withInput(userInput).createUser();

                userInput.password += "other password";
                const login = await service.login(userInput);

                expect(login.isSuccessful()).to.be.false;
                expect(login.getError()).to.eq(UserService.LOGIN_ERROR);
            });
        });
    });

});