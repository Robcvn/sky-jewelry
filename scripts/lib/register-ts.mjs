// node --import ./scripts/lib/register-ts.mjs: lets a script import the site's .ts/.tsx files (see ts-hooks.mjs).
import { register } from "node:module";

register("./ts-hooks.mjs", import.meta.url);
