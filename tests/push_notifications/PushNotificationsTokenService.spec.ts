import {Container} from "typedi";
import {UserFixture} from "../users/UserFixture";
import {expect} from "chai";
import {PushNotificationsTokenService} from "../../src/push_notifications/PushNotificationsTokenService";
import {UserService} from "../../src/users/UserService";

describe("Push Notifications Token Service", () => {

    let service: PushNotificationsTokenService;
    let userService: UserService;
    beforeEach(async () => {
        service = Container.get(PushNotificationsTokenService);
        userService = Container.get(UserService);
    });

    context("set token", () => {

        const OLD_TOKEN = "old_token";
        const NEW_TOKEN = "new_token";

        it("should set token to user", async () => {
            const user = await UserFixture.createUserWithFirebaseToken();

            const result = await service.setToken(NEW_TOKEN, user);
            expect(result.isSuccessful()).to.be.true;

            const login = await userService.login(UserFixture.getDefaultUserInput());
            expect(login.getData().firebaseToken).to.eq(NEW_TOKEN);
        });

        it("should set token to user if it is the same", async () => {
            const user = await UserFixture.createUserWithFirebaseToken(OLD_TOKEN);

            const result = await service.setToken(OLD_TOKEN, user);
            expect(result.isSuccessful()).to.be.true;

            const login = await userService.login(UserFixture.getDefaultUserInput());
            expect(login.getData().firebaseToken).to.eq(OLD_TOKEN);
        });

        it("should replace old token", async () => {
            const user = await UserFixture.createUserWithFirebaseToken(OLD_TOKEN);

            const result = await service.setToken(NEW_TOKEN, user);
            expect(result.isSuccessful()).to.be.true;

            const login = await userService.login(UserFixture.getDefaultUserInput());
            expect(login.getData().firebaseToken).to.eq(NEW_TOKEN);
        });

        it("should return error if token is empty", async () => {
            const user = await UserFixture.createUserWithFirebaseToken();

            const result = await service.setToken("", user);

            expect(result.isSuccessful()).to.be.false;
            expect(result.getError()).to.eq(PushNotificationsTokenService.INVALID_TOKEN_ERROR);
        });

        it("should not set token if is empty", async () => {
            const user = await UserFixture.createUserWithFirebaseToken(OLD_TOKEN);

            const result = await service.setToken("", user);
            expect(result.isSuccessful()).to.be.false;

            const login = await userService.login(UserFixture.getDefaultUserInput());
            expect(login.getData().firebaseToken).to.eq(OLD_TOKEN);
        });

        it("should return token", async () => {
            const user = await UserFixture.createUserWithFirebaseToken();

            const result = await service.setToken(NEW_TOKEN, user);

            expect(result.isSuccessful()).to.be.true;
            expect(result.getData()).to.eq(NEW_TOKEN);
        });

    });

    context("remove token", () => {

        const OLD_TOKEN = "old_token";

        it("should remove old token", async () => {
            const user = await UserFixture.createUserWithFirebaseToken(OLD_TOKEN);

            await service.removeToken(user);

            const login = await userService.login(UserFixture.getDefaultUserInput());
            expect(login.getData().firebaseToken).to.be.empty;
        });

        it("should not fail if user does not have token", async () => {
            const user = await UserFixture.createUserWithFirebaseToken();

            await expect(service.removeToken(user)).to.eventually.be.fulfilled;
        });

    });

});