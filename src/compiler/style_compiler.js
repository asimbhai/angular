'use strict';var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var source_module_1 = require('./source_module');
var view_1 = require('angular2/src/core/metadata/view');
var xhr_1 = require('angular2/src/compiler/xhr');
var lang_1 = require('angular2/src/facade/lang');
var async_1 = require('angular2/src/facade/async');
var shadow_css_1 = require('angular2/src/compiler/shadow_css');
var url_resolver_1 = require('angular2/src/compiler/url_resolver');
var style_url_resolver_1 = require('./style_url_resolver');
var util_1 = require('./util');
var di_1 = require('angular2/src/core/di');
var COMPONENT_VARIABLE = '%COMP%';
var HOST_ATTR = "_nghost-" + COMPONENT_VARIABLE;
var CONTENT_ATTR = "_ngcontent-" + COMPONENT_VARIABLE;
var StyleCompiler = (function () {
    function StyleCompiler(_xhr, _urlResolver) {
        this._xhr = _xhr;
        this._urlResolver = _urlResolver;
        this._styleCache = new Map();
        this._shadowCss = new shadow_css_1.ShadowCss();
    }
    StyleCompiler.prototype.compileComponentRuntime = function (template) {
        var styles = template.styles;
        var styleAbsUrls = template.styleUrls;
        return this._loadStyles(styles, styleAbsUrls, template.encapsulation === view_1.ViewEncapsulation.Emulated);
    };
    StyleCompiler.prototype.compileComponentCodeGen = function (template) {
        var shim = template.encapsulation === view_1.ViewEncapsulation.Emulated;
        return this._styleCodeGen(template.styles, template.styleUrls, shim);
    };
    StyleCompiler.prototype.compileStylesheetCodeGen = function (stylesheetUrl, cssText) {
        var styleWithImports = style_url_resolver_1.extractStyleUrls(this._urlResolver, stylesheetUrl, cssText);
        return [
            this._styleModule(stylesheetUrl, false, this._styleCodeGen([styleWithImports.style], styleWithImports.styleUrls, false)),
            this._styleModule(stylesheetUrl, true, this._styleCodeGen([styleWithImports.style], styleWithImports.styleUrls, true))
        ];
    };
    StyleCompiler.prototype.clearCache = function () { this._styleCache.clear(); };
    StyleCompiler.prototype._loadStyles = function (plainStyles, absUrls, encapsulate) {
        var _this = this;
        var promises = absUrls.map(function (absUrl) {
            var cacheKey = "" + absUrl + (encapsulate ? '.shim' : '');
            var result = _this._styleCache.get(cacheKey);
            if (lang_1.isBlank(result)) {
                result = _this._xhr.get(absUrl).then(function (style) {
                    var styleWithImports = style_url_resolver_1.extractStyleUrls(_this._urlResolver, absUrl, style);
                    return _this._loadStyles([styleWithImports.style], styleWithImports.styleUrls, encapsulate);
                });
                _this._styleCache.set(cacheKey, result);
            }
            return result;
        });
        return async_1.PromiseWrapper.all(promises).then(function (nestedStyles) {
            var result = plainStyles.map(function (plainStyle) { return _this._shimIfNeeded(plainStyle, encapsulate); });
            nestedStyles.forEach(function (styles) { return result.push(styles); });
            return result;
        });
    };
    StyleCompiler.prototype._styleCodeGen = function (plainStyles, absUrls, shim) {
        var _this = this;
        var arrayPrefix = lang_1.IS_DART ? "const" : '';
        var styleExpressions = plainStyles.map(function (plainStyle) { return util_1.escapeSingleQuoteString(_this._shimIfNeeded(plainStyle, shim)); });
        for (var i = 0; i < absUrls.length; i++) {
            var moduleUrl = this._createModuleUrl(absUrls[i], shim);
            styleExpressions.push(source_module_1.moduleRef(moduleUrl) + "STYLES");
        }
        var expressionSource = arrayPrefix + " [" + styleExpressions.join(',') + "]";
        return new source_module_1.SourceExpression([], expressionSource);
    };
    StyleCompiler.prototype._styleModule = function (stylesheetUrl, shim, expression) {
        var moduleSource = "\n      " + expression.declarations.join('\n') + "\n      " + util_1.codeGenExportVariable('STYLES') + expression.expression + ";\n    ";
        return new source_module_1.SourceModule(this._createModuleUrl(stylesheetUrl, shim), moduleSource);
    };
    StyleCompiler.prototype._shimIfNeeded = function (style, shim) {
        return shim ? this._shadowCss.shimCssText(style, CONTENT_ATTR, HOST_ATTR) : style;
    };
    StyleCompiler.prototype._createModuleUrl = function (stylesheetUrl, shim) {
        return shim ? stylesheetUrl + ".shim" + util_1.MODULE_SUFFIX : "" + stylesheetUrl + util_1.MODULE_SUFFIX;
    };
    StyleCompiler = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [xhr_1.XHR, url_resolver_1.UrlResolver])
    ], StyleCompiler);
    return StyleCompiler;
})();
exports.StyleCompiler = StyleCompiler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGVfY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLVZDVDE2d1pPLnRtcC9hbmd1bGFyMi9zcmMvY29tcGlsZXIvc3R5bGVfY29tcGlsZXIudHMiXSwibmFtZXMiOlsiU3R5bGVDb21waWxlciIsIlN0eWxlQ29tcGlsZXIuY29uc3RydWN0b3IiLCJTdHlsZUNvbXBpbGVyLmNvbXBpbGVDb21wb25lbnRSdW50aW1lIiwiU3R5bGVDb21waWxlci5jb21waWxlQ29tcG9uZW50Q29kZUdlbiIsIlN0eWxlQ29tcGlsZXIuY29tcGlsZVN0eWxlc2hlZXRDb2RlR2VuIiwiU3R5bGVDb21waWxlci5jbGVhckNhY2hlIiwiU3R5bGVDb21waWxlci5fbG9hZFN0eWxlcyIsIlN0eWxlQ29tcGlsZXIuX3N0eWxlQ29kZUdlbiIsIlN0eWxlQ29tcGlsZXIuX3N0eWxlTW9kdWxlIiwiU3R5bGVDb21waWxlci5fc2hpbUlmTmVlZGVkIiwiU3R5bGVDb21waWxlci5fY3JlYXRlTW9kdWxlVXJsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQSw4QkFBd0QsaUJBQWlCLENBQUMsQ0FBQTtBQUMxRSxxQkFBZ0MsaUNBQWlDLENBQUMsQ0FBQTtBQUNsRSxvQkFBa0IsMkJBQTJCLENBQUMsQ0FBQTtBQUM5QyxxQkFBOEMsMEJBQTBCLENBQUMsQ0FBQTtBQUN6RSxzQkFBNkIsMkJBQTJCLENBQUMsQ0FBQTtBQUN6RCwyQkFBd0Isa0NBQWtDLENBQUMsQ0FBQTtBQUMzRCw2QkFBMEIsb0NBQW9DLENBQUMsQ0FBQTtBQUMvRCxtQ0FBK0Isc0JBQXNCLENBQUMsQ0FBQTtBQUN0RCxxQkFLTyxRQUFRLENBQUMsQ0FBQTtBQUNoQixtQkFBeUIsc0JBQXNCLENBQUMsQ0FBQTtBQUVoRCxJQUFNLGtCQUFrQixHQUFHLFFBQVEsQ0FBQztBQUNwQyxJQUFNLFNBQVMsR0FBRyxhQUFXLGtCQUFvQixDQUFDO0FB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Q0E7UUFDRkEsTUFBTUEsQ0FBQ0EsSUFBSUEsNEJBQVlBLENBQUNBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsYUFBYUEsRUFBRUEsSUFBSUEsQ0FBQ0EsRUFBRUEsWUFBWUEsQ0FBQ0EsQ0FBQ0E7SUFDcEZBLENBQUNBO0lBRU9SLHFDQUFhQSxHQUFyQkEsVUFBc0JBLEtBQWFBLEVBQUVBLElBQWFBO1FBQ2hEUyxNQUFNQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxXQUFXQSxDQUFDQSxLQUFLQSxFQUFFQSxZQUFZQSxFQUFFQSxTQUFTQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQTtJQUNwRkEsQ0FBQ0E7SUFFT1Qsd0NBQWdCQSxHQUF4QkEsVUFBeUJBLGFBQXFCQSxFQUFFQSxJQUFhQTtRQUMzRFUsTUFBTUEsQ0FBQ0EsSUFBSUEsR0FBTUEsYUFBYUEsYUFBUUEsb0JBQWVBLEdBQUdBLEtBQUdBLGFBQWFBLEdBQUdBLG9CQUFlQSxDQUFDQTtJQUM3RkEsQ0FBQ0E7SUFuRkhWO1FBQUNBLGVBQVVBLEVBQUVBOztzQkFvRlpBO0lBQURBLG9CQUFDQTtBQUFEQSxDQUFDQSxBQXBGRCxJQW9GQztBQW5GWSxxQkFBYSxnQkFtRnpCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBpbGVUeXBlTWV0YWRhdGEsIENvbXBpbGVUZW1wbGF0ZU1ldGFkYXRhfSBmcm9tICcuL2RpcmVjdGl2ZV9tZXRhZGF0YSc7XG5pbXBvcnQge1NvdXJjZU1vZHVsZSwgU291cmNlRXhwcmVzc2lvbiwgbW9kdWxlUmVmfSBmcm9tICcuL3NvdXJjZV9tb2R1bGUnO1xuaW1wb3J0IHtWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbWV0YWRhdGEvdmlldyc7XG5pbXBvcnQge1hIUn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3hocic7XG5pbXBvcnQge0lTX0RBUlQsIFN0cmluZ1dyYXBwZXIsIGlzQmxhbmt9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge1Byb21pc2VXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2FzeW5jJztcbmltcG9ydCB7U2hhZG93Q3NzfSBmcm9tICdhbmd1bGFyMi9zcmMvY29tcGlsZXIvc2hhZG93X2Nzcyc7XG5pbXBvcnQge1VybFJlc29sdmVyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29tcGlsZXIvdXJsX3Jlc29sdmVyJztcbmltcG9ydCB7ZXh0cmFjdFN0eWxlVXJsc30gZnJvbSAnLi9zdHlsZV91cmxfcmVzb2x2ZXInO1xuaW1wb3J0IHtcbiAgZXNjYXBlU2luZ2xlUXVvdGVTdHJpbmcsXG4gIGNvZGVHZW5FeHBvcnRWYXJpYWJsZSxcbiAgY29kZUdlblRvU3RyaW5nLFxuICBNT0RVTEVfU1VGRklYXG59IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcblxuY29uc3QgQ09NUE9ORU5UX1ZBUklBQkxFID0gJyVDT01QJSc7XG5jb25zdCBIT1NUX0FUVFIgPSBgX25naG9zdC0ke0NPTVBPTkVOVF9WQVJJQUJMRX1gO1xuY29uc3QgQ09OVEVOVF9BVFRSID0gYF9uZ2NvbnRlbnQtJHtDT01QT05FTlRfVkFSSUFCTEV9YDtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0eWxlQ29tcGlsZXIge1xuICBwcml2YXRlIF9zdHlsZUNhY2hlOiBNYXA8c3RyaW5nLCBQcm9taXNlPHN0cmluZ1tdPj4gPSBuZXcgTWFwPHN0cmluZywgUHJvbWlzZTxzdHJpbmdbXT4+KCk7XG4gIHByaXZhdGUgX3NoYWRvd0NzczogU2hhZG93Q3NzID0gbmV3IFNoYWRvd0NzcygpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3hocjogWEhSLCBwcml2YXRlIF91cmxSZXNvbHZlcjogVXJsUmVzb2x2ZXIpIHt9XG5cbiAgY29tcGlsZUNvbXBvbmVudFJ1bnRpbWUodGVtcGxhdGU6IENvbXBpbGVUZW1wbGF0ZU1ldGFkYXRhKTogUHJvbWlzZTxBcnJheTxzdHJpbmcgfCBhbnlbXT4+IHtcbiAgICB2YXIgc3R5bGVzID0gdGVtcGxhdGUuc3R5bGVzO1xuICAgIHZhciBzdHlsZUFic1VybHMgPSB0ZW1wbGF0ZS5zdHlsZVVybHM7XG4gICAgcmV0dXJuIHRoaXMuX2xvYWRTdHlsZXMoc3R5bGVzLCBzdHlsZUFic1VybHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGUuZW5jYXBzdWxhdGlvbiA9PT0gVmlld0VuY2Fwc3VsYXRpb24uRW11bGF0ZWQpO1xuICB9XG5cbiAgY29tcGlsZUNvbXBvbmVudENvZGVHZW4odGVtcGxhdGU6IENvbXBpbGVUZW1wbGF0ZU1ldGFkYXRhKTogU291cmNlRXhwcmVzc2lvbiB7XG4gICAgdmFyIHNoaW0gPSB0ZW1wbGF0ZS5lbmNhcHN1bGF0aW9uID09PSBWaWV3RW5jYXBzdWxhdGlvbi5FbXVsYXRlZDtcbiAgICByZXR1cm4gdGhpcy5fc3R5bGVDb2RlR2VuKHRlbXBsYXRlLnN0eWxlcywgdGVtcGxhdGUuc3R5bGVVcmxzLCBzaGltKTtcbiAgfVxuXG4gIGNvbXBpbGVTdHlsZXNoZWV0Q29kZUdlbihzdHlsZXNoZWV0VXJsOiBzdHJpbmcsIGNzc1RleHQ6IHN0cmluZyk6IFNvdXJjZU1vZHVsZVtdIHtcbiAgICB2YXIgc3R5bGVXaXRoSW1wb3J0cyA9IGV4dHJhY3RTdHlsZVVybHModGhpcy5fdXJsUmVzb2x2ZXIsIHN0eWxlc2hlZXRVcmwsIGNzc1RleHQpO1xuICAgIHJldHVybiBbXG4gICAgICB0aGlzLl9zdHlsZU1vZHVsZShcbiAgICAgICAgICBzdHlsZXNoZWV0VXJsLCBmYWxzZSxcbiAgICAgICAgICB0aGlzLl9zdHlsZUNvZGVHZW4oW3N0eWxlV2l0aEltcG9ydHMuc3R5bGVdLCBzdHlsZVdpdGhJbXBvcnRzLnN0eWxlVXJscywgZmFsc2UpKSxcbiAgICAgIHRoaXMuX3N0eWxlTW9kdWxlKHN0eWxlc2hlZXRVcmwsIHRydWUsIHRoaXMuX3N0eWxlQ29kZUdlbihbc3R5bGVXaXRoSW1wb3J0cy5zdHlsZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVXaXRoSW1wb3J0cy5zdHlsZVVybHMsIHRydWUpKVxuICAgIF07XG4gIH1cblxuICBjbGVhckNhY2hlKCkgeyB0aGlzLl9zdHlsZUNhY2hlLmNsZWFyKCk7IH1cblxuICBwcml2YXRlIF9sb2FkU3R5bGVzKHBsYWluU3R5bGVzOiBzdHJpbmdbXSwgYWJzVXJsczogc3RyaW5nW10sXG4gICAgICAgICAgICAgICAgICAgICAgZW5jYXBzdWxhdGU6IGJvb2xlYW4pOiBQcm9taXNlPEFycmF5PHN0cmluZyB8IGFueVtdPj4ge1xuICAgIHZhciBwcm9taXNlczogUHJvbWlzZTxzdHJpbmdbXT5bXSA9IGFic1VybHMubWFwKChhYnNVcmw6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nW10+ID0+IHtcbiAgICAgIHZhciBjYWNoZUtleSA9IGAke2Fic1VybH0ke2VuY2Fwc3VsYXRlID8gJy5zaGltJyA6ICcnfWA7XG4gICAgICB2YXIgcmVzdWx0OiBQcm9taXNlPHN0cmluZ1tdPiA9IHRoaXMuX3N0eWxlQ2FjaGUuZ2V0KGNhY2hlS2V5KTtcbiAgICAgIGlmIChpc0JsYW5rKHJlc3VsdCkpIHtcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5feGhyLmdldChhYnNVcmwpLnRoZW4oKHN0eWxlKSA9PiB7XG4gICAgICAgICAgdmFyIHN0eWxlV2l0aEltcG9ydHMgPSBleHRyYWN0U3R5bGVVcmxzKHRoaXMuX3VybFJlc29sdmVyLCBhYnNVcmwsIHN0eWxlKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fbG9hZFN0eWxlcyhbc3R5bGVXaXRoSW1wb3J0cy5zdHlsZV0sIHN0eWxlV2l0aEltcG9ydHMuc3R5bGVVcmxzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuY2Fwc3VsYXRlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3N0eWxlQ2FjaGUuc2V0KGNhY2hlS2V5LCByZXN1bHQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9KTtcbiAgICByZXR1cm4gUHJvbWlzZVdyYXBwZXIuYWxsPHN0cmluZ1tdPihwcm9taXNlcykudGhlbigobmVzdGVkU3R5bGVzOiBzdHJpbmdbXVtdKSA9PiB7XG4gICAgICB2YXIgcmVzdWx0OiBBcnJheTxzdHJpbmcgfCBhbnlbXT4gPVxuICAgICAgICAgIHBsYWluU3R5bGVzLm1hcChwbGFpblN0eWxlID0+IHRoaXMuX3NoaW1JZk5lZWRlZChwbGFpblN0eWxlLCBlbmNhcHN1bGF0ZSkpO1xuICAgICAgbmVzdGVkU3R5bGVzLmZvckVhY2goc3R5bGVzID0+IHJlc3VsdC5wdXNoKHN0eWxlcykpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3N0eWxlQ29kZUdlbihwbGFpblN0eWxlczogc3RyaW5nW10sIGFic1VybHM6IHN0cmluZ1tdLCBzaGltOiBib29sZWFuKTogU291cmNlRXhwcmVzc2lvbiB7XG4gICAgdmFyIGFycmF5UHJlZml4ID0gSVNfREFSVCA/IGBjb25zdGAgOiAnJztcbiAgICB2YXIgc3R5bGVFeHByZXNzaW9ucyA9IHBsYWluU3R5bGVzLm1hcChcbiAgICAgICAgcGxhaW5TdHlsZSA9PiBlc2NhcGVTaW5nbGVRdW90ZVN0cmluZyh0aGlzLl9zaGltSWZOZWVkZWQocGxhaW5TdHlsZSwgc2hpbSkpKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWJzVXJscy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG1vZHVsZVVybCA9IHRoaXMuX2NyZWF0ZU1vZHVsZVVybChhYnNVcmxzW2ldLCBzaGltKTtcbiAgICAgIHN0eWxlRXhwcmVzc2lvbnMucHVzaChgJHttb2R1bGVSZWYobW9kdWxlVXJsKX1TVFlMRVNgKTtcbiAgICB9XG4gICAgdmFyIGV4cHJlc3Npb25Tb3VyY2UgPSBgJHthcnJheVByZWZpeH0gWyR7c3R5bGVFeHByZXNzaW9ucy5qb2luKCcsJyl9XWA7XG4gICAgcmV0dXJuIG5ldyBTb3VyY2VFeHByZXNzaW9uKFtdLCBleHByZXNzaW9uU291cmNlKTtcbiAgfVxuXG4gIHByaXZhdGUgX3N0eWxlTW9kdWxlKHN0eWxlc2hlZXRVcmw6IHN0cmluZywgc2hpbTogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbjogU291cmNlRXhwcmVzc2lvbik6IFNvdXJjZU1vZHVsZSB7XG4gICAgdmFyIG1vZHVsZVNvdXJjZSA9IGBcbiAgICAgICR7ZXhwcmVzc2lvbi5kZWNsYXJhdGlvbnMuam9pbignXFxuJyl9XG4gICAgICAke2NvZGVHZW5FeHBvcnRWYXJpYWJsZSgnU1RZTEVTJyl9JHtleHByZXNzaW9uLmV4cHJlc3Npb259O1xuICAgIGA7XG4gICAgcmV0dXJuIG5ldyBTb3VyY2VNb2R1bGUodGhpcy5fY3JlYXRlTW9kdWxlVXJsKHN0eWxlc2hlZXRVcmwsIHNoaW0pLCBtb2R1bGVTb3VyY2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2hpbUlmTmVlZGVkKHN0eWxlOiBzdHJpbmcsIHNoaW06IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgIHJldHVybiBzaGltID8gdGhpcy5fc2hhZG93Q3NzLnNoaW1Dc3NUZXh0KHN0eWxlLCBDT05URU5UX0FUVFIsIEhPU1RfQVRUUikgOiBzdHlsZTtcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZU1vZHVsZVVybChzdHlsZXNoZWV0VXJsOiBzdHJpbmcsIHNoaW06IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgIHJldHVybiBzaGltID8gYCR7c3R5bGVzaGVldFVybH0uc2hpbSR7TU9EVUxFX1NVRkZJWH1gIDogYCR7c3R5bGVzaGVldFVybH0ke01PRFVMRV9TVUZGSVh9YDtcbiAgfVxufVxuIl19