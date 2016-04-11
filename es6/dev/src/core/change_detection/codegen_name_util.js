import { StringWrapper } from 'angular2/src/facade/lang';
import { ListWrapper, Map } from 'angular2/src/facade/collection';
// The names of these fields must be kept in sync with abstract_change_detector.ts or change
// detection will fail.
const _STATE_ACCESSOR = "state";
const _CONTEXT_ACCESSOR = "context";
const _PROP_BINDING_INDEX = "propertyBindingIndex";
const _DIRECTIVES_ACCESSOR = "directiveIndices";
const _DISPATCHER_ACCESSOR = "dispatcher";
const _LOCALS_ACCESSOR = "locals";
const _MODE_ACCESSOR = "mode";
const _PIPES_ACCESSOR = "pipes";
const _PROTOS_ACCESSOR = "protos";
export const CONTEXT_ACCESSOR = "context";
// `context` is always first.
export const CONTEXT_INDEX = 0;
const _FIELD_PREFIX = 'this.';
var _whiteSpaceRegExp = /\W/g;
/**
 * Returns `s` with all non-identifier characters removed.
 */
export function sanitizeName(s) {
    return StringWrapper.replaceAll(s, _whiteSpaceRegExp, '');
}
/**
 * Class responsible for providing field and local variable names for change detector classes.
 * Also provides some convenience functions, for example, declaring variables, destroying pipes,
 * and dehydrating the detector.
 */
export class CodegenNameUtil {
    constructor(_records, _eventBindings, _directiveRecords, _utilName) {
        this._records = _records;
        this._eventBindings = _eventBindings;
        this._directiveRecords = _directiveRecords;
        this._utilName = _utilName;
        /** @internal */
        this._sanitizedEventNames = new Map();
        this._sanitizedNames = ListWrapper.createFixedSize(this._records.length + 1);
        this._sanitizedNames[CONTEXT_INDEX] = CONTEXT_ACCESSOR;
        for (var i = 0, iLen = this._records.length; i < iLen; ++i) {
            this._sanitizedNames[i + 1] = sanitizeName(`${this._records[i].name}${i}`);
        }
        for (var ebIndex = 0; ebIndex < _eventBindings.length; ++ebIndex) {
            var eb = _eventBindings[ebIndex];
            var names = [CONTEXT_ACCESSOR];
            for (var i = 0, iLen = eb.records.length; i < iLen; ++i) {
                names.push(sanitizeName(`${eb.records[i].name}${i}_${ebIndex}`));
            }
            this._sanitizedEventNames.set(eb, names);
        }
    }
    /** @internal */
    _addFieldPrefix(name) { return `${_FIELD_PREFIX}${name}`; }
    getDispatcherName() { return this._addFieldPrefix(_DISPATCHER_ACCESSOR); }
    getPipesAccessorName() { return this._addFieldPrefix(_PIPES_ACCESSOR); }
    getProtosName() { return this._addFieldPrefix(_PROTOS_ACCESSOR); }
    getDirectivesAccessorName() { return this._addFieldPrefix(_DIRECTIVES_ACCESSOR); }
    getLocalsAccessorName() { return this._addFieldPrefix(_LOCALS_ACCESSOR); }
    getStateName() { return this._addFieldPrefix(_STATE_ACCESSOR); }
    getModeName() { return this._addFieldPrefix(_MODE_ACCESSOR); }
    getPropertyBindingIndex() { return this._addFieldPrefix(_PROP_BINDING_INDEX); }
    getLocalName(idx) { return `l_${this._sanitizedNames[idx]}`; }
    getEventLocalName(eb, idx) {
        return `l_${this._sanitizedEventNames.get(eb)[idx]}`;
    }
    getChangeName(idx) { return `c_${this._sanitizedNames[idx]}`; }
    /**
     * Generate a statement initializing local variables used when detecting changes.
     */
    genInitLocals() {
        var declarations = [];
        var assignments = [];
        for (var i = 0, iLen = this.getFieldCount(); i < iLen; ++i) {
            if (i == CONTEXT_INDEX) {
                declarations.push(`${this.getLocalName(i)} = ${this.getFieldName(i)}`);
            }
            else {
                var rec = this._records[i - 1];
                if (rec.argumentToPureFunction) {
                    var changeName = this.getChangeName(i);
                    declarations.push(`${this.getLocalName(i)},${changeName}`);
                    assignments.push(changeName);
                }
                else {
                    declarations.push(`${this.getLocalName(i)}`);
                }
            }
        }
        var assignmentsCode = ListWrapper.isEmpty(assignments) ? '' : `${assignments.join('=')} = false;`;
        return `var ${declarations.join(',')};${assignmentsCode}`;
    }
    /**
     * Generate a statement initializing local variables for event handlers.
     */
    genInitEventLocals() {
        var res = [`${this.getLocalName(CONTEXT_INDEX)} = ${this.getFieldName(CONTEXT_INDEX)}`];
        this._sanitizedEventNames.forEach((names, eb) => {
            for (var i = 0; i < names.length; ++i) {
                if (i !== CONTEXT_INDEX) {
                    res.push(`${this.getEventLocalName(eb, i)}`);
                }
            }
        });
        return res.length > 1 ? `var ${res.join(',')};` : '';
    }
    getPreventDefaultAccesor() { return "preventDefault"; }
    getFieldCount() { return this._sanitizedNames.length; }
    getFieldName(idx) { return this._addFieldPrefix(this._sanitizedNames[idx]); }
    getAllFieldNames() {
        var fieldList = [];
        for (var k = 0, kLen = this.getFieldCount(); k < kLen; ++k) {
            if (k === 0 || this._records[k - 1].shouldBeChecked()) {
                fieldList.push(this.getFieldName(k));
            }
        }
        for (var i = 0, iLen = this._records.length; i < iLen; ++i) {
            var rec = this._records[i];
            if (rec.isPipeRecord()) {
                fieldList.push(this.getPipeName(rec.selfIndex));
            }
        }
        for (var j = 0, jLen = this._directiveRecords.length; j < jLen; ++j) {
            var dRec = this._directiveRecords[j];
            fieldList.push(this.getDirectiveName(dRec.directiveIndex));
            if (!dRec.isDefaultChangeDetection()) {
                fieldList.push(this.getDetectorName(dRec.directiveIndex));
            }
        }
        return fieldList;
    }
    /**
     * Generates statements which clear all fields so that the change detector is dehydrated.
     */
    genDehydrateFields() {
        var fields = this.getAllFieldNames();
        ListWrapper.removeAt(fields, CONTEXT_INDEX);
        if (ListWrapper.isEmpty(fields))
            return '';
        // At least one assignment.
        fields.push(`${this._utilName}.uninitialized;`);
        return fields.join(' = ');
    }
    /**
     * Generates statements destroying all pipe variables.
     */
    genPipeOnDestroy() {
        return this._records.filter(r => r.isPipeRecord())
            .map(r => `${this._utilName}.callPipeOnDestroy(${this.getPipeName(r.selfIndex)});`)
            .join('\n');
    }
    getPipeName(idx) {
        return this._addFieldPrefix(`${this._sanitizedNames[idx]}_pipe`);
    }
    getDirectiveName(d) {
        return this._addFieldPrefix(`directive_${d.name}`);
    }
    getDetectorName(d) { return this._addFieldPrefix(`detector_${d.name}`); }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWdlbl9uYW1lX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLVg5SkJNR0NnLnRtcC9hbmd1bGFyMi9zcmMvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL2NvZGVnZW5fbmFtZV91dGlsLnRzIl0sIm5hbWVzIjpbInNhbml0aXplTmFtZSIsIkNvZGVnZW5OYW1lVXRpbCIsIkNvZGVnZW5OYW1lVXRpbC5jb25zdHJ1Y3RvciIsIkNvZGVnZW5OYW1lVXRpbC5fYWRkRmllbGRQcmVmaXgiLCJDb2RlZ2VuTmFtZVV0aWwuZ2V0RGlzcGF0Y2hlck5hbWUiLCJDb2RlZ2VuTmFtZVV0aWwuZ2V0UGlwZXNBY2Nlc3Nvck5hbWUiLCJDb2RlZ2VuTmFtZVV0aWwuZ2V0UHJvdG9zTmFtZSIsIkNvZGVnZW5OYW1lVXRpbC5nZXREaXJlY3RpdmVzQWNjZXNzb3JOYW1lIiwiQ29kZWdlbk5hbWVVdGlsLmdldExvY2Fsc0FjY2Vzc29yTmFtZSIsIkNvZGVnZW5OYW1lVXRpbC5nZXRTdGF0ZU5hbWUiLCJDb2RlZ2VuTmFtZVV0aWwuZ2V0TW9kZU5hbWUiLCJDb2RlZ2VuTmFtZVV0aWwuZ2V0UHJvcGVydHlCaW5kaW5nSW5kZXgiLCJDb2RlZ2VuTmFtZVV0aWwuZ2V0TG9jYWxOYW1lIiwiQ29kZWdlbk5hbWVVdGlsLmdldEV2ZW50TG9jYWxOYW1lIiwiQ29kZWdlbk5hbWVVdGlsLmdldENoYW5nZU5hbWUiLCJDb2RlZ2VuTmFtZVV0aWwuZ2VuSW5pdExvY2FscyIsIkNvZGVnZW5OYW1lVXRpbC5nZW5Jbml0RXZlbnRMb2NhbHMiLCJDb2RlZ2VuTmFtZVV0aWwuZ2V0UHJldmVudERlZmF1bHRBY2Nlc29yIiwiQ29kZWdlbk5hbWVVdGlsLmdldEZpZWxkQ291bnQiLCJDb2RlZ2VuTmFtZVV0aWwuZ2V0RmllbGROYW1lIiwiQ29kZWdlbk5hbWVVdGlsLmdldEFsbEZpZWxkTmFtZXMiLCJDb2RlZ2VuTmFtZVV0aWwuZ2VuRGVoeWRyYXRlRmllbGRzIiwiQ29kZWdlbk5hbWVVdGlsLmdlblBpcGVPbkRlc3Ryb3kiLCJDb2RlZ2VuTmFtZVV0aWwuZ2V0UGlwZU5hbWUiLCJDb2RlZ2VuTmFtZVV0aWwuZ2V0RGlyZWN0aXZlTmFtZSIsIkNvZGVnZW5OYW1lVXRpbC5nZXREZXRlY3Rvck5hbWUiXSwibWFwcGluZ3MiOiJPQUFPLEVBQWdCLGFBQWEsRUFBQyxNQUFNLDBCQUEwQjtPQUM5RCxFQUFDLFdBQVcsRUFBYyxHQUFHLEVBQUMsTUFBTSxnQ0FBZ0M7QUFPM0UsNEZBQTRGO0FBQzVGLHVCQUF1QjtBQUN2QixNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUM7QUFDaEMsTUFBTSxpQkFBaUIsR0FBRyxTQUFTLENBQUM7QUFDcEMsTUFBTSxtQkFBbUIsR0FBRyxzQkFBc0IsQ0FBQztBQUNuRCxNQUFNLG9CQUFvQixHQUFHLGtCQUFrQixDQUFDO0FBQ2hELE1BQU0sb0JBQW9CLEdBQUcsWUFBWSxDQUFDO0FBQzFDLE1BQU0sZ0JBQWdCLEdBQUcsUUFBUSxDQUFDO0FBQ2xDLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQztBQUM5QixNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUM7QUFDaEMsTUFBTSxnQkFBZ0IsR0FBRyxRQUFRLENBQUM7QUFDbEMsYUFBYSxnQkFBZ0IsR0FBRyxTQUFTLENBQUM7QUFFMUMsNkJBQTZCO0FBQzdCLGFBQWEsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUMvQixNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUM7QUFFOUIsSUFBSSxpQkFBaUIsR0FBRyxLQUFLLENBQUM7QUFFOUI7O0dBRUc7QUFDSCw2QkFBNkIsQ0FBUztJQUNwQ0EsTUFBTUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsaUJBQWlCQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtBQUM1REEsQ0FBQ0E7QUFFRDs7OztHQUlHO0FBQ0g7SUFVRUMsWUFBb0JBLFFBQXVCQSxFQUFVQSxjQUE4QkEsRUFDL0RBLGlCQUF3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QUFDQSxnQkFBZ0JBLENBQUNBLENBQUNBLENBQUNBO0lBRS9EaEIsYUFBYUEsS0FBYWlCLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO0lBRS9EakIsWUFBWUEsQ0FBQ0EsR0FBV0EsSUFBWWtCLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0lBRTdGbEIsZ0JBQWdCQTtRQUNkbUIsSUFBSUEsU0FBU0EsR0FBR0EsRUFBRUEsQ0FBQ0E7UUFDbkJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBO1lBQzNEQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxlQUFlQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdERBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3ZDQSxDQUFDQTtRQUNIQSxDQUFDQTtRQUVEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTtZQUMzREEsSUFBSUEsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0Es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LENBQUNBLElBQUlBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0FBQ25HeEIsQ0FBQ0E7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7UmVnRXhwV3JhcHBlciwgU3RyaW5nV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7TGlzdFdyYXBwZXIsIE1hcFdyYXBwZXIsIE1hcH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcblxuaW1wb3J0IHtEaXJlY3RpdmVJbmRleH0gZnJvbSAnLi9kaXJlY3RpdmVfcmVjb3JkJztcblxuaW1wb3J0IHtQcm90b1JlY29yZH0gZnJvbSAnLi9wcm90b19yZWNvcmQnO1xuaW1wb3J0IHtFdmVudEJpbmRpbmd9IGZyb20gJy4vZXZlbnRfYmluZGluZyc7XG5cbi8vIFRoZSBuYW1lcyBvZiB0aGVzZSBmaWVsZHMgbXVzdCBiZSBrZXB0IGluIHN5bmMgd2l0aCBhYnN0cmFjdF9jaGFuZ2VfZGV0ZWN0b3IudHMgb3IgY2hhbmdlXG4vLyBkZXRlY3Rpb24gd2lsbCBmYWlsLlxuY29uc3QgX1NUQVRFX0FDQ0VTU09SID0gXCJzdGF0ZVwiO1xuY29uc3QgX0NPTlRFWFRfQUNDRVNTT1IgPSBcImNvbnRleHRcIjtcbmNvbnN0IF9QUk9QX0JJTkRJTkdfSU5ERVggPSBcInByb3BlcnR5QmluZGluZ0luZGV4XCI7XG5jb25zdCBfRElSRUNUSVZFU19BQ0NFU1NPUiA9IFwiZGlyZWN0aXZlSW5kaWNlc1wiO1xuY29uc3QgX0RJU1BBVENIRVJfQUNDRVNTT1IgPSBcImRpc3BhdGNoZXJcIjtcbmNvbnN0IF9MT0NBTFNfQUNDRVNTT1IgPSBcImxvY2Fsc1wiO1xuY29uc3QgX01PREVfQUNDRVNTT1IgPSBcIm1vZGVcIjtcbmNvbnN0IF9QSVBFU19BQ0NFU1NPUiA9IFwicGlwZXNcIjtcbmNvbnN0IF9QUk9UT1NfQUNDRVNTT1IgPSBcInByb3Rvc1wiO1xuZXhwb3J0IGNvbnN0IENPTlRFWFRfQUNDRVNTT1IgPSBcImNvbnRleHRcIjtcblxuLy8gYGNvbnRleHRgIGlzIGFsd2F5cyBmaXJzdC5cbmV4cG9ydCBjb25zdCBDT05URVhUX0lOREVYID0gMDtcbmNvbnN0IF9GSUVMRF9QUkVGSVggPSAndGhpcy4nO1xuXG52YXIgX3doaXRlU3BhY2VSZWdFeHAgPSAvXFxXL2c7XG5cbi8qKlxuICogUmV0dXJucyBgc2Agd2l0aCBhbGwgbm9uLWlkZW50aWZpZXIgY2hhcmFjdGVycyByZW1vdmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVOYW1lKHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBTdHJpbmdXcmFwcGVyLnJlcGxhY2VBbGwocywgX3doaXRlU3BhY2VSZWdFeHAsICcnKTtcbn1cblxuLyoqXG4gKiBDbGFzcyByZXNwb25zaWJsZSBmb3IgcHJvdmlkaW5nIGZpZWxkIGFuZCBsb2NhbCB2YXJpYWJsZSBuYW1lcyBmb3IgY2hhbmdlIGRldGVjdG9yIGNsYXNzZXMuXG4gKiBBbHNvIHByb3ZpZGVzIHNvbWUgY29udmVuaWVuY2UgZnVuY3Rpb25zLCBmb3IgZXhhbXBsZSwgZGVjbGFyaW5nIHZhcmlhYmxlcywgZGVzdHJveWluZyBwaXBlcyxcbiAqIGFuZCBkZWh5ZHJhdGluZyB0aGUgZGV0ZWN0b3IuXG4gKi9cbmV4cG9ydCBjbGFzcyBDb2RlZ2VuTmFtZVV0aWwge1xuICAvKipcbiAgICogUmVjb3JkIG5hbWVzIHNhbml0aXplZCBmb3IgdXNlIGFzIGZpZWxkcy5cbiAgICogU2VlIFtzYW5pdGl6ZU5hbWVdIGZvciBkZXRhaWxzLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIF9zYW5pdGl6ZWROYW1lczogc3RyaW5nW107XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3Nhbml0aXplZEV2ZW50TmFtZXMgPSBuZXcgTWFwPEV2ZW50QmluZGluZywgc3RyaW5nW10+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcmVjb3JkczogUHJvdG9SZWNvcmRbXSwgcHJpdmF0ZSBfZXZlbnRCaW5kaW5nczogRXZlbnRCaW5kaW5nW10sXG4gICAgICAgICAgICAgIHByaXZhdGUgX2RpcmVjdGl2ZVJlY29yZHM6IGFueVtdLCBwcml2YXRlIF91dGlsTmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fc2FuaXRpemVkTmFtZXMgPSBMaXN0V3JhcHBlci5jcmVhdGVGaXhlZFNpemUodGhpcy5fcmVjb3Jkcy5sZW5ndGggKyAxKTtcbiAgICB0aGlzLl9zYW5pdGl6ZWROYW1lc1tDT05URVhUX0lOREVYXSA9IENPTlRFWFRfQUNDRVNTT1I7XG4gICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSB0aGlzLl9yZWNvcmRzLmxlbmd0aDsgaSA8IGlMZW47ICsraSkge1xuICAgICAgdGhpcy5fc2FuaXRpemVkTmFtZXNbaSArIDFdID0gc2FuaXRpemVOYW1lKGAke3RoaXMuX3JlY29yZHNbaV0ubmFtZX0ke2l9YCk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgZWJJbmRleCA9IDA7IGViSW5kZXggPCBfZXZlbnRCaW5kaW5ncy5sZW5ndGg7ICsrZWJJbmRleCkge1xuICAgICAgdmFyIGViID0gX2V2ZW50QmluZGluZ3NbZWJJbmRleF07XG4gICAgICB2YXIgbmFtZXMgPSBbQ09OVEVYVF9BQ0NFU1NPUl07XG4gICAgICBmb3IgKHZhciBpID0gMCwgaUxlbiA9IGViLnJlY29yZHMubGVuZ3RoOyBpIDwgaUxlbjsgKytpKSB7XG4gICAgICAgIG5hbWVzLnB1c2goc2FuaXRpemVOYW1lKGAke2ViLnJlY29yZHNbaV0ubmFtZX0ke2l9XyR7ZWJJbmRleH1gKSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9zYW5pdGl6ZWRFdmVudE5hbWVzLnNldChlYiwgbmFtZXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2FkZEZpZWxkUHJlZml4KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7IHJldHVybiBgJHtfRklFTERfUFJFRklYfSR7bmFtZX1gOyB9XG5cbiAgZ2V0RGlzcGF0Y2hlck5hbWUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2FkZEZpZWxkUHJlZml4KF9ESVNQQVRDSEVSX0FDQ0VTU09SKTsgfVxuXG4gIGdldFBpcGVzQWNjZXNzb3JOYW1lKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9hZGRGaWVsZFByZWZpeChfUElQRVNfQUNDRVNTT1IpOyB9XG5cbiAgZ2V0UHJvdG9zTmFtZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fYWRkRmllbGRQcmVmaXgoX1BST1RPU19BQ0NFU1NPUik7IH1cblxuICBnZXREaXJlY3RpdmVzQWNjZXNzb3JOYW1lKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9hZGRGaWVsZFByZWZpeChfRElSRUNUSVZFU19BQ0NFU1NPUik7IH1cblxuICBnZXRMb2NhbHNBY2Nlc3Nvck5hbWUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2FkZEZpZWxkUHJlZml4KF9MT0NBTFNfQUNDRVNTT1IpOyB9XG5cbiAgZ2V0U3RhdGVOYW1lKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9hZGRGaWVsZFByZWZpeChfU1RBVEVfQUNDRVNTT1IpOyB9XG5cbiAgZ2V0TW9kZU5hbWUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2FkZEZpZWxkUHJlZml4KF9NT0RFX0FDQ0VTU09SKTsgfVxuXG4gIGdldFByb3BlcnR5QmluZGluZ0luZGV4KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9hZGRGaWVsZFByZWZpeChfUFJPUF9CSU5ESU5HX0lOREVYKTsgfVxuXG4gIGdldExvY2FsTmFtZShpZHg6IG51bWJlcik6IHN0cmluZyB7IHJldHVybiBgbF8ke3RoaXMuX3Nhbml0aXplZE5hbWVzW2lkeF19YDsgfVxuXG4gIGdldEV2ZW50TG9jYWxOYW1lKGViOiBFdmVudEJpbmRpbmcsIGlkeDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYGxfJHt0aGlzLl9zYW5pdGl6ZWRFdmVudE5hbWVzLmdldChlYilbaWR4XX1gO1xuICB9XG5cbiAgZ2V0Q2hhbmdlTmFtZShpZHg6IG51bWJlcik6IHN0cmluZyB7IHJldHVybiBgY18ke3RoaXMuX3Nhbml0aXplZE5hbWVzW2lkeF19YDsgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBhIHN0YXRlbWVudCBpbml0aWFsaXppbmcgbG9jYWwgdmFyaWFibGVzIHVzZWQgd2hlbiBkZXRlY3RpbmcgY2hhbmdlcy5cbiAgICovXG4gIGdlbkluaXRMb2NhbHMoKTogc3RyaW5nIHtcbiAgICB2YXIgZGVjbGFyYXRpb25zID0gW107XG4gICAgdmFyIGFzc2lnbm1lbnRzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSB0aGlzLmdldEZpZWxkQ291bnQoKTsgaSA8IGlMZW47ICsraSkge1xuICAgICAgaWYgKGkgPT0gQ09OVEVYVF9JTkRFWCkge1xuICAgICAgICBkZWNsYXJhdGlvbnMucHVzaChgJHt0aGlzLmdldExvY2FsTmFtZShpKX0gPSAke3RoaXMuZ2V0RmllbGROYW1lKGkpfWApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlYyA9IHRoaXMuX3JlY29yZHNbaSAtIDFdO1xuICAgICAgICBpZiAocmVjLmFyZ3VtZW50VG9QdXJlRnVuY3Rpb24pIHtcbiAgICAgICAgICB2YXIgY2hhbmdlTmFtZSA9IHRoaXMuZ2V0Q2hhbmdlTmFtZShpKTtcbiAgICAgICAgICBkZWNsYXJhdGlvbnMucHVzaChgJHt0aGlzLmdldExvY2FsTmFtZShpKX0sJHtjaGFuZ2VOYW1lfWApO1xuICAgICAgICAgIGFzc2lnbm1lbnRzLnB1c2goY2hhbmdlTmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVjbGFyYXRpb25zLnB1c2goYCR7dGhpcy5nZXRMb2NhbE5hbWUoaSl9YCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGFzc2lnbm1lbnRzQ29kZSA9XG4gICAgICAgIExpc3RXcmFwcGVyLmlzRW1wdHkoYXNzaWdubWVudHMpID8gJycgOiBgJHthc3NpZ25tZW50cy5qb2luKCc9Jyl9ID0gZmFsc2U7YDtcbiAgICByZXR1cm4gYHZhciAke2RlY2xhcmF0aW9ucy5qb2luKCcsJyl9OyR7YXNzaWdubWVudHNDb2RlfWA7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgYSBzdGF0ZW1lbnQgaW5pdGlhbGl6aW5nIGxvY2FsIHZhcmlhYmxlcyBmb3IgZXZlbnQgaGFuZGxlcnMuXG4gICAqL1xuICBnZW5Jbml0RXZlbnRMb2NhbHMoKTogc3RyaW5nIHtcbiAgICB2YXIgcmVzID0gW2Ake3RoaXMuZ2V0TG9jYWxOYW1lKENPTlRFWFRfSU5ERVgpfSA9ICR7dGhpcy5nZXRGaWVsZE5hbWUoQ09OVEVYVF9JTkRFWCl9YF07XG4gICAgdGhpcy5fc2FuaXRpemVkRXZlbnROYW1lcy5mb3JFYWNoKChuYW1lcywgZWIpID0+IHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaWYgKGkgIT09IENPTlRFWFRfSU5ERVgpIHtcbiAgICAgICAgICByZXMucHVzaChgJHt0aGlzLmdldEV2ZW50TG9jYWxOYW1lKGViLCBpKX1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXMubGVuZ3RoID4gMSA/IGB2YXIgJHtyZXMuam9pbignLCcpfTtgIDogJyc7XG4gIH1cblxuICBnZXRQcmV2ZW50RGVmYXVsdEFjY2Vzb3IoKTogc3RyaW5nIHsgcmV0dXJuIFwicHJldmVudERlZmF1bHRcIjsgfVxuXG4gIGdldEZpZWxkQ291bnQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3Nhbml0aXplZE5hbWVzLmxlbmd0aDsgfVxuXG4gIGdldEZpZWxkTmFtZShpZHg6IG51bWJlcik6IHN0cmluZyB7IHJldHVybiB0aGlzLl9hZGRGaWVsZFByZWZpeCh0aGlzLl9zYW5pdGl6ZWROYW1lc1tpZHhdKTsgfVxuXG4gIGdldEFsbEZpZWxkTmFtZXMoKTogc3RyaW5nW10ge1xuICAgIHZhciBmaWVsZExpc3QgPSBbXTtcbiAgICBmb3IgKHZhciBrID0gMCwga0xlbiA9IHRoaXMuZ2V0RmllbGRDb3VudCgpOyBrIDwga0xlbjsgKytrKSB7XG4gICAgICBpZiAoayA9PT0gMCB8fCB0aGlzLl9yZWNvcmRzW2sgLSAxXS5zaG91bGRCZUNoZWNrZWQoKSkge1xuICAgICAgICBmaWVsZExpc3QucHVzaCh0aGlzLmdldEZpZWxkTmFtZShrKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSB0aGlzLl9yZWNvcmRzLmxlbmd0aDsgaSA8IGlMZW47ICsraSkge1xuICAgICAgdmFyIHJlYyA9IHRoaXMuX3JlY29yZHNbaV07XG4gICAgICBpZiAocmVjLmlzUGlwZVJlY29yZCgpKSB7XG4gICAgICAgIGZpZWxkTGlzdC5wdXNoKHRoaXMuZ2V0UGlwZU5hbWUocmVjLnNlbGZJbmRleCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIGogPSAwLCBqTGVuID0gdGhpcy5fZGlyZWN0aXZlUmVjb3Jkcy5sZW5ndGg7IGogPCBqTGVuOyArK2opIHtcbiAgICAgIHZhciBkUmVjID0gdGhpcy5fZGlyZWN0aXZlUmVjb3Jkc1tqXTtcbiAgICAgIGZpZWxkTGlzdC5wdXNoKHRoaXMuZ2V0RGlyZWN0aXZlTmFtZShkUmVjLmRpcmVjdGl2ZUluZGV4KSk7XG4gICAgICBpZiAoIWRSZWMuaXNEZWZhdWx0Q2hhbmdlRGV0ZWN0aW9uKCkpIHtcbiAgICAgICAgZmllbGRMaXN0LnB1c2godGhpcy5nZXREZXRlY3Rvck5hbWUoZFJlYy5kaXJlY3RpdmVJbmRleCkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmllbGRMaXN0O1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBzdGF0ZW1lbnRzIHdoaWNoIGNsZWFyIGFsbCBmaWVsZHMgc28gdGhhdCB0aGUgY2hhbmdlIGRldGVjdG9yIGlzIGRlaHlkcmF0ZWQuXG4gICAqL1xuICBnZW5EZWh5ZHJhdGVGaWVsZHMoKTogc3RyaW5nIHtcbiAgICB2YXIgZmllbGRzID0gdGhpcy5nZXRBbGxGaWVsZE5hbWVzKCk7XG4gICAgTGlzdFdyYXBwZXIucmVtb3ZlQXQoZmllbGRzLCBDT05URVhUX0lOREVYKTtcbiAgICBpZiAoTGlzdFdyYXBwZXIuaXNFbXB0eShmaWVsZHMpKSByZXR1cm4gJyc7XG5cbiAgICAvLyBBdCBsZWFzdCBvbmUgYXNzaWdubWVudC5cbiAgICBmaWVsZHMucHVzaChgJHt0aGlzLl91dGlsTmFtZX0udW5pbml0aWFsaXplZDtgKTtcbiAgICByZXR1cm4gZmllbGRzLmpvaW4oJyA9ICcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBzdGF0ZW1lbnRzIGRlc3Ryb3lpbmcgYWxsIHBpcGUgdmFyaWFibGVzLlxuICAgKi9cbiAgZ2VuUGlwZU9uRGVzdHJveSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9yZWNvcmRzLmZpbHRlcihyID0+IHIuaXNQaXBlUmVjb3JkKCkpXG4gICAgICAgIC5tYXAociA9PiBgJHt0aGlzLl91dGlsTmFtZX0uY2FsbFBpcGVPbkRlc3Ryb3koJHt0aGlzLmdldFBpcGVOYW1lKHIuc2VsZkluZGV4KX0pO2ApXG4gICAgICAgIC5qb2luKCdcXG4nKTtcbiAgfVxuXG4gIGdldFBpcGVOYW1lKGlkeDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fYWRkRmllbGRQcmVmaXgoYCR7dGhpcy5fc2FuaXRpemVkTmFtZXNbaWR4XX1fcGlwZWApO1xuICB9XG5cbiAgZ2V0RGlyZWN0aXZlTmFtZShkOiBEaXJlY3RpdmVJbmRleCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2FkZEZpZWxkUHJlZml4KGBkaXJlY3RpdmVfJHtkLm5hbWV9YCk7XG4gIH1cblxuICBnZXREZXRlY3Rvck5hbWUoZDogRGlyZWN0aXZlSW5kZXgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fYWRkRmllbGRQcmVmaXgoYGRldGVjdG9yXyR7ZC5uYW1lfWApOyB9XG59XG4iXX0=