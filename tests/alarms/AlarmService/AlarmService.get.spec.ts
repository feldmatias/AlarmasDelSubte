import {Container} from "typedi";
import {AlarmService} from "../../../src/alarms/AlarmService";
import {expect} from "chai";
import {AlarmFixture} from "../AlarmFixture";
import {User} from "../../../src/users/entities/User";
import {UserFixture} from "../../users/UserFixture";

describe("Alarm Service", () => {

    let service: AlarmService;

    beforeEach(async () => {
        service = Container.get(AlarmService);
    });

    context("get alarm", () => {

        it("should return undefined if alarm does not exist", async () => {
            const user = await UserFixture.createUser();
            const alarm = await service.get(123, user);
            expect(alarm).to.be.undefined;
        });

        it("should return undefined if is not alarm's owner ", async () => {
            const created = await AlarmFixture.createAlarm();
            const id = created.id;

            const otherUser = await UserFixture.createUserWithUsername("other user");

            const alarm = await service.get(id, otherUser);

            expect(alarm).to.be.undefined;
        });

        it("should return alarm with correct id ", async () => {
            const alarmInput = await AlarmFixture.getDefaultAlarmInput();
            const created = await service.create(alarmInput);
            const id = created.getData().id;

            const alarm = await service.get(id, alarmInput.getOwner());

            expect(alarm).to.not.be.undefined;
            expect(alarm?.id).to.eq(id);
        });

        it("should return alarm with correct properties ", async () => {
            const alarmInput = await AlarmFixture.getDefaultAlarmInput();
            const created = await service.create(alarmInput);
            const id = created.getData().id;
            const expected = created.getData();

            const alarm = await service.get(id, alarmInput.getOwner());

            expect(alarm).to.not.be.undefined;
            expect(alarm?.name).to.eq(expected.name);
            expect(alarm?.start).to.eq(expected.start);
            expect(alarm?.end).to.eq(expected.end);
            expect(alarm?.days).to.deep.eq(expected.days);
        });

        it("should return alarm with correct subways", async () => {
            const alarmInput = await AlarmFixture.getDefaultAlarmInput();
            const created = await service.create(alarmInput);
            const id = created.getData().id;
            const expected = created.getData();

            const alarm = await service.get(id, alarmInput.getOwner());

            expect(alarm).to.not.be.undefined;
            expect(alarm?.subways()).to.deep.eq(expected.subways());
        });
    });

    context("get all alarms", () => {

        it("should return empty array if no alarm exist for that user", async () => {
            const alarms = await service.getAll(new User());
            expect(alarms).to.be.empty;
        });

        it("should return one alarm if one alarm exists for that user", async () => {
            const alarmInput = await AlarmFixture.getDefaultAlarmInput();
            await service.create(alarmInput);

            const alarms = await service.getAll(alarmInput.getOwner());

            expect(alarms).to.have.length(1);
            expect(alarms[0].name).to.eq(alarmInput.name);
        });

        it("should return n alarms if they exist for that user", async () => {
            const count = 10;
            const alarmInput = await AlarmFixture.getDefaultAlarmInput();

            for (let i = 0; i < count; i++) {
                alarmInput.name = i.toString();
                await service.create(alarmInput);
            }

            const alarms = await service.getAll(alarmInput.getOwner());
            const alarmNames = alarms.map(alarm => alarm.name);

            expect(alarms).to.have.length(count);
            for (let i = 0; i < count; i++) {
                expect(alarmNames).to.include(i.toString());
            }
        });

        it("should not return alarms that belong to other user", async () => {
            await AlarmFixture.createAlarm();

            const otherUser = await UserFixture.createUserWithUsername("other user");

            const alarms = await service.getAll(otherUser);

            expect(alarms).to.be.empty;
        });

        it("should return only user's alarms", async () => {
            const user = await UserFixture.createUserWithUsername("user");
            const otherUser = await UserFixture.createUserWithUsername("other user");

            const alarmInput = await AlarmFixture.getDefaultAlarmInput(false);

            alarmInput.setOwner(user);
            alarmInput.name = user.username;
            await service.create(alarmInput);

            alarmInput.setOwner(otherUser);
            alarmInput.name = otherUser.username;
            await service.create(alarmInput);

            const userAlarms = await service.getAll(user);
            const otherUserAlarms = await service.getAll(otherUser);

            expect(userAlarms).to.have.length(1);
            expect(otherUserAlarms).to.have.length(1);

            expect(userAlarms[0].name).to.eq(user.username);
            expect(otherUserAlarms[0].name).to.eq(otherUser.username);
        });

        it("should return alarms with subways", async () => {
            const alarmInput = await AlarmFixture.getDefaultAlarmInput();
            const created = await service.create(alarmInput);

            const alarms = await service.getAll(alarmInput.getOwner());

            expect(alarms).to.have.length(1);
            expect(alarms[0].subways()).to.deep.eq(created.getData().subways());
        });
    });

});
