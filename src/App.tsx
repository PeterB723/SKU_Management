import React, { useState } from 'react';
import { SKUProvider } from './context/SKUContext';
import { BranchManager } from './components/BranchManager';
import { SKUManager } from './components/SKUManager';
import { StockManager } from './components/StockManager';
import { StockAdjustment } from './components/StockAdjustment';
import { StockTransfer } from './components/StockTransfer';
import { ReorderAlerts } from './components/ReorderAlerts';
import { BranchStockTracker } from './components/BranchStockTracker';
import {
  Box,
  Container,
  Tab,
  Tabs,
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-tab-panel-${index}`}
      aria-labelledby={`scrollable-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SKUProvider>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                SKU Management System
              </Typography>
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={value} 
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="SKU Management tabs"
                >
                  <Tab label="Branch Setup" />
                  <Tab label="SKU Creation" />
                  <Tab label="SKU Search" />
                  <Tab label="SKU Deactivation" />
                  <Tab label="Barcode/QR" />
                  <Tab label="Stock Levels" />
                  <Tab label="Stock Adjustment" />
                  <Tab label="Reorder Alerts" />
                  <Tab label="Stock Transfer" />
                  <Tab label="Branch Stock" />
                </Tabs>
              </Box>

              <TabPanel value={value} index={0}>
                <BranchManager />
              </TabPanel>
              
              <TabPanel value={value} index={1}>
                <SKUManager mode="create" />
              </TabPanel>
              
              <TabPanel value={value} index={2}>
                <SKUManager mode="search" />
              </TabPanel>
              
              <TabPanel value={value} index={3}>
                <SKUManager mode="deactivate" />
              </TabPanel>
              
              <TabPanel value={value} index={4}>
                <SKUManager mode="barcode" />
              </TabPanel>
              
              <TabPanel value={value} index={5}>
                <StockManager />
              </TabPanel>
              
              <TabPanel value={value} index={6}>
                <StockAdjustment />
              </TabPanel>
              
              <TabPanel value={value} index={7}>
                <ReorderAlerts />
              </TabPanel>
              
              <TabPanel value={value} index={8}>
                <StockTransfer />
              </TabPanel>
              
              <TabPanel value={value} index={9}>
                <BranchStockTracker />
              </TabPanel>
            </Box>
          </Container>
        </Box>
      </SKUProvider>
    </ThemeProvider>
  );
}

export default App; 