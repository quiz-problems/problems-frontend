import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Alert,
  FormControl,
  Paper,
  LinearProgress,
  useTheme,
  Container,
  Chip,
  Tooltip,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SendIcon from '@mui/icons-material/Send';
import { quizzesApi } from '../../services/api';

const Quiz = ({ quiz, onSubmit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [error, setError] = useState('');
  const [startTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60);
  const [cooldownStatus, setCooldownStatus] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (cooldownStatus && !cooldownStatus.canAttempt) {
      const timeLeft = new Date(cooldownStatus.nextAttemptAt) - Date.now();
      if (timeLeft > 0) {
        const timer = setTimeout(() => {
          setCooldownStatus(prev => ({ ...prev, canAttempt: true }));
        }, timeLeft);
        return () => clearTimeout(timer);
      }
    }
  }, [cooldownStatus]);

  useEffect(() => {
    const checkCooldown = async () => {
      try {
        const response = await quizzesApi.getCooldownStatus(quiz.id);
        setCooldownStatus(response.data);
      } catch (error) {
        console.error('Failed to check cooldown status:', error);
      }
    };

    checkCooldown();
  }, [quiz.id]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
    setError('');
  };

  const handleNext = () => {
    const currentQuestionId = quiz.questions[currentQuestion].id;
    if (!selectedAnswers[currentQuestionId]) {
      setError('Please select an answer before proceeding');
      return;
    }
    setError('');
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const currentQuestionId = quiz.questions[currentQuestion].id;
    if (!selectedAnswers[currentQuestionId]) {
      setError('Please select an answer before submitting');
      return;
    }

    const unansweredQuestions = quiz.questions.filter(q => !selectedAnswers[q.id]);
    if (unansweredQuestions.length > 0) {
      setError(`Please answer all questions (${unansweredQuestions.length} remaining)`);
      return;
    }

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    const answers = quiz.questions.map(question => ({
      questionId: question.id,
      selectedOptionId: selectedAnswers[question.id]
    }));
    
    onSubmit({ answers, timeSpent })
      .then(response => {
        navigate(`/quiz/${quiz.id}/results`, {
          state: { 
            results: {
              score: response.score,
              correctAnswers: response.correctAnswers,
              totalQuestions: quiz.questions.length,
              timeSpent: timeSpent
            }
          }
        });
      })
      .catch(error => {
        if (error.response?.status === 403) {
          setCooldownStatus({
            canAttempt: false,
            nextAttemptAt: error.response.data.nextAttemptAt
          });
          setError(`Quiz is in cooldown. Next attempt allowed at: ${new Date(error.response.data.nextAttemptAt).toLocaleString()}`);
        } else {
          setError('Failed to submit quiz. Please try again.');
        }
      });
  };

  const formatCooldownTime = (nextAttemptAt) => {
    const now = new Date();
    const nextAttempt = new Date(nextAttemptAt);
    const diffInSeconds = Math.floor((nextAttempt - now) / 1000);
    
    if (diffInSeconds <= 0) return null;
    
    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    
    return `${hours}h ${minutes}m`;
  };

  const currentQuestionData = quiz.questions[currentQuestion];

  return (
    <Container maxWidth="md">
      <Box 
        sx={{ 
          position: 'sticky', 
          top: 0, 
          backgroundColor: 'background.default',
          zIndex: 1,
          pt: 2,
          pb: 1
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="primary">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </Typography>
          <Chip
            icon={<AccessTimeIcon />}
            label={formatTime(timeLeft)}
            color={timeLeft < 60 ? 'error' : timeLeft < 180 ? 'warning' : 'default'}
            variant="outlined"
          />
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.palette.grey[200],
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
            }
          }}
        />
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mt: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(211, 47, 47, 0.1)'
          }}
        >
          {error}
        </Alert>
      )}

      {cooldownStatus && !cooldownStatus.canAttempt && (
        <Alert 
          severity="warning" 
          sx={{ mt: 2, mb: 2 }}
        >
          Quiz is in cooldown. Next attempt allowed in: {formatCooldownTime(cooldownStatus.nextAttemptAt)}
        </Alert>
      )}

      <Paper 
        elevation={2} 
        sx={{ 
          p: 4, 
          my: 3,
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600,
              color: theme.palette.text.primary,
              flex: 1,
              mr: 2
            }}
          >
            {currentQuestionData.text}
          </Typography>
          <Tooltip title="Hint: Choose the best answer">
            <IconButton size="small">
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <RadioGroup
            value={selectedAnswers[currentQuestionData.id] || ''}
            onChange={(e) => handleOptionSelect(currentQuestionData.id, e.target.value)}
          >
            {currentQuestionData.options.map((option) => (
              <Paper
                key={option.id}
                elevation={1}
                sx={{
                  mb: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    transform: 'translateX(4px)'
                  }
                }}
              >
                <FormControlLabel
                  value={option.id}
                  control={
                    <Radio 
                      sx={{
                        '&.Mui-checked': {
                          color: theme.palette.primary.main,
                        }
                      }}
                    />
                  }
                  label={option.text}
                  sx={{
                    display: 'flex',
                    m: 0,
                    p: 2,
                    width: '100%',
                    borderRadius: 1,
                  }}
                />
              </Paper>
            ))}
          </RadioGroup>
        </FormControl>
      </Paper>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        position: 'sticky',
        bottom: 16,
        backgroundColor: 'background.default',
        p: 2,
        borderRadius: 2,
        boxShadow: theme.shadows[3]
      }}>
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          startIcon={<NavigateBeforeIcon />}
          sx={{ borderRadius: 2 }}
        >
          Previous
        </Button>

        {currentQuestion < quiz.questions.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!selectedAnswers[currentQuestionData.id]}
            endIcon={<NavigateNextIcon />}
            sx={{ borderRadius: 2 }}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSubmit}
            color="success"
            disabled={
              Object.keys(selectedAnswers).length !== quiz.questions.length ||
              (cooldownStatus && !cooldownStatus.canAttempt)
            }
            endIcon={<SendIcon />}
            sx={{ borderRadius: 2 }}
          >
            Submit Quiz
          </Button>
        )}
      </Box>

      <Box sx={{ mt: 2, mb: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {Object.keys(selectedAnswers).length} of {quiz.questions.length} questions answered
        </Typography>
      </Box>
    </Container>
  );
};

export default Quiz; 