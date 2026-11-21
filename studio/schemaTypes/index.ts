import { blockTypes } from "./blocks";
import { documentTypes } from "./documents";
import { sectionTypes } from "./sections";

export const schemaTypes = [...documentTypes, ...sectionTypes, ...blockTypes];
