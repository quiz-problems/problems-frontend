import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CardActionArea,
  InputAdornment,
  Skeleton,
  useTheme,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QuizIcon from '@mui/icons-material/Quiz';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { motion } from 'framer-motion';
import { quizzesApi } from '../services/api';

const DIFFICULTY_LEVELS = ['EASY', 'MEDIUM', 'HARD'];

const DifficultyChip = ({ difficulty }) => {
  const theme = useTheme();
  
  return (
    <Chip
      label={difficulty}
      size="small"
      sx={{
        fontWeight: 600,
        background: difficulty === 'EASY' 
          ? 'linear-gradient(135deg, #4CAF50, #81C784)'
          : difficulty === 'MEDIUM'
          ? 'linear-gradient(135deg, #FF9800, #FFB74D)'
          : 'linear-gradient(135deg, #f44336, #E57373)',
        color: 'white',
        '& .MuiChip-label': {
          textShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }
      }}
    />
  );
};

function QuizList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    topic: searchParams.get('topic') || '',
    difficulty: searchParams.get('difficulty') || '',
    search: searchParams.get('search') || '',
  });
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await quizzesApi.getAll(filters);
        setQuizzes(response.data.quizzes);
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    setSearchParams(newFilters);
  };

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Card>
            <CardContent>
              <Skeleton variant="text" height={32} width="80%" />
              <Skeleton variant="text" height={20} width="60%" />
              <Box sx={{ mt: 2 }}>
                <Skeleton variant="rectangular" height={32} width={100} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const QuizCard = ({ quiz }) => (
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
          onClick={() => navigate(`/quiz/${quiz.id}`)}
          sx={{ height: '100%', p: 1 }}
        >
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <DifficultyChip difficulty={quiz.difficulty} />
            </Box>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 700,
                mb: 2,
                background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {quiz.title}
            </Typography>
            <Typography 
              color="text.secondary" 
              sx={{ 
                mb: 3,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.6,
              }}
            >
              {quiz.description}
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 2, 
                alignItems: 'center', 
                mb: 3,
                '& .stat-box': {
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'rgba(0,0,0,0.04)',
                }
              }}
            >
              <Box className="stat-box">
                <QuizIcon sx={{ fontSize: 20, mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="body2" fontWeight={500}>{quiz.questionCount} Questions</Typography>
              </Box>
              <Box className="stat-box">
                <AccessTimeIcon sx={{ fontSize: 20, mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="body2" fontWeight={500}>{quiz.timeLimit} min</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {quiz.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{ 
                    borderRadius: '8px',
                    background: `${theme.palette.primary.main}15`,
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                    border: 'none',
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </motion.div>
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
                Available Quizzes
              </Typography>
            </Box>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
            >
              Choose from our collection of computer science quizzes
            </Typography>

            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                maxWidth: 800,
                mx: 'auto',
                mb: 6,
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    placeholder="Search quizzes..."
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
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
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Difficulty</InputLabel>
                    <Select
                      name="difficulty"
                      value={filters.difficulty}
                      label="Difficulty"
                      onChange={handleFilterChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <FilterListIcon color="primary" />
                        </InputAdornment>
                      }
                      sx={{ 
                        borderRadius: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0,0,0,0.1)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.primary.main,
                        },
                      }}
                    >
                      <MenuItem value="">All Levels</MenuItem>
                      {DIFFICULTY_LEVELS.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </motion.div>

        <Grid container spacing={3}>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            quizzes.map((quiz) => (
              <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                <QuizCard quiz={quiz} />
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default QuizList; 