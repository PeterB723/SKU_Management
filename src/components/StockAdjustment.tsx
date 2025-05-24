import React, { useState } from 'react';
import { useSKU } from '../context/SKUContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

export const StockAdjustment: React.FC = () => {
  const { skus, adjustStock } = useSKU();
  const [selectedSKU, setSelectedSKU] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSKU && quantity) {
      adjustStock({
        skuId: selectedSKU,
        quantity: parseInt(quantity),
        reason,
      });
      setSuccess(true);
      setSelectedSKU('');
      setQuantity('');
      setReason('');
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Stock Adjustment
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Stock adjustment completed successfully!
        </Alert>
      )}

      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(3, 1fr)', mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Select SKU</InputLabel>
              <Select
                value={selectedSKU}
                onChange={(e) => setSelectedSKU(e.target.value)}
                required
              >
                {skus.filter(sku => sku.isActive).map((sku) => (
                  <MenuItem key={sku.id} value={sku.id}>
                    {sku.name} ({sku.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              fullWidth
              helperText="Use negative values for reduction"
            />
            <TextField
              label="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              fullWidth
            />
          </Box>
          <Button type="submit" variant="contained" color="primary">
            Adjust Stock
          </Button>
        </form>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SKU Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Current Stock</TableCell>
              <TableCell>Reserved Stock</TableCell>
              <TableCell>Reorder Threshold</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {skus.filter(sku => sku.isActive).map((sku) => (
              <TableRow key={sku.id}>
                <TableCell>{sku.code}</TableCell>
                <TableCell>{sku.name}</TableCell>
                <TableCell>{sku.currentStock}</TableCell>
                <TableCell>{sku.reservedStock}</TableCell>
                <TableCell>{sku.reorderThreshold}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}; 