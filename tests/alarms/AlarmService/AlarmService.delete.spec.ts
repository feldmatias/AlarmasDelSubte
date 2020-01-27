import {Container} from "typedi";
import {AlarmService} from "../../../src/alarms/AlarmService";
import {expect} from "chai";
import {AlarmFixture} from "../AlarmFixture";
import {UserFixture} from "../../users/UserFixture";

describe("Alarm Service", () => {

    let service: AlarmService;

    beforeEach(async () => {
        service = Container.get(AlarmService);
    });

    context("delete alarm", () => {

        it("should delete alarm successfully", async () => {
            const alarmInput = await new AlarmFixture().getAlarmInput();
            const created = await service.create(alarmInput);
            const id = created.getData().id;

            const result = await service.delete(id, alarmInput.getOwner());

            expect(result.isSuccessful()).to.be.true;
            expect(result.getData()).to.eq(id);
        });

        it("should not be able to get deleted alarm", async () => {
            const alarmInput = await new AlarmFixture().getAlarmInput();
            const created = await service.create(alarmInput);
            const id = created.getData().id;

            const result = await service.delete(id, alarmInput.getOwner());
            expect(result.isSuccessful()).to.be.true;

            const alarm = await service.get(id, alarmInput.getOwner());
            expect(alarm).to.be.undefined;
        });

        it("should not be able to get deleted alarm in getAll", async () => {
            const alarmInput = await new AlarmFixture().getAlarmInput();
            const created = await service.create(alarmInput);
            const id = created.getData().id;

            const result = await service.delete(id, alarmInput.getOwner());
            expect(result.isSuccessful()).to.be.true;

            const alarms = await service.getAll(alarmInput.getOwner());
            expect(alarms).to.be.empty;
        });

        it("should not be able to delete unexistant alarm", async () => {
            const user = await UserFixture.createUser();
            const result = await service.delete(123, user);

            expect(result.isSuccessful()).to.be.false;
            expect(result.getError()).to.eq(AlarmService.ALARM_NOT_FOUND_ERROR);
        });

        it("should not be able to delete other user's alarm", async () => {
            const alarm = await new AlarmFixture().createAlarm();
            const otherUser = await UserFixture.createUserWithUsername("other user");

            const result = await service.delete(alarm.id, otherUser);

            expect(result.isSuccessful()).to.be.false;
            expect(result.getError()).to.eq(AlarmService.ALARM_NOT_FOUND_ERROR);
        });

    });

});
