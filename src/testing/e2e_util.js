'use strict';var webdriver = require('selenium-webdriver');
exports.browser = global['browser'];
exports.$ = global['$'];
function clickAll(buttonSelectors) {
    buttonSelectors.forEach(function (selector) { exports.$(selector).click(); });
}
exports.clickAll = clickAll;
function verifyNoBrowserErrors() {
    // TODO(tbosch): Bug in ChromeDriver: Need to execute at least one command
    // so that the browser logs can be read out!
    exports.browser.executeScript('1+1');
    exports.browser.manage().logs().get('browser').then(function (browserLog) {
        var filteredLog = browserLog.filter(function (logEntry) {
            if (logEntry.level.value >= webdriver.logging.Level.INFO.value) {
                console.log('>> ' + logEntry.message);
            }
            return logEntry.level.value > webdriver.logging.Level.WARNING.value;
        });
        expect(filteredLog).toEqual([]);
    });
}
exports.verifyNoBrowserErrors = verifyNoBrowserErrors;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZTJlX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLUpWanZiOHJDLnRtcC9hbmd1bGFyMi9zcmMvdGVzdGluZy9lMmVfdXRpbC50cyJdLCJuYW1lcyI6WyJjbGlja0FsbCIsInZlcmlmeU5vQnJvd3NlckVycm9ycyJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBWSxTQUFTLFdBQU0sb0JBQW9CLENBQUMsQ0FBQTtBQUVyQyxlQUFPLEdBQXdCLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqRCxTQUFDLEdBQXNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUU5QyxrQkFBeUIsZUFBZTtJQUN0Q0EsZUFBZUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBU0EsUUFBUUEsSUFBSSxTQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUNBLENBQUNBO0FBQ3ZFQSxDQUFDQTtBQUZlLGdCQUFRLFdBRXZCLENBQUE7QUFFRDtJQUNFQywwRUFBMEVBO0lBQzFFQSw0Q0FBNENBO0lBQzVDQSxlQUFPQSxDQUFDQSxhQUFhQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtJQUM3QkEsZUFBT0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBU0EsVUFBVUE7UUFDN0QsSUFBSSxXQUFXLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFTLFFBQVE7WUFDbkQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQy9ELE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN4QyxDQUFDO1lBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDdEUsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLENBQUMsQ0FBQ0EsQ0FBQ0E7QUFDTEEsQ0FBQ0E7QUFiZSw2QkFBcUIsd0JBYXBDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB3ZWJkcml2ZXIgZnJvbSAnc2VsZW5pdW0td2ViZHJpdmVyJztcblxuZXhwb3J0IHZhciBicm93c2VyOiBwcm90cmFjdG9yLklCcm93c2VyID0gZ2xvYmFsWydicm93c2VyJ107XG5leHBvcnQgdmFyICQ6IGNzc1NlbGVjdG9ySGVscGVyID0gZ2xvYmFsWyckJ107XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGlja0FsbChidXR0b25TZWxlY3RvcnMpIHtcbiAgYnV0dG9uU2VsZWN0b3JzLmZvckVhY2goZnVuY3Rpb24oc2VsZWN0b3IpIHsgJChzZWxlY3RvcikuY2xpY2soKTsgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2ZXJpZnlOb0Jyb3dzZXJFcnJvcnMoKSB7XG4gIC8vIFRPRE8odGJvc2NoKTogQnVnIGluIENocm9tZURyaXZlcjogTmVlZCB0byBleGVjdXRlIGF0IGxlYXN0IG9uZSBjb21tYW5kXG4gIC8vIHNvIHRoYXQgdGhlIGJyb3dzZXIgbG9ncyBjYW4gYmUgcmVhZCBvdXQhXG4gIGJyb3dzZXIuZXhlY3V0ZVNjcmlwdCgnMSsxJyk7XG4gIGJyb3dzZXIubWFuYWdlKCkubG9ncygpLmdldCgnYnJvd3NlcicpLnRoZW4oZnVuY3Rpb24oYnJvd3NlckxvZykge1xuICAgIHZhciBmaWx0ZXJlZExvZyA9IGJyb3dzZXJMb2cuZmlsdGVyKGZ1bmN0aW9uKGxvZ0VudHJ5KSB7XG4gICAgICBpZiAobG9nRW50cnkubGV2ZWwudmFsdWUgPj0gd2ViZHJpdmVyLmxvZ2dpbmcuTGV2ZWwuSU5GTy52YWx1ZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnPj4gJyArIGxvZ0VudHJ5Lm1lc3NhZ2UpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxvZ0VudHJ5LmxldmVsLnZhbHVlID4gd2ViZHJpdmVyLmxvZ2dpbmcuTGV2ZWwuV0FSTklORy52YWx1ZTtcbiAgICB9KTtcbiAgICBleHBlY3QoZmlsdGVyZWRMb2cpLnRvRXF1YWwoW10pO1xuICB9KTtcbn1cbiJdfQ==