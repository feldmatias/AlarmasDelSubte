import {anyOfClass, capture, instance, mock, when} from "ts-mockito";
import {AlarmService} from "../../src/alarms/AlarmService";
import {AlarmResolver} from "../../src/alarms/resolvers/AlarmResolver";
import {Result} from "../../src/utils/Result";
import {expect} from "chai";
import {Alarm} from "../../src/alarms/entities/Alarm";
import {AlarmInput} from "../../src/alarms/entities/AlarmInput";
import {RequestContext} from "../../src/graphql/RequestContext";
import {RequestContextMock} from "../graphql/RequestContextMock";
import {AlarmNameValidation} from "../../src/alarms/validation/AlarmNameValidation";
import AlarmErrorHelper from "../../src/alarms/resolvers/AlarmErrorHelper";
import {AlarmDaysValidation} from "../../src/alarms/validation/AlarmDaysValidation";
import {AlarmTimeValidation} from "../../src/alarms/validation/AlarmTimeValidation";
import {AlarmSubwaysValidation} from "../../src/alarms/validation/AlarmSubwaysValidation";
import {AlarmOwnerValidation} from "../../src/alarms/validation/AlarmOwnerValidation";
import {AlarmPartialInput} from "../../src/alarms/entities/AlarmPartialInput";
import {ErrorHelper} from "../../src/utils/ErrorHelper";

const ALARM_NAME = "alarm";

describe("Alarm Resolver", () => {

    let service: AlarmService;
    let resolver: AlarmResolver;
    let requestContext: RequestContext;
    beforeEach(async () => {
        service = mock(AlarmService);
        resolver = new AlarmResolver(instance(service));
        requestContext = await RequestContextMock.mock();
    });

    context("Create alarm", () => {

        it("should return created alarm", async () => {
            const alarm = new Alarm();
            alarm.name = ALARM_NAME;

            when(service.create(anyOfClass(AlarmInput))).thenResolve(Result.Success(alarm));

            const result = await resolver.createAlarm(new AlarmInput(), requestContext);
            expect(result.name).to.eq(ALARM_NAME);
        });

        it("should create alarm with request user", async () => {
            when(service.create(anyOfClass(AlarmInput))).thenResolve(Result.Success(new Alarm()));

            await resolver.createAlarm(new AlarmInput(), requestContext);

            const [input] = capture(service.create).last();
            expect(input.getOwner()).to.deep.eq(requestContext.user);
        });

        context("errors", () => {

            it("should raise error when invalid alarm name", async () => {
                when(service.create(anyOfClass(AlarmInput)))
                    .thenResolve(Result.Error(AlarmNameValidation.ERROR));

                await expect(resolver.createAlarm(new AlarmInput(), requestContext))
                    .to.eventually.be.rejectedWith(AlarmErrorHelper.INVALID_ALARM_NAME_MESSAGE);
            });

            it("should raise error when invalid alarm days", async () => {
                when(service.create(anyOfClass(AlarmInput)))
                    .thenResolve(Result.Error(AlarmDaysValidation.ERROR));

                await expect(resolver.createAlarm(new AlarmInput(), requestContext))
                    .to.eventually.be.rejectedWith(AlarmErrorHelper.INVALID_ALARM_DAYS_MESSAGE);
            });

            it("should raise error when invalid alarm time range", async () => {
                when(service.create(anyOfClass(AlarmInput)))
                    .thenResolve(Result.Error(AlarmTimeValidation.ERROR));

                await expect(resolver.createAlarm(new AlarmInput(), requestContext))
                    .to.eventually.be.rejectedWith(AlarmErrorHelper.INVALID_ALARM_TIME_RANGE_MESSAGE);
            });

            it("should raise error when invalid alarm subways", async () => {
                when(service.create(anyOfClass(AlarmInput)))
                    .thenResolve(Result.Error(AlarmSubwaysValidation.ERROR));

                await expect(resolver.createAlarm(new AlarmInput(), requestContext))
                    .to.eventually.be.rejectedWith(AlarmErrorHelper.INVALID_ALARM_SUBWAYS_MESSAGE);
            });

            it("should raise error when invalid alarm owner", async () => {
                when(service.create(anyOfClass(AlarmInput)))
                    .thenResolve(Result.Error(AlarmOwnerValidation.ERROR));

                await expect(resolver.createAlarm(new AlarmInput(), requestContext))
                    .to.eventually.be.rejectedWith(AlarmErrorHelper.INVALID_ALARM_OWNER_MESSAGE);
            });

            it("should raise error when select unexistant subways for alarm", async () => {
                when(service.create(anyOfClass(AlarmInput)))
                    .thenResolve(Result.Error(AlarmService.SUBWAY_NOT_FOUND_ERROR));

                await expect(resolver.createAlarm(new AlarmInput(), requestContext))
                    .to.eventually.be.rejectedWith(AlarmErrorHelper.SUBWAY_NOT_FOUND_ERROR_MESSAGE);
            });

            it("should raise default error when unknown error", async () => {
                when(service.create(anyOfClass(AlarmInput)))
                    .thenResolve(Result.Error("error"));

                await expect(resolver.createAlarm(new AlarmInput(), requestContext))
                    .to.eventually.be.rejectedWith(ErrorHelper.DEFAULT_ERROR_MESSAGE);
            });

        });

    });

    context("Edit alarm", () => {

        const ALARM_ID = 90;

        it("should return edited alarm", async () => {
            const alarm = new Alarm();
            alarm.name = ALARM_NAME;

            when(service.edit(ALARM_ID, anyOfClass(AlarmPartialInput))).thenResolve(Result.Success(alarm));

            const result = await resolver.editAlarm(ALARM_ID, new AlarmPartialInput(), requestContext);
            expect(result.name).to.eq(ALARM_NAME);
        });

        it("should edit alarm with request user", async () => {
            when(service.edit(ALARM_ID, anyOfClass(AlarmPartialInput))).thenResolve(Result.Success(new Alarm()));

            await resolver.editAlarm(ALARM_ID, new AlarmPartialInput(), requestContext);

            const [, input] = capture(service.edit).last();
            expect(input.getOwner()).to.deep.eq(requestContext.user);
        });

        context("errors", () => {

            it("should raise error when invalid alarm name", async () => {
                when(service.edit(ALARM_ID, anyOfClass(AlarmPartialInput)))
                    .thenResolve(Result.Error(AlarmNameValidation.ERROR));

                await expect(resolver.editAlarm(ALARM_ID, new AlarmPartialInput(), requestContext))
                    .to.eventually.be.rejectedWith(AlarmErrorHelper.INVALID_ALARM_NAME_MESSAGE);
            });

            it("should raise error when invalid alarm days", async () => {
                when(service.edit(ALARM_ID, anyOfClass(AlarmPartialInput)))
                    .thenResolve(Result.Error(AlarmDaysValidation.ERROR));

                await expect(resolver.editAlarm(ALARM_ID, new AlarmPartialInput(), requestContext))
                    .to.eventually.be.rejectedWith(AlarmErrorHelper.INVALID_ALARM_DAYS_MESSAGE);
            });

            it("should raise error when invalid alarm time range", async () => {
                when(service.edit(ALARM_ID, anyOfClass(AlarmPartialInput)))
                    .thenResolve(Result.Error(AlarmTimeValidation.ERROR));

                await expect(resolver.editAlarm(ALARM_ID, new AlarmPartialInput(), requestContext))
                    .to.eventually.be.rejectedWith(AlarmErrorHelper.INVALID_ALARM_TIME_RANGE_MESSAGE);
            });

            it("should raise error when invalid alarm subways", async () => {
                when(service.edit(ALARM_ID, anyOfClass(AlarmPartialInput)))
                    .thenResolve(Result.Error(AlarmSubwaysValidation.ERROR));

                await expect(resolver.editAlarm(ALARM_ID, new AlarmPartialInput(), requestContext))
                    .to.eventually.be.rejectedWith(AlarmErrorHelper.INVALID_ALARM_SUBWAYS_MESSAGE);
            });

            it("should raise error when invalid alarm owner", async () => {
                when(service.edit(ALARM_ID, anyOfClass(AlarmPartialInput)))
                    .thenResolve(Result.Error(AlarmOwnerValidation.ERROR));

                await expect(resolver.editAlarm(ALARM_ID, new AlarmPartialInput(), requestContext))
                    .to.eventually.be.rejectedWith(AlarmErrorHelper.INVALID_ALARM_OWNER_MESSAGE);
            });

            it("should raise error when select unexistant subways for alarm", async () => {
                when(service.edit(ALARM_ID, anyOfClass(AlarmPartialInput)))
                    .thenResolve(Result.Error(AlarmService.SUBWAY_NOT_FOUND_ERROR));

                await expect(resolver.editAlarm(ALARM_ID, new AlarmPartialInput(), requestContext))
                    .to.eventually.be.rejectedWith(AlarmErrorHelper.SUBWAY_NOT_FOUND_ERROR_MESSAGE);
            });

            it("should raise error when selected alarm does not exist", async () => {
                when(service.edit(ALARM_ID, anyOfClass(AlarmPartialInput)))
                    .thenResolve(Result.Error(AlarmService.ALARM_NOT_FOUND_ERROR));

                await expect(resolver.editAlarm(ALARM_ID, new AlarmPartialInput(), requestContext))
                    .to.eventually.be.rejectedWith(AlarmErrorHelper.ALARM_NOT_FOUND_ERROR_MESSAGE);
            });

            it("should raise default error when unknown error", async () => {
                when(service.edit(ALARM_ID, anyOfClass(AlarmPartialInput)))
                    .thenResolve(Result.Error("error"));

                await expect(resolver.editAlarm(ALARM_ID, new AlarmPartialInput(), requestContext))
                    .to.eventually.be.rejectedWith(ErrorHelper.DEFAULT_ERROR_MESSAGE);
            });

        });

    });

    context("Get alarm", () => {

        const ALARM_ID = 123;

        it("should return alarm if exists", async () => {
            const alarm = new Alarm();
            alarm.name = ALARM_NAME;

            when(service.get(ALARM_ID, requestContext.user)).thenResolve(alarm);

            const result = await resolver.getAlarm(ALARM_ID, requestContext);
            expect(result.name).to.eq(ALARM_NAME);
        });

        it("should throw error if alarm does not exist", async () => {
            when(service.get(ALARM_ID, requestContext.user)).thenResolve(undefined);

            await expect(resolver.getAlarm(ALARM_ID, requestContext))
                .to.eventually.be.rejectedWith(AlarmErrorHelper.ALARM_NOT_FOUND_ERROR_MESSAGE);
        });

    });

    context("Get all alarms", () => {

        it("should return empty array if service returns empty array", async () => {
            when(service.getAll(requestContext.user)).thenResolve([]);

            const alarms = await resolver.getAlarms(requestContext);

            expect(alarms).to.be.empty;
        });

        it("should return alarm if service returns an alarm", async () => {
            const alarm = new Alarm();
            alarm.name = "alarm";
            when(service.getAll(requestContext.user)).thenResolve([alarm]);

            const alarms = await resolver.getAlarms(requestContext);

            expect(alarms).to.have.length(1);
            expect(alarms[0].name).to.eq("alarm");
        });

        it("should return n alarms if service returns n alarms", async () => {
            const count = 10;
            const mock = new Array<Alarm>();

            for (let i = 0; i < count; i++) {
                const alarm = new Alarm();
                alarm.name = i.toString();
                mock.push(alarm);
            }

            when(service.getAll(requestContext.user)).thenResolve(mock);

            const alarms = await resolver.getAlarms(requestContext);

            expect(alarms).to.have.length(count);
            const alarmNames = alarms.map(alarm => alarm.name);
            for (let i = 0; i < count; i++) {
                expect(alarmNames).to.include(i.toString());
            }
        });
    });

    context("Delete alarm", () => {

        const ALARM_ID = 927;

        it("should return deleted alarm id", async () => {
            when(service.delete(ALARM_ID, requestContext.user)).thenResolve(Result.Success(ALARM_ID));

            const result = await resolver.deleteAlarm(ALARM_ID, requestContext);
            expect(result).to.eq(ALARM_ID);
        });

        it("should throw error if alarm not found", async () => {
            when(service.delete(ALARM_ID, requestContext.user))
                .thenResolve(Result.Error(AlarmService.ALARM_NOT_FOUND_ERROR));

            await expect(resolver.deleteAlarm(ALARM_ID, requestContext))
                .to.eventually.be.rejectedWith(AlarmErrorHelper.ALARM_NOT_FOUND_ERROR_MESSAGE);
        });

    });

});