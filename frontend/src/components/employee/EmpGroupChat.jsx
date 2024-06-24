import React from 'react';
import EmployeeSidebar from './EmployeeSidebar';
import EmpMessage from './EmpMessage';

const EmpGroupChat = () => {
  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div >
        <EmployeeSidebar />
      </div>
      <div className="flex-1 bg-white overflow-y-auto">
        <EmpMessage />
      </div>
    </div>
  );
};

export default EmpGroupChat;
