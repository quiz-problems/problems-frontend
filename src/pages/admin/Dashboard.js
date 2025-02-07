import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { quizzesApi } from '../../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalTopics: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await quizzesApi.getAll({ limit: 5 });
        setRecentQuizzes(response.data.quizzes);
        // TODO: Fetch actual stats from API
        setStats({
          totalQuizzes: response.data.total || 0,
          totalTopics: 10,
          activeUsers: 50,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/quizzes/new')}
        >
          Create New Quiz
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Total Quizzes
            </Typography>
            <Typography variant="h3">{stats.totalQuizzes}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Total Topics
            </Typography>
            <Typography variant="h3">{stats.totalTopics}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Active Users
            </Typography>
            <Typography variant="h3">{stats.activeUsers}</Typography>
          </Paper>
        </Grid>

        {/* Recent Quizzes */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Quizzes
            </Typography>
            <List>
              {recentQuizzes.map((quiz, index) => (
                <Box key={quiz.id}>
                  <ListItem>
                    <ListItemText
                      primary={quiz.title}
                      secondary={`${quiz.questionCount} questions • ${quiz.difficulty}`}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/admin/quizzes/${quiz.id}/edit`)}
                    >
                      Edit
                    </Button>
                  </ListItem>
                  {index < recentQuizzes.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="text"
                onClick={() => navigate('/admin/quizzes')}
              >
                View All Quizzes
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Topic Management
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/admin/topics')}
              >
                Manage Topics
              </Button>
            </Box>
            <Typography color="text.secondary">
              Create and manage topics for organizing quizzes
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard; 