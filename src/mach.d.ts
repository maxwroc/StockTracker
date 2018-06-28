
declare module "mach" {
    namespace Mach {
        interface AppConstructor {
            (conn: any): App;
        }
        interface App extends AppConstructor {
            delete: { (pattern, app): void };
            get: { (pattern, app): void };
            head: { (pattern, app): void };
            map: { (location, app): void };
            options: { (pattern, app): void };
            put: { (pattern, app): void };
            post: { (pattern, app): void };
            route: { (pattern, methods, app): void };
            run: { (downstreamApp): void };
            trace: { (pattern, app): void };
            use: { (middleware, ...options: any[]): void };
            length: number;
        }

        interface Router {
            hello: string;
        }

        export function stack(): Mach.App;
        export function serve(app: Mach.AppConstructor);

        // middleware
        export function logger(app: Mach.App, messageHandler: { (message: string): void }): Mach.AppConstructor;
        export function params(app: Mach.App, options: number | { maxLength: number }): Mach.AppConstructor;
        export function file(path: string): Mach.AppConstructor;
        export function file(app: Mach.App, options: string | { root: string, index: string | string[], autoIndex: boolean, useLastModified: boolean, useETag: boolean }): Mach.AppConstructor;
    }

    export = Mach;
}