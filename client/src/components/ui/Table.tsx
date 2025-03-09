// Path: components\ui\Table.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  IconButton,
  LinearProgress,
  Tooltip,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Toolbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CloudDownload as ExportIcon,
} from '@mui/icons-material';

// Define Column interface
interface Column {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  minWidth?: number;
  maxWidth?: number;
  format?: (value: any, row?: any) => React.ReactNode;
  sortable?: boolean;
  priority?: number; // Higher values are shown on smaller screens
}

// Define TableProps interface
interface TableProps {
  title: string;
  columns: Column[];
  rows: any[];
  isLoading?: boolean;
  emptyMessage?: string;
  searchPlaceholder?: string;
  stickyHeader?: boolean;
  rowKey?: (row: any) => string;
  actions?: Array<{
    icon: React.ReactNode;
    tooltip: string;
    onClick: (
      event: React.MouseEvent<HTMLButtonElement>,
      selectedRows: any[],
    ) => void;
    isFreeAction?: boolean;
  }>;
  // New prop: Function to get actions for a specific row
  actionGetter?: (row: any) => Array<{
    icon: React.ReactNode;
    tooltip: string;
    onClick: (
      event: React.MouseEvent<HTMLButtonElement>,
      selectedRows: any[],
    ) => void;
  }>;
  onSelectionChange?: (rows: any[]) => void;
  selectedRows?: any[];
  pagination?: {
    page: number;
    rowsPerPage: number;
    totalRows: number;
    onPageChange: (page: number) => void;
  };
  maxHeight?: number | string;
  exportData?: (data: any[]) => void;
  editable?: {
    isEditable?: (rowData: any) => boolean;
    isDeletable?: (rowData: any) => boolean;
    onRowAdd?: (newData: any) => Promise<void>;
    onRowUpdate?: (newData: any, oldData: any) => Promise<void>;
    onRowDelete?: (oldData: any) => Promise<void>;
    editTooltip?: string;
    deleteTooltip?: string;
    addTooltip?: string;
  };
  options?: {
    selection?: boolean;
    exportButton?: boolean;
    actionsColumnIndex?: number;
    paging?: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
    padding?: 'normal' | 'dense';
    headerStyle?: React.CSSProperties;
  };
  components?: {
    EditField?: React.ComponentType<{
      columnDef: any;
      value: any;
      onChange: (value: any) => void;
      rowData: any;
      fallback: React.ReactNode;
    }>;
  };
}

// TablePagination component
const TablePaginationControls = ({
  page,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  pageSizeOptions = [5, 10, 25],
}: {
  page: number;
  rowsPerPage: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  pageSizeOptions?: number[];
}) => {
  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (onRowsPerPageChange) {
      onRowsPerPageChange(parseInt(event.target.value, 10));
    }
    onPageChange(0); // Reset to first page
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2">Rows per page:</Typography>
        <TextField
          select
          value={rowsPerPage}
          onChange={handleChangeRowsPerPage}
          size="small"
          SelectProps={{
            native: true,
          }}
          sx={{ width: 70 }}
        >
          {pageSizeOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </TextField>
        <Typography variant="body2">
          {page * rowsPerPage + 1}-
          {Math.min((page + 1) * rowsPerPage, totalRows)} of {totalRows}
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <IconButton
            onClick={() => handleChangePage(null, page - 1)}
            disabled={page === 0}
            aria-label="previous page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </IconButton>
          <IconButton
            onClick={() => handleChangePage(null, page + 1)}
            disabled={page >= Math.ceil(totalRows / rowsPerPage) - 1}
            aria-label="next page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

// TableToolbar component
const TableToolbar = ({
  title,
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Search...',
  actionButtons,
}: {
  title: string;
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder?: string;
  actionButtons?: React.ReactNode;
}) => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      <Typography variant="h6" id="tableTitle" component="div">
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={onSearchChange}
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />,
          }}
          sx={{ mr: 1 }}
        />
        {actionButtons}
      </Box>
    </Toolbar>
  );
};

// EditDialog component
const TableEditDialog = ({
  open,
  onClose,
  onSave,
  title,
  columns,
  editField,
  isSubmitting,
}: {
  open: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  title: string;
  columns: Column[];
  editField: (column: Column) => React.ReactNode;
  isSubmitting: boolean;
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{columns.map(column => editField(column))}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={onSave}
          color="primary"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// DeleteDialog component
const TableDeleteDialog = ({
  open,
  onClose,
  onConfirmDelete,
  isSubmitting,
}: {
  open: boolean;
  onClose: () => void;
  onConfirmDelete: () => Promise<void>;
  isSubmitting: boolean;
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this item?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={onConfirmDelete}
          color="error"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Table component
export function Table({
  title,
  columns,
  rows,
  isLoading = false,
  emptyMessage = 'No data available.',
  searchPlaceholder = 'Search...',
  stickyHeader = false,
  rowKey,
  actions = [],
  actionGetter,
  onSelectionChange,
  selectedRows = [],
  maxHeight,
  exportData,
  editable,
  options = {},
  components = {},
}: TableProps) {
  // State for sorting
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('');

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(options.pageSize || 10);

  // State for search
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRows, setFilteredRows] = useState<any[]>(rows);

  // State for edit/add dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<any | null>(null);
  const [editRowData, setEditRowData] = useState<Record<string, any>>({});
  const [isNewRow, setIsNewRow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update filtered rows when rows change or search term changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredRows(rows);
      return;
    }

    const filteredData = rows.filter(row => {
      return columns.some(column => {
        const value = row[column.id];
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });

    setFilteredRows(filteredData);
  }, [rows, searchTerm, columns]);

  // Get current page rows
  const currentRows = useMemo(() => {
    // Apply sorting first
    let sortedRows = [...filteredRows];
    if (orderBy) {
      sortedRows.sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];

        if (aValue === null || aValue === undefined)
          return order === 'asc' ? -1 : 1;
        if (bValue === null || bValue === undefined)
          return order === 'asc' ? 1 : -1;

        // Compare based on type
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return order === 'asc' ? aValue - bValue : bValue - aValue;
        }

        // Default string comparison
        return order === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
    }

    // Then apply pagination
    if (options.paging !== false) {
      return sortedRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      );
    }
    return sortedRows;
  }, [filteredRows, orderBy, order, page, rowsPerPage, options.paging]);

  // Handle sort request
  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle page change
  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  // Handle export
  const handleExport = () => {
    if (exportData) {
      exportData(filteredRows);
    }
  };

  // Handle row add
  const handleAddRow = () => {
    // Initialize empty row
    const emptyRow = columns.reduce(
      (acc, column) => {
        acc[column.id] = '';
        return acc;
      },
      {} as Record<string, any>,
    );

    setEditRowData(emptyRow);
    setIsNewRow(true);
    setCurrentRow(null);
    setEditDialogOpen(true);
  };

  // Handle row edit
  const handleEditRow = (row: any) => {
    setEditRowData({ ...row });
    setIsNewRow(false);
    setCurrentRow(row);
    setEditDialogOpen(true);
  };

  // Handle row delete
  const handleDeleteRow = (row: any) => {
    setCurrentRow(row);
    setDeleteDialogOpen(true);
  };

  // Handle edit dialog close
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditRowData({});
  };

  // Handle delete dialog close
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  // Handle save row
  const handleSaveRow = async () => {
    if (!editable) return;

    setIsSubmitting(true);
    try {
      if (isNewRow && editable.onRowAdd) {
        await editable.onRowAdd(editRowData);
      } else if (!isNewRow && editable.onRowUpdate && currentRow) {
        await editable.onRowUpdate(editRowData, currentRow);
      }
      handleEditDialogClose();
    } catch (error) {
      console.error('Error saving row:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete row confirmation
  const handleDeleteRowConfirm = async () => {
    if (!editable || !editable.onRowDelete || !currentRow) return;

    setIsSubmitting(true);
    try {
      await editable.onRowDelete(currentRow);
      handleDeleteDialogClose();
    } catch (error) {
      console.error('Error deleting row:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit field change
  const handleEditFieldChange = (columnId: string, value: any) => {
    setEditRowData((prev: Record<string, any>) => ({
      ...prev,
      [columnId]: value,
    }));
  };

  // Generate action buttons
  const actionButtons = useMemo(() => {
    const buttons = [];

    // Add free actions (e.g., "Add" button)
    const freeActions = actions.filter(action => action.isFreeAction);
    for (const action of freeActions) {
      buttons.push(
        <Tooltip key={action.tooltip} title={action.tooltip}>
          <IconButton
            color="primary"
            onClick={e => action.onClick(e, selectedRows)}
          >
            {action.icon}
          </IconButton>
        </Tooltip>,
      );
    }

    // Add export button
    if (options.exportButton && exportData) {
      buttons.push(
        <Tooltip key="export" title="Export">
          <IconButton color="primary" onClick={handleExport}>
            <ExportIcon />
          </IconButton>
        </Tooltip>,
      );
    }

    // Add button for row creation
    if (editable?.onRowAdd) {
      buttons.push(
        <Tooltip key="add" title={editable.addTooltip || 'Add'}>
          <IconButton color="primary" onClick={handleAddRow}>
            <AddIcon />
          </IconButton>
        </Tooltip>,
      );
    }

    return buttons;
  }, [actions, selectedRows, editable, options.exportButton, exportData]);

  // Render edit dialog fields
  const renderEditField = (column: Column) => {
    const EditField = components?.EditField;
    const value = editRowData[column.id];

    if (EditField) {
      return (
        <EditField
          key={column.id}
          columnDef={{ field: column.id, title: column.label, adding: isNewRow }}
          value={value ?? ''}
          onChange={(newValue: any) =>
            handleEditFieldChange(column.id, newValue)
          }
          rowData={editRowData}
          fallback={
            <TextField
              key={column.id}
              fullWidth
              label={column.label}
              value={value ?? ''}
              onChange={e => handleEditFieldChange(column.id, e.target.value)}
              margin="normal"
            />
          }
        />
      );
    }

    return (
      <TextField
        key={column.id}
        fullWidth
        label={column.label}
        value={value ?? ''}
        onChange={e => handleEditFieldChange(column.id, e.target.value)}
        margin="normal"
      />
    );
  };

  // Render loading state
  if (isLoading && rows.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <TableToolbar
          title={title}
          searchTerm=""
          onSearchChange={() => {}}
          actionButtons={null}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ width: '100%', mb: 2 }}>
      <TableToolbar
        title={title}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder={searchPlaceholder}
        actionButtons={<>{actionButtons}</>}
      />

      {isLoading && <LinearProgress />}

      <TableContainer
        sx={{ maxHeight: maxHeight || (stickyHeader ? 440 : undefined) }}
      >
        <MuiTable
          stickyHeader={stickyHeader}
          size={options.padding === 'dense' ? 'small' : 'medium'}
        >
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    ...options.headerStyle,
                  }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}

              {/* Actions column */}
              {((actions.length > 0 && !actionGetter) || (actionGetter && currentRows.some(row => actionGetter(row).length > 0)) || editable) && (
                <TableCell align="right" style={{ minWidth: 100 }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.length > 0 ? (
              currentRows.map((row, index) => (
                <TableRow
                  hover
                  key={rowKey ? rowKey(row) : index}
                  onClick={() => {
                    if (onSelectionChange && options.selection) {
                      const isSelected = selectedRows.some(selectedRow =>
                        rowKey
                          ? rowKey(selectedRow) === rowKey(row)
                          : selectedRow === row,
                      );

                      const newSelectedRows = isSelected
                        ? selectedRows.filter(selectedRow =>
                            rowKey
                              ? rowKey(selectedRow) !== rowKey(row)
                              : selectedRow !== row,
                          )
                        : [...selectedRows, row];

                      onSelectionChange(newSelectedRows);
                    }
                  }}
                  selected={selectedRows.some(selectedRow =>
                    rowKey
                      ? rowKey(selectedRow) === rowKey(row)
                      : selectedRow === row,
                  )}
                  sx={{ cursor: options.selection ? 'pointer' : 'default' }}
                >
                  {columns.map(column => (
                    <TableCell key={column.id} align={column.align || 'left'}>
                      {column.format
                        ? column.format(row[column.id], row)
                        : row[column.id]}
                    </TableCell>
                  ))}

                  {/* Row action buttons - Updated to support actionGetter */}
                  {((actions.length > 0 && !actionGetter) || (actionGetter && actionGetter(row).length > 0) || editable) && (
                    <TableCell align="right">
                      {/* Get row-specific actions if actionGetter is provided */}
                      {actionGetter 
                        ? actionGetter(row).map(action => (
                            <Tooltip key={action.tooltip} title={action.tooltip}>
                              <IconButton
                                size="small"
                                onClick={e => {
                                  e.stopPropagation();
                                  action.onClick(e, [row]);
                                }}
                              >
                                {action.icon}
                              </IconButton>
                            </Tooltip>
                          ))
                        : /* Show non-free actions */
                          actions
                            .filter(action => !action.isFreeAction)
                            .map(action => (
                              <Tooltip key={action.tooltip} title={action.tooltip}>
                                <IconButton
                                  size="small"
                                  onClick={e => {
                                    e.stopPropagation();
                                    action.onClick(e, [row]);
                                  }}
                                >
                                  {action.icon}
                                </IconButton>
                              </Tooltip>
                            ))
                      }

                      {/* Show edit button if editable */}
                      {editable && editable.isEditable?.(row) !== false && (
                        <Tooltip title={editable.editTooltip || 'Edit'}>
                          <IconButton
                            size="small"
                            onClick={e => {
                              e.stopPropagation();
                              handleEditRow(row);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* Show delete button if editable */}
                      {editable && editable.isDeletable?.(row) !== false && (
                        <Tooltip title={editable.deleteTooltip || 'Delete'}>
                          <IconButton
                            size="small"
                            onClick={e => {
                              e.stopPropagation();
                              handleDeleteRow(row);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length + (actions.length > 0 || editable ? 1 : 0)
                  }
                  align="center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>

      {/* Pagination controls */}
      {options.paging !== false && (
        <TablePaginationControls
          page={page}
          rowsPerPage={rowsPerPage}
          totalRows={filteredRows.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          pageSizeOptions={options.pageSizeOptions}
        />
      )}

      {/* Edit/Add Dialog */}
      <TableEditDialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        onSave={handleSaveRow}
        title={isNewRow ? 'Add New Entry' : 'Edit Entry'}
        columns={columns}
        editField={renderEditField}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <TableDeleteDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirmDelete={handleDeleteRowConfirm}
        isSubmitting={isSubmitting}
      />
    </Paper>
  );
}