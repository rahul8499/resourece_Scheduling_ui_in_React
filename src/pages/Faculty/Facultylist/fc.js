
import React, { useState, useEffect } from "react";
import { RiDeleteBin6Line } from 'react-icons/ri';
import { AiFillEdit } from 'react-icons/ai';
import { IoEyeSharp } from "react-icons/io5";
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import TableHeader from '../../../components/TableHeader/TableHeader';
import './faculty.css'
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'
import { toast } from 'react-toastify';




const FacultyList = (props) => {
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
    const response = await axios.delete(`${facultyReacordDeleteURL}/${id}`);
    toast.success('Record Delete successfully');
    facultyApiData();
  } catch (error) {
    toast.error('error');
  }
};

 useEffect(() => {
  facultyApiData();
 }, [searchTerm,currentPage]);

 return (
  <div className=" ">
     <ToastContainer />
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
              style={{backgroundColor:"#6c7ac9", width:"6vw"}}
              className="   mt-3   text-center py-3 m-1     text-xl  font-medium text-white "

            >
              Add
            </button>
            </Link> 
  </div>
</div>
 

   <section className="ml-6 font-serif ">
    <div className=" overflow-x-auto" >
     <div class=" min-w-full inline-block align-middle">
      <div  className="bg-white">
       <table class="min-w-full divide-y divide-gray-400 dark:divide-gray-700">
        <thead>
         <tr class="bg-slate-100">
          <th scope="col" class="px-16 py-7 whitespace-nowrap text-lg font-bold text-primary dark:text-gray-200">First Name</th>
          <th scope="col" class="px-16 py-7 whitespace-nowrap text-lg font-bold text-primary dark:text-gray-200">Email</th>
          <th scope="col" class="px-16 py-7 whitespace-nowrap text-lg font-bold text-primary dark:text-gray-200">Phone</th>
          {/* <th scope="col" class="px-16 py-7 whitespace-nowrap text-lg font-bold text-primary dark:text-gray-200">Subject</th> */}
          <th scope="col" class="px-16 py-7 whitespace-nowrap text-lg font-bold text-primary dark:text-gray-200">Experience</th>
          {/* <th scope="col" class="px-16 py-7 whitespace-nowrap text-lg font-bold text-primary dark:text-gray-200">Location</th> */}
          <th scope="col" class="px-16 py-7 whitespace-nowrap text-lg font-bold text-primary dark:text-gray-200">Action</th>
         </tr>
        </thead>
        <tbody class="divide-y divide-gray-400 dark:divide-gray-700">
         {facultyData.map((item, i) => {
          return (
            <tr class="hover:bg-gray-100 dark:hover:bg-gray-700">
            <td class="px-16 py-7 whitespace-nowrap text-lg font-medium text-gray-800 dark:text-gray-200 text-center">{item.first_name}</td>
            <td class="px-16 py-7 whitespace-nowrap text-lg text-gray-800 dark:text-gray-200 text-center">{item.mail}</td>
            <td class="px-16 py-7 whitespace-nowrap text-lg text-gray-800 dark:text-gray-200 text-center">{item.phone}</td>
            {/* <td class="px-16 py-7 whitespace-nowrap text-lg text-gray-800 dark:text-gray-200 text-center">{item.subject}</td> */}
            <td class="px-16 py-7 whitespace-nowrap text-lg text-gray-800 dark:text-gray-200 text-center">{item.experience}</td>
            {/* <td class="px-16 py-7 whitespace-nowrap text-lg text-gray-800 dark:text-gray-200 text-center">{item.locationName}</td> */}
            <td class="px-16 py-7 whitespace-nowrap text-sm font-medium text-center">
            <Link to={`/facultyformedit/${item.id}`}>
                            <button className="button muted-button">
                              <AiFillEdit class="text-2xl mr-3 text-green-700" />
                            </button>
                          </Link>
                          <button onClick={()=>deleteRecordHandler(item.id)}><RiDeleteBin6Line class=" text-red-700 text-2xl mr-3 " /></button>
                          <Link to={'/facultyview'}>   <button> <IoEyeSharp class="text-blue-900 text-2xl mr-3" /></button></Link>

                         
            </td>
           </tr>
          )
         })}
        </tbody>
       </table>
      </div>
     </div>
    </div>

    <div>
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