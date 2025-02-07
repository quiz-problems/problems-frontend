import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { topicsApi } from '../../services/api';

function TopicManager() {
  const [topics, setTopics] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteTopicId, setDeleteTopicId] = useState(null);
  const [editTopic, setEditTopic] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await topicsApi.getAll();
      setTopics(response.data.topics);
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    }
  };

  const handleOpenDialog = (topic = null) => {
    if (topic) {
      setEditTopic(topic);
      setFormData({ name: topic.name, description: topic.description });
    } else {
      setEditTopic(null);
      setFormData({ name: '', description: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ name: '', description: '' });
    setEditTopic(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTopic) {
        await topicsApi.update(editTopic.id, formData);
      } else {
        await topicsApi.create(formData);
      }
      fetchTopics();
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save topic:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await topicsApi.delete(deleteTopicId);
      setDeleteTopicId(null);
      fetchTopics();
    } catch (error) {
      console.error('Failed to delete topic:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Topic Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create New Topic
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Quiz Count</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topics.map((topic) => (
              <TableRow key={topic.id}>
                <TableCell>{topic.name}</TableCell>
                <TableCell>{topic.description}</TableCell>
                <TableCell>{topic.quizCount}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleOpenDialog(topic)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => setDeleteTopicId(topic.id)}
                    color="error"
                    disabled={topic.quizCount > 0}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editTopic ? 'Edit Topic' : 'Create New Topic'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editTopic ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTopicId} onClose={() => setDeleteTopicId(null)}>
        <DialogTitle>Delete Topic</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this topic? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTopicId(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default TopicManager; 