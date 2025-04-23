interface VinRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const VinRequestModal: React.FC<VinRequestModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {children}
    </div>
  );
}; 