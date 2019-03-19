import { Argument, KeywordArgument, DocstringParts, Returns, Raises, Decorator, Attribute, DocumentableObject } from "../docstring_parts";
import { guessType } from "./guess_types";
import { tokenizeDefinition } from "./tokenize_definition"
import { Key } from "readline";


export function parseParameters(parameterTokens: string[], body: string[], objectName: DocumentableObject): DocstringParts {
    return {
        name: objectName,
        decorators: parseDecorators(parameterTokens),
        args: parseArguments(parameterTokens),
        kwargs: parseKeywordArguments(parameterTokens),
        returns: parseReturn(parameterTokens, body),
        raises: parseRaises(body),
        attributes: parseAttributes(body),
    }
}

function parseDecorators(parameters: string[]): Decorator[] {
    let decorators: Decorator[] = [];
    let pattern = /^@(\w+)/;

    for (let param of parameters) {
        let match = param.trim().match(pattern);

        if (match == undefined) {
            continue;
        }

        decorators.push({
            name: match[1],
        })
    }

    return decorators;
}

function parseArguments(parameters: string[]): Argument[] {
    let args: Argument[] = [];
    let excludedArgs = ['self', 'cls'];
    let pattern = /^(\w+)/;

    for (let param of parameters) {
        let match = param.trim().match(pattern);

        if (match == undefined || param.includes('=') || inArray(param, excludedArgs)) {
            continue;
        }

        args.push({
            var: match[1],
            type: guessType(param),
        });
    }

    return args;
}

function parseKeywordArguments(parameters: string[]): KeywordArgument[] {
    let kwargs: KeywordArgument[] = [];
    let pattern = /^(\w+)(?:\s*:[^=]+)?\s*=\s*(.+)/;

    for (let param of parameters) {
        let match = param.trim().match(pattern);

        if (match == undefined) {
            continue;
        }

        kwargs.push({
            var: match[1],
            default: match[2],
            type: guessType(param),
        });
    }

    return kwargs;
}

function parseReturn(parameters: string[], body: string[]): Returns {
    let returnType = parseReturnFromDefinition(parameters);

    if (returnType == undefined) {
        return parseReturnFromBody(body);
    }

    return returnType;
}

function parseReturnFromDefinition(parameters: string[]): Returns {
    let pattern = /^->\s*([\w\[\], \.]*)/;

    for (let param of parameters) {
        let match = param.trim().match(pattern);

        if (match == undefined) {
            continue;
        }

        return { type: match[1] };
    }

    return undefined
}

function parseReturnFromBody(body: string[]): Returns {
    let pattern = /return /

    for (let line of body) {
        let match = line.match(pattern);

        if (match == undefined) {
            continue;
        }

        return { type: undefined };
    }

    return undefined
}

function parseRaises(body: string[]): Raises[] {
    let raises: Raises[] = [];
    let pattern = /raise\s+([\w.]+)/;

    for (let line of body) {
        let match = line.match(pattern);

        if (match == undefined) {
            continue;
        }

        raises.push({ exception: match[1] });
    }

    return raises;
}

function parseAttributes(body: string[]): Attribute[] {
    let attributes: Attribute[] = [];

    let pattern = /self\.(\S+)\s*=\s*(\S+)/
    let initPattern = /__init__/
    let inInit = false;

    let known = {}

    for (let line of body){
        if (!inInit){
            inInit = line.match(initPattern) != undefined
            // If we've just encountered the __init__ declaration, parse its parameters to get
            // any names and default values to infer the parameter values.
            if (inInit){
                let parameterTokens: string[] = tokenizeDefinition(line)

                let args: Argument[] = parseArguments(parameterTokens)
                for (let arg of args) {
                    attributes.push({ "var": arg.var, "type": arg.type })
                    known[arg.var] = true;
                }

                let keywords: KeywordArgument[] = parseKeywordArguments(parameterTokens);
                for(let kw of keywords ) {
                    attributes.push({"var": kw.var, "type": kw.type})
                    known[kw.var] = true;
                }
            }
            continue
        // If we encounter *any other method definition*, we stop looking for attributes
        } else if (line.match(/def/)) {
            break
        }
        let match = line.match(pattern)

        if (match == undefined) {
            continue;
        }

        let attrName = match[1]
        if (known[attrName] != undefined) {
            continue
        }
        let value = match[2]
        let attrType = guessType(line)
        attributes.push({
            "type": attrType,
            "var": attrName
        })
    }
    console.log(attributes)
    return attributes
}


export function inArray<type>(item: type, array: type[]) {
    return array.some(x => item == x);
}
