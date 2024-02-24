import React, { useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./Report.css";
import ReactPaginate from "react-paginate";
import LocationContext from "../../../context/LocationContext";
import { getApiService } from "../../../Services/Services";

const MonthlyReportTableView = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { selectedDate, selectedLocation } = useContext(LocationContext);
  console.log(selectedDate);
  const selectedDateArray = Array.isArray(selectedDate) ? selectedDate : [];
  function formatDate(dateString) {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const formattedDates = selectedDateArray.map((dateString) => {
    const startingDateDecoded = decodeURIComponent(dateString);
    return formatDate(startingDateDecoded);
  });
  const startDate = formattedDates[0];
  const endDate = formattedDates[1];
  console.log(startDate, endDate);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "desc",
  });
  const [totalRecords, setTotalRecords] = useState("");
  const [limit, setLimit] = useState(6);
  const noOfpage = totalRecords / limit;
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const sortOrder = sortConfig.direction === "desc" ? "DESC" : " ASC";
  const sortBy = sortConfig.key ? sortConfig.key : "facutly";

  function getDateRangeForWeek(weekNumber, year) {
    const startDate = new Date(year, 0, 1 + (weekNumber - 1) * 7);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    // Adjusted options for the desired date format
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedStartDate = startDate.toLocaleDateString(undefined, options);
    const formattedEndDate = endDate.toLocaleDateString(undefined, options);

    // Extract day part from formattedStartDate and concatenate with the formattedEndDate
    const dayPart = formattedStartDate.split(" ")[0];
    return `${dayPart} - ${formattedEndDate}`;
  }
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };
  const handleLimitChange = (e) => {
    setLimit(e);
    setCurrentPage(0); // Reset current page to 0 when changing the limit
    setIsDropdownOpen(!isDropdownOpen);
  };
  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      const reportURL = `${process.env.REACT_APP_API_URL}/getReport?search_term=${searchTerm}&limit=${limit}&page=${currentPage}&sortBy=${sortBy}&sortOrder=${sortOrder}&starting_date=${startDate}&ending_date=${endDate}&location_id=${selectedLocation}`;
      const response = await getApiService(reportURL);
      console.log("responseData", response)
      setData(response?.location_id[0]?.data?.faculty_data);
      console.log("response.data.pagination.total", response.pagination.total)
      setTotalRecords(response.pagination.total)
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(data, "reportData");
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };
  useEffect(() => {
    if (selectedLocation) {
      fetchReportData();
    }
  }, [searchTerm, currentPage, sortConfig, selectedLocation, limit, startDate,  endDate]);
  // useEffect(() => {
  //   if (selectedDateArray.length > 0 && selectedLocation) {
  //     fetchReportData();
  //   }
  //   fetchReportData();
  // }, [searchTerm,sortOrder, startDate,limit, endDate, selectedLocation, selectedDateArray]);

  return (
    <div>
    <div className="faculty-table">
    <div className="flex items-center justify-between  mt-2">
  <div className="flex items-center">
    <input
      value={searchTerm}
      onChange={handleChange}
      style={{ width: "35vw" }}
      className="bg-white border border-gray-500 m-1 py-3 px-4 focus:outline-none mt-3 "
      placeholder="Search....."
    />
  </div>
</div>
      <div className="overflow-x-auto flex-grow bg-secondaryColour mt-1  " style={{height:"28vw"}}>
        <table className="table-auto w-full">
          <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
            <tr className="bg-shadeColour">
              <th
                scope="col"
                className="px-8 py-3 whitespace-nowrap text-base font-bold text-primary cursor-pointer"
                onClick={() => handleSort("facutly")}
              >
                Faculty
                {sortConfig.key === "facutly" ? (
                  sortConfig.direction === "asc" ? (
                    <span>▲</span>
                  ) : (
                    <span>▼</span>
                  )
                ) : (
                  <span>▲</span>
                )}
              </th>

              <th
                scope="col"
                className="px-8 py-3 whitespace-nowrap text-base font-bold text-primary"
              >
                Code
              </th>
              <th
                scope="col"
                className="px-8 py-3 whitespace-nowrap text-base font-bold text-primary"
              >
                Subject
              </th>
              {/* Display the week and slot information in the table head */}
              {data &&
                data.length > 0 &&
                data[0].weeks.map((week, weekIndex) => (
                  <th
                    key={weekIndex}
                    className="px-8 py-3 whitespace-nowrap text-base font-bold text-primary"
                  >
                    {getDateRangeForWeek(week.week, 2024)}
                  </th>
                ))}
            </tr>
          </thead>
          {data?.length > 0 ? (
            <tbody className="divide-y divide-gray-400">
              {data?.map((facultyData, index) => (
                <tr key={index}>
                  <td className="px-8 py-3 whitespace-nowrap text-sm text-gray-800 text-center">
                    {`${facultyData.faculty.first_name} ${facultyData.faculty.last_name}`}
                  </td>
                  <td className="px-8 py-3 whitespace-nowrap text-sm text-gray-800 text-center">
                    {facultyData.faculty.faculty_code}
                  </td>
                  <td className="px-8 py-3 whitespace-nowrap text-sm text-gray-800 text-center">
                    {/* Check if facultyData.faculty.subject exists and is an array */}
                    {facultyData.faculty.subject &&
                      Array.isArray(facultyData.faculty.subject) &&
                      // Use the map function to display each subject_name
                      facultyData.faculty.subject.map((sub, subIndex) => (
                        <div key={subIndex}>{sub.subject_name}</div>
                      ))}
                  </td>
                  {/* Display the corresponding slots for each week in the body */}
                  {data[0].weeks.map((week, weekIndex) => (
                    <td
                      key={weekIndex}
                      className="px-8 py-3 whitespace-nowrap text-sm text-gray-800 text-center"
                    >
                      {/* Find the corresponding week data for the faculty */}
                      {facultyData.weeks.find(
                        (facultyWeek) => facultyWeek.week === week.week
                      ) &&
                        facultyData.weeks.find(
                          (facultyWeek) => facultyWeek.week === week.week
                        ).slots.length}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ) : (
            <p style={{ textAlign: "center" }}>
           No records avaible please select other date.
            </p>
          )}
        </table>
      </div>
     
    </div>
    <div className="" style={{ float: "right" }}>
          <div className="flex mt-2">
            <p className=" mt-2 ">Items per page:</p>
            <div className="relative inline-block">
              <button
                className="me-3 mb-3 md:mb-0 text-balck  border       font-medium  text-sm px-3 py-2 text-center inline-flex items-center  "
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                type="button"
                style={{ border: " 2px solid balck" }}
              >
                {limit}
                <svg
                  className={`w-2.5 h-2.5 ms-3 transition-transform transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5 5 1 1 5"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              <div
                className={`z-10 ${
                  isDropdownOpen ? "" : "hidden"
                } absolute bottom-0 mb-10 bg-white divide-y divide-gray-100 rounded-lg  w-16 dark:bg-gray-700`}
              >
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <button
                      onClick={() => handleLimitChange(6)}
                      className="block px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                    >
                      6
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleLimitChange(10)}
                      className="block px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                    >
                      10
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleLimitChange(20)}
                      className="block px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                    >
                      20
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleLimitChange(50)}
                      className="block px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                    >
                      50
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <ReactPaginate
              previousLabel="<"
              nextLabel=">"
              breakLabel="..."
              pageCount={noOfpage}
              marginPagesDisplayed={2}
              pageRangeDisplayed={2}
              onPageChange={handlePageChange}
              containerClassName={"pagination"}
              previousLinkClassName={"pagination__link"}
              nextLinkClassName={"pagination__link"}
              disabledClassName={"pagination__link--disabled"}
              activeClassName={"pagination__link--active"}
            />
          </div>
        </div>
   </div>
  );
};

export default MonthlyReportTableView;






