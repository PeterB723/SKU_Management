import React, { useState } from 'react';
import { useSKU } from '../context/SKUContext';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Card,
  CardContent,
} from '@mui/material';

export const BranchStockTracker: React.FC = () => {
  const { branches, skus, getStockLevel } = useSKU();
  const [selectedBranch, setSelectedBranch] = useState<string>('');

  const getTotalStock = (branchId: string) => {
    return skus
      .filter(sku => sku.isActive)
      .reduce((total, sku) => total + getStockLevel(sku.id, branchId), 0);
  };

  const getLowStockItems = (branchId: string) => {
    return skus
      .filter(sku => sku.isActive)
      .filter(sku => {
        const stock = getStockLevel(sku.id, branchId);
        return stock <= sku.reorderThreshold;
      }).length;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Branch Stock Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {branches.map((branch) => (
          <Grid item xs={12} sm={6} md={4} key={branch.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {branch.name}
                </Typography>
                <Typography color="textSecondary">
                  Location: {branch.location}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Total Items: {getTotalStock(branch.id)}
                </Typography>
                <Typography variant="body2" color="error">
                  Low Stock Items: {getLowStockItems(branch.id)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 2 }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Branch</InputLabel>
          <Select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <MenuItem value="">All Branches</MenuItem>
            {branches.map((branch) => (
              <MenuItem key={branch.id} value={branch.id}>
                {branch.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Branch</TableCell>
                <TableCell>SKU Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Available Stock</TableCell>
                <TableCell>Reorder Threshold</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {branches
                .filter(branch => !selectedBranch || branch.id === selectedBranch)
                .map((branch) => (
                  skus.filter(sku => sku.isActive).map((sku) => {
                    const stock = getStockLevel(sku.id, branch.id);
                    const isLow = stock <= sku.reorderThreshold;
                    return (
                      <TableRow 
                        key={`${branch.id}-${sku.id}`}
                        sx={{ 
                          backgroundColor: isLow ? 'rgba(255, 152, 0, 0.1)' : 'inherit'
                        }}
                      >
                        <TableCell>{branch.name}</TableCell>
                        <TableCell>{sku.code}</TableCell>
                        <TableCell>{sku.name}</TableCell>
                        <TableCell>{stock}</TableCell>
                        <TableCell>{sku.reorderThreshold}</TableCell>
                        <TableCell>
                          <Typography 
                            color={isLow ? 'error' : 'success'}
                          >
                            {isLow ? 'Low Stock' : 'Normal'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}; 