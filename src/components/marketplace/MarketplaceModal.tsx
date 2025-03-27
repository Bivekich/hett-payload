import React, { useEffect } from 'react';
import MarketplaceList, { defaultMarketplaces } from './MarketplaceList';

interface Marketplace {
  name: string;
  link: string;
  url?: string;
}

interface MarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketplaces?: Marketplace[];
  title?: string;
}

const MarketplaceModal: React.FC<MarketplaceModalProps> = ({
  isOpen,
  onClose,
  marketplaces = defaultMarketplaces,
  title
}) => {
  // Close modal when ESC key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div 
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <MarketplaceList 
          marketplaces={marketplaces} 
          onClose={onClose}
          title={title}
        />
      </div>
      {/* Background overlay */}
      <div 
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
};

export default MarketplaceModal; 