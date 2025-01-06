import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../features/users/userSlice';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, TextField, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from './userList.styles';

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
    const searchTerm = event.target.value.toLowerCase();
    setSearchValue(searchTerm);
    const filteredUserList = users.filter((user) =>
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm)
    );
    setFilteredUsers(filteredUserList);
  };

  return (
    <>
      {status === 'loading' ? (
        <Box sx={styles.loader}>
          <CircularProgress />
        </Box>
      ) : users.length === 0 || error ? (
        <Typography sx={styles.centeredText}>No Users Found</Typography>
      ) : (
        <>
          <Typography variant="h5" align="left" sx={styles.title}>
            User List
          </Typography>
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
                {filteredUsers?.map((user) => (
                  <TableRow
                    key={user?.id}
                    onClick={() => handleUserNavigation(user?.id)}
                    sx={styles.clickableRow}
                  >
                    <TableCell sx={styles.bodyCell} component="th" scope="row">
                      {user?.firstName}
                    </TableCell>
                    <TableCell sx={styles.bodyCell}>{user?.lastName}</TableCell>
                    <TableCell sx={styles.bodyCell}>{user?.email}</TableCell>
                    <TableCell sx={styles.bodyCell}>{user?.phone}</TableCell>
                    <TableCell sx={styles.bodyCell}>{user?.company?.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );

}
