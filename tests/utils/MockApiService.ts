import {Axios, AXIOS_DI} from "../../src/utils/ApiService";
import {Container} from "typedi";
import {instance, mock, when} from "ts-mockito";
import {AxiosInstance} from "axios";

class MockApiService {

    private axiosMock?: Axios;
    private realAxios?: Axios;

    public mock(): void {
        this.realAxios = Container.get(AXIOS_DI);
        this.axiosMock = mock<AxiosInstance>();
        Container.set(AXIOS_DI, instance(this.axiosMock));
    }

    public reset(): void {
        Container.set(AXIOS_DI, this.realAxios);
    }

    public mockGetRequest(url: string, data: any): void { // eslint-disable-line  @typescript-eslint/no-explicit-any
        if (!this.axiosMock) {
            throw new Error("Api Service is not mocked");
        }

        when(this.axiosMock.get(url)).thenResolve(
            {
                data: data,
                status: 200,
                statusText: "",
                headers: [],
                config: {}
            });
    }

}

export default new MockApiService();