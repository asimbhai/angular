import { IS_DART, StringWrapper, isBlank, isPresent, isString, isArray } from 'angular2/src/facade/lang';
var CAMEL_CASE_REGEXP = /([A-Z])/g;
var DASH_CASE_REGEXP = /-([a-z])/g;
var SINGLE_QUOTE_ESCAPE_STRING_RE = /'|\\|\n|\r|\$/g;
var DOUBLE_QUOTE_ESCAPE_STRING_RE = /"|\\|\n|\r|\$/g;
export var MODULE_SUFFIX = IS_DART ? '.dart' : '.js';
export var CONST_VAR = IS_DART ? 'const' : 'var';
export function camelCaseToDashCase(input) {
    return StringWrapper.replaceAllMapped(input, CAMEL_CASE_REGEXP, (m) => { return '-' + m[1].toLowerCase(); });
}
export function dashCaseToCamelCase(input) {
    return StringWrapper.replaceAllMapped(input, DASH_CASE_REGEXP, (m) => { return m[1].toUpperCase(); });
}
export function escapeSingleQuoteString(input) {
    if (isBlank(input)) {
        return null;
    }
    return `'${escapeString(input, SINGLE_QUOTE_ESCAPE_STRING_RE)}'`;
}
export function escapeDoubleQuoteString(input) {
    if (isBlank(input)) {
        return null;
    }
    return `"${escapeString(input, DOUBLE_QUOTE_ESCAPE_STRING_RE)}"`;
}
function escapeString(input, re) {
    return StringWrapper.replaceAllMapped(input, re, (match) => {
        if (match[0] == '$') {
            return IS_DART ? '\\$' : '$';
        }
        else if (match[0] == '\n') {
            return '\\n';
        }
        else if (match[0] == '\r') {
            return '\\r';
        }
        else {
            return `\\${match[0]}`;
        }
    });
}
export function codeGenExportVariable(name) {
    if (IS_DART) {
        return `const ${name} = `;
    }
    else {
        return `var ${name} = exports['${name}'] = `;
    }
}
export function codeGenConstConstructorCall(name) {
    if (IS_DART) {
        return `const ${name}`;
    }
    else {
        return `new ${name}`;
    }
}
export function codeGenValueFn(params, value, fnName = '') {
    if (IS_DART) {
        return `${codeGenFnHeader(params, fnName)} => ${value}`;
    }
    else {
        return `${codeGenFnHeader(params, fnName)} { return ${value}; }`;
    }
}
export function codeGenFnHeader(params, fnName = '') {
    if (IS_DART) {
        return `${fnName}(${params.join(',')})`;
    }
    else {
        return `function ${fnName}(${params.join(',')})`;
    }
}
export function codeGenToString(expr) {
    if (IS_DART) {
        return `'\${${expr}}'`;
    }
    else {
        // JS automatically converts to string...
        return expr;
    }
}
export function splitAtColon(input, defaultValues) {
    var parts = StringWrapper.split(input.trim(), /\s*:\s*/g);
    if (parts.length > 1) {
        return parts;
    }
    else {
        return defaultValues;
    }
}
export class Statement {
    constructor(statement) {
        this.statement = statement;
    }
}
export class Expression {
    constructor(expression, isArray = false) {
        this.expression = expression;
        this.isArray = isArray;
    }
}
export function escapeValue(value) {
    if (value instanceof Expression) {
        return value.expression;
    }
    else if (isString(value)) {
        return escapeSingleQuoteString(value);
    }
    else if (isBlank(value)) {
        return 'null';
    }
    else {
        return `${value}`;
    }
}
export function codeGenArray(data) {
    return `[${data.map(escapeValue).join(',')}]`;
}
export function codeGenFlatArray(values) {
    var result = '([';
    var isFirstArrayEntry = true;
    var concatFn = IS_DART ? '.addAll' : 'concat';
    for (var i = 0; i < values.length; i++) {
        var value = values[i];
        if (value instanceof Expression && value.isArray) {
            result += `]).${concatFn}(${value.expression}).${concatFn}([`;
            isFirstArrayEntry = true;
        }
        else {
            if (!isFirstArrayEntry) {
                result += ',';
            }
            isFirstArrayEntry = false;
            result += escapeValue(value);
        }
    }
    result += '])';
    return result;
}
export function codeGenStringMap(keyValueArray) {
    return `{${keyValueArray.map(codeGenKeyValue).join(',')}}`;
}
function codeGenKeyValue(keyValue) {
    return `${escapeValue(keyValue[0])}:${escapeValue(keyValue[1])}`;
}
export function addAll(source, target) {
    for (var i = 0; i < source.length; i++) {
        target.push(source[i]);
    }
}
export function flattenArray(source, target) {
    if (isPresent(source)) {
        for (var i = 0; i < source.length; i++) {
            var item = source[i];
            if (isArray(item)) {
                flattenArray(item, target);
            }
            else {
                target.push(item);
            }
        }
    }
    return target;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtWDlKQk1HQ2cudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci91dGlsLnRzIl0sIm5hbWVzIjpbImNhbWVsQ2FzZVRvRGFzaENhc2UiLCJkYXNoQ2FzZVRvQ2FtZWxDYXNlIiwiZXNjYXBlU2luZ2xlUXVvdGVTdHJpbmciLCJlc2NhcGVEb3VibGVRdW90ZVN0cmluZyIsImVzY2FwZVN0cmluZyIsImNvZGVHZW5FeHBvcnRWYXJpYWJsZSIsImNvZGVHZW5Db25zdENvbnN0cnVjdG9yQ2FsbCIsImNvZGVHZW5WYWx1ZUZuIiwiY29kZUdlbkZuSGVhZGVyIiwiY29kZUdlblRvU3RyaW5nIiwic3BsaXRBdENvbG9uIiwiU3RhdGVtZW50IiwiU3RhdGVtZW50LmNvbnN0cnVjdG9yIiwiRXhwcmVzc2lvbiIsIkV4cHJlc3Npb24uY29uc3RydWN0b3IiLCJlc2NhcGVWYWx1ZSIsImNvZGVHZW5BcnJheSIsImNvZGVHZW5GbGF0QXJyYXkiLCJjb2RlR2VuU3RyaW5nTWFwIiwiY29kZUdlbktleVZhbHVlIiwiYWRkQWxsIiwiZmxhdHRlbkFycmF5Il0sIm1hcHBpbmdzIjoiT0FBTyxFQUNMLE9BQU8sRUFDUCxhQUFhLEVBQ2IsT0FBTyxFQUNQLFNBQVMsRUFDVCxRQUFRLEVBQ1IsT0FBTyxFQUNSLE1BQU0sMEJBQTBCO0FBRWpDLElBQUksaUJBQWlCLEdBQUcsVUFBVSxDQUFDO0FBQ25DLElBQUksZ0JBQWdCLEdBQUcsV0FBVyxDQUFDO0FBQ25DLElBQUksNkJBQTZCLEdBQUcsZ0JBQWdCLENBQUM7QUFDckQsSUFBSSw2QkFBNkIsR0FBRyxnQkFBZ0IsQ0FBQztBQUVyRCxXQUFXLGFBQWEsR0FBRyxPQUFPLEdBQUcsT0FBTyxHQUFHLEtBQUssQ0FBQztBQUVyRCxXQUFXLFNBQVMsR0FBRyxPQUFPLEdBQUcsT0FBTyxHQUFHLEtBQUssQ0FBQztBQUVq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Q0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDdEJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBQ3ZDQSxJQUFJQSxJQUFJQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNyQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2xCQSxZQUFZQSxDQUFDQSxJQUFJQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQTtZQUM3QkEsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ05BLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ3BCQSxDQUFDQTtRQUNIQSxDQUFDQTtJQUNIQSxDQUFDQTtJQUNEQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtBQUNoQkEsQ0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBJU19EQVJULFxuICBTdHJpbmdXcmFwcGVyLFxuICBpc0JsYW5rLFxuICBpc1ByZXNlbnQsXG4gIGlzU3RyaW5nLFxuICBpc0FycmF5XG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbnZhciBDQU1FTF9DQVNFX1JFR0VYUCA9IC8oW0EtWl0pL2c7XG52YXIgREFTSF9DQVNFX1JFR0VYUCA9IC8tKFthLXpdKS9nO1xudmFyIFNJTkdMRV9RVU9URV9FU0NBUEVfU1RSSU5HX1JFID0gLyd8XFxcXHxcXG58XFxyfFxcJC9nO1xudmFyIERPVUJMRV9RVU9URV9FU0NBUEVfU1RSSU5HX1JFID0gL1wifFxcXFx8XFxufFxccnxcXCQvZztcblxuZXhwb3J0IHZhciBNT0RVTEVfU1VGRklYID0gSVNfREFSVCA/ICcuZGFydCcgOiAnLmpzJztcblxuZXhwb3J0IHZhciBDT05TVF9WQVIgPSBJU19EQVJUID8gJ2NvbnN0JyA6ICd2YXInO1xuXG5leHBvcnQgZnVuY3Rpb24gY2FtZWxDYXNlVG9EYXNoQ2FzZShpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIFN0cmluZ1dyYXBwZXIucmVwbGFjZUFsbE1hcHBlZChpbnB1dCwgQ0FNRUxfQ0FTRV9SRUdFWFAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG0pID0+IHsgcmV0dXJuICctJyArIG1bMV0udG9Mb3dlckNhc2UoKTsgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkYXNoQ2FzZVRvQ2FtZWxDYXNlKGlucHV0OiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gU3RyaW5nV3JhcHBlci5yZXBsYWNlQWxsTWFwcGVkKGlucHV0LCBEQVNIX0NBU0VfUkVHRVhQLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtKSA9PiB7IHJldHVybiBtWzFdLnRvVXBwZXJDYXNlKCk7IH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlU2luZ2xlUXVvdGVTdHJpbmcoaW5wdXQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChpc0JsYW5rKGlucHV0KSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBgJyR7ZXNjYXBlU3RyaW5nKGlucHV0LCBTSU5HTEVfUVVPVEVfRVNDQVBFX1NUUklOR19SRSl9J2A7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGVEb3VibGVRdW90ZVN0cmluZyhpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKGlzQmxhbmsoaW5wdXQpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIGBcIiR7ZXNjYXBlU3RyaW5nKGlucHV0LCBET1VCTEVfUVVPVEVfRVNDQVBFX1NUUklOR19SRSl9XCJgO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVTdHJpbmcoaW5wdXQ6IHN0cmluZywgcmU6IFJlZ0V4cCk6IHN0cmluZyB7XG4gIHJldHVybiBTdHJpbmdXcmFwcGVyLnJlcGxhY2VBbGxNYXBwZWQoaW5wdXQsIHJlLCAobWF0Y2gpID0+IHtcbiAgICBpZiAobWF0Y2hbMF0gPT0gJyQnKSB7XG4gICAgICByZXR1cm4gSVNfREFSVCA/ICdcXFxcJCcgOiAnJCc7XG4gICAgfSBlbHNlIGlmIChtYXRjaFswXSA9PSAnXFxuJykge1xuICAgICAgcmV0dXJuICdcXFxcbic7XG4gICAgfSBlbHNlIGlmIChtYXRjaFswXSA9PSAnXFxyJykge1xuICAgICAgcmV0dXJuICdcXFxccic7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgXFxcXCR7bWF0Y2hbMF19YDtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29kZUdlbkV4cG9ydFZhcmlhYmxlKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChJU19EQVJUKSB7XG4gICAgcmV0dXJuIGBjb25zdCAke25hbWV9ID0gYDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYHZhciAke25hbWV9ID0gZXhwb3J0c1snJHtuYW1lfSddID0gYDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29kZUdlbkNvbnN0Q29uc3RydWN0b3JDYWxsKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChJU19EQVJUKSB7XG4gICAgcmV0dXJuIGBjb25zdCAke25hbWV9YDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYG5ldyAke25hbWV9YDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29kZUdlblZhbHVlRm4ocGFyYW1zOiBzdHJpbmdbXSwgdmFsdWU6IHN0cmluZywgZm5OYW1lOiBzdHJpbmcgPSAnJyk6IHN0cmluZyB7XG4gIGlmIChJU19EQVJUKSB7XG4gICAgcmV0dXJuIGAke2NvZGVHZW5GbkhlYWRlcihwYXJhbXMsIGZuTmFtZSl9ID0+ICR7dmFsdWV9YDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYCR7Y29kZUdlbkZuSGVhZGVyKHBhcmFtcywgZm5OYW1lKX0geyByZXR1cm4gJHt2YWx1ZX07IH1gO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb2RlR2VuRm5IZWFkZXIocGFyYW1zOiBzdHJpbmdbXSwgZm5OYW1lOiBzdHJpbmcgPSAnJyk6IHN0cmluZyB7XG4gIGlmIChJU19EQVJUKSB7XG4gICAgcmV0dXJuIGAke2ZuTmFtZX0oJHtwYXJhbXMuam9pbignLCcpfSlgO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBgZnVuY3Rpb24gJHtmbk5hbWV9KCR7cGFyYW1zLmpvaW4oJywnKX0pYDtcbiAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGNvZGVHZW5Ub1N0cmluZyhleHByOiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoSVNfREFSVCkge1xuICAgIHJldHVybiBgJ1xcJHske2V4cHJ9fSdgO1xuICB9IGVsc2Uge1xuICAgIC8vIEpTIGF1dG9tYXRpY2FsbHkgY29udmVydHMgdG8gc3RyaW5nLi4uXG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNwbGl0QXRDb2xvbihpbnB1dDogc3RyaW5nLCBkZWZhdWx0VmFsdWVzOiBzdHJpbmdbXSk6IHN0cmluZ1tdIHtcbiAgdmFyIHBhcnRzID0gU3RyaW5nV3JhcHBlci5zcGxpdChpbnB1dC50cmltKCksIC9cXHMqOlxccyovZyk7XG4gIGlmIChwYXJ0cy5sZW5ndGggPiAxKSB7XG4gICAgcmV0dXJuIHBhcnRzO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBkZWZhdWx0VmFsdWVzO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFN0YXRlbWVudCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzdGF0ZW1lbnQ6IHN0cmluZykge31cbn1cblxuZXhwb3J0IGNsYXNzIEV4cHJlc3Npb24ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZXhwcmVzc2lvbjogc3RyaW5nLCBwdWJsaWMgaXNBcnJheSA9IGZhbHNlKSB7fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlVmFsdWUodmFsdWU6IGFueSk6IHN0cmluZyB7XG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEV4cHJlc3Npb24pIHtcbiAgICByZXR1cm4gdmFsdWUuZXhwcmVzc2lvbjtcbiAgfSBlbHNlIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZXNjYXBlU2luZ2xlUXVvdGVTdHJpbmcodmFsdWUpO1xuICB9IGVsc2UgaWYgKGlzQmxhbmsodmFsdWUpKSB7XG4gICAgcmV0dXJuICdudWxsJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYCR7dmFsdWV9YDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29kZUdlbkFycmF5KGRhdGE6IGFueVtdKTogc3RyaW5nIHtcbiAgcmV0dXJuIGBbJHtkYXRhLm1hcChlc2NhcGVWYWx1ZSkuam9pbignLCcpfV1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29kZUdlbkZsYXRBcnJheSh2YWx1ZXM6IGFueVtdKTogc3RyaW5nIHtcbiAgdmFyIHJlc3VsdCA9ICcoWyc7XG4gIHZhciBpc0ZpcnN0QXJyYXlFbnRyeSA9IHRydWU7XG4gIHZhciBjb25jYXRGbiA9IElTX0RBUlQgPyAnLmFkZEFsbCcgOiAnY29uY2F0JztcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdmFsdWUgPSB2YWx1ZXNbaV07XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRXhwcmVzc2lvbiAmJiAoPEV4cHJlc3Npb24+dmFsdWUpLmlzQXJyYXkpIHtcbiAgICAgIHJlc3VsdCArPSBgXSkuJHtjb25jYXRGbn0oJHt2YWx1ZS5leHByZXNzaW9ufSkuJHtjb25jYXRGbn0oW2A7XG4gICAgICBpc0ZpcnN0QXJyYXlFbnRyeSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghaXNGaXJzdEFycmF5RW50cnkpIHtcbiAgICAgICAgcmVzdWx0ICs9ICcsJztcbiAgICAgIH1cbiAgICAgIGlzRmlyc3RBcnJheUVudHJ5ID0gZmFsc2U7XG4gICAgICByZXN1bHQgKz0gZXNjYXBlVmFsdWUodmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXN1bHQgKz0gJ10pJztcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvZGVHZW5TdHJpbmdNYXAoa2V5VmFsdWVBcnJheTogYW55W11bXSk6IHN0cmluZyB7XG4gIHJldHVybiBgeyR7a2V5VmFsdWVBcnJheS5tYXAoY29kZUdlbktleVZhbHVlKS5qb2luKCcsJyl9fWA7XG59XG5cbmZ1bmN0aW9uIGNvZGVHZW5LZXlWYWx1ZShrZXlWYWx1ZTogYW55W10pOiBzdHJpbmcge1xuICByZXR1cm4gYCR7ZXNjYXBlVmFsdWUoa2V5VmFsdWVbMF0pfToke2VzY2FwZVZhbHVlKGtleVZhbHVlWzFdKX1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkQWxsKHNvdXJjZTogYW55W10sIHRhcmdldDogYW55W10pIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2UubGVuZ3RoOyBpKyspIHtcbiAgICB0YXJnZXQucHVzaChzb3VyY2VbaV0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuQXJyYXkoc291cmNlOiBhbnlbXSwgdGFyZ2V0OiBhbnlbXSk6IGFueVtdIHtcbiAgaWYgKGlzUHJlc2VudChzb3VyY2UpKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpdGVtID0gc291cmNlW2ldO1xuICAgICAgaWYgKGlzQXJyYXkoaXRlbSkpIHtcbiAgICAgICAgZmxhdHRlbkFycmF5KGl0ZW0sIHRhcmdldCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXQucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldDtcbn1cbiJdfQ==