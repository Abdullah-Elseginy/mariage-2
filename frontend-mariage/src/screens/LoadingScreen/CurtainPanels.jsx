import React from 'react';
import { motion } from 'framer-motion';

const panelTransition = {
  duration: 1.55,
  ease: [0.76, 0, 0.24, 1],
};

const CurtainPanels = ({ isOpen, groomName, brideName, transition = panelTransition }) => (
  <div className="loading-curtains" aria-hidden="true">
    <motion.div className="loading-curtain-panel loading-curtain-panel-left" initial={{ x: 0 }} animate={{ x: isOpen ? '-104%' : 0 }} transition={transition}>
      <span className="curtain-name curtain-name-left">{groomName}</span>
      <span className="curtain-panel-glow" />
      <span className="curtain-panel-handle" />
    </motion.div>
    <motion.div className="loading-curtain-panel loading-curtain-panel-right" initial={{ x: 0 }} animate={{ x: isOpen ? '104%' : 0 }} transition={transition}>
      <span className="curtain-name curtain-name-right">{brideName}</span>
      <span className="curtain-panel-glow" />
      <span className="curtain-panel-handle" />
    </motion.div>
    <motion.div className="loading-curtain-line" initial={{ opacity: 0, scaleY: 0.64 }} animate={{ opacity: isOpen ? 0 : 1, scaleY: isOpen ? 1.08 : 1 }} transition={{ duration: 0.8, ease: 'easeOut' }} />
  </div>
);

export default CurtainPanels;
