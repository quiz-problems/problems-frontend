import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Collapse,
} from '@mui/material';
import { parseQuizText } from '../../utils/quizParser';

const QuizTextParser = ({ onParsed }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [showFormat, setShowFormat] = useState(false);

  const handleParse = () => {
    try {
      const parsedQuiz = parseQuizText(text);
      console.log('Parsed quiz:', parsedQuiz);
      onParsed(parsedQuiz);
      setError('');
    } catch (err) {
      console.error('Parsing error:', err);
      setError(err.message);
    }
  };

  const formatExample = `Title: JavaScript Basics
Description: Test your knowledge of JavaScript fundamentals
Difficulty: MEDIUM
Time: 30
Topic: javascript-basics
Tags: javascript, programming, basics

Q1: What is the output of typeof null in JavaScript?
A) undefined
B) null
C) object *correct*
D) number
Explanation: In JavaScript, typeof null returns "object", which is considered a bug in the language.

Q2: Which method is used to add elements to the end of an array?
A) unshift()
B) push() *correct*
C) append()
D) add()
Explanation: The push() method adds one or more elements to the end of an array.`;

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Quick Quiz Creation from Text
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setShowFormat(!showFormat)}
          sx={{ mb: 2 }}
        >
          {showFormat ? 'Hide Format' : 'Show Format'}
        </Button>
        
        <Collapse in={showFormat}>
          <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {formatExample}
            </Typography>
          </Paper>
        </Collapse>
      </Box>

      <TextField
        multiline
        rows={10}
        fullWidth
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your quiz text here..."
        variant="outlined"
        sx={{ mb: 2 }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        onClick={handleParse}
        disabled={!text.trim()}
      >
        Parse Quiz
      </Button>
    </Paper>
  );
};

export default QuizTextParser; 