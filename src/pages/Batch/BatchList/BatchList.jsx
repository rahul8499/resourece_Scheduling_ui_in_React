import React, { useEffect, useMemo, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";
import { IoEyeSharp } from "react-icons/io5";
import axios from "axios";
import ReactPaginate from "react-paginate";
import TableHeader from "../../../components/TableHeader/TableHeader";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import LocationContext from "../../../context/LocationContext";
import { useContext } from "react";
import Popup from "../../../components/Popup";

const BatchList = (props) => {
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
        fontSize: "1.2em",
        width: "400px",
        padding: "10px",
      },
    }),
    []
  );
  const [isOpen, setIsOpen] = useState(false);
  const [deleteBatchCode, setDeleteBatchCode] = useState('')

  const openPopup = (id,  batchCode) => {
    setItemToDelete(id)
    setDeleteBatchCode(batchCode); // Corrected spelling

    setIsOpen(true);
  };


  const closePopup = () => {
    setIsOpen(false);
  };
  const handleDeleteBatch = () => {
    if (itemToDelete !== null) {
      setIsOpen(false);
      axios
        .delete(`${process.env.REACT_APP_API_URL}/delete/${itemToDelete}`)
        .then(() => {
          toast.success("Batch Successfully deleted.. ", toastConfig);

          batchApiData();
        });
    }
  };

  const { selectedLocation } = useContext(LocationContext);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "desc",
  });
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState("");
  const [batchData, setBatchData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const noOfPages = Math.ceil(totalRecords / limit);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const batchApiData = async () => {
    const sortOrder = sortConfig.direction === "asc" ? "ASC" : "DESC";
    const sortBy = sortConfig.key ? sortConfig.key : "updated_at";
    const url = `${process.env.REACT_APP_API_URL}/getbatchdata?q=${searchTerm}&limit=${limit}&page=${currentPage}&sortBy=${sortBy}&sortOrder=${sortOrder}&location_id=${selectedLocation}`;

    try {
      const response = await fetch(url);

      if (response.ok) {
        const responseData = await response.json();
        const { data, total } = responseData;
        setBatchData(data);

        setTotalRecords(total);
        localStorage.setItem("totalBatchRecords", total);
      } else {
        console.error("Error fetching batch data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching batch data:", error);
    }
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
    if (selectedLocation) {
      batchApiData();
    }
  }, [searchTerm, currentPage, sortConfig, selectedLocation, limit]);

  function formatDateddmmyy(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
    return `${day}-${month}-${year}`;
  }
  return (
    <div className="">
      <ToastContainer />
      <section>
        <TableHeader

          breadcrumbs={[{ name: 'Schedule', path: '/schedule' }, 
          { name: "Batches" }]}
        />
      </section>

      <div className="grid grid-cols-12 m-1">
        <div className="md:col-span-11 sm:col-span-6 w-full">
       
          <input
            value={searchTerm}
            onChange={handleChange}
            style={{ width: "35vw" }}
            className="bg-white border border-gray-500 m-1 py-3 px-4 focus:outline-none mt-3 ml-5"
            placeholder="Search....."
          />
        </div>
        <div className="md:col-span-1   pl-5   ">
          <Link to="/batchcreate">
            <button className="bg-white mt-3   hover:bg-gray-100 text-gray-800 text-2xl font-bold py-1 px-3 border border-gray-400  shadow">
              +
            </button>
          </Link>
        </div>
      </div>

      <section className="ml-6 font-serif bg-secondaryColour mr-4">
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="" style={{ height: "30vw" }}>
              <table className="min-w-full divide-y divide-gray-400 ">
                <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                  <tr className=" bg-primaryColour text-white">
                    <th
                      scope="col"
                      className="px-4 py-3 whitespace-nowrap  text-base font-bold text-primary cursor-pointer"
                      onClick={() => handleSort("batch_code")}
                    >
                      Batch Code{" "}
                      {sortConfig.key === "batch_code" ? (
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
                      className="px-4 py-3 whitespace-nowrap  text-base font-bold text-primary "
                    >
                      Batch Type
                     
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3 whitespace-nowrap  text-base font-bold text-primary "
                      onClick={() => handleSort("batch_slot")}
                    >
                      {" "}
                      Batch Slots
                      
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3 whitespace-nowrap  text-base font-bold text-primary cursor-pointer "
                      onClick={() => handleSort("batch_stream_id")}
                    >
                      Batch Stream
                      {sortConfig.key === "batch_stream_id" ? (
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
                      className="px-4 py-3 whitespace-nowrap  text-base font-bold text-primary cursor-pointer cursor-pointer"
                      onClick={() => handleSort("starting_date")}
                    >
                      Start Date{" "}
                      {sortConfig.key === "starting_date" ? (
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
                      className="px-4 py-3 whitespace-nowrap  text-base font-bold text-primary cursor-pointer"
                      onClick={() => handleSort("duration")}
                    >
                      Duration
                      {sortConfig.key === "duration" ? (
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
                      className="px-8 py-3 whitespace-nowrap  text-base font-bold text-primary cursor-pointer"
                      onClick={() => handleSort("location_id")}
                      
                    >
                      Locations
                      {sortConfig.key === "location_id" ? (
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
                      className="px-4 py-3 whitespace-nowrap  text-base font-bold text-primary "
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-400 dark:divide-gray-700">
                  {batchData.map((item, i) => (
                    <tr className="hover:bg-gray-100">
                      <td className="px-8 py-4 whitespace-nowrap text-sm  text-gray-800  ">
                        {item.batch_code}
                      </td>
                      <td className="px-16 py-4 whitespace-nowrap text-sm  text-gray-800  text-center">
                        {item.batch_types.map((batchtype) => (
                          <p>{batchtype.name}</p>
                        ))}
                      </td>

                      <td className="px-8 py-4 whitespace-nowrap text-sm  text-gray-800 text-center">
  
                        {item.batch_slots.length === 0
                          ? item.slot_times_foundations.map(
                              (slotTime, index) => (
                                <React.Fragment key={index}>
                                  {slotTime.slot_times &&
                                    slotTime.slot.includes("morning") && (
                                      <p>Morning</p>
                                    )}
                                  {slotTime.slot_times &&
                                    slotTime.slot.includes("afternoon") && (
                                      <p>Afternoon</p>
                                    )}
                                </React.Fragment>
                              )
                            )
                          : item.batch_slots.map((slotTime, index) => (
                              <React.Fragment key={index}>
                                {slotTime.slot_times &&
                                  slotTime.slot.includes("morning") && (
                                    <p>Morning</p>
                                  )}
                                {slotTime.slot_times &&
                                  slotTime.slot.includes("afternoon") && (
                                    <p>Afternoon</p>
                                  )}
                              </React.Fragment>
                            ))}
                      </td>

                      <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-800  text-center">
                        {item.batch_stream.map((streamnames) => (
                          <p>{streamnames.stream_names}</p>
                        ))}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-800  text-center">
                      {formatDateddmmyy(item.starting_date)}

                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-base  text-gray-800  text-center">
                        {item.duration}
                        {item.duration_type}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap  text-sm text-gray-800  text-center">
                        {item.locations.map((locations) => (
                          <p>{locations.name}</p>
                        ))}
                      </td>

                      <td className="px-7 flex py-4 whitespace-nowrap text-sm text-gray-800 text-center">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <button className="button muted-button">
                            <Link to={`/batchformedit/${item.id}`}>
                              <AiFillEdit className="text-xl mr-3 text-green-700" />
                            </Link>
                          </button>
                        </div>
                        <div onClick={(e) => { e.stopPropagation(); }}>
  <button onClick={() => openPopup(item.id, item.batch_code)}>
    <RiDeleteBin6Line className="text-red-700 text-xl mr-3" />
  </button>

  <Popup isOpen={isOpen} onClose={closePopup} heading={deleteBatchCode}>
  <h6>Do you want to delete the batch ?</h6>
<div className="button-container">
      <button className="text-gray-900  bg-gray-50 border border-gray-300 focus:outline-none hover:bg-gray-100  font-medium  text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:border-gray-600 dark:focus:ring-gray-800" onClick={() => setIsOpen(false)}>No</button>
      <button className="focus:outline-none text-white bg-primaryColour hover:bg-primaryColour-1000 focus:ring-4 focus:ring-green-300 font-medium  text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={() => handleDeleteBatch()}>Yes</button>
    </div>
  </Popup>
</div>
                      </td>
                    </tr>
                  ))}
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

export default BatchList;
