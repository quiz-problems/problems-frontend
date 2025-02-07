import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import QuizForm from '../../components/admin/QuizForm';
import QuizTextParser from '../../components/admin/QuizTextParser';
import { adminApi } from '../../services/api';

function CreateQuiz() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'MEDIUM',
    timeLimit: 30,
    topicId: '',
    tags: [],
    questions: []
  });

  const handleParsedQuiz = (parsedQuiz) => {
    console.log('Received parsed quiz:', parsedQuiz);
    setFormData(parsedQuiz);
  };

  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);

  const handleSubmit = async (quizData) => {
    try {
      const response = await adminApi.createQuiz(quizData);
      console.log('Quiz created:', response.data);
      navigate('/admin/quizzes');
    } catch (error) {
      console.error('Failed to create quiz:', error);
      throw error;
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Create New Quiz
      </Typography>

      <QuizTextParser onParsed={handleParsedQuiz} />

      <QuizForm 
        quiz={formData}
        onSubmit={handleSubmit}
        isCreating={true}
      />
    </Container>
  );
}

export default CreateQuiz; 