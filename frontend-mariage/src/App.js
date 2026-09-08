import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import EidTemplates from './screens/EidTemplates';
import BirthdayTemplates from './screens/BirthdayTemplates';
import OrganizerDashboard from './screens/OrganizerDashboard';
import LoveMessages from './screens/LoveMessages';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/eid/:eidPath" element={<EidTemplates />} />
          <Route path="/birthday/:birthdayPath" element={<BirthdayTemplates />} />
          <Route path="/love/:loveMessagePath" element={<LoveMessages />} />
          <Route path="/:invitationPath/organizer" element={<OrganizerDashboard />} />
          <Route path="/:invitationPath" element={<HomeScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
