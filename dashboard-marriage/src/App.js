import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Dashboard, { CompletedPage, EidGreetingsPage, BirthdayPage } from './Dashboard';
import AdminsPage from './Dashboard/pages/AdminsPage';
import LoveMessagesPage from './Dashboard/pages/LoveMessagesPage';
import { ToastProvider } from './components/ToastProvider';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/completed" replace />} />
          <Route path="/dashboard" element={<Navigate to="/completed" replace />} />
          <Route path="/completed" element={<CompletedPage />} />
          <Route path="/invitations" element={<Navigate to="/completed" replace />} />
          <Route path="/invitations/new" element={<Dashboard />} />
          <Route path="/eid-greetings" element={<Navigate to="/completed" replace />} />
          <Route path="/eid-greetings/new" element={<EidGreetingsPage />} />
          <Route path="/birthday-greetings" element={<Navigate to="/completed" replace />} />
          <Route path="/birthday-greetings/new" element={<BirthdayPage />} />
          <Route path="/love-messages" element={<Navigate to="/completed" replace />} />
          <Route path="/love-messages/new" element={<LoveMessagesPage />} />
          <Route path="/settings" element={<AdminsPage />} />
          <Route path="*" element={<Navigate to="/completed" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
