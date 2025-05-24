import React, { useState } from 'react';
import { useSKU } from '../context/SKUContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

export const BranchManager: React.FC = () => {
  const { branches, addBranch } = useSKU();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [contactDetails, setContactDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBranch({ name, location, contactDetails });
    setName('');
    setLocation('');
    setContactDetails('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Branch Management
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Branch Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Contact Details"
              value={contactDetails}
              onChange={(e) => setContactDetails(e.target.value)}
              required
              fullWidth
            />
          </Box>
          <Button type="submit" variant="contained" color="primary">
            Add Branch
          </Button>
        </form>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Branch ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Contact Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell>{branch.id}</TableCell>
                <TableCell>{branch.name}</TableCell>
                <TableCell>{branch.location}</TableCell>
                <TableCell>{branch.contactDetails}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}; 