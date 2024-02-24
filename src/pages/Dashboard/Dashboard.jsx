import React, { useEffect, useState } from "react";
import TableHeader from "../../components/TableHeader/TableHeader";
import axios from "axios";
import learning7 from "../../utils/Images/learning7.png";
import teacher7 from "../../utils/Images/teacher7.png";


const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [facultyData, setFacultyData] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (searchTerm.trim() !== "") {

      const fetchFacultyData = async () => {
        try {
          const response = await axios.get(
            `http://dev.allen-api.com:5020/api/getfacultydata?q=${searchTerm}&limit=4&page=1&gender=&sortBy=gender&sortOrder=ASC`
          );
          const { data } = response.data;
          let filteredData = data;
          if (searchTerm) {
            filteredData = data.filter((faculty) =>
              faculty.first_name.toLowerCase().startsWith(searchTerm.toLowerCase())
            );
          }
          setFacultyData(filteredData);
          setShowResults(true);
        } catch (error) {
          console.error("Error fetching faculty data:", error);
        }
      };

      fetchFacultyData();
    } else {
      setShowResults(false);
      setFacultyData([]);
    }
  }, [searchTerm]);


 // Rest of your code...

  //-------------------------GET Total Faculty----------------------------//
  const totalBatchsRecords = localStorage.getItem("totalBatchsRecords");

  const totalFacutlyRecords = localStorage.getItem("totalFacultyRecords");
  console.log(totalFacutlyRecords);
  //----------------------------------------------------------------------//

  return (
    <>
     
      <TableHeader
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Dashboard" }]}
      />

    <div className=" col-span-12 mt-4 flex justify-center items-center  ">
  
      <div className="flex flex-nowrap space-x-20">
      
          <div className="col-span-12 lg:col-span-4 flex justify-center" >
            <div className="box-border border bg-secondaryColour border-gray-400 text-primaryColour font-medium text-lg justify-center items-center h-28 w-80 lg:w-96">
              <div className="mt-2">
                <div className="flex"  >
                  <div className="img " style={{ width: "19%" }}>
                    <img src={teacher7} className=" bg-secondaryColour ml-16" alt="teacher" />
                    {/* <GiTeacher/> */}
                  </div>
                  <div className="content justify-center m-auto">         
                    <div className=" mr-7">
                    <h5>Total Faculty</h5>
                    <h5 className="text-center">{totalFacutlyRecords}</h5>
                      </div>

                  </div>
                </div>
              </div>
            </div>
            
          </div>

          <div className="col-span-12 lg:col-span-4 flex justify-center" >
            <div className="box-border border bg-secondaryColour border-gray-400 text-primaryColour font-medium text-lg justify-center items-center h-28 w-80 lg:w-96">
              <div className="mt-2">
                <div className="flex"  >
                  <div className="img " style={{ width: "19%" }}>
                    <img src={learning7} className="ml-16" alt="batches" />
                    {/* <MdOutlineBatchPrediction/> */}
                  </div>
                  <div className="content justify-center m-auto">         
                    <div className="mr-7">
                       <h5>Total Batches</h5>
                       <h5 className="text-center">{totalBatchsRecords}</h5></div>

                  </div>
                </div>
              </div>
            </div>
            
          </div>
      </div>
    
    </div>
    
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
     {/* <div class = " md:col-span-1 " >
    <button className="bg-white mt-3 hover:bg-gray-100 text-gray-800 text-2xl font-bold py-1 px-3 border border-gray-400 shadow" >
          +
    </button>
   </div> */}
   </div>
{/* *********************************8  */}
   
  {/* // list */}
      <section className=" mt-4 ml-6 font-serif">
        <div className=" overflow-x-auto">
          <div class=" min-w-full inline-block align-middle">
            <div style={{ height: "45vh" }} className="bg-secondaryColour">
              <table class="min-w-full divide-y divide-gray-400 dark:divide-gray-700">
                <thead>
                  <tr class=" bg-shadeColour">
                    <th
                      scope="col"
                      class="px-16 py-7 whitespace-nowrap text-lg font-bold text-primary dark:text-gray-200"
                    >
                      First Name
                    </th>
                    <th
                      scope="col"
                      class="px-16 py-7 whitespace-nowrap text-lg font-bold text-primary dark:text-gray-200"
                    >
                      {" "}
                      Last Name
                    </th>
                    <th
                      scope="col"
                      class="px-16 py-7 whitespace-nowrap text-lg font-bold text-primary dark:text-gray-200"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      class="px-16 py-7 whitespace-nowrap text-lg font-bold text-primary dark:text-gray-200"
                    >
                      Phone
                    </th>
                    <th
                      scope="col"
                      class="px-16 py-7 whitespace-nowrap text-lg font-bold text-primary dark:text-gray-200"
                    >
                      Experience
                    </th>
                   
                  </tr>
                </thead>
               
                <tbody className="divide-y divide-gray-400 dark:divide-gray-700">
                  {showResults && facultyData.length > 0 ? (
                    facultyData.map((faculty) => (
                      <tr key={faculty.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                        <td className="px-16 py-7 whitespace-nowrap text-lg font-medium text-gray-800 dark:text-gray-200 text-center">
                          {faculty.first_name}
                        </td>
                        <td className="px-16 py-7 whitespace-nowrap text-lg text-gray-800 dark:text-gray-200 text-center">
                          {faculty.last_name}
                        </td>
                        <td className="px-16 py-7 whitespace-nowrap text-lg text-gray-800 dark:text-gray-200 text-center">
                          {faculty.mail}
                        </td>
                        <td className="px-16 py-7 whitespace-nowrap text-lg text-gray-800 dark:text-gray-200 text-center">
                          {faculty.phone}
                        </td>
                        <td className="px-16 py-7 whitespace-nowrap text-lg text-gray-800 dark:text-gray-200 text-center">
                          {faculty.experience}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-16 py-7 whitespace-nowrap text-lg font-medium text-gray-800 dark:text-gray-200 text-center"
                      >
                        {showResults ? "No faculty found." : "Search faculty name to see results."}
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
