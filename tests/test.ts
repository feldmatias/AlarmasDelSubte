import {expect} from 'chai';
import 'mocha';
import {Config} from "../config/config";

describe('Hello function', () => {

    it('should return hello world', () => {
        const result = "Hello world!";
        expect(result).to.equal('Hello world!');
    });

    it('config is ok', () => {
        expect(Config.db.name).to.equal('test');
    });

});