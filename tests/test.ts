import {expect} from 'chai';
import 'mocha';
import {Config} from "../config/config";
import {User} from "../src/users/entities/User";
import {getRepository} from "typeorm";


describe('Hello function', () => {

    it('should return hello world', () => {
        const result = "Hello world!";
        expect(result).to.equal('Hello world!');
    });

    it('config is ok', () => {
        expect(Config.db.name).to.equal(':memory:');
    });

    it('test db', async () => {
        const userRepository = getRepository(User);
        const user = new User();
        user.username = "abc";
        user.password = "asdasd";
        user.token = "dasd";
        await userRepository.save(user);
        expect(user.id).to.not.be.undefined;
        expect(user.id).to.eq(1);
    });

});