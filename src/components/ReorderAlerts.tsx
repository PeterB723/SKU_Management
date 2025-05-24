import React, { useState } from 'react';
import { useSKU } from '../context/SKUContext';
import {
  Box,
  Typography,
  Paper,
  Alert,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';

interface NotificationConfig {
  email: boolean;
  inApp: boolean;
  webhook: boolean;
  webhookUrl?: string;
  emailAddress?: string;
}

export const ReorderAlerts: React.FC = () => {
  const { skus, reorderAlerts, updateReorderThreshold } = useSKU();
  const [searchCode, setSearchCode] = useState('');
  const [threshold, setThreshold] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig>({
    email: false,
    inApp: true,
    webhook: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const sku = skus.find(
      (sku) => sku.code.toLowerCase() === searchCode.toLowerCase() && sku.isActive
    );

    if (sku) {
      setThreshold(sku.reorderThreshold.toString());
      setSearchError(null);
    } else {
      setThreshold('');
      setSearchError('SKU not found or inactive');
    }
  };

  const handleThresholdUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const sku = skus.find(
      (sku) => sku.code.toLowerCase() === searchCode.toLowerCase() && sku.isActive
    );

    if (sku && threshold) {
      updateReorderThreshold({
        skuId: sku.id,
        threshold: parseInt(threshold),
        notificationConfig,
      });
      setSearchCode('');
      setThreshold('');
    }
  };

  const handleNotificationChange = (key: keyof NotificationConfig) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNotificationConfig(prev => ({
        ...prev,
        [key]: event.target.checked,
      }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Reorder Alerts Management
      </Typography>

      {/* Threshold Configuration Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Set Reorder Threshold
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
            />
            <Button type="submit" variant="contained" color="primary">
              Find SKU
            </Button>
          </Box>
        </form>

        {!searchError && threshold && (
          <form onSubmit={handleThresholdUpdate}>
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Reorder Threshold"
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              
              <Typography variant="subtitle1" gutterBottom>
                Notification Settings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationConfig.inApp}
                      onChange={handleNotificationChange('inApp')}
                    />
                  }
                  label="In-App Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationConfig.email}
                      onChange={handleNotificationChange('email')}
                    />
                  }
                  label="Email Notifications"
                />
                {notificationConfig.email && (
                  <TextField
                    label="Email Address"
                    type="email"
                    value={notificationConfig.emailAddress || ''}
                    onChange={(e) => setNotificationConfig(prev => ({
                      ...prev,
                      emailAddress: e.target.value
                    }))}
                    required={notificationConfig.email}
                    sx={{ ml: 3 }}
                  />
                )}
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationConfig.webhook}
                      onChange={handleNotificationChange('webhook')}
                    />
                  }
                  label="Webhook Notifications"
                />
                {notificationConfig.webhook && (
                  <TextField
                    label="Webhook URL"
                    type="url"
                    value={notificationConfig.webhookUrl || ''}
                    onChange={(e) => setNotificationConfig(prev => ({
                      ...prev,
                      webhookUrl: e.target.value
                    }))}
                    required={notificationConfig.webhook}
                    sx={{ ml: 3 }}
                  />
                )}
              </Box>
              <Button type="submit" variant="contained" color="primary">
                Update Threshold & Notifications
              </Button>
            </Box>
          </form>
        )}
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Current Alerts Section */}
      <Typography variant="h6" gutterBottom>
        Current Alerts
      </Typography>
      {reorderAlerts.length === 0 ? (
        <Alert severity="info">
          <AlertTitle>No Alerts</AlertTitle>
          All stock levels are above their reorder thresholds.
        </Alert>
      ) : (
        <Box sx={{ mb: 4 }}>
          {reorderAlerts.map((alert, index) => {
            const sku = skus.find((s) => s.id === alert.skuId);
            return (
              <Alert severity="warning" key={index} sx={{ mb: 1 }}>
                <AlertTitle>Low Stock Alert</AlertTitle>
                {sku?.name} (SKU: {sku?.code}) - Current Stock: {alert.currentStock}
                <br />
                Reorder Threshold: {alert.threshold}
                <br />
                Date: {new Date(alert.date).toLocaleString()}
              </Alert>
            );
          })}
        </Box>
      )}

      {/* SKUs Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SKU Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Current Stock</TableCell>
              <TableCell>Reorder Threshold</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {skus.filter(sku => sku.isActive).map((sku) => {
              const isLow = sku.currentStock <= sku.reorderThreshold;
              return (
                <TableRow 
                  key={sku.id}
                  sx={{ 
                    backgroundColor: isLow ? 'rgba(255, 152, 0, 0.1)' : 'inherit'
                  }}
                >
                  <TableCell>{sku.code}</TableCell>
                  <TableCell>{sku.name}</TableCell>
                  <TableCell>{sku.currentStock}</TableCell>
                  <TableCell>{sku.reorderThreshold}</TableCell>
                  <TableCell>
                    <Typography 
                      color={isLow ? 'error' : 'success'}
                    >
                      {isLow ? 'Below Threshold' : 'Normal'}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}; 