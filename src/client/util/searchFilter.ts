const searchFilter = <T>(searchInput: string, array: T[]) =>
  searchInput.length < 2
    ? array
    : array.filter((entry: T) => {
        for (const [, v] of Object.entries(entry)) {
          if (typeof v === 'string') {
            if (v.toLowerCase().includes(searchInput.toLowerCase())) return true;
          }
        }
        return false;
      });

export default searchFilter;
