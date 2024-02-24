import React, { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
// import YearlyReportGraphView from '../GraphView/YearlyReportGraphView';
import { BsBarChart, BsTable } from 'react-icons/bs';

const YearScheduleTable = () => {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'graph'
    const currentYear = new Date().getFullYear();
  
    const [selectedDateRange, setSelectedDateRange] = useState([
      {
        startDate: new Date(currentYear, 0, 1), // Start of the year
        endDate: new Date(currentYear, 11, 31), // End of the year
        key: 'selection',
      },
  ]);

  const scheduleData = [
    {
      location: 'Baner',
      faculty: 'Faculty A',
      year: '2023',
      totalClasses: 50,
      months: [
        { month: 'January', classes: 22, doubt: 6 },
        { month: 'February', classes: 22, doubt: 6 },
        { month: 'March', classes: 22, doubt: 6 },
        { month: 'April', classes: 22, doubt: 6 },
        { month: 'May', classes: 22, doubt: 6 },
        { month: 'June', classes: 22, doubt: 6 },
        { month: 'July', classes: 22, doubt: 6 },
        { month: 'August', classes: 22, doubt: 6 },
        { month: 'September', classes: 22, doubt: 6 },
        { month: 'October', classes: 22, doubt: 6 },
        { month: 'November', classes: 22, doubt: 6 },
        { month: 'December', classes: 22, doubt: 6 },
      ],
    },
    {
      location: 'Pune',
      faculty: 'Faculty B',
      year: '2023',
      totalClasses: 60,
      months: [
        { month: 'January', classes: 25, doubt: 7 },
        { month: 'February', classes: 20, doubt: 6 },
        { month: 'March', classes: 24, doubt: 5 },
        { month: 'April', classes: 22, doubt: 6 },
        { month: 'May', classes: 22, doubt: 6 },
        { month: 'June', classes: 22, doubt: 6 },
        { month: 'July', classes: 22, doubt: 6 },
        { month: 'August', classes: 22, doubt: 6 },
        { month: 'September', classes: 22, doubt: 6 },
        { month: 'October', classes: 22, doubt: 6 },
        { month: 'November', classes: 22, doubt: 6 },
        { month: 'December', classes: 22, doubt: 6 },
      ],
    },
    {
      location: 'Mumbai',
      faculty: 'Faculty C',
      year: '2023',
      totalClasses: 55,
      months: [
        { month: 'January', classes: 23, doubt: 5 },
        { month: 'February', classes: 22, doubt: 6 },
        { month: 'March', classes: 21, doubt: 4 },
        { month: 'April', classes: 22, doubt: 6 },
        { month: 'May', classes: 22, doubt: 6 },
        { month: 'June', classes: 22, doubt: 6 },
        { month: 'July', classes: 22, doubt: 6 },
        { month: 'August', classes: 22, doubt: 6 },
        { month: 'September', classes: 22, doubt: 6 },
        { month: 'October', classes: 22, doubt: 6 },
        { month: 'November', classes: 22, doubt: 6 },
        { month: 'December', classes: 22, doubt: 6 },
      ],
    }
  ];
  
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const groupedData = scheduleData.reduce((result, data) => {
    const year = data.year;
    if (!result[year]) {
      result[year] = [];
    }
    result[year].push(data);
    return result;
  }, {});

  const handleToggleClick = () => {
    setViewMode(viewMode === 'table' ? 'graph' : 'table');
  };

  return (
    <div className="faculty-table">
      <div className="flex items-center mb-4 mt-4">
        <div className="relative inline-block w-64 mr-4">
          <input
            type="text"
            value={`${selectedDateRange[0].startDate.toDateString()} - ${selectedDateRange[0].endDate.toDateString()}`}
            readOnly
            onClick={() => setDatePickerVisible(!isDatePickerVisible)}
            className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary cursor-pointer"
          />
          {isDatePickerVisible && (
            <DateRangePicker
              ranges={selectedDateRange}
              onChange={(ranges) => {
                setSelectedDateRange([ranges.selection]);
                setDatePickerVisible(false);
              }}
              showDateDisplay={false}
              direction="horizontal"
            />
          )}
        </div>
        <button
          onClick={handleToggleClick}
          className="ReportBtns"
        >
          {viewMode === 'table' ? <BsBarChart /> : <BsTable />}
        </button>
      </div>
      {Object.entries(groupedData).length === 0 ? (
        <div className="text-red-600">No data available for the selected month.</div>
      ) : (
        <div className="overflow-x-auto">
            {viewMode === 'table' ? (
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-shadeColour">
                <th
                  scope="col"
                  className="px-8 py-3 whitespace-nowrap text-lg font-bold text-primary"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-8 py-3 whitespace-nowrap text-lg font-bold text-primary"
                >
                  Faculty
                </th>
                {/* <th
                  scope="col"
                  className="px-8 py-3 whitespace-nowrap text-lg font-bold text-primary"
                >
                  Year
                </th> */}
                <th
                  scope="col"
                  className="px-8 py-3 whitespace-nowrap text-lg font-bold text-primary"
                >
                  Total Classes
                </th>
                {scheduleData[0].months.map((month) => (
                  <th
                    key={month.month}
                    scope="col"
                    className="text-lg font-bold text-primary text-center"
                    colSpan="2">
                    {month.month} {selectedDateRange[0].startDate.getFullYear()}
                    <br />
                   <span className="px-8 py-3 whitespace-nowrap text-lg font-bold text-primary">Classes</span>
        <span className="px-8 py-3 whitespace-nowrap text-lg font-bold text-primary ml-4">Doubt</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-400">
              {Object.entries(groupedData).map(([year, yearData]) =>
                yearData.map(data => (
                  <tr key={`${year}-${data.location}`}>
                    <td className="px-8 py-3 whitespace-nowrap text-lg text-gray-800 text-center">
                      {data.location}
                    </td>
                    <td className="px-8 py-3 whitespace-nowrap text-lg text-gray-800 text-center">
                      {data.faculty}
                    </td>
                    {/* <td className="px-8 py-3 whitespace-nowrap text-lg text-gray-800 text-center">
                      {year}
                    </td> */}
                    <td className="px-8 py-3 whitespace-nowrap text-lg text-gray-800 text-center">
                      {data.months.reduce((total, month) => total + month.classes, 0)}
                    </td>
                    {data.months.map(month => (
                      <React.Fragment key={month.month}>
                        <td className="px-8 py-3 whitespace-nowrap text-lg text-gray-800 text-center">
                          {month.classes}
                        </td>
                        <td className="px-8 py-3 whitespace-nowrap text-lg text-gray-800 text-center">
                          {month.doubt}
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
            ) : (
              <div className="w-full h-50vh">
                {/* <YearlyReportGraphView selectedDateRange={selectedDateRange}/> */}
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default YearScheduleTable;
