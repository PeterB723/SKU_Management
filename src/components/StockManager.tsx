import React, { useState } from 'react';
import { useSKU } from '../context/SKUContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Alert,
} from '@mui/material';

export const StockManager: React.FC = () => {
  const { skus } = useSKU();
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const sku = skus.find(
      (sku) => sku.code.toLowerCase() === searchCode.toLowerCase() && sku.isActive
    );

    if (sku) {
      setSearchResult(sku);
      setSearchError(null);
    } else {
      setSearchResult(null);
      setSearchError('SKU not found or inactive');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Stock Information Lookup
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Enter SKU Code
        </Typography>
        <form onSubmit={handleSearch}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="SKU Code"
              value={searchCode}
              onChange={(e) => {
                setSearchCode(e.target.value);
                setSearchError(null);
              }}
              error={!!searchError}
              helperText={searchError}
              fullWidth
              autoFocus
            />
            <Button type="submit" variant="contained" color="primary">
              Search
            </Button>
          </Box>
        </form>

        {searchResult && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Current Stock
                  </Typography>
                  <Typography variant="h4">
                    {searchResult.currentStock}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Reserved Stock
                  </Typography>
                  <Typography variant="h4">
                    {searchResult.reservedStock}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Reorder Threshold
                  </Typography>
                  <Typography variant="h4">
                    {searchResult.reorderThreshold}
                  </Typography>
                  {searchResult.currentStock <= searchResult.reorderThreshold && (
                    <Alert severity="warning" sx={{ mt: 1 }}>
                      Stock is below reorder threshold
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Box>
  );
}; 