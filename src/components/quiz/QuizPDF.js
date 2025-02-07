import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    color: '#444',
  },
  metadata: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 11,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  questionSection: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: '1 solid #eee',
  },
  question: {
    fontSize: 12,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  option: {
    fontSize: 11,
    marginBottom: 5,
    marginLeft: 15,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 20,
    right: 30,
    color: '#666',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
});

const QuizPDF = ({ quiz }) => {
  // Split questions into groups of 5 per page
  const questionsPerPage = 5;
  const pages = [];
  for (let i = 0; i < quiz.questions.length; i += questionsPerPage) {
    pages.push(quiz.questions.slice(i, i + questionsPerPage));
  }

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{quiz.title}</Text>
        <View style={styles.metadata}>
          <Text>Difficulty Level: {quiz.difficulty}</Text>
          <Text>Time Limit: {quiz.timeLimit} minutes</Text>
          <Text>Total Questions: {quiz.questions.length}</Text>
        </View>
        
        <View style={styles.instructions}>
          <Text style={{ fontSize: 14, marginBottom: 10, fontWeight: 'bold' }}>
            Instructions:
          </Text>
          <Text>• Read each question carefully before answering</Text>
          <Text>• Each question has only one correct answer</Text>
          <Text>• Time allowed: {quiz.timeLimit} minutes</Text>
          <Text>• Total marks: {quiz.questions.length} points</Text>
        </View>

        <View style={styles.footer}>
          <Text>Student Name: _______________________</Text>
          <Text>Date: _______________________</Text>
        </View>
      </Page>

      {/* Question Pages */}
      {pages.map((pageQuestions, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <Text style={styles.title}>{quiz.title}</Text>
          
          {pageQuestions.map((question, index) => (
            <View key={index} style={styles.questionSection}>
              <Text style={styles.question}>
                {pageIndex * questionsPerPage + index + 1}. {question.text}
              </Text>
              {question.options.map((option, optIndex) => (
                <Text key={optIndex} style={styles.option}>
                  {String.fromCharCode(65 + optIndex)}. {option.text}
                </Text>
              ))}
            </View>
          ))}
          
          <Text style={styles.pageNumber}>
            Page {pageIndex + 2} of {pages.length + 1}
          </Text>
        </Page>
      ))}
    </Document>
  );
};

export default QuizPDF; 