import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Chip,
  Avatar,
  useTheme
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { leaderboardApi } from '../services/api';

const LeaderboardTabs = {
  GLOBAL: 'global',
  WEEKLY: 'weekly',
  TOPIC: 'topic',
  QUIZ: 'quiz'
};

const RankBadge = ({ rank }) => {
  const theme = useTheme();
  const badges = {
    1: { icon: '👑', color: 'linear-gradient(135deg, #FFD700, #FFA500)', shadow: '0 2px 10px rgba(255, 215, 0, 0.3)' },
    2: { icon: '🥈', color: 'linear-gradient(135deg, #C0C0C0, #A9A9A9)', shadow: '0 2px 10px rgba(192, 192, 192, 0.3)' },
    3: { icon: '🥉', color: 'linear-gradient(135deg, #CD7F32, #8B4513)', shadow: '0 2px 10px rgba(205, 127, 50, 0.3)' },
  };

  if (!badges[rank]) return rank;

  return (
    <Chip
      label={badges[rank].icon}
      sx={{
        background: badges[rank].color,
        boxShadow: badges[rank].shadow,
        border: 'none',
        fontWeight: 700,
        fontSize: '1.2rem',
        height: 32,
        width: 32,
      }}
    />
  );
};

const Leaderboard = () => {
  const { type, id } = useParams();
  const [activeTab, setActiveTab] = useState(type || LeaderboardTabs.GLOBAL);
  const [leaderboardData, setLeaderboardData] = useState({ leaderboard: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        let response;
        switch (activeTab) {
          case LeaderboardTabs.QUIZ:
            response = await leaderboardApi.getQuizLeaderboard(id);
            break;
          case LeaderboardTabs.TOPIC:
            response = await leaderboardApi.getTopicLeaderboard(id);
            break;
          case LeaderboardTabs.WEEKLY:
            response = await leaderboardApi.getWeeklyLeaderboard();
            break;
          default:
            response = await leaderboardApi.getGlobalLeaderboard();
        }
        setLeaderboardData(response.data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        setError('Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [activeTab, id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <Typography color="error" align="center" variant="h6">
              {error}
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.light}15 100%)`,
        py: 6,
        position: 'relative',
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
              <WorkspacePremiumIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
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
                Leaderboard
              </Typography>
            </Box>
          </Box>

          <Paper 
            elevation={0}
            sx={{ 
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.2)',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 2 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    minWidth: 100,
                  },
                  '& .Mui-selected': {
                    color: theme.palette.primary.main,
                  },
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  },
                }}
              >
                <Tab label="Global" value={LeaderboardTabs.GLOBAL} />
                <Tab label="Weekly" value={LeaderboardTabs.WEEKLY} />
                {id && type === LeaderboardTabs.TOPIC && (
                  <Tab label="Topic" value={LeaderboardTabs.TOPIC} />
                )}
                {id && type === LeaderboardTabs.QUIZ && (
                  <Tab label="Quiz" value={LeaderboardTabs.QUIZ} />
                )}
              </Tabs>
            </Box>

            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer sx={{ px: 3, pb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, fontSize: '1rem' }}>Rank</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '1rem' }}>Player</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: '1rem' }}>Score</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: '1rem' }}>Quizzes</TableCell>
                      {activeTab === LeaderboardTabs.QUIZ && (
                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '1rem' }}>Time</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaderboardData.leaderboard?.map((entry, index) => (
                      <motion.tr
                        key={entry.userId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        component={TableRow}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.02)',
                          },
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <RankBadge rank={index + 1} />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar 
                              sx={{ 
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                width: 36,
                                height: 36,
                              }}
                            >
                              {entry.name[0].toUpperCase()}
                            </Avatar>
                            <Typography sx={{ fontWeight: 500 }}>{entry.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${Math.round(entry.totalScore || entry.averageScore || entry.score)}%`}
                            sx={{
                              background: `${theme.palette.primary.main}15`,
                              color: theme.palette.primary.main,
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontWeight: 500 }}>
                            {entry.quizzesTaken || 1}
                          </Typography>
                        </TableCell>
                        {activeTab === LeaderboardTabs.QUIZ && (
                          <TableCell align="right">
                            <Typography sx={{ fontWeight: 500 }}>
                              {Math.floor(entry.timeSpent / 60)}m {entry.timeSpent % 60}s
                            </Typography>
                          </TableCell>
                        )}
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Leaderboard; 