import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Skeleton,
  useTheme,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import QuizIcon from '@mui/icons-material/Quiz';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { motion } from 'framer-motion';
import { topicsApi } from '../services/api';

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await topicsApi.getAll();
        setTopics(response.data.topics);
      } catch (error) {
        console.error('Failed to fetch topics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TopicCard = ({ topic }) => {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          elevation={0}
          sx={{
            height: '100%',
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(255,255,255,0.9) 100%)`,
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            '&:hover::before': {
              opacity: 1,
            },
          }}
        >
          <CardActionArea 
            onClick={() => navigate(`/quizzes?topic=${topic.name}`)}
            sx={{ height: '100%', p: 1 }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    mr: 2
                  }}
                >
                  {topic.name[0].toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {topic.name}
                  </Typography>
                  <Chip
                    size="small"
                    icon={<QuizIcon sx={{ fontSize: 16 }} />}
                    label={`${topic.stats?.totalQuizzes || 0} Quizzes`}
                    sx={{ 
                      backgroundColor: `${theme.palette.primary.main}15`,
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </Box>

              <Typography 
                color="text.secondary" 
                sx={{ 
                  mb: 3,
                  minHeight: 60,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.6,
                }}
              >
                {topic.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {topic.stats?.difficulties && (
                  Object.entries(topic.stats.difficulties).map(([difficulty, count]) => (
                    count > 0 && (
                      <Chip
                        key={difficulty}
                        label={`${count} ${difficulty.toUpperCase()}`}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          background: difficulty === 'easy' 
                            ? 'linear-gradient(135deg, #4CAF50, #81C784)'
                            : difficulty === 'medium'
                            ? 'linear-gradient(135deg, #FF9800, #FFB74D)'
                            : 'linear-gradient(135deg, #f44336, #E57373)',
                          color: 'white',
                          '& .MuiChip-label': {
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                          }
                        }}
                      />
                    )
                  ))
                )}
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </motion.div>
    );
  };

  const LoadingSkeleton = () => (
    <>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                <Skeleton variant="text" width={120} />
              </Box>
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" width="60%" />
              <Box sx={{ mt: 2 }}>
                <Skeleton variant="rectangular" height={6} sx={{ borderRadius: 3 }} />
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: 1 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </>
  );

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.light}15 100%)`,
        py: 6,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          backgroundImage: 'url("/path/to/pattern.svg")',
          opacity: 0.05,
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <AutoAwesomeIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
              <Typography 
                variant="h2" 
                component="h1"
                sx={{ 
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                Topics
              </Typography>
            </Box>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
            >
              Explore our collection of computer science topics
            </Typography>

            <Paper 
              elevation={0}
              sx={{ 
                p: 2,
                maxWidth: 600,
                mx: 'auto',
                mb: 6,
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <TextField
                fullWidth
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '12px',
                    '&.MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0,0,0,0.1)',
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }
                }}
              />
            </Paper>
          </Box>
        </motion.div>

        <Grid container spacing={3}>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            filteredTopics.map((topic) => (
              <Grid item xs={12} sm={6} md={4} key={topic.name}>
                <TopicCard topic={topic} />
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Topics; 