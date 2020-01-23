import {Container, Inject, Service} from "typedi";
import axios, {AxiosInstance} from 'axios';
import {Result} from "./Result";
import {deserialize} from "typescript-json-serializer";

export const AXIOS_DI = "Axios";
export type Axios = AxiosInstance;
Container.set(AXIOS_DI, axios.create());

@Service()
export class ApiService {

    public constructor(@Inject(AXIOS_DI) private axiosInstance: Axios) {
    }

    public async get<T>(url: string, type: new() => T): Promise<Result<T>> {
        try {
            const response = await this.axiosInstance.get(url);
            const data = deserialize(response.data, type);
            return Result.Success(data);
        } catch (error) {
            console.log(error.message);
            return Result.Error(error.message);
        }
    }

}