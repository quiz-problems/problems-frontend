import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Chip,
  Skeleton,
  Grid,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QuizIcon from '@mui/icons-material/Quiz';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { quizzesApi } from '../services/api';
import ExportQuizButton from '../components/quiz/ExportQuizButton';
import { useAuth } from '../context/AuthContext';

function QuizDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  console.log('Current user:', user);
  console.log('Is admin?:', user?.role === 'ADMIN');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await quizzesApi.getById(id);
        setQuiz(response.data);
      } catch (err) {
        setError('Failed to load quiz details');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Skeleton variant="text" height={60} width="60%" />
        <Skeleton variant="text" height={30} width="40%" sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !quiz) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error" gutterBottom>
            {error || 'Quiz not found'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/quizzes')}
            startIcon={<ArrowBackIcon />}
          >
            Back to Quizzes
          </Button>
        </Paper>
      </Container>
    );
  }

  const DifficultyChip = ({ difficulty }) => {
    const colors = {
      EASY: {
        bg: theme.palette.success.light,
        color: theme.palette.success.dark
      },
      MEDIUM: {
        bg: theme.palette.warning.light,
        color: theme.palette.warning.dark
      },
      HARD: {
        bg: theme.palette.error.light,
        color: theme.palette.error.dark
      }
    };

    return (
      <Chip
        label={difficulty}
        sx={{
          backgroundColor: colors[difficulty]?.bg,
          color: colors[difficulty]?.color,
          fontWeight: 600,
          fontSize: '0.9rem',
          '&:hover': {
            backgroundColor: colors[difficulty]?.bg,
          }
        }}
      />
    );
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        background: `linear-gradient(to bottom, ${theme.palette.primary.light}15, ${theme.palette.background.default})`,
        pt: 4,
        pb: 6
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3 
        }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/quizzes')}
          >
            Back to Quizzes
          </Button>

          <ExportQuizButton 
            quiz={quiz} 
            sx={{ 
              ml: 2,
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }} 
          />
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Box sx={{ mb: 3 }}>
                <DifficultyChip difficulty={quiz.difficulty} />
              </Box>
              
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                }}
              >
                {quiz.title}
              </Typography>

              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ mb: 4 }}
              >
                {quiz.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                {quiz.tags?.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    variant="outlined"
                    size="small"
                    sx={{ 
                      borderRadius: 1,
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }}
                  />
                ))}
              </Box>

              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
                onClick={() => navigate(`/quiz/${id}/take`)}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                  },
                }}
              >
                Start Quiz
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Quiz Details
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Time Limit" 
                    secondary={`${quiz.timeLimit} minutes`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <QuizIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Questions" 
                    secondary={`${quiz.questions?.length || 0} questions`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmojiEventsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Points Available" 
                    secondary="100 points"
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Instructions
              </Typography>
              <List dense>
                {[
                  'Answer all questions to complete the quiz',
                  'Each question has only one correct answer',
                  'You cannot return to previous questions',
                  'Results will be shown after submission'
                ].map((instruction, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={instruction} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default QuizDetails; 