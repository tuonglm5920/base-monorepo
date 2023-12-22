import { FC } from 'react';
import './ConfirmLeavePage.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
export const ConfirmDialog: FC<Props> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="overlay">
      <div className="dialog">
        <h2>Confirm Navigation</h2>
        <p>You have unsaved changes. Are you sure you want to leave this page?</p>
        <div className="actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm} className="confirm">
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};
