'use strict';var angular_entrypoint_1 = require('angular2/src/core/angular_entrypoint');
exports.AngularEntrypoint = angular_entrypoint_1.AngularEntrypoint;
var browser_common_1 = require('angular2/src/platform/browser_common');
exports.BROWSER_PROVIDERS = browser_common_1.BROWSER_PROVIDERS;
exports.ELEMENT_PROBE_PROVIDERS = browser_common_1.ELEMENT_PROBE_PROVIDERS;
exports.ELEMENT_PROBE_PROVIDERS_PROD_MODE = browser_common_1.ELEMENT_PROBE_PROVIDERS_PROD_MODE;
exports.inspectNativeElement = browser_common_1.inspectNativeElement;
exports.BrowserDomAdapter = browser_common_1.BrowserDomAdapter;
exports.By = browser_common_1.By;
exports.Title = browser_common_1.Title;
exports.enableDebugTools = browser_common_1.enableDebugTools;
exports.disableDebugTools = browser_common_1.disableDebugTools;
var lang_1 = require('angular2/src/facade/lang');
var browser_common_2 = require('angular2/src/platform/browser_common');
var core_1 = require('angular2/core');
/**
 * An array of providers that should be passed into `application()` when bootstrapping a component
 * when all templates
 * have been precompiled offline.
 */
exports.BROWSER_APP_PROVIDERS = browser_common_2.BROWSER_APP_COMMON_PROVIDERS;
/**
 * See {@link bootstrap} for more information.
 */
function bootstrapStatic(appComponentType, customProviders, initReflector) {
    if (lang_1.isPresent(initReflector)) {
        initReflector();
    }
    var appProviders = lang_1.isPresent(customProviders) ? [exports.BROWSER_APP_PROVIDERS, customProviders] : exports.BROWSER_APP_PROVIDERS;
    return core_1.platform(browser_common_2.BROWSER_PROVIDERS).application(appProviders).bootstrap(appComponentType);
}
exports.bootstrapStatic = bootstrapStatic;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlcl9zdGF0aWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLVZDVDE2d1pPLnRtcC9hbmd1bGFyMi9wbGF0Zm9ybS9icm93c2VyX3N0YXRpYy50cyJdLCJuYW1lcyI6WyJib290c3RyYXBTdGF0aWMiXSwibWFwcGluZ3MiOiJBQUFBLG1DQUFnQyxzQ0FBc0MsQ0FBQztBQUEvRCxtRUFBK0Q7QUFDdkUsK0JBVU8sc0NBQXNDLENBQUM7QUFUNUMsK0RBQWlCO0FBQ2pCLDJFQUF1QjtBQUN2QiwrRkFBaUM7QUFDakMscUVBQW9CO0FBQ3BCLCtEQUFpQjtBQUNqQixpQ0FBRTtBQUNGLHVDQUFLO0FBQ0wsNkRBQWdCO0FBQ2hCLCtEQUM0QztBQUU5QyxxQkFBOEIsMEJBQTBCLENBQUMsQ0FBQTtBQUN6RCwrQkFHTyxzQ0FBc0MsQ0FBQyxDQUFBO0FBQzlDLHFCQUFxQyxlQUFlLENBQUMsQ0FBQTtBQUVyRDs7OztHQUlHO0FBQ1UsNkJBQXFCLEdBQzlCLDZDQUE0QixDQUFDO0FBRWpDOztHQUVHO0FBQ0gseUJBQWdDLGdCQUFzQixFQUN0QixlQUF3RCxFQUN4RCxhQUF3QjtJQUN0REEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsZ0JBQVNBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQzdCQSxhQUFhQSxFQUFFQSxDQUFDQTtJQUNsQkEsQ0FBQ0E7SUFFREEsSUFBSUEsWUFBWUEsR0FDWkEsZ0JBQVNBLENBQUNBLGVBQWVBLENBQUNBLEdBQUdBLENBQUNBLDZCQUFxQkEsRUFBRUEsZUFBZUEsQ0FBQ0EsR0FBR0EsNkJBQXFCQSxDQUFDQTtJQUNsR0EsTUFBTUEsQ0FBQ0EsZUFBUUEsQ0FBQ0Esa0NBQWlCQSxDQUFDQSxDQUFDQSxXQUFXQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxnQkFBZ0JBLENBQUNBLENBQUNBO0FBQzNGQSxDQUFDQTtBQVZlLHVCQUFlLGtCQVU5QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHtBbmd1bGFyRW50cnlwb2ludH0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvYW5ndWxhcl9lbnRyeXBvaW50JztcbmV4cG9ydCB7XG4gIEJST1dTRVJfUFJPVklERVJTLFxuICBFTEVNRU5UX1BST0JFX1BST1ZJREVSUyxcbiAgRUxFTUVOVF9QUk9CRV9QUk9WSURFUlNfUFJPRF9NT0RFLFxuICBpbnNwZWN0TmF0aXZlRWxlbWVudCxcbiAgQnJvd3NlckRvbUFkYXB0ZXIsXG4gIEJ5LFxuICBUaXRsZSxcbiAgZW5hYmxlRGVidWdUb29scyxcbiAgZGlzYWJsZURlYnVnVG9vbHNcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2Jyb3dzZXJfY29tbW9uJztcblxuaW1wb3J0IHtUeXBlLCBpc1ByZXNlbnR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge1xuICBCUk9XU0VSX1BST1ZJREVSUyxcbiAgQlJPV1NFUl9BUFBfQ09NTU9OX1BST1ZJREVSU1xufSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vYnJvd3Nlcl9jb21tb24nO1xuaW1wb3J0IHtDb21wb25lbnRSZWYsIHBsYXRmb3JtfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcblxuLyoqXG4gKiBBbiBhcnJheSBvZiBwcm92aWRlcnMgdGhhdCBzaG91bGQgYmUgcGFzc2VkIGludG8gYGFwcGxpY2F0aW9uKClgIHdoZW4gYm9vdHN0cmFwcGluZyBhIGNvbXBvbmVudFxuICogd2hlbiBhbGwgdGVtcGxhdGVzXG4gKiBoYXZlIGJlZW4gcHJlY29tcGlsZWQgb2ZmbGluZS5cbiAqL1xuZXhwb3J0IGNvbnN0IEJST1dTRVJfQVBQX1BST1ZJREVSUzogQXJyYXk8YW55IC8qVHlwZSB8IFByb3ZpZGVyIHwgYW55W10qLz4gPVxuICAgIEJST1dTRVJfQVBQX0NPTU1PTl9QUk9WSURFUlM7XG5cbi8qKlxuICogU2VlIHtAbGluayBib290c3RyYXB9IGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYm9vdHN0cmFwU3RhdGljKGFwcENvbXBvbmVudFR5cGU6IFR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbVByb3ZpZGVycz86IEFycmF5PGFueSAvKlR5cGUgfCBQcm92aWRlciB8IGFueVtdKi8+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0UmVmbGVjdG9yPzogRnVuY3Rpb24pOiBQcm9taXNlPENvbXBvbmVudFJlZj4ge1xuICBpZiAoaXNQcmVzZW50KGluaXRSZWZsZWN0b3IpKSB7XG4gICAgaW5pdFJlZmxlY3RvcigpO1xuICB9XG5cbiAgbGV0IGFwcFByb3ZpZGVycyA9XG4gICAgICBpc1ByZXNlbnQoY3VzdG9tUHJvdmlkZXJzKSA/IFtCUk9XU0VSX0FQUF9QUk9WSURFUlMsIGN1c3RvbVByb3ZpZGVyc10gOiBCUk9XU0VSX0FQUF9QUk9WSURFUlM7XG4gIHJldHVybiBwbGF0Zm9ybShCUk9XU0VSX1BST1ZJREVSUykuYXBwbGljYXRpb24oYXBwUHJvdmlkZXJzKS5ib290c3RyYXAoYXBwQ29tcG9uZW50VHlwZSk7XG59XG4iXX0=