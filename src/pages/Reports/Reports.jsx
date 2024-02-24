import React, { useContext, useEffect, useState } from "react";
import MonthlyReportTableView from "./TableView/MonthlyReportTableView";
// import YearlyReportTableView from "./TableView/YearlyReportTableView";
import TableHeader from "../../components/TableHeader/TableHeader";


const Reports = () => {

  return (
    <>
      <TableHeader
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Reports" }]}
      />
      <section className="ml-6 font-serif">
        <div className="h-80vh flex flex-col overflow-hidden">
        
          <div className="min-w-full inline-block align-middle">
            <div className="" >
              <div className="flex-grow">
              
                  <MonthlyReportTableView/>
           
              </div>
            </div>
          </div>
          
        </div>
      </section>
    </>
  );
};

export default Reports;
