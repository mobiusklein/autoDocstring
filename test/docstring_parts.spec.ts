import chai = require('chai');
import 'mocha';

import { DocstringParts, removeTypes, addTypePlaceholders } from '../src/docstring_parts';

chai.config.truncateThreshold = 0;
let expect = chai.expect;

describe('removeTypes()', () => {
    it('should remove types from the docstringParts', () => {
        let docstringParts = {
            name: { "name": "", "type": 1 },
            args: [
                { var: "param1", type: undefined },
                { var: "param2", type: "int" },
            ],
            kwargs: [
                { var: "param3", default: "1", type: "int" },
                { var: "param4", default: "'abc'", type: "str" },
            ],
            returns: { type: "int" },
            raises: [],
            decorators: [],
            attributes: []
        }

        removeTypes(docstringParts)

        expect(docstringParts).to.eql({
            name: { "name": "", "type": 1 },
            args: [
                { var: "param1", type: undefined },
                { var: "param2", type: undefined },
            ],
            kwargs: [
                { var: "param3", default: "1", type: undefined},
                { var: "param4", default: "'abc'", type: undefined},
            ],
            returns: { type: undefined },
            raises: [],
            decorators: [],
            attributes: []
        })
    });
});

describe('addTypePlaceholders()', () => {
    it('should set all undefined types to a given placeholder', () => {
        let docstringParts = {
            name: {"name": "", "type": 1},
            args: [
                { var: "param1", type: undefined },
                { var: "param2", type: "int" },
            ],
            kwargs: [
                { var: "param3", default: "1", type: "int" },
                { var: "param4", default: "'abc'", type: undefined },
            ],
            returns: { type: undefined },
            raises: [],
            decorators: [],
            attributes: []
        };

        addTypePlaceholders(docstringParts, '[type]');

        expect(docstringParts).to.eql({
            name: { "name": "", "type": 1 },
            args: [
                { var: "param1", type: '[type]' },
                { var: "param2", type: "int" },
            ],
            kwargs: [
                { var: "param3", default: "1", type: "int" },
                { var: "param4", default: "'abc'", type: '[type]' },
            ],
            returns: { type: '[type]' },
            raises: [],
            decorators: [],
            attributes: []
        });
    });
});
