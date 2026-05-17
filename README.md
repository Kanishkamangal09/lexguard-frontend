# LexGuard Frontend

The frontend of LexGuard is a premium, institutional-grade legal dashboard built with React and Vite. It provides a highly interactive and polished user experience for uploading contracts, viewing risk analyses, and conversing with an AI legal assistant.

## Technologies Used

- **React 19**: Modern UI component library.
- **Vite**: Blazing fast frontend tooling and development server.
- **Tailwind CSS v4**: Utility-first CSS framework for custom styling.
- **Framer Motion**: For fluid, sophisticated micro-animations and transitions.
- **Lucide React**: Clean, modern iconography.

## Features

- **Upload Vault**: Drag-and-drop PDF submission with animated progress steps and file validation.
- **Supreme Court Dossier**: A comprehensive dashboard showing overall risk scores and document metadata.
- **Risk Heat Map**: Visual bar chart of all clauses sorted by risk level.
- **Clause Analysis**: Side-by-side comparison of predatory text and suggested balanced amendments.
- **Interrogation Ledger**: Real-time streaming chat interface to ask specific questions about the analyzed document.
- **Print-Ready Reports**: Generate professional, formatted legal reports (`@media print` support).

## Setup & Installation

### Prerequisites

- Node.js (v20+ recommended)
- npm or yarn

### 1. Install Dependencies

Navigate to the `frontend` directory and install the required packages:

```bash
cd frontend
npm install
```

### 2. Run the Development Server

Start the Vite development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`. 

*Note: The frontend is configured to automatically proxy requests starting with `/api` to the backend server running at `http://localhost:8000` during development.*

### 3. Build for Production

To create an optimized production build:

```bash
npm run build
```

This will generate a `dist` directory. When deploying LexGuard as a single container (like on Google Cloud Run), these built static assets are copied to the backend and served directly by FastAPI.
