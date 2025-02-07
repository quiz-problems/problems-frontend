import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button, CircularProgress, Box, Tooltip } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import QuizPDF from './QuizPDF';

const ExportQuizButton = ({ quiz }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <PDFDownloadLink
        document={<QuizPDF quiz={quiz} />}
        fileName={`${quiz.title.toLowerCase().replace(/\s+/g, '-')}.pdf`}
      >
        {({ blob, url, loading, error }) => (
          <Tooltip title="Download quiz as PDF for printing">
            <Button
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} /> : <PictureAsPdfIcon />}
              disabled={loading}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                py: 1,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                },
              }}
            >
              {loading ? 'Generating PDF...' : 'Download Quiz PDF'}
            </Button>
          </Tooltip>
        )}
      </PDFDownloadLink>
    </Box>
  );
};

export default ExportQuizButton; 