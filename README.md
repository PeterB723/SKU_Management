# SKU_Management
ERP assignment using react

# SKU Management System

A React-based SKU (Stock Keeping Unit) Management System that helps businesses manage their inventory across multiple branches.

## Features

- **Branch Management**: Create and manage inventory branches
- **SKU Management**: Create, view, and deactivate SKUs
- **Stock Management**: Track and adjust stock levels
- **QR Code Integration**: Generate QR codes for SKUs
- **Stock Transfer**: Transfer stock between branches
- **Reorder Alerts**: Get notifications when stock is low

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sku-management
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### Branch Management
- Add new branches with name, location, and contact details
- View all branches in a table format

### SKU Management
- Create new SKUs with name, code, category, subcategory, and brand
- Generate QR codes for SKUs
- Deactivate SKUs when needed
- View all SKUs in a table format

### Stock Management
- Adjust stock levels with reasons
- Transfer stock between branches
- Monitor stock levels across all branches
- View reorder alerts when stock is low

## Development

- Built with React + TypeScript
- Uses Material-UI for components
- State management with React Context API
- QR code generation with qrcode.react

## Building for Production

To create a production build:

```bash
npm run build
```

The build files will be available in the `dist` directory.

## License

MIT 
