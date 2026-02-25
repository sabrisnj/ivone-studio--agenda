
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './store';
import App from './App';

// --- ROOT RENDERING ---
// Initialize the application by rendering the App component within the AppProvider context.
// This structure ensures all components have access to the global state defined in store.tsx.
const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <AppProvider>
            <App />
        </AppProvider>
    );
}
