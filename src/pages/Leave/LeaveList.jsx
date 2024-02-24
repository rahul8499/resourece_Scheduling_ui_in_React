import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import LocationContext from "../../context/LocationContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";

import { DateRangePicker } from "rsuite";
import { Link } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";
import TableHeader from "../../components/TableHeader/TableHeader";
import subDays from "date-fns/subDays";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import addDays from "date-fns/addDays";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import addMonths from "date-fns/addMonths";
import Popup from "../../components/Popup";
const predefinedRanges = [
  {
    label: "Today",
    value: [new Date(), new Date()],
    placement: "left",
  },
  {
    label: "Yesterday",
    value: [addDays(new Date(), -1), addDays(new Date(), -1)],
    placement: "left",
  },
  {
    label: "This week",
    value: [startOfWeek(new Date()), endOfWeek(new Date())],
    placement: "left",
  },
  {
    label: "Last 7 days",
    value: [subDays(new Date(), 6), new Date()],
    placement: "left",
  },
  {
    label: "Last 30 days",
    value: [subDays(new Date(), 29), new Date()],
    placement: "left",
  },
  {
    label: "This month",
    value: [startOfMonth(new Date()), new Date()],
    placement: "left",
  },
  {
    label: "Last month",
    value: [
      startOfMonth(addMonths(new Date(), -1)),
      endOfMonth(addMonths(new Date(), -1)),
    ],
    placement: "left",
  },
  {
    label: "This year",
    value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
    placement: "left",
  },
  {
    label: "Last year",
    value: [
      new Date(new Date().getFullYear() - 1, 0, 1),
      new Date(new Date().getFullYear(), 0, 0),
    ],
    placement: "left",
  },
  {
    label: "All time",
    value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date()],
    placement: "left",
  },
  {
    label: "Last week",
    closeOverlay: false,
    value: (value) => {
      const [start = new Date()] = value || [];
      return [
        addDays(startOfWeek(start, { weekStartsOn: 0 }), -7),
        addDays(endOfWeek(start, { weekStartsOn: 0 }), -7),
      ];
    },
    appearance: "default",
  },
  {
    label: "Next week",
    closeOverlay: false,
    value: (value) => {
      const [start = new Date()] = value || [];
      return [
        addDays(startOfWeek(start, { weekStartsOn: 0 }), 7),
        addDays(endOfWeek(start, { weekStartsOn: 0 }), 7),
      ];
    },
    appearance: "default",
  },
];
const LeaveList = () => {
  const [itemToDelete, setItemToDelete] = useState(null);

  const toastConfig = useMemo(
    () => ({
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
        marginBottom: "4vw",
        fontSize: "1.5em",
        width: "400px",
        padding: "10px",
      },
    }),
    []
  );
  const [isOpen, setIsOpen] = useState(false);
  const [deleteFaculyName, setDeleteFaculyName] = useState("");

  const openPopup = (id, firstName) => {
    setItemToDelete(id);
    setDeleteFaculyName(firstName); // Corrected spelling

    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };
  const handleDeleteLeave = () => {
    if (itemToDelete !== null) {
      setIsOpen(false);
      axios
        .delete(`${process.env.REACT_APP_API_URL}/deleteLeave/${itemToDelete}`)
        .then(() => {
          toast.success("leave Successfully Deleted.. ", toastConfig);
          leaveApiData();
        });
    }
  };

  const styles = { width: "20vw", display: "block", marginTop: 11 };

  const { selectedLocation } = useContext(LocationContext);
  const [leaves, setLeave] = useState([]);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "desc",
  });
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const noOfPages = Math.ceil(totalRecords / limit);
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  }
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const leaveApiData = async () => {
    const formattedStartDate = startDate
      ? startDate.toISOString().split("T")[0]
      : "";
    const formattedEndDate = endDate ? endDate.toISOString().split("T")[0] : "";

    const sortOrder = sortConfig.direction === "desc" ? "DESC" : " ASC";
    const sortBy = sortConfig.key ? sortConfig.key : "updated_at";

    const url = `http://dev.allen-api.com:5020/api/getLeave?starting_date=${formattedStartDate}&ending_date=${formattedEndDate}&faculty=${searchTerm}&location_id=${selectedLocation}&sort_by=${sortBy}&sort_order=${sortOrder}&page=${currentPage}&limit=${limit}`;
    try {
      const response = await fetch(url);

      if (response.ok) {
        const responseData = await response.json();
        const { data, total } = responseData.leave_records;
        setLeave(data);
        setTotalRecords(total);
        localStorage.setItem("totalLeaveRecords", total);
      } else {
        setLeave("");
      }
    } catch (error) {
      console.error("Error fetching Leave data:", error);
    }
  };

  const handleDateRangeChange = (selectedDates) => {
    setStartDate(selectedDates[0]);
    setEndDate(selectedDates[1]);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const handleLimitChange = (e) => {
    setLimit(e);
    setCurrentPage(0);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const getCurrentWeekDates = () => {
      const currentDate = new Date();
      const currentDay = currentDate.getDay();
      const diff = currentDay - 1;

      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - diff);

      const endOfWeek = new Date(currentDate);
      endOfWeek.setDate(currentDate.getDate() + (6 - diff));

      return [startOfWeek, endOfWeek];
    };

    const [initialStartDate, initialEndDate] = getCurrentWeekDates();
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      leaveApiData();
    }
  }, [
    searchTerm,
    sortConfig,
    selectedLocation,
    startDate,
    endDate,
    currentPage,
    limit,
  ]);

  function formatDateAndDay(dateString) {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const formattedDate = `${day}-${month}-${year}`;
    const dayOfWeek = daysOfWeek[dateObj.getDay()];
    return { formattedDate, dayOfWeek };
  }
  return (
    <div className="faculty-table">
      <ToastContainer />
      <section>
        <TableHeader
          breadcrumbs={[
            { name: "Schedule", path: "/schedule" },
            { name: "Leaves" },
          ]}
        />
      </section>
      <div class="grid grid-cols-12 m-1   ">
        <div class="md:col-span-11 flex sm:col-span-6 w-full  ">
          <input
            value={searchTerm}
            onChange={handleChange}
            style={{ width: "35vw" }}
            className="  bg-white border border-gray-500 m-1 py-3 px-4 focus:outline-none mt-3 ml-5"
            placeholder="Search....."
          />

          <div className=" ml-6 ">
            <DateRangePicker
              showOneCalendar
              size="lg"
              placeholder="Calender"
              ranges={predefinedRanges}
              style={styles}
              value={[startDate, endDate]}
              onChange={handleDateRangeChange}
              format="dd-MM-yyyy"
            />
          </div>
        </div>
        <div class=" md:col-span-1   pl-5   ">
          <Link to="/leavecreate">
            <button className="bg-white mt-3  hover:bg-gray-100 text-gray-800 text-2xl font-bold py-1 px-3 border border-gray-400 shadow">
              +
            </button>
          </Link>
        </div>
      </div>

      <section className="ml-6 font-serif bg-secondaryColour ">
        <div className="overflow--auto">
          <div className="min-w-full inline-block align-middle">
            <div className="" style={{ height: "30vw" }}>
              <table className="min-w-full divide-y divide-gray-400 ">
                <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                  <tr className=" bg-primaryColour text-white">
                    <th
                      scope="col"
                      className="px-8 py-3 whitespace-nowrap  text-base font-bold text-primary cursor-pointer"
                      onClick={() => handleSort("faculty_id")}
                    >
                      Faculty Name{" "}
                      {sortConfig.key === "faculty_id" ? (
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
                      className="px-8 py-3 whitespace-nowrap  text-base font-bold text-primary "
                    >
                      Start Date
                    </th>

                    <th
                      scope="col"
                      className="px-8 py-3 whitespace-nowrap  text-base font-bold text-primary "
                    >
                      End Date
                    </th>

                    <th
                      scope="col"
                      className="px-8 py-3 whitespace-nowrap  text-base font-bold text-primary "
                    >
                      Slots
                    </th>

                    <th
                      scope="col"
                      className=" py-3 whitespace-nowrap  text-base font-bold text-primary "
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-400">
                  {leaves.length > 0 ? (
                    leaves.map((item, i) => (
                      <tr className="hover:bg-gray-100 cursor-pointer" key={i}>
                        <td className="px-4 py-3 whitespace-nowrap  text-sm text-gray-800 text-center">
                          {item.faculty.first_name} {item.faculty.last_name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-center">
                          {formatDateAndDay(item.dates[0]).formattedDate}-{" "}
                          {formatDateAndDay(item.dates[0]).dayOfWeek}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-center">
                          {
                            formatDateAndDay(item.dates[item.dates.length - 1])
                              .formattedDate
                          }
                          -{" "}
                          {
                            formatDateAndDay(item.dates[item.dates.length - 1])
                              .dayOfWeek
                          }
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap  text-sm text-gray-800 text-center">
                          {item.batch_slot.name}
                        </td>
                        <td className="px-8 py-3 justify-center flex whitespace-nowrap text-sm font-medium text-center">
                          <div>
                            <button className="button muted-button">
                              <Link to={`/leaveEdit/${item.id}`}>
                                <AiFillEdit className="text-xl mr-3 text-green-700" />
                              </Link>
                            </button>
                          </div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <button
                              onClick={() =>
                                openPopup(
                                  item.id,
                                  item.faculty.first_name +
                                    " " +
                                    item.faculty.last_name
                                )
                              }
                            >
                              <RiDeleteBin6Line className="text-red-700 text-xl mr-3" />
                            </button>

                            <Popup
                              isOpen={isOpen}
                              onClose={closePopup}
                              heading={deleteFaculyName}
                            >
                              <h6>Do you want to delete the leave ?</h6>
                              <div className="button-container">
                                <button
                                  className="text-gray-900  bg-gray-50 border border-gray-300 focus:outline-none hover:bg-gray-100  font-medium  text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:border-gray-600 dark:focus:ring-gray-800"
                                  onClick={() => setIsOpen(false)}
                                >
                                  No
                                </button>
                                <button
                                  className="focus:outline-none text-white bg-primaryColour hover:bg-primaryColour-1000 focus:ring-4 focus:ring-green-300 font-medium  text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                  onClick={() => handleDeleteLeave()}
                                >
                                  Yes
                                </button>
                              </div>
                            </Popup>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        No leaves available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="" style={{ float: "right" }}>
          <div className="flex mt-2">
            <p className=" mt-1 ">Items per page:</p>

            <div className="relative inline-block">
              <button
                className="me-3 mb-3 md:mb-0 text-balck  border       font-medium text-sm px-3 py-1 text-center inline-flex items-center  "
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

              <div
                className={`z-10 ${
                  isDropdownOpen ? "" : "hidden"
                } absolute bottom-0 mb-6 bg-white divide-y divide-gray-100 rounded-lg   w-16 dark:bg-gray-700`}
              >
                <ul className="py-2text-base text-gray-700 dark:text-gray-200">
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
              pageCount={noOfPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={2}
              onPageChange={handlePageChange}
              containerClassName="pagination"
              previousLinkClassName="pagination__link"
              nextLinkClassName="pagination__link"
              disabledClassName="pagination__link--disabled"
              activeClassName="pagination__link--active"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
export default LeaveList;
