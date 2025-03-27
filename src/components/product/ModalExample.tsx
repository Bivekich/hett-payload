import React, { useState } from 'react';
import Button from '../uiKit/Button';
import { MarketplaceModal, defaultMarketplaces } from '../marketplace';
import { DistributorsModal, defaultDistributors } from '../distributor';

const ModalExample: React.FC = () => {
  const [showMarketplaces, setShowMarketplaces] = useState(false);
  const [showDistributors, setShowDistributors] = useState(false);

  return (
    <div className="p-8 flex flex-col gap-4">
      <h2 className="text-2xl font-bold font-[Roboto_Condensed] mb-4">Модальные окна</h2>
      
      <div className="flex gap-4">
        <Button 
          label="Все маркетплейсы"
          onClick={() => setShowMarketplaces(true)}
          variant="primary"
          className="w-auto"
        />
        
        <Button 
          label="Дистрибьюторы"
          onClick={() => setShowDistributors(true)}
          variant="primary"
          className="w-auto"
        />
      </div>
      
      {/* Marketplace Modal */}
      <MarketplaceModal
        isOpen={showMarketplaces}
        onClose={() => setShowMarketplaces(false)}
        marketplaces={defaultMarketplaces}
        title="Все маркетплейсы"
      />
      
      {/* Distributors Modal */}
      <DistributorsModal
        isOpen={showDistributors}
        onClose={() => setShowDistributors(false)}
        distributors={defaultDistributors}
        title="Дистрибьюторы"
      />
    </div>
  );
};

export default ModalExample; 