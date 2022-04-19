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

    // key des Modells wird nicht durch values übergeben, fehlt also im Formular
    if (currentValue === undefined) {
      errors.push(k);
      continue;
    }

    // wenn leer => null
    if (currentValue === '') {
      if (v.allowNull === false) errors.push(k);
      else validatedValues[k] = null;
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

    // sonst einfach den string hinzufügen
    validatedValues[k] = currentValue.trim();
  }

  return { values: validatedValues, errors };
};
