import React from 'react';
import { motion } from 'framer-motion';
import './SummaryCard.css';

const SummaryCard = ({ icon, text, number, color = 'blue' }) => {
  return (
    <motion.div 
      className={`dashboard-card color-${color}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="card-glass">
        <div className="icon-container">
          {icon}
        </div>
        <div className="dashboard-content-inner">
          <p className="card-text">{text}</p>
          <p className="card-number">{number}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SummaryCard;