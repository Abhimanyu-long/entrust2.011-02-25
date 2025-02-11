import React from 'react';

const ConfirmationModal = ({ show, onConfirm, onCancel, message }) => {
  if (!show) return null; // Don't render anything if the modal is not visible

  return (
    <div style={styles.modalBackdrop}>
      <div style={styles.modalContent}>
        <p>{message}</p>
        <div style={styles.buttonContainer}>
          <button onClick={onConfirm} style={styles.confirmButton}>Confirm</button>
          <button onClick={onCancel} style={styles.cancelButton}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Basic styles for the modal
const styles = {
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    width: '300px',
  },
  buttonContainer: {
    marginTop: '20px',
  },
  confirmButton: {
    padding: '10px 20px',
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    marginRight: '10px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
};

export default ConfirmationModal;
