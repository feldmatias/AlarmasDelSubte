import {Container} from "typedi";
import {AlarmService} from "../../../src/alarms/AlarmService";
import {expect} from "chai";
import {AlarmDaysValidation} from "../../../src/alarms/validation/AlarmDaysValidation";
import {AlarmTimeValidation} from "../../../src/alarms/validation/AlarmTimeValidation";
import {AlarmSubwaysValidation} from "../../../src/alarms/validation/AlarmSubwaysValidation";
import {AlarmFixture} from "../AlarmFixture";
import {UserFixture} from "../../users/UserFixture";
import {Alarm} from "../../../src/alarms/entities/Alarm";
import {AlarmPartialInput} from "../../../src/alarms/entities/AlarmPartialInput";
import {SubwayFixture} from "../../subways/SubwayFixture";
import {AlarmAssert} from "../AlarmAssert";

describe("Alarm Service", () => {

    let service: AlarmService;

    beforeEach(async () => {
        service = Container.get(AlarmService);
    });

    context("edit alarm", () => {

        let originalAlarm: Alarm;
        let editAlarmInput: AlarmPartialInput;
        beforeEach(async () => {
            originalAlarm = await new AlarmFixture().createAlarm();
            editAlarmInput = new AlarmPartialInput();
            editAlarmInput.setOwner(originalAlarm.owner);
        });

        it("should not be able to edit alarm that does not exist", async () => {
            const result = await service.edit(123, editAlarmInput);
            expect(result.isSuccessful()).to.be.false;
            expect(result.getError()).to.eq(AlarmService.ALARM_NOT_FOUND_ERROR);
        });

        it("should not be able to edit other user's alarm", async () => {
            const otherUser = await UserFixture.createUserWithUsername("other user");
            editAlarmInput.setOwner(otherUser);

            const result = await service.edit(originalAlarm.id, editAlarmInput);
            expect(result.isSuccessful()).to.be.false;
            expect(result.getError()).to.eq(AlarmService.ALARM_NOT_FOUND_ERROR);
        });

        it("edit with empty input should not change anything", async () => {
            const result = await service.edit(originalAlarm.id, editAlarmInput);

            expect(result.isSuccessful()).to.be.true;
            AlarmAssert.assertAlarmEquals(result.getData(), originalAlarm);
        });

        it("get alarm after edit with empty input should not change anything", async () => {
            await service.edit(originalAlarm.id, editAlarmInput);
            const alarm = await service.get(originalAlarm.id, originalAlarm.owner);
            AlarmAssert.assertAlarmEquals(alarm, originalAlarm);
        });

        it("should be able to edit all properties at once", async () => {
            const newSubway = await SubwayFixture.createSubway("new subway");
            editAlarmInput.name = "new name";
            editAlarmInput.days = ["sunday"];
            editAlarmInput.start = "00:01";
            editAlarmInput.end = "23:03";
            editAlarmInput.subwayLines = [newSubway.line];

            const result = await service.edit(originalAlarm.id, editAlarmInput);

            expect(result.isSuccessful()).to.be.true;
            expect(result.getData().name).to.eq(editAlarmInput.name);
            expect(result.getData().days).to.deep.eq(editAlarmInput.days);
            expect(result.getData().start).to.eq(editAlarmInput.start);
            expect(result.getData().end).to.eq(editAlarmInput.end);
            expect(result.getData().subways()[0].line).to.eq(newSubway.line);
        });

        it("edit alarm does not change id", async () => {
            editAlarmInput.name = "new name";

            const result = await service.edit(originalAlarm.id, editAlarmInput);

            expect(result.isSuccessful()).to.be.true;
            expect(result.getData().id).to.eq(originalAlarm.id);
        });

        it("edit alarm does not change owner", async () => {
            editAlarmInput.name = "new name";

            const result = await service.edit(originalAlarm.id, editAlarmInput);

            expect(result.isSuccessful()).to.be.true;
            expect(result.getData().owner).to.deep.eq(originalAlarm.owner);
        });

        context("edit alarm name", () => {

            const NEW_NAME = "new name";

            it("should be able to edit alarm name", async () => {
                editAlarmInput.name = NEW_NAME;
                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.isSuccessful()).to.be.true;
                expect(result.getData().name).to.eq(NEW_NAME);
            });

            it("get alarm returns edited name", async () => {
                editAlarmInput.name = NEW_NAME;
                await service.edit(originalAlarm.id, editAlarmInput);

                const alarm = await service.get(originalAlarm.id, originalAlarm.owner);

                expect(alarm?.name).to.eq(NEW_NAME);
            });

            it("should not edit alarm name with empty value", async () => {
                editAlarmInput.name = "";
                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.isSuccessful()).to.be.true;
                expect(result.getData().name).to.eq(originalAlarm.name);
            });

            it("get alarm returns original name when not edited", async () => {
                editAlarmInput.name = "";
                await service.edit(originalAlarm.id, editAlarmInput);

                const alarm = await service.get(originalAlarm.id, originalAlarm.owner);

                expect(alarm?.name).to.eq(originalAlarm.name);
            });

        });

        context("edit alarm days", () => {

            const NEW_DAYS = AlarmDaysValidation.VALID_DAYS.slice(0, 3);

            it("should be able to edit alarm days with all valid days", async () => {
                editAlarmInput.days = AlarmDaysValidation.VALID_DAYS;
                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.isSuccessful()).to.be.true;
                expect(result.getData().days).to.deep.eq(AlarmDaysValidation.VALID_DAYS);
            });

            it("should be able to edit alarm days with some valid days", async () => {
                editAlarmInput.days = NEW_DAYS;
                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.isSuccessful()).to.be.true;
                expect(result.getData().days).to.deep.eq(NEW_DAYS);
            });

            it("get alarm returns edited days", async () => {
                editAlarmInput.days = NEW_DAYS;
                await service.edit(originalAlarm.id, editAlarmInput);

                const alarm = await service.get(originalAlarm.id, originalAlarm.owner);

                expect(alarm?.days).to.deep.eq(NEW_DAYS);
            });

            it("should not edit alarm days with empty array", async () => {
                editAlarmInput.days = [];
                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmDaysValidation.ERROR);
            });

            it("should not edit alarm days with invalid day", async () => {
                editAlarmInput.days = ["invalid"];
                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmDaysValidation.ERROR);
            });

            it("should not edit alarm days with valid and invalid days", async () => {
                editAlarmInput.days = ["invalid"];
                editAlarmInput.days.push(...NEW_DAYS);
                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmDaysValidation.ERROR);
            });

            it("get alarm returns original days when edit fails", async () => {
                editAlarmInput.days = [];
                const result = await service.edit(originalAlarm.id, editAlarmInput);
                expect(result.isSuccessful()).to.be.false;

                const alarm = await service.get(originalAlarm.id, originalAlarm.owner);

                expect(alarm?.days).to.deep.eq(originalAlarm.days);
            });

        });

        context("edit alarm start time", () => {

            const NEW_START_TIME = "00:00";

            it("should be able to edit alarm start time", async () => {
                editAlarmInput.start = NEW_START_TIME;
                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.isSuccessful()).to.be.true;
                expect(result.getData().start).to.eq(NEW_START_TIME);
            });

            it("get alarm returns edited start time", async () => {
                editAlarmInput.start = NEW_START_TIME;
                await service.edit(originalAlarm.id, editAlarmInput);

                const alarm = await service.get(originalAlarm.id, originalAlarm.owner);

                expect(alarm?.start).to.eq(NEW_START_TIME);
            });

            it("should not edit alarm start time with empty string", async () => {
                editAlarmInput.start = "";
                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.isSuccessful()).to.be.true;
                expect(result.getData().start).to.eq(originalAlarm.start);
            });

            it('should not edit alarm with no start time', async () => {
                editAlarmInput.start = "1234";
                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmTimeValidation.ERROR);
            });

            ["1", "123", "60", "61", "-1", "-10", "69", "70"].forEach(minutes => {
                it(`should not edit alarm with invalid minutes '${minutes}' in start time`, async () => {
                    editAlarmInput.start = `00:${minutes}`;
                    const result = await service.edit(originalAlarm.id, editAlarmInput);

                    expect(result.isSuccessful()).to.be.false;
                    expect(result.getError()).to.eq(AlarmTimeValidation.ERROR);
                });
            });

            ["1", "123", "24", "25", "-1", "-10", "30"].forEach(hours => {
                it(`should not edit alarm with invalid hours '${hours}' in start time`, async () => {
                    editAlarmInput.start = `${hours}:00`;
                    const result = await service.edit(originalAlarm.id, editAlarmInput);

                    expect(result.isSuccessful()).to.be.false;
                    expect(result.getError()).to.eq(AlarmTimeValidation.ERROR);
                });
            });

            it("get alarm returns original start time when edit fails", async () => {
                editAlarmInput.start = "invalid";
                const result = await service.edit(originalAlarm.id, editAlarmInput);
                expect(result.isSuccessful()).to.be.false;

                const alarm = await service.get(originalAlarm.id, originalAlarm.owner);

                expect(alarm?.start).to.eq(originalAlarm.start);
            });

        });

        context("edit alarm end time", () => {

            const NEW_END_TIME = "23:00";

            it("should be able to edit alarm end time", async () => {
                editAlarmInput.end = NEW_END_TIME;
                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.isSuccessful()).to.be.true;
                expect(result.getData().end).to.eq(NEW_END_TIME);
            });

            it("get alarm returns edited end time", async () => {
                editAlarmInput.end = NEW_END_TIME;
                await service.edit(originalAlarm.id, editAlarmInput);

                const alarm = await service.get(originalAlarm.id, originalAlarm.owner);

                expect(alarm?.end).to.eq(NEW_END_TIME);
            });

            it("should not edit alarm end time with empty string", async () => {
                editAlarmInput.end = "";
                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.isSuccessful()).to.be.true;
                expect(result.getData().end).to.eq(originalAlarm.end);
            });

            it('should not edit alarm with no end time', async () => {
                editAlarmInput.end = "1234";
                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmTimeValidation.ERROR);
            });

            ["1", "123", "60", "61", "-1", "-10", "69", "70"].forEach(minutes => {
                it(`should not edit alarm with invalid minutes '${minutes}' in end time`, async () => {
                    editAlarmInput.end = `00:${minutes}`;
                    const result = await service.edit(originalAlarm.id, editAlarmInput);

                    expect(result.isSuccessful()).to.be.false;
                    expect(result.getError()).to.eq(AlarmTimeValidation.ERROR);
                });
            });

            ["1", "123", "24", "25", "-1", "-10", "30"].forEach(hours => {
                it(`should not edit alarm with invalid hours '${hours}' in end time`, async () => {
                    editAlarmInput.end = `${hours}:00`;
                    const result = await service.edit(originalAlarm.id, editAlarmInput);

                    expect(result.isSuccessful()).to.be.false;
                    expect(result.getError()).to.eq(AlarmTimeValidation.ERROR);
                });
            });

            it("get alarm returns original end time when edit fails", async () => {
                editAlarmInput.end = "invalid";
                const result = await service.edit(originalAlarm.id, editAlarmInput);
                expect(result.isSuccessful()).to.be.false;

                const alarm = await service.get(originalAlarm.id, originalAlarm.owner);

                expect(alarm?.end).to.eq(originalAlarm.end);
            });

        });

        context("edit alarm time range", () => {

            const NEW_START_TIME = "15:00";
            const NEW_END_TIME = "16:00";

            it("should be able to edit alarm time range", async () => {
                editAlarmInput.start = NEW_START_TIME;
                editAlarmInput.end = NEW_END_TIME;
                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.isSuccessful()).to.be.true;
                expect(result.getData().start).to.eq(NEW_START_TIME);
                expect(result.getData().end).to.eq(NEW_END_TIME);
            });

            it("get alarm returns edited time range", async () => {
                editAlarmInput.start = NEW_START_TIME;
                editAlarmInput.end = NEW_END_TIME;
                await service.edit(originalAlarm.id, editAlarmInput);

                const alarm = await service.get(originalAlarm.id, originalAlarm.owner);

                expect(alarm?.start).to.eq(NEW_START_TIME);
                expect(alarm?.end).to.eq(NEW_END_TIME);
            });

            it("should not be able to edit alarm time range when start is equal to end", async () => {
                editAlarmInput.start = NEW_START_TIME;
                editAlarmInput.end = editAlarmInput.start;
                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmTimeValidation.ERROR);
            });

            it("should not be able to edit alarm time range when start is greater to end", async () => {
                editAlarmInput.start = NEW_END_TIME;
                editAlarmInput.end = NEW_START_TIME;
                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmTimeValidation.ERROR);
            });

            it("get alarm returns edited time range when validation fails", async () => {
                editAlarmInput.start = NEW_END_TIME;
                editAlarmInput.end = NEW_START_TIME;
                const result = await service.edit(originalAlarm.id, editAlarmInput);
                expect(result.isSuccessful()).to.be.false;

                const alarm = await service.get(originalAlarm.id, originalAlarm.owner);

                expect(alarm?.start).to.eq(originalAlarm.start);
                expect(alarm?.end).to.eq(originalAlarm.end);
            });

        });

        context("edit alarm subways", () => {

            it("should be able to edit alarm subways with one subway", async () => {
                const subway = await SubwayFixture.createSubway();
                editAlarmInput.subwayLines = [subway.line];

                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.isSuccessful()).to.be.true;
                expect(result.getData().subways()).to.have.length(1);
                expect(result.getData().subways()[0].line).to.eq(subway.line);
            });

            it("should be able to edit alarm subways with multiple subways", async () => {
                const count = 3;
                editAlarmInput.subwayLines = [];

                for (let i = 0; i < count; i++) {
                    const subway = await SubwayFixture.createSubway(i.toString());
                    editAlarmInput.subwayLines.push(subway.line);
                }

                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.getData().subways()).to.have.length(count);
                const subwayLines = result.getData().subways().map(subway => subway.line);
                for (let i = 0; i < count; i++) {
                    expect(subwayLines).to.include(i.toString());
                }
            });

            it("should be able to edit alarm subways with multiple subways and current subway", async () => {
                const count = 3;
                const originalSubway = originalAlarm.subways()[0].line;
                editAlarmInput.subwayLines = [originalSubway];

                for (let i = 0; i < count; i++) {
                    const subway = await SubwayFixture.createSubway(i.toString());
                    editAlarmInput.subwayLines.push(subway.line);
                }

                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.getData().subways()).to.have.length(count + 1);
                const subwayLines = result.getData().subways().map(subway => subway.line);
                for (let i = 0; i < count; i++) {
                    expect(subwayLines).to.include(i.toString());
                }
                expect(subwayLines).to.include(originalSubway);
            });

            it("get alarm should return edited subways", async () => {
                const count = 3;
                editAlarmInput.subwayLines = [];

                for (let i = 0; i < count; i++) {
                    const subway = await SubwayFixture.createSubway(i.toString());
                    editAlarmInput.subwayLines.push(subway.line);
                }

                await service.edit(originalAlarm.id, editAlarmInput);

                const alarm = await service.get(originalAlarm.id, originalAlarm.owner);

                expect(alarm?.subways()).to.have.length(count);
                const subwayLines = alarm?.subways().map(subway => subway.line);
                for (let i = 0; i < count; i++) {
                    expect(subwayLines).to.include(i.toString());
                }
            });

            it("should not be able to edit alarm subways with empty array", async () => {
                editAlarmInput.subwayLines = [];

                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmSubwaysValidation.ERROR);
            });

            it("should not be able to edit alarm subways with unexistant subway", async () => {
                editAlarmInput.subwayLines = ["invalid"];

                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmService.SUBWAY_NOT_FOUND_ERROR);
            });

            it("should not be able to edit alarm subways with existant and unexistant subway", async () => {
                const subway = await SubwayFixture.createSubway();
                editAlarmInput.subwayLines = ["invalid", subway.line];

                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.isSuccessful()).to.be.false;
                expect(result.getError()).to.eq(AlarmService.SUBWAY_NOT_FOUND_ERROR);
            });

            it("get alarm should return original subways if edit fails", async () => {
                editAlarmInput.subwayLines = [];

                const result = await service.edit(originalAlarm.id, editAlarmInput);
                expect(result.isSuccessful()).to.be.false;

                const alarm = await service.get(originalAlarm.id, originalAlarm.owner);

                expect(alarm?.subways()).to.deep.eq(originalAlarm.subways());
            });

        });
    });

});
