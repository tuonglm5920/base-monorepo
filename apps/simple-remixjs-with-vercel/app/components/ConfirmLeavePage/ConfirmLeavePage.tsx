import { FC } from 'react';
import './ConfirmLeavePage.css';
import { Text, View } from 'reactjs';

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
        <Text tagName="h1" disableStrict>
          Confirm Navigation
        </Text>
        <Text tagName="p" disableStrict>
          You have unsaved changes. Are you sure you want to leave this page?
        </Text>
        <div className="actions">
          <View tagName="button" disableStrict onClick={onClose}>
            Cancel
          </View>
          <View tagName="button" disableStrict onClick={onConfirm} className="confirm">
            Leave
          </View>
        </div>
      </div>
    </div>
  );
};
