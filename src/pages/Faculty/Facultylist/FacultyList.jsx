import React, { useState, useEffect, useMemo } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";
import axios from "axios";
import ReactPaginate from "react-paginate";
import TableHeader from "../../../components/TableHeader/TableHeader";
import "./faculty.css";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { deleteData } from "../../../Services/Services";
import LocationContext from "../../../context/LocationContext";
import { useContext } from "react";
import { ReactDialogBox } from "react-js-dialog-box";
import Popup from "../../../components/Popup";
import defaultImage from "../../../utils/Images/defaultImage.jpg";

const FacultyList = (props) => {
  const handleLimitChange = (e) => {
    setLimit(e);
    setCurrentPage(0);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const openBox = (id) => {
    setItemToDelete(id);
    setIsOpen(true);
  };

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
  const [deleteFaculyName, setDeleteFaculyName] = useState("");

  const openPopup = (id, firstName) => {
    setItemToDelete(id);
    setDeleteFaculyName(firstName); // Corrected spelling

    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const handleDeleteFaculty = () => {
    setIsOpen(false);
    axios
      .delete(`${process.env.REACT_APP_API_URL}/deletefaculty/${itemToDelete}`)
      .then(() => {
        toast.success("Faculty Successfully Deleted.. ", toastConfig);
        facultyApiData();
      });
  };

  const { selectedLocation } = useContext(LocationContext);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "desc",
  });
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState("");
  const [facultyData, setFacultyData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const noOfpage = totalRecords / limit;

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const facultyApiData = async () => {
    const sortOrder = sortConfig.direction === "desc" ? "DESC" : " ASC";
    const sortBy = sortConfig.key ? sortConfig.key : "updated_at";
    const url = `${process.env.REACT_APP_API_URL}/getfacultydata?q=${searchTerm}&limit=${limit}&page=${currentPage}&gender=&sortBy=${sortBy}&sortOrder=${sortOrder}&location_id=${selectedLocation}`;

    try {
      const response = await fetch(url);

      if (response.ok) {
        const responseData = await response.json();
        const { data, total } = responseData;
        setFacultyData(data);
        setTotalRecords(total);
        localStorage.setItem("totalFacultyRecords", total);
      } else {
        console.error("Error fetching faculty data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    }
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const handleRowClick = (id) => {
    navigate(`/facultyview/${id}`);
  };

  useEffect(() => {
    facultyApiData();
  }, [searchTerm, currentPage, sortConfig, selectedLocation, limit]);

  return (
    <div className="  ">
      <ToastContainer />
      <section>
        <TableHeader
          breadcrumbs={[
            { name: "Schedule", path: "/schedule" },
            { name: "Faculty List" },
          ]}
        />
      </section>

      <div class="grid grid-cols-12 m-1   ">
        <div class="md:col-span-11 sm:col-span-6 w-full  ">
          <input
            value={searchTerm}
            onChange={handleChange}
            style={{ width: "35vw" }}
            className="  bg-white border border-gray-500 m-1 py-3 px-4 focus:outline-none mt-3 ml-5"
            placeholder="Search....."
          />
        </div>
        <div class=" md:col-span-1   pl-5  ">
          <Link to="/facultycreate">
            <button className="bg-white mt-3 hover:bg-gray-100 text-gray-800 text-2xl font-bold py-1 px-3 border border-gray-400 ">
              +
            </button>
          </Link>
        </div>
      </div>

      <section className="ml-6 font-serif bg-secondaryColour mr-4">
        <div className=" overflow-x-auto">
          <div class=" min-w-full inline-block align-middle bg-secondaryColour">
            <div className=" bg-secondaryColour " style={{ height: "30vw" }}>
              <table className="min-w-full divide-y divide-gray-400  font-serif ">
                <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                  <tr className=" bg-primaryColour text-white">
                    <th
                      scope="col"
                      className="px-2 py-3  font-serif whitespace-nowrap text-base font-bold text-primary"
                    >
                      Image
                    </th>
                    <th
                      scope="col"
                      className=" font-serif px-8 py-3 whitespace-nowrap text-base font-bold text-primary"
                    >
                      Faculty Code
                    </th>

                    <th
                      scope="col"
                      className=" font-serif px-8 py-3 whitespace-nowrap text-base font-bold text-primary cursor-pointer"
                      onClick={() => handleSort("first_name")}
                    >
                      First Name
                      {sortConfig.key === "first_name" ? (
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
                      className="px-8 py-3 font-serif whitespace-nowrap text-base font-bold text-primary cursor-pointer"
                      onClick={() => handleSort("last_name")}
                    >
                      Last Name{" "}
                      {sortConfig.key === "last_name" ? (
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
                      className="px-8 font-serif py-3 whitespace-nowrap text-base font-bold text-primary"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-8  font-serif py-3 whitespace-nowrap text-base font-bold text-primary "
                    >
                      Phone
                    </th>

                    <th
                      scope="col"
                      className="px-8 font-serif py-3 whitespace-nowrap text-base font-bold text-primary cursor-pointer"
                      onClick={() => handleSort("experience")}
                    >
                      Experience{" "}
                      {sortConfig.key === "experience" ? (
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
                      className="px-8  font-serif py-3 whitespace-nowrap text-base font-bold text-primary "
                    >
                      Subjects
                    </th>

                    <th
                      scope="col"
                      className="px-8 font-serif py-3 whitespace-nowrap text-base font-bold text-primary "
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-400">
                  {facultyData.map((item, i) => (
                    <tr
                      className="hover:bg-gray-100  cursor-pointer "
                      key={i}
                      onClick={() => handleRowClick(item.id)}
                    >
                      <td className="px-4 font-serif py-3 whitespace-nowrap text-base text-gray-800  text-center">
                        <img
                          src={item.image_url}
                          onError={(e) => {
                            e.target.src = defaultImage;
                          }}
                          className="  h-8 w-8  rounded-full "
                        ></img>
                      </td>
                      <td className="px-8 font-serif py-3 whitespace-nowrap text-sm text-gray-800  text-center">
                        {item.faculty_code}
                      </td>

                      <td className="px-8  font-serif py-3 whitespace-nowrap text-sm font-medium text-gray-800 text-center">
                        {item.first_name}
                      </td>
                      <td className="px-8 font-serif py-3 whitespace-nowrap text-sm text-gray-800  text-center">
                        {item.last_name}
                      </td>

                      <td className="px-8 font-serif py-3 whitespace-nowrap text-sm text-gray-800  text-center">
                        {item.mail}
                      </td>
                      <td className="px-8  font-serif py-3 whitespace-nowrap text-sm text-gray-800  text-center">
                        {item.phone}
                      </td>
                      <td className="px-8 font-serif py-3 whitespace-nowrap text-sm text-gray-800  text-center">
                        {item.experience}
                      </td>

                      <td className="px-8 font-serif py-3 whitespace-nowrap text-sm text-gray-800  text-center">
                        {item.subject.map((item) => (
                          <p>{item.subject_name}</p>
                        ))}
                      </td>

                      <td className="px-8 py-3  font-serif justify-center  flex whitespace-nowraptext-base font-medium text-center">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <button className="button muted-button">
                            <Link to={`/facultyformedit/${item.id}`}>
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
                                item.first_name + " " + item.last_name
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
                            <h6>Do you want to delete the faculty ?</h6>
                            <div className="button-container">
                              <button
                                className="text-gray-900   bg-gray-50 border border-gray-300 focus:outline-none hover:bg-gray-100  font-medium  text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:border-gray-600 dark:focus:ring-gray-800"
                                onClick={() => setIsOpen(false)}
                              >
                                No
                              </button>
                              <button
                                className="focus:outline-none text-white bg-primaryColour hover:bg-primaryColour-1000 focus:ring-4 focus:ring-green-300 font-medium  text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                onClick={() => handleDeleteFaculty()}
                              >
                                Yes
                              </button>
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
                className="me-3 mb-3 md:mb-0 text-balck  border       font-medium  text-sm px-3 py-1 text-center inline-flex items-center  "
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
                } absolute bottom-0 mb-6 bg-white divide-y divide-gray-100 rounded-lg   w-16 dark:bg-gray-700`}
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
      </section>
    </div>
  );
};

export default FacultyList;
