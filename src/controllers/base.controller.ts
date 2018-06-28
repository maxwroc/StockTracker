
export class BaseController {
    private scriptFiles: { [file: string]: number } = {};
    private styleFiles: { [file: string]: number } = {};

    addScriptFile(path: string) {
        this.scriptFiles[path] = 1;
    }

    getScriptFiles(): string[] {
        return Object.keys(this.scriptFiles).map(s => `<script async="" src="${s}"></script>`);
    }

    addStyleFile(path: string) {
        this.styleFiles[path] = 1;
    }

    getStyleFiles(): string[] {
        return Object.keys(this.styleFiles).map(s => `<link rel="stylesheet" type="text/css" href="${s}">`);
    }
}