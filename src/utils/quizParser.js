/**
 * Parses quiz text in the following format:
 * 
 * Title: Quiz Title
 * Description: Quiz description
 * Difficulty: EASY|MEDIUM|HARD
 * Time: 30 (in minutes)
 * Topic: topic-id
 * Tags: tag1, tag2, tag3
 * 
 * Q1: Question text here?
 * A) First option
 * B) Second option
 * C) Third option *correct*
 * D) Fourth option
 * Explanation: Explanation for the correct answer
 * 
 * Q2: Another question?
 * ...
 */

export const parseQuizText = (text) => {
  try {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    let quiz = {
      title: '',
      description: '',
      difficulty: 'MEDIUM',
      timeLimit: 30,
      topicId: '',
      tags: [],
      questions: []
    };

    let currentQuestion = null;
    let currentOptions = [];
    let currentExplanation = '';

    const saveCurrentQuestion = () => {
      if (currentQuestion) {
        quiz.questions.push({
          text: currentQuestion,
          options: currentOptions,
          explanation: currentExplanation
        });
        currentQuestion = null;
        currentOptions = [];
        currentExplanation = '';
      }
    };

    lines.forEach((line, index) => {
      // Parse metadata
      if (line.startsWith('Title:')) {
        quiz.title = line.substring(6).trim();
      } else if (line.startsWith('Description:')) {
        quiz.description = line.substring(12).trim();
      } else if (line.startsWith('Difficulty:')) {
        quiz.difficulty = line.substring(11).trim().toUpperCase();
      } else if (line.startsWith('Time:')) {
        quiz.timeLimit = parseInt(line.substring(5).trim());
      } else if (line.startsWith('Topic:')) {
        quiz.topicId = line.substring(6).trim();
      } else if (line.startsWith('Tags:')) {
        quiz.tags = line.substring(5).split(',').map(tag => tag.trim());
      }
      // Parse questions
      else if (line.match(/^Q\d+:/)) {
        saveCurrentQuestion();
        currentQuestion = line.substring(line.indexOf(':') + 1).trim();
      }
      // Parse options
      else if (line.match(/^[A-D]\)/)) {
        const isCorrect = line.includes('*correct*');
        const optionText = line.substring(2).replace('*correct*', '').trim();
        currentOptions.push({
          text: optionText,
          isCorrect: isCorrect
        });
      }
      // Parse explanation
      else if (line.startsWith('Explanation:')) {
        currentExplanation = line.substring(12).trim();
      }

      // If this is the last line, save the final question
      if (index === lines.length - 1) {
        saveCurrentQuestion();
      }
    });

    // Validate that each question has exactly one correct answer
    quiz.questions.forEach((question, index) => {
      const correctAnswers = question.options.filter(opt => opt.isCorrect).length;
      if (correctAnswers !== 1) {
        throw new Error(`Question ${index + 1} must have exactly one correct answer`);
      }
    });

    return quiz;
  } catch (error) {
    console.error('Error parsing quiz text:', error);
    throw new Error('Invalid quiz format: ' + error.message);
  }
}; 