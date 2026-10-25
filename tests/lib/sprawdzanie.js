// Wyciąga z index.html funkcje sprawdzania odpowiedzi (bez przeglądarki) – testy zawsze sprawdzają aktualny kod aplikacji.
const fs = require("fs"), path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "..", "index.html"), "utf8");
const a = src.indexOf("const clozeAnswer ="), b = src.indexOf("// Ocena sensu przez AI");
if (a < 0 || b < 0) throw new Error("Nie znaleziono bloku sprawdzania w index.html (znaczniki: 'const clozeAnswer =' … '// Ocena sensu przez AI')");
module.exports = new Function(src.slice(a, b) + "\nreturn {offlineCap,checkAnswer,mathKey,plain,fold,norm,answerAlts,splitParen,numValue,clozeAnswer,exprKey,shortMatch};")();
