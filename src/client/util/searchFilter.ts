const searchFilter = <T = { [key: string]: unknown }>(searchInput: string, array: readonly T[]) =>
  searchInput.length < 2
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

export default searchFilter;
