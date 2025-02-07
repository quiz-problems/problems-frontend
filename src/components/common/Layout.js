import { Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from '../../pages/Home';
import Login from '../../pages/Login';
import Register from '../../pages/Register';
import Topics from '../../pages/Topics';
import QuizList from '../../pages/QuizList';
import QuizDetails from '../../pages/QuizDetails';
import TakeQuiz from '../../pages/TakeQuiz';
import QuizResults from '../../pages/QuizResults';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import Dashboard from '../../pages/admin/Dashboard';
import QuizManager from '../../pages/admin/QuizManager';
import CreateQuiz from '../../pages/admin/CreateQuiz';
import EditQuiz from '../../pages/admin/EditQuiz';
import TopicManager from '../../pages/admin/TopicManager';
import Profile from '../../pages/Profile';
import Leaderboard from '../../pages/Leaderboard';

function Layout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/quiz/:id" element={<QuizDetails />} />
          <Route
            path="/quiz/:id/take"
            element={
              <ProtectedRoute>
                <TakeQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id/results"
            element={
              <ProtectedRoute>
                <QuizResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/quizzes"
            element={
              <AdminRoute>
                <QuizManager />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/quizzes/new"
            element={
              <AdminRoute>
                <CreateQuiz />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/quizzes/:id/edit"
            element={
              <AdminRoute>
                <EditQuiz />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/topics"
            element={
              <AdminRoute>
                <TopicManager />
              </AdminRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/leaderboard/:type/:id" element={<Leaderboard />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default Layout; 