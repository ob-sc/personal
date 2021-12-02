import { GridLocaleText } from '@mui/x-data-grid';

const dataGridLocale: GridLocaleText = {
  // Root
  noRowsLabel: 'Keine Einträge',
  noResultsOverlayLabel: 'Kein Ergebnis gefunden',
  errorOverlayDefaultLabel: 'Es ist ein Fehler aufgetreten',

  // Density selector toolbar button text
  toolbarDensity: 'Dichte',
  toolbarDensityLabel: 'Dichte',
  toolbarDensityCompact: 'Kompakt',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Komfortabel',

  // Columns selector toolbar button text
  toolbarColumns: 'Spalten',
  toolbarColumnsLabel: 'Spalten auswählen',

  // Filters toolbar button text
  toolbarFilters: 'Filter',
  toolbarFiltersLabel: 'Filter zeigen',
  toolbarFiltersTooltipHide: 'Filter verstecken',
  toolbarFiltersTooltipShow: 'Filter zeigen',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktive Filter` : `${count} aktiver Filter`,

  // Export selector toolbar button text
  toolbarExport: 'Exportieren',
  toolbarExportLabel: 'Exportieren',
  toolbarExportCSV: 'Download als CSV',
  toolbarExportPrint: 'Drucken',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Spalte finden',
  columnsPanelTextFieldPlaceholder: 'Spaltentitel',
  columnsPanelDragIconLabel: 'Spalten umsortieren',
  columnsPanelShowAllButton: 'Alle anzeigen',
  columnsPanelHideAllButton: 'Alle verstecken',

  // Filter panel text
  filterPanelAddFilter: 'Filter hinzufügen',
  filterPanelDeleteIconLabel: 'Löschen',
  filterPanelOperators: 'Operatoren',
  filterPanelOperatorAnd: 'Und',
  filterPanelOperatorOr: 'Oder',
  filterPanelColumns: 'Spalten',
  filterPanelInputLabel: 'Wert',
  filterPanelInputPlaceholder: 'Wert filtern',

  // Filter operators text
  filterOperatorContains: 'enthält',
  filterOperatorEquals: 'ist gleich',
  filterOperatorStartsWith: 'startet mit',
  filterOperatorEndsWith: 'ended mit',
  filterOperatorIs: 'ist',
  filterOperatorNot: 'ist nicht',
  filterOperatorAfter: 'ist nach',
  filterOperatorOnOrAfter: 'ist am oder nach',
  filterOperatorBefore: 'ist vor',
  filterOperatorOnOrBefore: 'ist am oder vor',
  filterOperatorIsEmpty: 'ist leer',
  filterOperatorIsNotEmpty: 'ist nicht leer',

  // Filter values text
  filterValueAny: 'egal',
  filterValueTrue: 'wahr',
  filterValueFalse: 'falsch',

  // Column menu text
  columnMenuLabel: 'Menü',
  columnMenuShowColumns: 'Spalten zeigen',
  columnMenuFilter: 'Filter',
  columnMenuHideColumn: 'Verstecken',
  columnMenuUnsort: 'Nicht sortieren',
  columnMenuSortAsc: 'Aufsteigend',
  columnMenuSortDesc: 'Absteigend',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktive Filter` : `${count} aktiver Filter`,
  columnHeaderFiltersLabel: 'Filter zeigen',
  columnHeaderSortIconLabel: 'Sortieren',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1 ? `${count.toLocaleString()} Zeilen` : `${count.toLocaleString()} Zeile`,

  // Total rows footer text
  footerTotalRows: 'Zeilen insgesamt:',

  // Total visible rows footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Checkbox Auswahl',

  // Boolean cell text
  booleanCellTrueLabel: 'wahr',
  booleanCellFalseLabel: 'falsch',

  // Actions cell more text
  actionsCellMore: 'mehr',

  // Tree Data
  // treeDataGroupingHeaderName: 'Group',
  // treeDataExpand: 'see children',
  // treeDataCollapse: 'hide children',

  // Used core components translation keys
  MuiTablePagination: {},
};

export default dataGridLocale;
