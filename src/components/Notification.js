// Notification.js
import React, { useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
 
const Notification = ({ message, variant = 'success', show, onClose }) => {
  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast onClose={onClose} show={show} delay={3000} autohide bg={variant}>
        <Toast.Header closeButton={true}>
          <strong className="me-auto">Notificació</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};
 
export default Notification;
