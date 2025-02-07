import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Avatar,
  LinearProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../services/api';
import PersonIcon from '@mui/icons-material/Person';
import UserAvatar from '../components/common/UserAvatar';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userApi.getProfile();
        setProfile(response.data);
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return null;

  const memberSince = profile.user.createdAt 
    ? format(new Date(profile.user.createdAt), 'MMMM d, yyyy')
    : 'N/A';

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* User Info Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: '0 auto',
                  bgcolor: profile.user.avatar?.color || 'primary.main',
                  fontSize: '40px'
                }}
              >
                {profile.user.avatar?.initials || profile.user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" sx={{ mt: 2 }}>
                {profile.user.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {profile.user.email}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Member since {memberSince}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="h6" gutterBottom>
                Statistics
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Total Quizzes Taken"
                    secondary={profile.stats.totalAttempts}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Average Score"
                    secondary={`${profile.stats.averageScore}%`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Highest Score"
                    secondary={`${profile.stats.highestScore}%`}
                  />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>

        {/* Topic Progress */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Topic Progress
            </Typography>
            <Grid container spacing={2}>
              {profile.stats.topicProgress.map((topic) => (
                <Grid item xs={12} key={topic.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1">{topic.name}</Typography>
                        <Chip 
                          label={`${topic.progress.completion}%`}
                          size="small"
                          color={topic.progress.completion === 100 ? 'success' : 'primary'}
                        />
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={topic.progress.completion}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">
                          {topic.progress.attemptedQuizzes} / {topic.progress.totalQuizzes} Quizzes
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Avg. Score: {topic.progress.averageScore}%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Recent Activity */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {profile.stats.recentActivity.map((activity) => (
                <ListItem key={activity.id} divider>
                  <ListItemText
                    primary={activity.quizTitle}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textSecondary">
                          Score: {activity.score}% • Time: {Math.floor(activity.timeSpent / 60)}m {activity.timeSpent % 60}s
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="textSecondary">
                          {format(new Date(activity.completedAt), 'MMM d, yyyy h:mm a')}
                        </Typography>
                      </>
                    }
                  />
                  <Chip 
                    label={activity.quizDifficulty}
                    size="small"
                    color={
                      activity.quizDifficulty === 'EASY' ? 'success' :
                      activity.quizDifficulty === 'MEDIUM' ? 'warning' : 'error'
                    }
                    sx={{ ml: 1 }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 