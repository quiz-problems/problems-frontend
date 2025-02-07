import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Grid,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { topicsApi, adminApi } from '../../services/api';

const DIFFICULTY_LEVELS = ['EASY', 'MEDIUM', 'HARD'];

const emptyQuestion = {
  text: '',
  options: [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ],
  explanation: '',
};

function QuizForm({ quiz, onSubmit, isCreating = false }) {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [formData, setFormData] = useState(quiz || {
    title: '',
    description: '',
    difficulty: 'MEDIUM',
    timeLimit: 30,
    topicId: '',
    tags: [],
    questions: []
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (quiz) {
      console.log('QuizForm received new quiz:', quiz);
      setFormData(quiz);
    }
  }, [quiz]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await topicsApi.getAll();
        setTopics(response.data.topics);
      } catch (error) {
        console.error('Failed to fetch topics:', error);
      }
    };

    fetchTopics();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      ),
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, qIndex) =>
        qIndex === questionIndex
          ? {
              ...q,
              options: q.options.map((opt, oIndex) =>
                oIndex === optionIndex ? { ...opt, [field]: value } : opt
              ),
            }
          : q
      ),
    }));
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, { ...emptyQuestion }],
    }));
  };

  const removeQuestion = (index) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {quiz ? 'Edit Quiz' : 'Create New Quiz'}
        </Typography>

        <Box component="form" onSubmit={handleFormSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Topic</InputLabel>
                <Select
                  name="topicId"
                  value={formData.topicId}
                  onChange={handleChange}
                  required
                >
                  {topics.map((topic) => (
                    <MenuItem key={topic.id} value={topic.id}>
                      {topic.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  required
                >
                  {DIFFICULTY_LEVELS.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Time Limit (minutes)"
                name="timeLimit"
                value={formData.timeLimit}
                onChange={handleChange}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <TextField
                  label="Add Tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  helperText="Press Enter to add a tag"
                />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Questions
              </Typography>
              {formData.questions.map((question, qIndex) => (
                <Paper key={qIndex} sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label={`Question ${qIndex + 1}`}
                      value={question.text}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, 'text', e.target.value)
                      }
                      required
                    />
                    <IconButton
                      color="error"
                      onClick={() => removeQuestion(qIndex)}
                      disabled={formData.questions.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Grid container spacing={2}>
                    {question.options.map((option, oIndex) => (
                      <Grid item xs={12} sm={6} key={oIndex}>
                        <TextField
                          fullWidth
                          label={`Option ${oIndex + 1}`}
                          value={option.text}
                          onChange={(e) =>
                            handleOptionChange(
                              qIndex,
                              oIndex,
                              'text',
                              e.target.value
                            )
                          }
                          required
                        />
                        <FormControl fullWidth sx={{ mt: 1 }}>
                          <Select
                            value={option.isCorrect}
                            onChange={(e) =>
                              handleOptionChange(
                                qIndex,
                                oIndex,
                                'isCorrect',
                                e.target.value
                              )
                            }
                          >
                            <MenuItem value={false}>Incorrect</MenuItem>
                            <MenuItem value={true}>Correct</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    ))}
                  </Grid>

                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Explanation"
                    value={question.explanation}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, 'explanation', e.target.value)
                    }
                    sx={{ mt: 2 }}
                    required
                  />
                </Paper>
              ))}

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addQuestion}
                sx={{ mt: 2 }}
              >
                Add Question
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/admin/quizzes')}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {isCreating ? 'Create Quiz' : 'Update Quiz'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default QuizForm; 