
import { renderToString } from "react-dom/server";


const scripts: { [script: string]: number } = {};

export interface IMasterProps<T> {
  title: string,
  body: string
}

export function Master<T>(props: IMasterProps<T>) {
    const { title, body } = props;
    const scriptsString = Object.keys(scripts).map(s => `<script src="${s}"></script>`).join("");
    return `
<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/bootstrap.min.css">
    ${scriptsString}
  </head>
  <body style="margin:0">
    <div id="app">${body}</div>
  </body>
</html>
`;
}

export function addScriptFile(...files: string[]) {
    files.forEach(f => {
        if (!f.startsWith("http") && !f.startsWith("js/")) {
            f = "js/" + f;
        }

        scripts[f] = 1;
    });
}

export function jsxToString<T>(elemConstructor: { (props: T): JSX.Element }, props: T): string {
  return renderToString(elemConstructor(props));
}

export default Master;