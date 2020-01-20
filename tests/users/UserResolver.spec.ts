import {UserService} from "../../src/users/UserService";
import {anyOfClass, instance, mock, when} from "ts-mockito";
import {Result} from "../../src/utils/Result";
import {User} from "../../src/users/entities/User";
import {UserResolver} from "../../src/users/resolvers/UserResolver";
import {UserInput} from "../../src/users/entities/UserInput";
import {expect} from "chai";
import {UserValidator} from "../../src/users/validation/UserValidator";
import UserErrorHelper from "../../src/users/UserErrorHelper";
import {ErrorHelper} from "../../src/utils/ErrorHelper";
import {UserPasswordValidation} from "../../src/users/validation/UserPasswordValidation";
import {UserUsernameValidation} from "../../src/users/validation/UserUsernameValidation";

const USERNAME = "username";
const TOKEN = "token";

describe("User Resolver", () => {

    let service: UserService;
    let resolver: UserResolver;
    beforeEach(() => {
        service = mock(UserService);
        resolver = new UserResolver(instance(service));
    });

    context("Register user", () => {

        it("should return created user", async () => {
            const user = new User();
            user.username = USERNAME;
            user.token = TOKEN;

            when(service.registerUser(anyOfClass(UserInput))).thenResolve(Result.Success(user));

            const result = await resolver.registerUser(new UserInput());
            expect(result.username).to.eq(USERNAME);
            expect(result.token).to.eq(TOKEN);
        });

        context("errors", () => {

            it("should raise error when invalid password", async () => {
                when(service.registerUser(anyOfClass(UserInput)))
                    .thenResolve(Result.Error(UserPasswordValidation.ERROR));

                await expect(resolver.registerUser(new UserInput()))
                    .to.eventually.be.rejectedWith(UserErrorHelper.INVALID_PASSWORD_MESSAGE);
            });

            it("should raise error when invalid username", async () => {
                when(service.registerUser(anyOfClass(UserInput)))
                    .thenResolve(Result.Error(UserUsernameValidation.ERROR));

                await expect(resolver.registerUser(new UserInput()))
                    .to.eventually.be.rejectedWith(UserErrorHelper.INVALID_USERNAME_MESSAGE);
            });

            it("should raise error when not unique username", async () => {
                when(service.registerUser(anyOfClass(UserInput)))
                    .thenResolve(Result.Error(UserValidator.NOT_UNIQUE_USERNAME_ERROR));

                await expect(resolver.registerUser(new UserInput()))
                    .to.eventually.be.rejectedWith(UserErrorHelper.NOT_UNIQUE_USERNAME_MESSAGE);
            });

            it("should raise default error when something happens", async () => {
                when(service.registerUser(anyOfClass(UserInput)))
                    .thenResolve(Result.Error("error"));

                await expect(resolver.registerUser(new UserInput()))
                    .to.eventually.be.rejectedWith(ErrorHelper.DEFAULT_ERROR_MESSAGE);
            });
        });
    });

    context("Login user", () => {

        it("should return logged in user", async () => {
            const user = new User();
            user.username = USERNAME;
            user.token = TOKEN;

            when(service.login(anyOfClass(UserInput))).thenResolve(Result.Success(user));

            const result = await resolver.login(new UserInput());
            expect(result.username).to.eq(USERNAME);
            expect(result.token).to.eq(TOKEN);
        });

        context("errors", () => {

            it("should raise error when invalid login", async () => {
                when(service.login(anyOfClass(UserInput)))
                    .thenResolve(Result.Error(UserService.LOGIN_ERROR));

                await expect(resolver.login(new UserInput()))
                    .to.eventually.be.rejectedWith(UserErrorHelper.INVALID_LOGIN_MESSAGE);
            });
        });

    });
});