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

const ALARM_NAME = "alarm";

describe("Alarm Resolver", () => {

    let service: AlarmService;
    let resolver: AlarmResolver;
    beforeEach(() => {
        service = mock(AlarmService);
        resolver = new AlarmResolver(instance(service));
    });

    context("Create alarm", () => {

        let requestContext: RequestContext;
        beforeEach(async () => {
            requestContext = await RequestContextMock.mock();
        });

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
                    .to.eventually.be.rejectedWith(AlarmErrorHelper.SUBWAY_NOT_FOUND_MESSAGE);
            });

        });

    });

    context("Get alarm", () => {

        const ALARM_ID = 123;

        let requestContext: RequestContext;
        beforeEach(async () => {
            requestContext = await RequestContextMock.mock();
        });

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

});