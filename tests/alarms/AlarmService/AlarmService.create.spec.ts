import {Container} from "typedi";
import {AlarmService} from "../../../src/alarms/AlarmService";
import {expect} from "chai";
import {AlarmDaysValidation} from "../../../src/alarms/validation/AlarmDaysValidation";
import {AlarmTimeValidation} from "../../../src/alarms/validation/AlarmTimeValidation";
import {AlarmNameValidation} from "../../../src/alarms/validation/AlarmNameValidation";
import {AlarmSubwaysValidation} from "../../../src/alarms/validation/AlarmSubwaysValidation";
import {AlarmOwnerValidation} from "../../../src/alarms/validation/AlarmOwnerValidation";
import {AlarmFixture} from "../AlarmFixture";
import {SubwayFixture} from "../../subways/SubwayFixture";

describe("Alarm Service", () => {

    let service: AlarmService;

    beforeEach(async () => {
        service = Container.get(AlarmService);
    });

    context("create alarm", () => {

        it("should create valid alarm successfully", async () => {
            const alarm = await AlarmFixture.getDefaultAlarmInput();

            const result = await service.create(alarm);

            expect(result.isSuccessful()).to.be.true;
        });

        it("should return alarm with an id", async () => {
            const alarm = await AlarmFixture.getDefaultAlarmInput();

            const result = await service.create(alarm);

            expect(result.getData().id).to.not.be.undefined;
        });

        it("should return alarm with correct subway", async () => {
            const alarm = await AlarmFixture.getDefaultAlarmInput();

            const result = await service.create(alarm);

            expect(result.getData().subways).to.have.length(1);
            expect(result.getData().subways[0].line).to.eq(AlarmFixture.ALARM_SUBWAY_LINE);
        });

        it("should create alarm with multiple subways", async () => {
            const count = 3;
            const alarm = await AlarmFixture.getDefaultAlarmInput(true, false);
            alarm.subwayLines = [];

            for (let i = 0; i < count; i++) {
                const subway = await SubwayFixture.createSubway(i.toString());
                alarm.subwayLines.push(subway.line);
            }

            const result = await service.create(alarm);

            expect(result.getData().subways).to.have.length(count);
            const subwayLines = result.getData().subways.map(subway => subway.line);
            for (let i = 0; i < count; i++) {
                expect(subwayLines).to.include(i.toString());
            }
        });

        it("should be able to get created alarm", async () => {
            const alarmInput = await AlarmFixture.getDefaultAlarmInput();
            const created = await service.create(alarmInput);
            const id = created.getData().id;

            const alarm = await service.get(id, alarmInput.getOwner());

            expect(alarm).to.not.be.undefined;
        });

        it("should be able to get created alarm with subways", async () => {
            const alarmInput = await AlarmFixture.getDefaultAlarmInput();
            const created = await service.create(alarmInput);
            const id = created.getData().id;

            const alarm = await service.get(id, alarmInput.getOwner());

            expect(alarm?.subways).to.have.length(1);
            expect(alarm?.subways[0].line).to.eq(AlarmFixture.ALARM_SUBWAY_LINE);
        });

        context("validations", () => {

            it('should not create alarm without name', async () => {
                const alarm = await AlarmFixture.getDefaultAlarmInput();
                alarm.name = "";

                const result = await service.create(alarm);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmNameValidation.ERROR);
            });

            it('should not create alarm without days', async () => {
                const alarm = await AlarmFixture.getDefaultAlarmInput();
                alarm.days = [];

                const result = await service.create(alarm);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmDaysValidation.ERROR);
            });

            it('should not create alarm with invalid day', async () => {
                const alarm = await AlarmFixture.getDefaultAlarmInput();
                alarm.days = ["invalid"];

                const result = await service.create(alarm);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmDaysValidation.ERROR);
            });

            it('should not create alarm with invalid days', async () => {
                const alarm = await AlarmFixture.getDefaultAlarmInput();
                alarm.days = ["invalid", "invalid2"];

                const result = await service.create(alarm);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmDaysValidation.ERROR);
            });

            it('should not create alarm with valid and invalid day', async () => {
                const alarm = await AlarmFixture.getDefaultAlarmInput();
                alarm.days = [AlarmDaysValidation.VALID_DAYS[0], "invalid"];

                const result = await service.create(alarm);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmDaysValidation.ERROR);
            });

            it('should create alarm with all valid days', async () => {
                const alarm = await AlarmFixture.getDefaultAlarmInput();
                alarm.days = AlarmDaysValidation.VALID_DAYS;

                const result = await service.create(alarm);

                expect(result.isSuccessful()).to.be.true;
            });

            it('should create alarm with some valid days', async () => {
                const alarm = await AlarmFixture.getDefaultAlarmInput();
                alarm.days = AlarmDaysValidation.VALID_DAYS.slice(0, 3);

                const result = await service.create(alarm);

                expect(result.isSuccessful()).to.be.true;
            });

            it('should not create alarm with empty start time', async () => {
                const alarm = await AlarmFixture.getDefaultAlarmInput();
                alarm.start = "";

                const result = await service.create(alarm);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmTimeValidation.ERROR);
            });

            it('should not create alarm with no start time', async () => {
                const alarm = await AlarmFixture.getDefaultAlarmInput();
                alarm.start = "1234";

                const result = await service.create(alarm);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmTimeValidation.ERROR);
            });

            ["1", "123", "60", "61", "-1", "-10", "69", "70"].forEach(minutes => {
                it(`should not create alarm with invalid minutes '${minutes} in start time`, async () => {
                    const alarm = await AlarmFixture.getDefaultAlarmInput();
                    alarm.start = `00:${minutes}`;

                    const result = await service.create(alarm);

                    expect(result.isSuccessful()).to.be.false;
                    expect(result.getError()).to.eq(AlarmTimeValidation.ERROR);
                });
            });

            ["1", "123", "24", "25", "-1", "-10", "30"].forEach(hours => {
                it(`should not create alarm with invalid hours '${hours} in start time`, async () => {
                    const alarm = await AlarmFixture.getDefaultAlarmInput();
                    alarm.start = `${hours}:00`;

                    const result = await service.create(alarm);

                    expect(result.isSuccessful()).to.be.false;
                    expect(result.getError()).to.eq(AlarmTimeValidation.ERROR);
                });
            });

            it('should not create alarm with empty end time', async () => {
                const alarm = await AlarmFixture.getDefaultAlarmInput();
                alarm.end = "";

                const result = await service.create(alarm);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmTimeValidation.ERROR);
            });

            it('should not create alarm with no end time', async () => {
                const alarm = await AlarmFixture.getDefaultAlarmInput();
                alarm.end = "1643";

                const result = await service.create(alarm);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmTimeValidation.ERROR);
            });

            ["1", "123", "60", "61", "-1", "-10", "69", "70"].forEach(minutes => {
                it(`should not create alarm with invalid minutes '${minutes} in end time`, async () => {
                    const alarm = await AlarmFixture.getDefaultAlarmInput();
                    alarm.end = `23:${minutes}`;

                    const result = await service.create(alarm);

                    expect(result.isSuccessful()).to.be.false;
                    expect(result.getError()).to.eq(AlarmTimeValidation.ERROR);
                });
            });

            ["1", "123", "24", "25", "-1", "-10", "30"].forEach(hours => {
                it(`should not create alarm with invalid hours '${hours} in end time`, async () => {
                    const alarm = await AlarmFixture.getDefaultAlarmInput();
                    alarm.end = `${hours}:59`;

                    const result = await service.create(alarm);

                    expect(result.isSuccessful()).to.be.false;
                    expect(result.getError()).to.eq(AlarmTimeValidation.ERROR);
                });
            });

            it('should not create alarm with end time before start time', async () => {
                const alarm = await AlarmFixture.getDefaultAlarmInput();
                alarm.start = "12:00";
                alarm.end = "11:00";

                const result = await service.create(alarm);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmTimeValidation.ERROR);
            });

            it('should not create alarm with end time equal start time', async () => {
                const alarm = await AlarmFixture.getDefaultAlarmInput();
                alarm.start = "12:00";
                alarm.end = alarm.start;

                const result = await service.create(alarm);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmTimeValidation.ERROR);
            });

            it('should not create alarm without subways', async () => {
                const alarm = await AlarmFixture.getDefaultAlarmInput();
                alarm.subwayLines = [];

                const result = await service.create(alarm);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmSubwaysValidation.ERROR);
            });

            it('should not create alarm with unexistant subways', async () => {
                const alarm = await AlarmFixture.getDefaultAlarmInput();
                alarm.subwayLines = ["4"];

                const result = await service.create(alarm);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmService.SUBWAY_NOT_FOUND_ERROR);
            });

            it('should not create alarm with existant and unexistant subways', async () => {
                const alarm = await AlarmFixture.getDefaultAlarmInput();
                alarm.subwayLines.push("5");

                const result = await service.create(alarm);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmService.SUBWAY_NOT_FOUND_ERROR);
            });

            it('should not create alarm without owner', async () => {
                const alarm = await AlarmFixture.getDefaultAlarmInput(false);

                const result = await service.create(alarm);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmOwnerValidation.ERROR);
            });
        });

    });

});
