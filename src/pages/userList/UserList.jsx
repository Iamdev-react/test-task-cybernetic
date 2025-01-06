import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../features/users/userSlice';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, TextField, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const styles = {
  title: {
    margin: '20px 0',
  },
  searchBox: {
    marginBottom: '20px',
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: '18px',
  },
  bodyCell: {
    fontSize: '16px',
  },
  clickableRow: {
    cursor: 'pointer',
  },
  loader: {
    height: '70vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

export default function UserList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, status, error } = useSelector((state) => state.users);

  const [searchValue, setSearchValue] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (users.length > 0) {
      setFilteredUsers(users);
    }
  }, [users]);

  const handleUserNavigation = (id) => {
    navigate(`/user/${id}`);
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchValue(value);
    const filtered = users.filter((user) =>
      user.firstName.toLowerCase().includes(value) ||
      user.lastName.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
  };

  if (status === 'loading') {
    return (
      <Box sx={styles.loader}>
        <CircularProgress />
      </Box>
    );
  }

  if (users.length === 0 || error) {
    return <p>No Users Found</p>;
  }

  return (
    <>
      <Typography variant="h5" align="left" sx={styles.title}>User List</Typography>
      <Box sx={styles.searchBox}>
        <TextField
          label="Search Users"
          variant="outlined"
          fullWidth
          value={searchValue}
          onChange={handleSearch}
          placeholder="Search by Name"
        />
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={styles.headerCell}>First name</TableCell>
              <TableCell sx={styles.headerCell}>Last name</TableCell>
              <TableCell sx={styles.headerCell}>Email</TableCell>
              <TableCell sx={styles.headerCell}>Phone</TableCell>
              <TableCell sx={styles.headerCell}>Company Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => handleUserNavigation(row.id)}
                sx={styles.clickableRow}
              >
                <TableCell sx={styles.bodyCell} component="th" scope="row">
                  {row.firstName}
                </TableCell>
                <TableCell sx={styles.bodyCell}>{row.lastName}</TableCell>
                <TableCell sx={styles.bodyCell}>{row.email}</TableCell>
                <TableCell sx={styles.bodyCell}>{row.phone}</TableCell>
                <TableCell sx={styles.bodyCell}>{row.company.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
