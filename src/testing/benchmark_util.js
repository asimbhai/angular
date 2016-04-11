'use strict';var browser_adapter_1 = require('angular2/src/platform/browser/browser_adapter');
var browser_1 = require('angular2/src/facade/browser');
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var DOM = new browser_adapter_1.BrowserDomAdapter();
function getIntParameter(name) {
    return lang_1.NumberWrapper.parseInt(getStringParameter(name), 10);
}
exports.getIntParameter = getIntParameter;
function getStringParameter(name) {
    var els = DOM.querySelectorAll(browser_1.document, "input[name=\"" + name + "\"]");
    var value;
    var el;
    for (var i = 0; i < els.length; i++) {
        el = els[i];
        var type = DOM.type(el);
        if ((type != 'radio' && type != 'checkbox') || DOM.getChecked(el)) {
            value = DOM.getValue(el);
            break;
        }
    }
    if (lang_1.isBlank(value)) {
        throw new exceptions_1.BaseException("Could not find and input field with name " + name);
    }
    return value;
}
exports.getStringParameter = getStringParameter;
function bindAction(selector, callback) {
    var el = DOM.querySelector(browser_1.document, selector);
    DOM.on(el, 'click', function (_) { callback(); });
}
exports.bindAction = bindAction;
function microBenchmark(name, iterationCount, callback) {
    var durationName = name + "/" + iterationCount;
    browser_1.window.console.time(durationName);
    callback();
    browser_1.window.console.timeEnd(durationName);
}
exports.microBenchmark = microBenchmark;
function windowProfile(name) {
    browser_1.window.console.profile(name);
}
exports.windowProfile = windowProfile;
function windowProfileEnd(name) {
    browser_1.window.console.profileEnd(name);
}
exports.windowProfileEnd = windowProfileEnd;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVuY2htYXJrX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLUpWanZiOHJDLnRtcC9hbmd1bGFyMi9zcmMvdGVzdGluZy9iZW5jaG1hcmtfdXRpbC50cyJdLCJuYW1lcyI6WyJnZXRJbnRQYXJhbWV0ZXIiLCJnZXRTdHJpbmdQYXJhbWV0ZXIiLCJiaW5kQWN0aW9uIiwibWljcm9CZW5jaG1hcmsiLCJ3aW5kb3dQcm9maWxlIiwid2luZG93UHJvZmlsZUVuZCJdLCJtYXBwaW5ncyI6IkFBQUEsZ0NBQWdDLCtDQUErQyxDQUFDLENBQUE7QUFDaEYsd0JBQStCLDZCQUE2QixDQUFDLENBQUE7QUFDN0QscUJBQXFDLDBCQUEwQixDQUFDLENBQUE7QUFDaEUsMkJBQThDLGdDQUFnQyxDQUFDLENBQUE7QUFFL0UsSUFBSSxHQUFHLEdBQUcsSUFBSSxtQ0FBaUIsRUFBRSxDQUFDO0FBRWxDLHlCQUFnQyxJQUFZO0lBQzFDQSxNQUFNQSxDQUFDQSxvQkFBYUEsQ0FBQ0EsUUFBUUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtBQUM5REEsQ0FBQ0E7QUFGZSx1QkFBZSxrQkFFOUIsQ0FBQTtBQUVELDRCQUFtQyxJQUFZO0lBQzdDQyxJQUFJQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQSxnQkFBZ0JBLENBQUNBLGtCQUFRQSxFQUFFQSxrQkFBZUEsSUFBSUEsUUFBSUEsQ0FBQ0EsQ0FBQ0E7SUFDbEVBLElBQUlBLEtBQUtBLENBQUNBO0lBQ1ZBLElBQUlBLEVBQUVBLENBQUNBO0lBRVBBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1FBQ3BDQSxFQUFFQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNaQSxJQUFJQSxJQUFJQSxHQUFHQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUN4QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsT0FBT0EsSUFBSUEsSUFBSUEsSUFBSUEsVUFBVUEsQ0FBQ0EsSUFBSUEsR0FBR0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbEVBLEtBQUtBLEdBQUdBLEdBQUdBLENBQUNBLFFBQVFBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO1lBQ3pCQSxLQUFLQSxDQUFDQTtRQUNSQSxDQUFDQTtJQUNIQSxDQUFDQTtJQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxjQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNuQkEsTUFBTUEsSUFBSUEsMEJBQWFBLENBQUNBLDhDQUE0Q0EsSUFBTUEsQ0FBQ0EsQ0FBQ0E7SUFDOUVBLENBQUNBO0lBRURBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO0FBQ2ZBLENBQUNBO0FBbkJlLDBCQUFrQixxQkFtQmpDLENBQUE7QUFFRCxvQkFBMkIsUUFBZ0IsRUFBRSxRQUFrQjtJQUM3REMsSUFBSUEsRUFBRUEsR0FBR0EsR0FBR0EsQ0FBQ0EsYUFBYUEsQ0FBQ0Esa0JBQVFBLEVBQUVBLFFBQVFBLENBQUNBLENBQUNBO0lBQy9DQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxPQUFPQSxFQUFFQSxVQUFTQSxDQUFDQSxJQUFJLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDQSxDQUFDQTtBQUNuREEsQ0FBQ0E7QUFIZSxrQkFBVSxhQUd6QixDQUFBO0FBRUQsd0JBQStCLElBQUksRUFBRSxjQUFjLEVBQUUsUUFBUTtJQUMzREMsSUFBSUEsWUFBWUEsR0FBTUEsSUFBSUEsU0FBSUEsY0FBZ0JBLENBQUNBO0lBQy9DQSxnQkFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7SUFDbENBLFFBQVFBLEVBQUVBLENBQUNBO0lBQ1hBLGdCQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQTtBQUN2Q0EsQ0FBQ0E7QUFMZSxzQkFBYyxpQkFLN0IsQ0FBQTtBQUVELHVCQUE4QixJQUFZO0lBQ2xDQyxnQkFBTUEsQ0FBQ0EsT0FBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7QUFDdENBLENBQUNBO0FBRmUscUJBQWEsZ0JBRTVCLENBQUE7QUFFRCwwQkFBaUMsSUFBWTtJQUNyQ0MsZ0JBQU1BLENBQUNBLE9BQVFBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0FBQ3pDQSxDQUFDQTtBQUZlLHdCQUFnQixtQkFFL0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QnJvd3NlckRvbUFkYXB0ZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9icm93c2VyL2Jyb3dzZXJfYWRhcHRlcic7XG5pbXBvcnQge2RvY3VtZW50LCB3aW5kb3d9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvYnJvd3Nlcic7XG5pbXBvcnQge051bWJlcldyYXBwZXIsIGlzQmxhbmt9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb24sIFdyYXBwZWRFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5cbnZhciBET00gPSBuZXcgQnJvd3NlckRvbUFkYXB0ZXIoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEludFBhcmFtZXRlcihuYW1lOiBzdHJpbmcpIHtcbiAgcmV0dXJuIE51bWJlcldyYXBwZXIucGFyc2VJbnQoZ2V0U3RyaW5nUGFyYW1ldGVyKG5hbWUpLCAxMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdHJpbmdQYXJhbWV0ZXIobmFtZTogc3RyaW5nKSB7XG4gIHZhciBlbHMgPSBET00ucXVlcnlTZWxlY3RvckFsbChkb2N1bWVudCwgYGlucHV0W25hbWU9XCIke25hbWV9XCJdYCk7XG4gIHZhciB2YWx1ZTtcbiAgdmFyIGVsO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgZWwgPSBlbHNbaV07XG4gICAgdmFyIHR5cGUgPSBET00udHlwZShlbCk7XG4gICAgaWYgKCh0eXBlICE9ICdyYWRpbycgJiYgdHlwZSAhPSAnY2hlY2tib3gnKSB8fCBET00uZ2V0Q2hlY2tlZChlbCkpIHtcbiAgICAgIHZhbHVlID0gRE9NLmdldFZhbHVlKGVsKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChpc0JsYW5rKHZhbHVlKSkge1xuICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBDb3VsZCBub3QgZmluZCBhbmQgaW5wdXQgZmllbGQgd2l0aCBuYW1lICR7bmFtZX1gKTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRBY3Rpb24oc2VsZWN0b3I6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gIHZhciBlbCA9IERPTS5xdWVyeVNlbGVjdG9yKGRvY3VtZW50LCBzZWxlY3Rvcik7XG4gIERPTS5vbihlbCwgJ2NsaWNrJywgZnVuY3Rpb24oXykgeyBjYWxsYmFjaygpOyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1pY3JvQmVuY2htYXJrKG5hbWUsIGl0ZXJhdGlvbkNvdW50LCBjYWxsYmFjaykge1xuICB2YXIgZHVyYXRpb25OYW1lID0gYCR7bmFtZX0vJHtpdGVyYXRpb25Db3VudH1gO1xuICB3aW5kb3cuY29uc29sZS50aW1lKGR1cmF0aW9uTmFtZSk7XG4gIGNhbGxiYWNrKCk7XG4gIHdpbmRvdy5jb25zb2xlLnRpbWVFbmQoZHVyYXRpb25OYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdpbmRvd1Byb2ZpbGUobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICg8YW55PndpbmRvdy5jb25zb2xlKS5wcm9maWxlKG5hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2luZG93UHJvZmlsZUVuZChuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgKDxhbnk+d2luZG93LmNvbnNvbGUpLnByb2ZpbGVFbmQobmFtZSk7XG59XG4iXX0=