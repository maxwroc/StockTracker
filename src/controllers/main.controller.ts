
export class MainController {
    constructor(app: any, private database: any) {
        app.get("/", conn => this.getIndex());
    }

    private getIndex(): string {
        return "Hello!!!";
    }
}
