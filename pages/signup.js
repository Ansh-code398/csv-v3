import React, { useRef, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import LinkBody from 'next/link'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useRouter } from 'next/router';
import { VideoCard } from 'material-ui-player';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

export default function SignUp(props) {
  const theme = createTheme();
  const email = useRef();
  const password = useRef();
  const profilePic = useRef();
  const name = useRef();
  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();
      try {
        const data = await axios.post('https://csv-v3-api.vercel.app/api/auth/register', {
          email: email.current.value,
          password: password.current.value,
          photo_url: profilePic.current.value,
          username: name.current.value,
        });
        localStorage.setItem('user', data.data._id);
        props.setUser(data.data);
        router.push('/');
      }
      catch (err) {
        console.log(err);
      }
  };
  useEffect(() => {
    if (localStorage.getItem('user') !== null) {
      router.push('/');
    }
  }, []);

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="Name"
                  label="Name"
                  autoFocus
                  inputRef={name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  inputRef={email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  inputRef={password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="profile"
                  label="profile pic url"
                  type="url"
                  id="profile"
                  autoComplete="profile"
                  inputRef={profilePic}
                />
              </Grid>

            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              className='bg-blue-500 hover:bg-blue-900'
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link variant="body2">
                  <LinkBody href="/signin">
                    Already have an account? Sign in
                  </LinkBody>
                </Link>
              </Grid>
            </Grid>
            
          </Box>
        </Box>
      </Container>
  );
}