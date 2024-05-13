import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { createClient } from '@supabase/supabase-js';
import moment from 'moment-timezone';
import logo from '../logoVPI_vr2.png';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const columns = [
  { id: 'id', label: 'ID', minWidth: 100 }, 
  { 
    id: 'created_at', 
    label: 'Thời gian', 
    minWidth: 200, 
    format: (id) => {
      const vietnamDateTime = moment.utc(id).tz('Asia/Ho_Chi_Minh').format('DD-MM-yyyy, HH:mm:ss');
      return vietnamDateTime;
    } 
  },
  { id: 'img_id', label: 'Id ảnh', minWidth: 200 },
  { id: 'name_job', label: 'Tên công việc', minWidth: 200 },
  { id: 'note_job', label: 'Ghi chú', minWidth: 200 },
  { id: 'type_manage_job', label: 'Loại công việc', minWidth: 200 },
  { id: 'user_email', label: 'Email', minWidth: 200 },
];

const StickyHeadTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [sort, setSort] = useState({
    sortBy: null,
    sortDirection: 'asc',
  });
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('checking_job_management')
        .select('*');
        
      if (error) {
        console.error('Error fetching data:', error.message);
        setError(error.message);
      } else {
        setRows(data);
        setFilteredRows(data);
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setError(error.message);
    }
  };
   
  useEffect(() => {
    fetchData();
  }, []);

  const handleSort = (columnId) => {
    const isAsc = sort.sortBy === columnId && sort.sortDirection === 'asc';
    const sortedRows = [...filteredRows].sort((a, b) => {
      if (columnId === 'created_at') {
        // Convert timestamps to moment objects for proper comparison
        const dateA = moment.utc(a[columnId]);
        const dateB = moment.utc(b[columnId]);
        return isAsc ? dateA - dateB : dateB - dateA;
      } else {
        // For other columns, use simple string comparison
        return isAsc ? a[columnId].localeCompare(b[columnId]) : b[columnId].localeCompare(a[columnId]);
      }
    });
    setFilteredRows(sortedRows);
    setSort({
      sortBy: columnId,
      sortDirection: isAsc ? 'desc' : 'asc',
    });
  };
  
  const handleSearchClick = async () => {
    try {
      const filteredRows = rows.filter((row) =>
        Object.values(row).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
      setFilteredRows(filteredRows);
    } catch (error) {
      console.error('Error searching data:', error.message);
      setError(error.message);
    }
  };
  

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    if (event.target.value.trim() === '') {
      setFilteredRows(rows);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div style={{ maxWidth: '100%', overflowX: 'hidden', marginTop: '0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
        <img src={logo} className="App-logo" alt="logo" style={{ width: '150px', height: '140px', marginRight: '0' }} />
        <h1 style={{ fontSize: '42px', flexGrow: 1 ,textAlign: 'center',marginRight: '4em'}}>Quản lý công việc</h1>
      </div>

      <div style={{ marginBottom: '20px', textAlign: 'right', marginRight: '10px' }}>
        <TextField 
          id="search" 
          label="Search" 
          variant="outlined" 
          size="small" 
          value={searchValue} 
          onChange={handleSearchChange} 
        />
        <Button 
          id="searchBtn" 
          variant="contained" 
          sx={{ marginLeft: '10px' }} 
          onClick={handleSearchClick} 
        >
          Search
        </Button>
      </div>
      <Paper sx={{ width: '100%', overflowX: 'auto' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="center"
                    style={{ minWidth: column.minWidth, fontSize: '18px', fontWeight: 'bold' }}
                    onClick={() => handleSort(column.id)}
                  >
                    {column.label}
                    {sort.sortBy === column.id && (
                      <span style={{ marginLeft: '5px' }}>
                        {sort.sortDirection === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align="center" style={{ fontSize: '16px' }}>
                          {column.format ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default StickyHeadTable;
