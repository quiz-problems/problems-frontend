import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Button,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ReplayIcon from '@mui/icons-material/Replay';
import HomeIcon from '@mui/icons-material/Home';

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const results = location.state?.results;

  if (!results) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            No results available
          </Typography>
          <Typography color="text.secondary" paragraph>
            Please take a quiz first to see your results
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/quizzes')}
            startIcon={<HomeIcon />}
          >
            Browse Quizzes
          </Button>
        </Paper>
      </Container>
    );
  }

  const { score, correctAnswers, totalQuestions, timeSpent } = results;
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  const getScoreColor = (score) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        background: `linear-gradient(to bottom, ${theme.palette.primary.light}15, ${theme.palette.background.default})`,
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 4, 
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                Quiz Results
              </Typography>

              <Box 
                sx={{ 
                  position: 'relative', 
                  display: 'inline-flex',
                  my: 4
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={160}
                  thickness={4}
                  sx={{ color: theme.palette.grey[200] }}
                />
                <CircularProgress
                  variant="determinate"
                  value={score}
                  size={160}
                  thickness={4}
                  sx={{
                    color: getScoreColor(score),
                    position: 'absolute',
                    left: 0,
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="h3"
                    component="div"
                    color={getScoreColor(score)}
                    sx={{ fontWeight: 700 }}
                  >
                    {score}%
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                <Grid item>
                  <Paper 
                    elevation={2}
                    sx={{ 
                      p: 2, 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 1,
                      backgroundColor: theme.palette.success.light,
                      color: theme.palette.success.dark
                    }}
                  >
                    <CheckCircleIcon />
                    <Typography variant="h6">
                      {correctAnswers} Correct
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper 
                    elevation={2}
                    sx={{ 
                      p: 2, 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 1,
                      backgroundColor: theme.palette.error.light,
                      color: theme.palette.error.dark
                    }}
                  >
                    <CancelIcon />
                    <Typography variant="h6">
                      {totalQuestions - correctAnswers} Incorrect
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Performance Summary
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmojiEventsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Accuracy"
                    secondary={`${score}% of answers were correct`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Time Taken"
                    secondary={`${minutes} minutes ${seconds} seconds (${Math.round(timeSpent / totalQuestions)} seconds per question)`}
                  />
                </ListItem>
              </List>

              <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<ReplayIcon />}
                  onClick={() => navigate('/quizzes')}
                >
                  Try Another Quiz
                </Button>
                <Button
                  variant="contained"
                  startIcon={<HomeIcon />}
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default QuizResults; 