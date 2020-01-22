import {Container} from "typedi";
import {AlarmService} from "../../src/alarms/AlarmService";
import {expect} from "chai";
import {AlarmDaysValidation} from "../../src/alarms/validation/AlarmDaysValidation";
import {AlarmTimeValidation} from "../../src/alarms/validation/AlarmTimeValidation";
import {AlarmNameValidation} from "../../src/alarms/validation/AlarmNameValidation";
import {AlarmSubwaysValidation} from "../../src/alarms/validation/AlarmSubwaysValidation";
import {AlarmOwnerValidation} from "../../src/alarms/validation/AlarmOwnerValidation";
import {AlarmFixture} from "./AlarmFixture";
import {User} from "../../src/users/entities/User";
import {UserFixture} from "../users/UserFixture";
import {Alarm} from "../../src/alarms/entities/Alarm";
import {AlarmPartialInput} from "../../src/alarms/entities/AlarmPartialInput";
import {SubwayFixture} from "../subways/SubwayFixture";

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
            expect(alarm?.subways).to.deep.eq(expected.subways);
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
            expect(alarms[0].subways).to.deep.eq(created.getData().subways);
        });
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

    context("edit alarm", () => {

        let originalAlarm: Alarm;
        let editAlarmInput: AlarmPartialInput;
        beforeEach(async () => {
            originalAlarm = await AlarmFixture.createAlarm();
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
            expect(result.getData()).to.deep.eq(originalAlarm);
        });

        it("get alarm after edit with empty input should not change anything", async () => {
            await service.edit(originalAlarm.id, editAlarmInput);
            const alarm = await service.get(originalAlarm.id, originalAlarm.owner);
            expect(alarm).to.deep.eq(originalAlarm);
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
            expect(result.getData().subways[0].line).to.eq(newSubway.line);
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
                it(`should not edit alarm with invalid minutes '${minutes} in start time`, async () => {
                    editAlarmInput.start = `00:${minutes}`;
                    const result = await service.edit(originalAlarm.id, editAlarmInput);

                    expect(result.isSuccessful()).to.be.false;
                    expect(result.getError()).to.eq(AlarmTimeValidation.ERROR);
                });
            });

            ["1", "123", "24", "25", "-1", "-10", "30"].forEach(hours => {
                it(`should not edit alarm with invalid hours '${hours} in start time`, async () => {
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
                it(`should not edit alarm with invalid minutes '${minutes} in end time`, async () => {
                    editAlarmInput.end = `00:${minutes}`;
                    const result = await service.edit(originalAlarm.id, editAlarmInput);

                    expect(result.isSuccessful()).to.be.false;
                    expect(result.getError()).to.eq(AlarmTimeValidation.ERROR);
                });
            });

            ["1", "123", "24", "25", "-1", "-10", "30"].forEach(hours => {
                it(`should not edit alarm with invalid hours '${hours} in end time`, async () => {
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
                expect(result.getData().subways).to.have.length(1);
                expect(result.getData().subways[0].line).to.eq(subway.line);
            });

            it("should be able to edit alarm subways with multiple subways", async () => {
                const count = 3;
                editAlarmInput.subwayLines = [];

                for (let i = 0; i < count; i++) {
                    const subway = await SubwayFixture.createSubway(i.toString());
                    editAlarmInput.subwayLines.push(subway.line);
                }

                const result = await service.edit(originalAlarm.id, editAlarmInput);

                expect(result.getData().subways).to.have.length(count);
                const subwayLines = result.getData().subways.map(subway => subway.line);
                for (let i = 0; i < count; i++) {
                    expect(subwayLines).to.include(i.toString());
                }
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

                expect(alarm?.subways).to.have.length(count);
                const subwayLines = alarm?.subways.map(subway => subway.line);
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

                expect(alarm?.subways).to.deep.eq(originalAlarm.subways);
            });

        });
    });

    context("delete alarm", () => {

        it("should delete alarm successfully", async () => {
            const alarmInput = await AlarmFixture.getDefaultAlarmInput();
            const created = await service.create(alarmInput);
            const id = created.getData().id;

            const result = await service.delete(id, alarmInput.getOwner());

            expect(result.isSuccessful()).to.be.true;
            expect(result.getData()).to.eq(id);
        });

        it("should not be able to get deleted alarm", async () => {
            const alarmInput = await AlarmFixture.getDefaultAlarmInput();
            const created = await service.create(alarmInput);
            const id = created.getData().id;

            const result = await service.delete(id, alarmInput.getOwner());
            expect(result.isSuccessful()).to.be.true;

            const alarm = await service.get(id, alarmInput.getOwner());
            expect(alarm).to.be.undefined;
        });

        it("should not be able to get deleted alarm in getAll", async () => {
            const alarmInput = await AlarmFixture.getDefaultAlarmInput();
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
            const alarm = await AlarmFixture.createAlarm();
            const otherUser = await UserFixture.createUserWithUsername("other user");

            const result = await service.delete(alarm.id, otherUser);

            expect(result.isSuccessful()).to.be.false;
            expect(result.getError()).to.eq(AlarmService.ALARM_NOT_FOUND_ERROR);
        });

    });

});
