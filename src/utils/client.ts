import createCache from '@emotion/cache';
import { GridValueFormatterParams } from '@mui/x-data-grid';
import { SelectOption } from 'types/client';

export function createEmotionCache() {
  return createCache({ key: 'css' });
}

export function searchFilter<T = { [key: string]: unknown }>(
  searchInput: string,
  array: readonly T[]
) {
  return searchInput.length < 2
    ? array
    : array.filter((entry: T) => {
        for (const [, v] of Object.entries(entry)) {
          if (typeof v === 'string') {
            const value = v.toString().toLowerCase();
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
  options: SelectOption[],
  text?: string
): SelectOption[] {
  return [{ optval: '', optlabel: text ?? 'Bitte wählen' }, ...options];
}
