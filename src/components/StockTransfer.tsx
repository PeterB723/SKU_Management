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
} from '@mui/material';

export const StockTransfer: React.FC = () => {
  const { skus, branches, transferStock } = useSKU();
  const [selectedSKU, setSelectedSKU] = useState('');
  const [quantity, setQuantity] = useState('');
  const [sourceLocation, setSourceLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceLocation === destinationLocation) {
      setError('Source and destination cannot be the same');
      return;
    }

    if (selectedSKU && quantity && sourceLocation && destinationLocation) {
      transferStock({
        skuId: selectedSKU,
        quantity: parseInt(quantity),
        sourceLocation,
        destinationLocation,
      });
      setSuccess(true);
      setError(null);
      setSelectedSKU('');
      setQuantity('');
      setSourceLocation('');
      setDestinationLocation('');
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Stock Transfer
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Stock transfer completed successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)', mb: 2 }}>
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
            />

            <FormControl fullWidth>
              <InputLabel>Source Location</InputLabel>
              <Select
                value={sourceLocation}
                onChange={(e) => setSourceLocation(e.target.value)}
                required
              >
                {branches.map((branch) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Destination Location</InputLabel>
              <Select
                value={destinationLocation}
                onChange={(e) => setDestinationLocation(e.target.value)}
                required
              >
                {branches.map((branch) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button type="submit" variant="contained" color="primary">
            Transfer Stock
          </Button>
        </form>
      </Paper>
    </Box>
  );
}; 