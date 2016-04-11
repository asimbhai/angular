import { NgZone } from 'angular2/src/core/zone/ng_zone';
import { Provider } from 'angular2/src/core/di';
import { Parse5DomAdapter } from 'angular2/src/platform/server/parse5_adapter';
import { PostMessageBus, PostMessageBusSink, PostMessageBusSource } from 'angular2/src/web_workers/shared/post_message_bus';
import { WORKER_APP_APPLICATION_COMMON } from './worker_app_common';
import { APP_INITIALIZER } from 'angular2/core';
import { MessageBus } from 'angular2/src/web_workers/shared/message_bus';
import { COMPILER_PROVIDERS } from 'angular2/src/compiler/compiler';
// TODO(jteplitz602) remove this and compile with lib.webworker.d.ts (#3492)
let _postMessage = {
    postMessage: (message, transferrables) => {
        postMessage(message, transferrables);
    }
};
export const WORKER_APP_APPLICATION = [
    WORKER_APP_APPLICATION_COMMON,
    COMPILER_PROVIDERS,
    new Provider(MessageBus, { useFactory: createMessageBus, deps: [NgZone] }),
    new Provider(APP_INITIALIZER, { useValue: setupWebWorker, multi: true })
];
function createMessageBus(zone) {
    let sink = new PostMessageBusSink(_postMessage);
    let source = new PostMessageBusSource();
    let bus = new PostMessageBus(sink, source);
    bus.attachToZone(zone);
    return bus;
}
function setupWebWorker() {
    Parse5DomAdapter.makeCurrent();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyX2FwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtWDlKQk1HQ2cudG1wL2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS93b3JrZXJfYXBwLnRzIl0sIm5hbWVzIjpbImNyZWF0ZU1lc3NhZ2VCdXMiLCJzZXR1cFdlYldvcmtlciJdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxnQ0FBZ0M7T0FFOUMsRUFBQyxRQUFRLEVBQUMsTUFBTSxzQkFBc0I7T0FDdEMsRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLDZDQUE2QztPQUNyRSxFQUNMLGNBQWMsRUFDZCxrQkFBa0IsRUFDbEIsb0JBQW9CLEVBQ3JCLE1BQU0sa0RBQWtEO09BQ2xELEVBQUMsNkJBQTZCLEVBQUMsTUFBTSxxQkFBcUI7T0FDMUQsRUFBQyxlQUFlLEVBQUMsTUFBTSxlQUFlO09BQ3RDLEVBQUMsVUFBVSxFQUFDLE1BQU0sNkNBQTZDO09BQy9ELEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxnQ0FBZ0M7QUFFakUsNEVBQTRFO0FBQzVFLElBQUksWUFBWSxHQUFHO0lBQ2pCLFdBQVcsRUFBRSxDQUFDLE9BQVksRUFBRSxjQUE2QjtRQUNqRCxXQUFZLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7Q0FDRixDQUFDO0FBRUYsYUFBYSxzQkFBc0IsR0FBMkM7SUFDNUUsNkJBQTZCO0lBQzdCLGtCQUFrQjtJQUNsQixJQUFJLFFBQVEsQ0FBQyxVQUFVLEVBQUUsRUFBQyxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQztJQUN4RSxJQUFJLFFBQVEsQ0FBQyxlQUFlLEVBQUUsRUFBQyxRQUFRLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQztDQUN2RSxDQUFDO0FBRUYsMEJBQTBCLElBQVk7SUFDcENBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLGtCQUFrQkEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7SUFDaERBLElBQUlBLE1BQU1BLEdBQUdBLElBQUlBLG9CQUFvQkEsRUFBRUEsQ0FBQ0E7SUFDeENBLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLGNBQWNBLENBQUNBLElBQUlBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBO0lBQzNDQSxHQUFHQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtJQUN2QkEsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0E7QUFDYkEsQ0FBQ0E7QUFFRDtJQUNFQyxnQkFBZ0JBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO0FBQ2pDQSxDQUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Tmdab25lfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS96b25lL25nX3pvbmUnO1xuaW1wb3J0IHtUeXBlLCBDT05TVF9FWFBSLCBpc1ByZXNlbnR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge1Byb3ZpZGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5pbXBvcnQge1BhcnNlNURvbUFkYXB0ZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9zZXJ2ZXIvcGFyc2U1X2FkYXB0ZXInO1xuaW1wb3J0IHtcbiAgUG9zdE1lc3NhZ2VCdXMsXG4gIFBvc3RNZXNzYWdlQnVzU2luayxcbiAgUG9zdE1lc3NhZ2VCdXNTb3VyY2Vcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9wb3N0X21lc3NhZ2VfYnVzJztcbmltcG9ydCB7V09SS0VSX0FQUF9BUFBMSUNBVElPTl9DT01NT059IGZyb20gJy4vd29ya2VyX2FwcF9jb21tb24nO1xuaW1wb3J0IHtBUFBfSU5JVElBTElaRVJ9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtNZXNzYWdlQnVzfSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL21lc3NhZ2VfYnVzJztcbmltcG9ydCB7Q09NUElMRVJfUFJPVklERVJTfSBmcm9tICdhbmd1bGFyMi9zcmMvY29tcGlsZXIvY29tcGlsZXInO1xuXG4vLyBUT0RPKGp0ZXBsaXR6NjAyKSByZW1vdmUgdGhpcyBhbmQgY29tcGlsZSB3aXRoIGxpYi53ZWJ3b3JrZXIuZC50cyAoIzM0OTIpXG5sZXQgX3Bvc3RNZXNzYWdlID0ge1xuICBwb3N0TWVzc2FnZTogKG1lc3NhZ2U6IGFueSwgdHJhbnNmZXJyYWJsZXM/OltBcnJheUJ1ZmZlcl0pID0+IHtcbiAgICAoPGFueT5wb3N0TWVzc2FnZSkobWVzc2FnZSwgdHJhbnNmZXJyYWJsZXMpO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgV09SS0VSX0FQUF9BUFBMSUNBVElPTjogQXJyYXk8YW55IC8qVHlwZSB8IFByb3ZpZGVyIHwgYW55W10qLz4gPSBbXG4gIFdPUktFUl9BUFBfQVBQTElDQVRJT05fQ09NTU9OLFxuICBDT01QSUxFUl9QUk9WSURFUlMsXG4gIG5ldyBQcm92aWRlcihNZXNzYWdlQnVzLCB7dXNlRmFjdG9yeTogY3JlYXRlTWVzc2FnZUJ1cywgZGVwczogW05nWm9uZV19KSxcbiAgbmV3IFByb3ZpZGVyKEFQUF9JTklUSUFMSVpFUiwge3VzZVZhbHVlOiBzZXR1cFdlYldvcmtlciwgbXVsdGk6IHRydWV9KVxuXTtcblxuZnVuY3Rpb24gY3JlYXRlTWVzc2FnZUJ1cyh6b25lOiBOZ1pvbmUpOiBNZXNzYWdlQnVzIHtcbiAgbGV0IHNpbmsgPSBuZXcgUG9zdE1lc3NhZ2VCdXNTaW5rKF9wb3N0TWVzc2FnZSk7XG4gIGxldCBzb3VyY2UgPSBuZXcgUG9zdE1lc3NhZ2VCdXNTb3VyY2UoKTtcbiAgbGV0IGJ1cyA9IG5ldyBQb3N0TWVzc2FnZUJ1cyhzaW5rLCBzb3VyY2UpO1xuICBidXMuYXR0YWNoVG9ab25lKHpvbmUpO1xuICByZXR1cm4gYnVzO1xufVxuXG5mdW5jdGlvbiBzZXR1cFdlYldvcmtlcigpOiB2b2lkIHtcbiAgUGFyc2U1RG9tQWRhcHRlci5tYWtlQ3VycmVudCgpO1xufVxuIl19