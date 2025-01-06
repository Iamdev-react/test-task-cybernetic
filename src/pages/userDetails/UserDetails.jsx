import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Card, CardContent, Box, CircularProgress } from '@mui/material';
import { fetchUserDetails } from '../../features/users/userSlice';

const styles = {
  card: {
    boxShadow: 'none',
    textAlign: 'left',
  },
  title: {
    fontSize: '25px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  section: {
    marginBottom: 2,
  },
  text: {
    fontSize: '18px',
    paddingBottom: '6px',
  },
  centeredText: {
    textAlign: 'center',
  },
  loader: {
    height: '70vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

export default function UserDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [userDetail, setUserDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true)
    dispatch(fetchUserDetails(id)).then((response) => {
      setIsLoading(false)
      if (response.meta.requestStatus === 'fulfilled') {
        setUserDetail(response.payload);
      }
    });
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <Box sx={styles.loader}>
        <CircularProgress />
      </Box>
    );
  }

  if (!userDetail) {
    return <Typography style={styles.centeredText}>User not found</Typography>;
  }

  return (
    <>
      <Card sx={styles.card}>
        <CardContent>
          <Typography variant="h5" style={styles.title}>User Details</Typography>
          <Box sx={styles.section}>
            <Typography style={styles.text}><strong>First Name:</strong> {userDetail.firstName}</Typography>
            <Typography style={styles.text}><strong>Last Name:</strong> {userDetail.lastName}</Typography>
            <Typography style={styles.text}><strong>Email:</strong> {userDetail.email}</Typography>
            <Typography style={styles.text}><strong>Phone:</strong> {userDetail.phone}</Typography>
          </Box>
          <Box sx={styles.section}>
            <Typography style={styles.text}><strong>Company Name:</strong> {userDetail.company.name}</Typography>
            <Typography style={styles.text}><strong>Address:</strong> {userDetail.company.address.address}</Typography>
            <Typography style={styles.text}><strong>Department:</strong> {userDetail.company.department}</Typography>
            <Typography style={styles.text}><strong>Title:</strong> {userDetail.company.title}</Typography>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
