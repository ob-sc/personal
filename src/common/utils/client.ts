import createCache from '@emotion/cache';
import { GridValueFormatterParams } from '@mui/x-data-grid';
import { SelectOption } from 'src/common/types/client';

export function createEmotionCache() {
  return createCache({ key: 'css' });
}

/** Filtere Objekte in Array (aus API Call) */
export function searchFilter<T = { [key: string]: unknown }>(
  searchInput: string,
  array: readonly T[]
) {
  return searchInput.length < 2
    ? array
    : array.filter((entry: T) => {
        for (const [, val] of Object.entries(entry)) {
          if (typeof val === 'string') {
            const value = val.toLowerCase();
            const term = searchInput.toLowerCase();
            if (value.includes(term)) return true;
          }
        }
        return false;
      });
}

export function gridEmptyVal(params: GridValueFormatterParams) {
  return params.value ?? '-';
}

export function gridTinyIntVal(params: GridValueFormatterParams) {
  return params.value === 1;
}

/** @example array.map(selectOptionMapper) */
export function selectOptionMapper(obj: {
  id?: number;
  name?: string;
}): SelectOption {
  const optval = obj.id ? String(obj.id) : 'Fehler';
  const optlabel = obj.name ? obj.name : 'Fehler';

  return { optval, optlabel };
}

export function withEmptyOption(
  options: SelectOption[] = [],
  text = 'Bitte wählen'
): SelectOption[] {
  return [{ optval: '', optlabel: text }, ...options];
}
