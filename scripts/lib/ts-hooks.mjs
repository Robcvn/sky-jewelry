// Node module hooks so build scripts can import the site's TypeScript content files as they are: the "@/" alias,
// extensionless relative imports, and .ts/.tsx compiled with the site's own TypeScript (types stripped, JSX for React).
// Registered by scripts/lib/register-ts.mjs (node --import ./scripts/lib/register-ts.mjs script.mjs).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const SRC = path.resolve(fileURLToPath(new URL("../../src/", import.meta.url)));
const EXTENSIONS = [".ts", ".tsx", "/index.ts", "/index.tsx"];

function candidate(base) {
  if (fs.existsSync(base) && fs.statSync(base).isFile()) return base;
  for (const extension of EXTENSIONS) if (fs.existsSync(base + extension)) return base + extension;
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const file = candidate(path.join(SRC, specifier.slice(2)));
    if (file) return { url: pathToFileURL(file).href, shortCircuit: true };
  }
  if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.startsWith("file:")) {
    const file = candidate(path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier));
    if (file) return { url: pathToFileURL(file).href, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.startsWith("file:") && /\.tsx?$/.test(url)) {
    const file = fileURLToPath(url);
    const { outputText } = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      fileName: file,
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, isolatedModules: true, verbatimModuleSyntax: false },
    });
    return { format: "module", source: outputText, shortCircuit: true };
  }
  return nextLoad(url, context);
}
