// Schema Evolution Diff & Compatibility Checker

import { Schema, SchemaField } from '@/types';

export interface SchemaDiffResult {
  compatibility: 'Compatible' | 'Warning' | 'Breaking';
  addedFields: SchemaField[];
  removedFields: SchemaField[];
  modifiedFields: { fieldName: string; change: string }[];
  summary: string;
}

export function compareSchemas(oldSchema: Schema, newSchema: Schema): SchemaDiffResult {
  const oldFieldMap = new Map(oldSchema.fields.map(f => [f.name, f]));
  const newFieldMap = new Map(newSchema.fields.map(f => [f.name, f]));

  const addedFields: SchemaField[] = [];
  const removedFields: SchemaField[] = [];
  const modifiedFields: { fieldName: string; change: string }[] = [];

  newSchema.fields.forEach(newF => {
    const oldF = oldFieldMap.get(newF.name);
    if (!oldF) {
      addedFields.push(newF);
    } else {
      if (oldF.type !== newF.type) {
        modifiedFields.push({ fieldName: newF.name, change: `Type changed from ${oldF.type} to ${newF.type}` });
      }
      if (oldF.required !== newF.required) {
        modifiedFields.push({ fieldName: newF.name, change: `Required changed from ${oldF.required} to ${newF.required}` });
      }
    }
  });

  oldSchema.fields.forEach(oldF => {
    if (!newFieldMap.has(oldF.name)) {
      removedFields.push(oldF);
    }
  });

  let compatibility: 'Compatible' | 'Warning' | 'Breaking' = 'Compatible';

  if (removedFields.length > 0 || modifiedFields.some(m => m.change.includes('Type changed'))) {
    compatibility = 'Breaking';
  } else if (addedFields.some(f => f.required) || modifiedFields.length > 0) {
    compatibility = 'Warning';
  }

  const summary = `Diff v${oldSchema.version} -> v${newSchema.version}: ${addedFields.length} added, ${removedFields.length} removed, ${modifiedFields.length} modified. Result: ${compatibility}.`;

  return {
    compatibility,
    addedFields,
    removedFields,
    modifiedFields,
    summary,
  };
}
