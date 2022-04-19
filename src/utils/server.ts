// "Vor"-Validierung, eigentliche Validierung in Sequelize
export const validateForm = async (
  fields: object,
  values: { [key: string]: string }
) => {
  const errors: string[] = [];
  const validatedValues: {
    [key: string]: string | number | null;
  } = {};

  for (const [k, v] of Object.entries(fields)) {
    const currentValue = values[k as keyof typeof fields];

    // createdAt und updatedAt werden von sequelize automatisch befüllt, nicht bewerten
    if (k === 'createdAt' || k === 'updatedAt') continue;

    // wenn es leer ist aber nicht leer sein sollte
    if (currentValue === '' && v.allowNull === false) {
      errors.push(k);
      continue;
    }

    // wenn INT => number
    // andere zahlenformate?
    if (v.type === 'INT') {
      const numberValue = Number(currentValue);
      if (Number.isNaN(numberValue)) errors.push(k);
      else validatedValues[k] = numberValue;
      continue;
    }

    // wenn nicht leer den string hinzufügen
    if (currentValue !== '') validatedValues[k] = currentValue.trim();
  }

  return { values: validatedValues, errors };
};
