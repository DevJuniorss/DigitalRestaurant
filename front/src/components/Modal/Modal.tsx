import React, { ReactNode, useRef, useEffect } from 'react';
import type { FC } from 'react';
import styles from './Modal.module.css';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  titleId: string;
};

const Modal: FC<ModalProps> = ({ isOpen, onClose, children, titleId }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!isOpen){
      return;
    }
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div 
    className={styles.modalOverlay}
    onClick={onClose}
    role="dialog"
    aria-modal="true"
    aria-labelledby={titleId}
    
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button 
        ref={closeButtonRef}
        className={styles.closeButton} 
        onClick={onClose}
        aria-label='Fechar modal'
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;