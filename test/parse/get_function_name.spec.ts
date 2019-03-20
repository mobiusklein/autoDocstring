import chai = require('chai');
import 'mocha';

import { getFunctionName } from '../../src/parse/get_object_name';
import * as interfaces from '../../src/docstring_parts';

chai.config.truncateThreshold = 0;
let expect = chai.expect;

describe('getFunctionName()', () => {
    it("should get the function definition from a function", () => {
        var functionDefinition = 'def Func1_3(argument, kwarg="abc"):';
        var result = getFunctionName(functionDefinition);
        expect(result.name).to.eql('Func1_3');
        expect(result.type).to.eql(interfaces.DocumentableObjectType.Function)
    });

    it("should get the function definition from a function with weird spacing", () => {
        var functionDefinition = 'def  Func1  (argument, kwarg="abc"):';
        var result = getFunctionName(functionDefinition);
        expect(result.name).to.eql('Func1');
        expect(result.type).to.eql(interfaces.DocumentableObjectType.Function)
    });

});
