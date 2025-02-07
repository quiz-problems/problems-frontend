import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Container } from '@mui/material';
import QuizForm from '../../components/admin/QuizForm';
import { quizzesApi } from '../../services/api';

function EditQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await quizzesApi.getById(id);
        setQuiz(response.data);
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
        navigate('/admin/quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id, navigate]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return <QuizForm quiz={quiz} />;
}

export default EditQuiz; 