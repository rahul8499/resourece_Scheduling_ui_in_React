import React, { useEffect, useState, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import TableHeader from "../components/TableHeader/TableHeader";
import { Link } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReactPaginate from "react-paginate";

import axios from "axios";
import Popup from "../components/Popup";

const Users = () => {
  const [totalRecords, setTotalRecords] = useState("");

  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const noOfpage = totalRecords / limit;

  const [searchTerm, setSearchTerm] = useState("");
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleLimitChange = (e) => {
   
    setLimit(e);
    setCurrentPage(0); 
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };
  
  const [isOpen, setIsOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null)

  const openPopup = (id,  userName) => {
    setDeleteUserId(id)

    setIsOpen(true);
  };


  const closePopup = () => {
    setIsOpen(false);
  };
  const handleDeleteUser = () => {
    if (deleteUserId !== null) {
      setIsOpen(false);
      axios
        .delete(`${process.env.REACT_APP_API_URL}/deleteUser/${deleteUserId}`)
        .then(() => {
          toast.success("User Successfully deleted.. ", toastConfig);

          UserApiData();
        });
    }
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
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "desc",
  });
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };
  const [userData, setUserData] = useState([]);
  const UserApiData = async () => {
    const sortOrder = sortConfig.direction === "asc" ? "ASC" : "DESC";
    const sortBy = sortConfig.key ? sortConfig.key : "updated_at";
    const url = `${process.env.REACT_APP_API_URL}/getUsers?q=${searchTerm}&sortBy=${sortBy}&sortOrder=${sortOrder}&limit=${limit}&page=${currentPage}`;
    try {
      const response = await fetch(url);
    
      if (response.ok) {
        const responseData = await response.json();
    
        const { data: userData, total } = responseData.users;
    
      
        setUserData(userData);
        setTotalRecords(total);
      } else {
        console.error("Error fetching batch data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching batch data:", error);
    }
    
  };

  useEffect(() => {
    UserApiData();
  }, [searchTerm, currentPage, sortConfig, limit]);
  return (
    <div className="  ">
      <ToastContainer />
      <section>
      <TableHeader
        breadcrumbs={[    { name: 'Schedule', path: '/schedule' },        { name: "Users" }]}
      />
      
      </section>
      <div class="grid grid-cols-12 m-1   ">
      <div className="md:col-span-11 sm:col-span-6 w-full">
         
      
        </div>
        <div class="md:col-span-11 sm:col-span-11 w-full  ">
          <input
            value={searchTerm}
            onChange={handleChange}
            style={{ width: "35vw" }}
            className="  bg-white border border-gray-500 m-1 py-2 px-4 focus:outline-none mt-3 ml-5"
            placeholder="Search....."
          />
        </div>
        <div class=" md:col-span-1  pl-5 ">
          <Link to="/createUser">
            <button className="bg-white mt-3  hover:bg-gray-100 text-gray-800 text-2xl font-bold py-1 px-3 border border-gray-400 ">
              +
            </button>
          </Link>
        </div>
      </div>

      <section className="ml-6 font-serif bg-secondaryColour mr-4">
        <div className=" overflow-x-auto">
          <div class=" min-w-full inline-block align-middle bg-secondaryColour">
            <div className=" bg-secondaryColour " style={{ height: "30vw" }}>
              <table className="min-w-full divide-y divide-gray-400 ">
                <thead>
                  <tr className=" bg-primaryColour text-white">
                    
                  <th
                      scope="col"
                      onClick={() => handleSort("name")}
                      autoComplete="off"

                      className="px-8 py-2 whitespace-nowrap text-base font-bold text-primary"
                    >
                      Name
                      {sortConfig.key === "name" ? (
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
                      onClick={() => handleSort("email")}
                      autoComplete="off"

                      className="px-8 py-2 whitespace-nowrap text-base font-bold text-primary"
                    >
                      Email
                      {sortConfig.key === "email" ? (
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
                      className="px-8 py-2 whitespace-nowrap text-base font-bold text-primary "
                      onClick={() => handleSort("contact_number")}
                      style={{cursor:"pointer"}}
                    autoComplete="off"

                    >
                      Phone
                      {sortConfig.key === "contact_number" ? (
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
                      className="px-8 py-2 whitespace-nowrap text-base font-bold text-primary "
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-400">
        {userData.length === 0 ? (
          <tr>
            <td colSpan="2" className="px-4 py-2 text-base text-gray-800 text-center">
              No records found
            </td>
          </tr>
        ) : (
          userData.map((user, index) => (
            <tr
              key={index}
              className="hover:bg-gray-100 cursor-pointer"
            >
              <td className="px-4 py-2 whitespace-nowrap  font-serif text-base text-gray-800 text-center ">{user.name}</td>
              <td className="px-4 py-2 whitespace-nowrap  font-serif text-base text-gray-800 text-center ">{user.email}</td>
             
              <td className="px-4 py-2 font-serif whitespace-nowrap text-base text-gray-800 text-center">{user.contact_number}</td>
             
             <td className="px-4 py-2 whitespace-nowrap  text-gray-800 text-center">
              <div>
                <span  onClick={(e) => {
                            e.stopPropagation();
                          }}> <button className="button muted-button">
                                                      {/* <Link to={`/batchformedit/${user.id}`}> */}

                          <Link to={`/userEdit/${user.id}`}>
                            <AiFillEdit className="text-xl mr-3 text-green-700" />
                          </Link>
                        </button></span>
                <span  onClick={(e) => {
                            e.stopPropagation();
                          }}>
                             <button onClick={() => openPopup(user.id, user.email )}>
    <RiDeleteBin6Line className="text-red-700 text-xl mr-3" />
  </button>
                        
                        </span>
              </div>
              <Popup isOpen={isOpen} onClose={closePopup} heading={"User?"}>
  <h6>Do you want to delete the user ?</h6>
<div className="button-container">
      <button className="text-gray-900  bg-gray-50 border border-gray-300 focus:outline-none hover:bg-gray-100  font-medium  text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:border-gray-600 dark:focus:ring-gray-800" onClick={() => setIsOpen(false)}>No</button>
      <button className="focus:outline-none text-white bg-primaryColour hover:bg-primaryColour-1000 focus:ring-4 focus:ring-green-300 font-medium  text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={() => handleDeleteUser()}>Yes</button>
    </div>
  </Popup>
            
             </td>
             
            </tr>
          ))
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

export default Users;
