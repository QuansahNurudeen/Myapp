import React, { createContext, useState, useContext } from 'react';

const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  const [selectedBusiness, setSelectedBusiness] = useState('All');
  const [businesses] = useState(['All', 'Boutique', 'Hardware', 'Cold Store']);

  return (
    <BusinessContext.Provider value={{ 
      selectedBusiness, 
      setSelectedBusiness,
      businesses
    }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => useContext(BusinessContext);