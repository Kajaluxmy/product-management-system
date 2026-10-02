import { Box, Container, Typography } from '@mui/material';

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Box
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          py: 2,
        }}
      >
        <Container>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Product Management System
          </Typography>
        </Container>
      </Box>

      {children}
    </>
  );
}
