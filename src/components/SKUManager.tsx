import React, { useState, useEffect } from 'react';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import SearchIcon from '@mui/icons-material/Search';
import QRCode from 'qrcode.react';
import Barcode from 'react-barcode';

interface SKUManagerProps {
  mode: 'create' | 'search' | 'deactivate' | 'barcode';
}

export const SKUManager: React.FC<SKUManagerProps> = ({ mode }) => {
  const { skus, addSKU, deactivateSKU, searchSKUs } = useSKU();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [brandName, setBrandName] = useState('');
  const [selectedSKU, setSelectedSKU] = useState<string | null>(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [deactivationSuccess, setDeactivationSuccess] = useState(false);
  const [autoGenerateCode, setAutoGenerateCode] = useState(true);
  const [skuIdInput, setSkuIdInput] = useState('');
  const [deactivationError, setDeactivationError] = useState<string | null>(null);

  const generateSKUCode = () => {
    if (!name || !category || !brandName) return '';
    
    // Create code from first 3 letters of category, first 3 of brand, and first 3 of name
    const categoryPrefix = category.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
    const brandPrefix = brandName.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
    const namePrefix = name.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
    
    // Add a random 4-digit number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    
    return `${categoryPrefix}${brandPrefix}${namePrefix}-${randomNum}`;
  };

  useEffect(() => {
    if (autoGenerateCode && name && category && brandName) {
      setCode(generateSKUCode());
    }
  }, [autoGenerateCode, name, category, brandName]);

  // Filter SKUs based on search criteria
  const filteredSKUs = searchQuery
    ? searchSKUs(searchQuery).filter(sku => {
        if (searchType === 'all') return true;
        if (searchType === 'name') return sku.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (searchType === 'code') return sku.code.toLowerCase().includes(searchQuery.toLowerCase());
        if (searchType === 'category') return sku.category.toLowerCase().includes(searchQuery.toLowerCase());
        return true;
      })
    : skus;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skuCode = autoGenerateCode ? generateSKUCode() : code;
    addSKU({
      name,
      code: skuCode,
      category,
      subcategory,
      brandName,
      reorderThreshold: 10,
    });
    setName('');
    setCode('');
    setCategory('');
    setSubcategory('');
    setBrandName('');
  };

  const handleDeactivate = (id: string) => {
    setSelectedSKU(id);
    setDeactivateDialogOpen(true);
  };

  const confirmDeactivation = () => {
    if (selectedSKU) {
      deactivateSKU(selectedSKU);
      setDeactivationSuccess(true);
      setTimeout(() => {
        setDeactivateDialogOpen(false);
        setDeactivationSuccess(false);
      }, 2000);
    }
  };

  const handleQRCode = (skuId: string) => {
    setSelectedSKU(skuId);
    setQrDialogOpen(true);
  };

  const handleDirectDeactivation = () => {
    const skuToDeactivate = skus.find(sku => sku.id === skuIdInput || sku.code === skuIdInput);
    
    if (!skuToDeactivate) {
      setDeactivationError('SKU not found. Please check the ID/Code and try again.');
      return;
    }

    if (!skuToDeactivate.isActive) {
      setDeactivationError('This SKU is already deactivated.');
      return;
    }

    setSelectedSKU(skuToDeactivate.id);
    setDeactivationError(null);
    setDeactivateDialogOpen(true);
  };

  const renderContent = () => {
    switch (mode) {
      case 'create':
        return (
          <>
            <Typography variant="h5" gutterBottom>
              Create New SKU
            </Typography>
            <Paper sx={{ p: 2, mb: 3 }}>
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(3, 1fr)', mb: 2 }}>
                  <TextField
                    label="Item Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    fullWidth
                  />
                  <Box sx={{ gridColumn: 'span 2' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={autoGenerateCode}
                          onChange={(e) => setAutoGenerateCode(e.target.checked)}
                        />
                      }
                      label="Auto-generate SKU Code"
                    />
                    <TextField
                      label="SKU Code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      fullWidth
                      disabled={autoGenerateCode}
                      helperText={autoGenerateCode ? "Code will be generated automatically" : "Enter SKU code manually"}
                    />
                  </Box>
                  <TextField
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Subcategory"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Brand Name"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    required
                    fullWidth
                  />
                </Box>
                <Button type="submit" variant="contained" color="primary">
                  Add SKU
                </Button>
              </form>
            </Paper>
          </>
        );

      case 'search':
        return (
          <>
            <Typography variant="h5" gutterBottom>
              Search SKUs
            </Typography>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                  InputProps={{
                    endAdornment: <SearchIcon />
                  }}
                />
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Search By</InputLabel>
                  <Select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    label="Search By"
                  >
                    <MenuItem value="all">All Fields</MenuItem>
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="code">SKU Code</MenuItem>
                    <MenuItem value="category">Category</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Paper>
          </>
        );

      case 'deactivate':
        return (
          <>
            <Typography variant="h5" gutterBottom>
              Deactivate SKUs
            </Typography>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body1">
                  Enter SKU ID or Code to deactivate
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <TextField
                    label="SKU ID/Code"
                    value={skuIdInput}
                    onChange={(e) => {
                      setSkuIdInput(e.target.value);
                      setDeactivationError(null);
                    }}
                    fullWidth
                    error={!!deactivationError}
                    helperText={deactivationError}
                  />
                  <Button 
                    variant="contained" 
                    color="error" 
                    onClick={handleDirectDeactivation}
                    disabled={!skuIdInput}
                  >
                    Deactivate
                  </Button>
                </Box>
              </Box>
            </Paper>
            <Alert severity="info" sx={{ mb: 2 }}>
              You can either enter a SKU ID/Code above or select from the table below to deactivate. Deactivated SKUs will retain their historical data.
            </Alert>
          </>
        );

      case 'barcode':
        return (
          <>
            <Typography variant="h5" gutterBottom>
              SKU Barcodes & QR Codes
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Click on the barcode icon to view or print the SKU's barcode and QR code.
            </Alert>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {renderContent()}

      {/* SKUs Table - shown for all modes except create */}
      {mode !== 'create' && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SKU Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Subcategory</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSKUs.map((sku) => (
                <TableRow key={sku.id}>
                  <TableCell>{sku.code}</TableCell>
                  <TableCell>{sku.name}</TableCell>
                  <TableCell>{sku.category}</TableCell>
                  <TableCell>{sku.subcategory}</TableCell>
                  <TableCell>{sku.brandName}</TableCell>
                  <TableCell>{sku.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    {mode === 'deactivate' && (
                      <IconButton 
                        onClick={() => handleDeactivate(sku.id)} 
                        disabled={!sku.isActive}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                    {mode === 'barcode' && (
                      <IconButton 
                        onClick={() => handleQRCode(sku.id)}
                        color="primary"
                      >
                        <QrCode2Icon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* QR Code Dialog */}
      <Dialog 
        open={qrDialogOpen} 
        onClose={() => setQrDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>SKU Identification Codes</DialogTitle>
        <DialogContent>
          {selectedSKU && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, py: 2 }}>
              <Typography variant="h6">QR Code</Typography>
              <QRCode value={selectedSKU} size={200} />
              <Typography variant="h6">Barcode</Typography>
              <Barcode value={selectedSKU} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Deactivation Confirmation Dialog */}
      <Dialog open={deactivateDialogOpen} onClose={() => setDeactivateDialogOpen(false)}>
        <DialogTitle>Confirm Deactivation</DialogTitle>
        <DialogContent>
          {deactivationSuccess ? (
            <Alert severity="success">SKU successfully deactivated!</Alert>
          ) : (
            <Typography>
              Are you sure you want to deactivate this SKU? This action will retain historical data.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          {!deactivationSuccess && (
            <>
              <Button onClick={() => setDeactivateDialogOpen(false)}>Cancel</Button>
              <Button onClick={confirmDeactivation} color="error" variant="contained">
                Deactivate
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 