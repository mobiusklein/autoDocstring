import { type } from "os";

export type DocstringParts = {
    name: DocumentableObject;
    decorators: Decorator[];
    args: Argument[];
    kwargs: KeywordArgument[];
    raises: Raises[];
    returns: Returns;
    attributes: Attribute[];
}

export type Decorator = {
    name: string;
}

export type Argument = {
    var: string;
    type: string;
}

export type KeywordArgument = {
    default: string;
    var: string;
    type: string;
}

export type Raises = {
    exception: string;
}

export type Returns = {
    type: string;
}

export type Attribute = {
    type: string;
    var: string;
}

export enum DocumentableObjectType {
    Variable,
    Function,
    Method,
    Class,
    Module,
    Empty
}


export type DocumentableObject = {
    type: DocumentableObjectType;
    name: string;
}


export function removeTypes(docstringParts: DocstringParts): void {
    for (let arg of docstringParts.args) {
        arg.type = undefined
    }

    for (let kwarg of docstringParts.kwargs) {
        kwarg.type = undefined
    }

    docstringParts.returns.type = undefined
}

export function addTypePlaceholders(docstringParts: DocstringParts, placeholder: string): void {
    for (let arg of docstringParts.args) {
        if (arg.type == undefined) {
            arg.type = placeholder
        }
    }

    for (let kwarg of docstringParts.kwargs) {
        if (kwarg.type == undefined) {
            kwarg.type = placeholder
        }
    }

    let returns = docstringParts.returns;
    if (returns != undefined && returns.type == undefined) {
        returns.type = placeholder
    }
}
