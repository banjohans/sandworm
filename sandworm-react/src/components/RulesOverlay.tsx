import React from 'react';
import '../styles/RulesOverlay.css';

interface RulesOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

export const RulesOverlay: React.FC<RulesOverlayProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div id="rules-overlay">
      <div id="rules-content">
        <h2>How to Play</h2>
        <ul>
          <li>
            <strong>Goal:</strong> Eat as many Fremen as possible to score points.
          </li>
          <li>
            <strong>Special Rule:</strong> Eating "Lisan al Gaib" gives bonus points.
          </li>
          <li>
            <strong>Controls:</strong> Use arrow keys or swipe to move the sandworm.
          </li>
          <li>
            <strong>Time Limit:</strong> You have 3 minutes to collect points.
          </li>
          <li>
            <strong>Mouse click:</strong> Warp to anywhere with a mouse click for a 5 point penalty.
          </li>
          <li>
            <strong>Tip:</strong> Fremen are notoriously evasive when you approach them head on. Try attacking them from behind.
          </li>
        </ul>
        <button id="close-rules-button" className="menu-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};
