import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams} from 'react-router-dom';

import { Typography, Card, CardContent, Box, CircularProgress } from '@mui/material';
import { fetchUserDetails } from '../../features/users/userSlice';
import styles from './userDetails.styles';

export default function UserDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [userDetail, setUserDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true)
    dispatch(fetchUserDetails(id)).then((response) => {
      setIsLoading(false)
      if (response?.meta?.requestStatus === 'fulfilled') {
        setUserDetail(response.payload);
      }
    });
  }, [dispatch, id]);

  return (
    <>
      {isLoading ? (
        <Box sx={styles.loader}>
          <CircularProgress />
        </Box>
      ) : !userDetail ? (
        <Typography style={styles.centeredText}>User not found</Typography>
      ) : (
        <Card sx={styles.card}>
          <CardContent>
            <Typography variant="h5" style={styles.title}>User Details</Typography>
            <Box sx={styles.section}>
              <Typography style={styles.text}><strong>First Name:</strong> {userDetail?.firstName}</Typography>
              <Typography style={styles.text}><strong>Last Name:</strong> {userDetail?.lastName}</Typography>
              <Typography style={styles.text}><strong>Email:</strong> {userDetail?.email}</Typography>
              <Typography style={styles.text}><strong>Phone:</strong> {userDetail?.phone}</Typography>
            </Box>
            <Box sx={styles.section}>
              <Typography style={styles.text}><strong>Company Name:</strong> {userDetail?.company.name}</Typography>
              <Typography style={styles.text}><strong>Address:</strong> {userDetail?.company.address.address}</Typography>
              <Typography style={styles.text}><strong>Department:</strong> {userDetail?.company.department}</Typography>
              <Typography style={styles.text}><strong>Title:</strong> {userDetail?.company.title}</Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </>
  );
  
}
