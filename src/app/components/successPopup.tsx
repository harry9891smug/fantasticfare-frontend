import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface SuccessPopupProps {
  show: boolean;
  onClose: () => void;
  title: string;
  message: string;
  isSuccess: boolean;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({
  show,
  onClose,
  title,
  message,
  isSuccess,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <div className="mb-3">
          {isSuccess ? (
            <FaCheckCircle size={48} className="text-success" />
          ) : (
            <FaTimesCircle size={48} className="text-danger" />
          )}
        </div>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant={isSuccess ? "success" : "danger"} onClick={onClose}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SuccessPopup;
