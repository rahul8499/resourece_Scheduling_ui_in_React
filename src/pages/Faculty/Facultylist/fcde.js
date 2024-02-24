
import React, { useState, useEffect } from "react";
import { RiDeleteBin6Line } from 'react-icons/ri';
import { AiFillEdit } from 'react-icons/ai';
import { IoEyeSharp } from "react-icons/io5";
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import TableHeader from '../../../components/TableHeader/TableHeader';
import './faculty.css'
// import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';





const FacultyList = (props) => {
  const navigate = useNavigate();

 const [currentPage, setCurrentPage] = useState(1);
 const [limit, setLimit] = useState(6);
 const [totalRecords, setTotalRecords] = useState('');
 const [facultyData, setFacultyData] = useState([]);
 const [searchTerm, setSearchTerm] = useState("");
 const noOfpage= totalRecords/ limit;
 const facultyReacordDeleteURL=`http://dev.allen-api.com:5020/api/deletefaculty`

 const handleChange = (e) => {
  setSearchTerm(e.target.value);
 };

 const facultyApiData = async () => { 
  const url = `http://dev.allen-api.com:5020/api/getfacultydata?q=${searchTerm}&limit=${limit}&page=${currentPage}&gender=&sortBy=gender&sortOrder=ASC`;
  try {
   const response = await axios.get(url);
//    console.log(response)
   const { data, total } = response.data;
   setFacultyData(data);
   setTotalRecords(total);
   localStorage.setItem("totalFacultyRecords", total)
  } catch (error) {
   console.error('Error fetching faculty data:', error);
  }
 }

 const handlePageChange = ({ selected }) => {
  setCurrentPage(selected + 1);
 };
 const deleteRecordHandler = async (id) => {
  try {
     await axios.delete(`${facultyReacordDeleteURL}/${id}`);
    toast.success('Record Delete successfully');
    facultyApiData();
  } catch (error) {
    toast.error('error');
  }
};

const handleRowClick = (id) => {
  // Navigate to the view page with the specific record ID
    // navigate(`/facultyview`);

  navigate(`/facultyview/${id}`);

};

 useEffect(() => {
  facultyApiData();
 }, [searchTerm,currentPage]);

 return (
  <div className="  ">
     {/* <ToastContainer /> */}
   <section>
    <TableHeader pagename="Faculty" />
   </section>
   
 

   <div class="grid grid-cols-12 m-1   ">
  <div class = "md:col-span-11 sm:col-span-6 w-full  ">

  <input
     value={searchTerm}
     onChange={handleChange}
     style={{width:"35vw"}}
     className="  bg-white border border-gray-500 m-1 py-3 px-4 focus:outline-none mt-3 ml-5"
     placeholder="Search....."
    />
  </div>
  <div class = " md:col-span-1  " >
  <Link to='/facultycreate'  > 
<button
              type="button"
              style={{ width:"6vw"}}
              className=" bg-primaryColour  mt-3   text-center py-3 m-1     text-xl  font-medium text-white "

            >
              Add
            </button>
            </Link> 
  </div>
</div>
 

   <section className="ml-6 font-serif bg-secondaryColour ">
    <div className=" overflow-x-auto" >
     <div class=" min-w-full inline-block align-middle bg-secondaryColour" >
      <div  className=" bg-secondaryColour " style={{height:"60vh"}}>
  <table className="min-w-full divide-y divide-gray-400 dark:divide-gray-700">
  <thead>
    <tr className="bg-shadeColour">
      <th scope="col" className="px-16 py-5 whitespace-nowrap text-lg font-bold text-primary ">First Name</th>
      <th scope="col" className="px-16 py-5 whitespace-nowrap text-lg font-bold text-primary dark:text-gray-200">Last Name</th>

      <th scope="col" className="px-16 py-5 whitespace-nowrap text-lg font-bold text-primary dark:text-gray-200">Email</th>
      <th scope="col" className="px-16 py-5 whitespace-nowrap text-lg font-bold text-primary dark:text-gray-200">Phone</th>
      {/* <th scope="col" className="px-16 py-7 whitespace-nowrap text-lg font-bold text-primary dark:text-gray-200">Subject</th> */}
      <th scope="col" className="px-16 py-5 whitespace-nowrap text-lg font-bold text-primary dark:text-gray-200">Experience</th>
      {/* <th scope="col" className="px-16 py-7 whitespace-nowrap text-lg font-bold text-primary dark:text-gray-200">Location</th> */}
      <th scope="col" className="px-16 py-5 whitespace-nowrap text-lg font-bold text-primary dark:text-gray-200">Action</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-400 dark:divide-gray-700">
  {facultyData.map((item, i) => (
    <tr
      className="hover:bg-gray-100 dark:hover:bg-gray-700"
      key={i}
      onClick={() => handleRowClick(item.id)}
    >
      <td className="px-16 py-4 whitespace-nowrap text-lg font-medium text-gray-800 dark:text-gray-200 text-center">
        {/* <Link to={`/facultyview/${item.id}`}>{item.first_name}</Link> */}
        {item.first_name}
      </td>
      <td className="px-16 py-4 whitespace-nowrap text-lg text-gray-800 dark:text-gray-200 text-center">{item.last_name}</td>

      <td className="px-16 py-4 whitespace-nowrap text-lg text-gray-800 dark:text-gray-200 text-center">{item.mail}</td>
      <td className="px-16 py-4 whitespace-nowrap text-lg text-gray-800 dark:text-gray-200 text-center">{item.phone}</td>
      {/* <td className="px-16 py-7 whitespace-nowrap text-lg text-gray-800 dark:text-gray-200 text-center">{item.subject}</td> */}
      <td className="px-16 py-4 whitespace-nowrap text-lg text-gray-800 dark:text-gray-200 text-center">{item.experience}</td>
      {/* <td className="px-16 py-7 whitespace-nowrap text-lg text-gray-800 dark:text-gray-200 text-center">{item.locationName}</td> */}
      <td className="px-16 py-4  justify-center  flex whitespace-nowrap text-sm font-medium text-center">

          <div
            onClick={(e) => {
              e.stopPropagation(); // Prevent event propagation
            }}
          >
            <button className="button muted-button">
            <Link to={`/facultyformedit/${item.id}`}>

              <AiFillEdit className="text-2xl mr-3 text-green-700" />
              </Link>

            </button>
          </div>


        <div
          onClick={(e) => {
            e.stopPropagation(); // Prevent event propagation
          }}
        >
          <button
            onClick={() => {
              deleteRecordHandler(item.id);
            }}
          >
            <RiDeleteBin6Line className="text-red-700 text-2xl mr-3" />
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>


</table>


      </div>
     </div>
    </div>

    <div className="mt-2">
     <div  >
      <ReactPaginate
       previousLabel= "<"
       nextLabel= ">"
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
 )
}

export default FacultyList;