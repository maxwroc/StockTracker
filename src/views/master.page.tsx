
const scripts: { [script: string]: number } = {};

const Master = ({ title, body }) => {
  const scriptsString = Object.keys(scripts).map(s => `<script src="${s}"></script>`).join("");
  return `
<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
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

export default Master;