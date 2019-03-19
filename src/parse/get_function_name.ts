import * as interfaces from '../docstring_parts';

export function getFunctionName(functionDefinition: string): interfaces.DocumentableObject {
    let pattern = /(def|class)\s+(\w+)\s*\(/;

    let match = pattern.exec(functionDefinition);
    if (match == undefined || match[2] == undefined) {
        let result = {
            "type": interfaces.DocumentableObjectType.Empty,
            "name": ""
        }
        return result;
    };
    let result = null;
    if (match[1] == 'def') {
        result = {
            "type": interfaces.DocumentableObjectType.Function,
            "name": match[2]
        }
    } else if (match[1] == 'class') {
        result = {
            "type": interfaces.DocumentableObjectType.Class,
            "name": match[2]
        };
    }
    return result
}
