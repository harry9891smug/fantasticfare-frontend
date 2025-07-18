import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface SuccessPopupProps {
  show: boolean;
  onClose: () => void;
}

const SpecialCallOfferModal: React.FC<SuccessPopupProps> = ({
  show,
  onClose,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Hello</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <div className="mb-3">hi</div>
        <p>test</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SpecialCallOfferModal;
