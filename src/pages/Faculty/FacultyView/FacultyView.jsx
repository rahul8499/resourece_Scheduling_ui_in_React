import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  endOfDay,
  subDays,
} from "date-fns";
import { Link, useParams } from "react-router-dom";
import LocationContext from "../../../context/LocationContext";
import TableHeader from "../../../components/TableHeader/TableHeader";
import CalenderLite from "../../../components/Calender/ClaenderLite";
import defaultImage from "../../../utils/Images/defaultImage.jpg";

const FacultyView = () => {
  const { id } = useParams();
  const facultyId = id;

  const [facultyProfileData, setFacultyProfileData] = useState({});
  const [pastScheduleData, setPastScheduleData] = useState([]);
  const [upcomingScheduleData, setUpcomingScheduleData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [locations, setLocations] = useState([]);
  const defaultHistoryStartDate = subDays(new Date(), 30);
  const defaultHistoryEndDate = new Date(); // Today
  const defaultHistoryDateRange = [
    defaultHistoryStartDate,
    defaultHistoryEndDate,
  ];

  const defaultStartDateLeave = subDays(new Date(), 365); // Start date is 365 days ago
  const defaultEndDateLeave = endOfDay(new Date()); // End date is today
  const defaultDateRangeLeave = [defaultStartDateLeave, defaultEndDateLeave];
  const {
    selectedLocation,
    selectedDate,
    selectedDateHistorySche,
    setSelectedDateHistorySche,
    selectedDateLeave,
    setSelectedDateLeave,
  } = useContext(LocationContext);

  let date = new Date().toJSON().slice(0, 10);

  const fetchFacultyData = () => {
    axios
      .get(`http://dev.allen-api.com:5020/api/showfacultyById/${facultyId}`)
      .then((res) => {
        setFacultyProfileData(res.data.data);
        console.log("data", res.data);

        if (res.data.data.subject) {
          setSubjects(res.data.data.subject);
        }
        if (res.data.data.location) {
          setLocations(res.data.data.location);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [facultyLeaveData, setFacultyLeaveData] = useState([]);
  const fetchFacultyLeaveData = () => {
    const startDate = selectedDateLeave[0]
      ? selectedDateLeave[0].toISOString().substring(0, 10)
      : "";
    const endDate = selectedDateLeave[1]
      ? selectedDateLeave[1].toISOString().substring(0, 10)
      : "";
    axios
      .get(
        `http://dev.allen-api.com:5020/api/getById/${facultyId}?starting_date=${startDate}&ending_date=${endDate}`
      )
      .then((res) => {
        console.log("facultyLeaveData", res.data);
        setFacultyLeaveData(res.data.leave_records);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const calculateWeekRange = (date) => {
    const currentDay = date.getDay();
    const daysUntilMonday = (currentDay + 6) % 7; // Adjust Sunday to 6
    const startingDate = new Date(date);
    startingDate.setDate(
      date.getDate() -
        daysUntilMonday +
        (daysUntilMonday === 0 ? 1 : 8 - daysUntilMonday)
    ); // If it's Monday, go to next Monday
    const endingDate = new Date(startingDate);
    endingDate.setDate(startingDate.getDate() + 6); // Set to the Sunday of the same week
    const formattedStartingDate = startingDate?.toISOString()?.slice(0, 10);
    const formattedEndingDate = endingDate?.toISOString()?.slice(0, 10);

    return {
      startingDate: formattedStartingDate,
      endingDate: formattedEndingDate,
    };
  };

  const fetchScheduleData = (weekOffset) => {
    const currentDate = new Date();
    const { startingDate, endingDate } = calculateWeekRange(
      currentDate,
      weekOffset
    );
    console.log("fetchScheudleDate", startingDate, endingDate);

    axios
      .get(`http://dev.allen-api.com:5020/api/getSchedule`, {
        params: {
          starting_date: startingDate,
          ending_date: endingDate,
          location_id: selectedLocation,
          faculty_id: facultyId,
        },
      })
      .then((res) => {
        console.log("res", res);
        setUpcomingScheduleData(res.data);
      })
      .catch((err) => {
        console.log(`Week offset ${weekOffset} error:`, err);
      });
  };

  const fetchPastSchedule = () => {
    const startDate = selectedDateHistorySche[0]
      ?.toISOString()
      ?.substring(0, 10);
    const endDate = selectedDateHistorySche[1]?.toISOString()?.substring(0, 10);

    axios
      .get(`http://dev.allen-api.com:5020/api/getSchedule`, {
        params: {
          starting_date: startDate,
          ending_date: endDate,
          location_id: selectedLocation,
          faculty_id: facultyId,
        },
      })
      .then((res) => {
        setPastScheduleData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchScheduleData();
  }, []);

  useEffect(() => {
    fetchFacultyLeaveData();
  }, [selectedDateLeave]);
  useEffect(() => {
    fetchFacultyData(selectedLocation);
    fetchPastSchedule();
  }, [selectedDateHistorySche, selectedLocation]);

  function formatDateddmmyy(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
    return `${day}-${month}-${year}`;
  }

  return (
    <div class="container-fluid ">
      <section>
        <TableHeader
          breadcrumbs={[
            { name: "Home", path: "/" },
            { name: "Faculty List", path: "/facultylist" },
            { name: "Faculty View" },
          ]}
        />
      </section>
      <div class="md:flex no-wrap  font-serif "  >
        <div
          class="w-full  bg-secondaryColour md:w-2/12 md:mx-2 font-serif "
          style={{ height: "40vw", width: "14vw" , overflow:"auto" }}
        >
          <div class="  p-2 ">
            <div class=" ml-6">
              <img
                src={facultyProfileData.image_url}
                onError={(e) => {
                  e.target.src = defaultImage;
                }}
                className=" faculty-card__name  w-36 h-24 mt-2 "
              ></img>
            </div>

            <button class="ml-32 bg-primaryColour  mt-1 " >
            <Link
              to={`/facultyformedit/${id}`}
              class="flex items-center py-3  h-6 w-10  text-center  justify-center "
              style={{ listStyle:"none", color:"white" }}
            >
          Edit
            </Link>
            </button>

            {/* <Link
              to={`/facultyformedit/${id}`}
              class="flex items-center py-3  "
            >
              <span class=" ml-32">
                <span class="bg-primaryColour  font-serif py-1 px-2 rounded text-white text-sm ">
                  Edit
                </span>
              </span>
            </Link> */}

            <div className="grid gap-y-2 items-center  text-gray-900 ">
              <h4 className="font-serif text-primaryColour  text-xl ml-2">Profile</h4>

              <React.Fragment>
                <div className="text-sm ml-2">
                  <p className="grid grid-cols-1 font-serif">
                    <span className="font-bold">Faculty Code:</span>
                    <span className=" font-serif">
                      {facultyProfileData.faculty_code}
                    </span>
                  </p>
                  <p className="grid grid-cols-1 font-serif">
                    <span className="font-bold">Name:</span>
                    <span className=" font-serif">
                      {facultyProfileData.first_name}{" "}
                      {facultyProfileData.last_name}
                    </span>
                  </p>
                  <p className="grid grid-cols-1 font-serif">
                    <span className="font-bold">Email:</span>
                    <span className=" font-serif">
                      {facultyProfileData.mail}
                    </span>
                  </p>
                  <p className="grid grid-cols-1 font-serif">
                    <span className="font-serif font-bold">Phone:</span>
                    <span className=" font-serif">
                      {facultyProfileData.phone}
                    </span>
                  </p>
                  <p className="grid grid-cols-1 font-serif ">
                    <span className="font-serif font-bold">Gender:</span>
                    <span className="font-serif">
                      {facultyProfileData.gender}
                    </span>
                  </p>
                  <p className="grid grid-cols-1 font-serif">
                    <span className="font-serif font-bold">Age:</span>
                    <span className=" font-serif">
                      {facultyProfileData.age}
                    </span>
                  </p>
                  <p className="grid grid-cols-1 font-serif">
                    <span className="font-serif font-bold">Experience:</span>
                    <span className="font-serif">
                      {facultyProfileData.experience}
                    </span>
                  </p>
                  <p className="grid grid-cols-1 font-serif">
                    <span className="font-serif font-bold">Address:</span>
                    <span className=" font-serif">
                      {facultyProfileData.address}
                    </span>
                  </p>
                </div>
              </React.Fragment>
            </div>

            <hr className=" "></hr>
            <div className="items-center  font-serif grid gap-y-2 space-x-2  text-gray-900 ">
              <h4 className="font-bold text-primaryColour font-serif text-xl ml-2 ">
                Academic Details
              </h4>

              <React.Fragment>
                <div className="text-sm ml-2">
                  {subjects.length > 0 && (
                    <p className="grid grid-cols-1 font-serif">
                      <span className="font-serif font-bold">Subjects:</span>
                      <span className=" font-serif">
                        {subjects
                          .map((subject) => subject.subject_name)
                          .join(", ")}
                      </span>
                    </p>
                  )}

                  {locations.length > 0 && (
                    <p className="grid grid-cols-1">
                      <span className="font-serif font-bold">Locations:</span>
                      <span className=" font-serif">
                        {locations.map((location) => location.name).join(", ")}
                      </span>
                    </p>
                  )}
                </div>
              </React.Fragment>
            </div>
          </div>
        </div>

        <div className=" max:w-full	 md:w-5/12 font-serif ">
          <div>
          <div
              className="bg-gray-50 p-3 shadow-sm rounded-sm"
              // style={{ height: "30vh" }}
            >
              <div className="w-full  font-serif space-x-2  text-gray-900 leading-8">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <h4 className="font-bold mt-2 ml-4 text-primaryColour font-serif text-xl">
                    Leaves
                  </h4>
                  <div  className="" style={{ marginLeft: "15px", marginBottom: "16px" }}>
                    <CalenderLite
                      selectedDate={selectedDateLeave}
                      setSelectedDate={setSelectedDateLeave}
                      defaultRange={defaultDateRangeLeave}
                    />
                  </div>
                </div>
                <div className="upcomingContainer  font-serif  overflow-y-auto ">
                  <div className="listSectionOFUpComingSchedules  ">
                  <div className="bg-secondaryColour" style={{ height: "30vh", position: "relative", zIndex: "1" }}>

                      <table className="  font-serif min-w-full divide-y divide-gray-400  ">
                        <thead class=" bg-primaryColour text-white font-serif sticky top-0 z-9999">
                          <tr class=" bg-primaryColour text-white font-serif">
                            <th
                              scope="col"
                              className=" font-serif top-0 sticky z-10  py-3 whitespace-nowrap text-base  text-primary"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className=" font-serif top-0  sticky z-10  py-3 whitespace-nowrap text-base  text-primary"
                            >
                              Day
                            </th>
                          </tr>
                        </thead>

                        <tbody className=" font-serif divide-y divide-gray-400">
                          {facultyLeaveData && facultyLeaveData.length === 0 ? (
                            <tr>
                              <td
                                colSpan="7"
                                className=" font-serif px-8 py-3 whitespace-nowrap text-smtext-gray-800 text-center"
                              >
                                No Leaves Found
                              </td>
                            </tr>
                          ) : (
                            facultyLeaveData
                              .reduce((rows, schedule) => {
                                const existingRow = rows.find(
                                  (row) => row.date === schedule.dates[0]
                                );

                                if (existingRow) {
                                  existingRow.slots.push(
                                    schedule.batch_slot.name
                                  );
                                } else {
                                  rows.push({
                                    date: schedule.dates[0],
                                    facultyName: `${schedule.faculty.first_name} ${schedule.faculty.last_name}`,
                                    slots: [schedule.batch_slot.name],
                                  });
                                }

                                return rows;
                              }, [])
                              .map((row, index) => (
                                <tr
                                  key={index}
                                  className="hover:bg-gray-100 cursor-pointer"
                                >
                                  <td className=" font-serif py-3 whitespace-nowrap text-sm text-gray-800 text-center">
                                    {/* {row.date} */}
                                    {formatDateddmmyy(row.date)}
                                  </td>
                                  <td className="py-3  font-serif whitespace-nowrap text-sm text-gray-800 text-center">
                                    {row.slots.includes("Morning") &&
                                    row.slots.includes("Afternoon")
                                      ? "Full Day"
                                      : row.slots.join(", ")}
                                  </td>
                                </tr>
                              ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className=" p-3 font-serif shadow-sm rounded-sm"
              style={{ height: "40vh" }}
            >
              <div className="w-full  font-serif items-center space-x-2  text-gray-900 leading-8">
                <h4 className="     ml-4 text-primaryColour font-serif text-xl">
                  Upcoming Schedule
                </h4>
                <div
                  className="upcomingContainer  font-serif  overflow-y-auto  "
                  // style={{ height: "35vh" }}
                >
                  <div className="listSectionOFUpComingSchedules  font-serif  ">
                  <div className=" bg-secondaryColour  font-serif" style={{ height: "35vh", position: "relative", zIndex: "0" }}>
                      <table className=" font-serif min-w-full divide-y divide-gray-400   bg-secondaryColour ">
                        <thead class=" bg-primaryColour text-white font-serif sticky top-0 z-10 ">
                          <tr>
                            <th
                              scope="col"
                              className="top-0 font-serif sticky z-10  py-3 whitespace-nowrap text-base  text-primary"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="top-0 font-serif  sticky z-10  py-3 whitespace-nowrap text-base  text-primary"
                            >
                              Time
                            </th>
                            <th
                              scope="col"
                              className="top-0 font-serif  sticky z-10  py-3 whitespace-nowrap text-base  text-primary"
                            >
                              Batch Code
                            </th>
                            {/* 
                            <th
                              scope="col"
                              className="top-0 font-serif  left-56 sticky z-10  py-3 whitespace-nowrap text-base  text-primary"
                            >
                              Subject
                            </th> */}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-400 font-serif">
                          {upcomingScheduleData.length === 0 ? (
                            <tr className="font-serif">
                              <td
                                colSpan="7"
                                className="px-8 py-3 whitespace-nowrap text-smtext-gray-800 text-center"
                              >
                                No Schedule Found
                              </td>
                            </tr>
                          ) : (
                            upcomingScheduleData.map((schedule) => (
                              <tr
                                key={schedule.id}
                                className="hover:bg-gray-100 cursor-pointer font-serif"
                              >
                                <td className=" font-serif py-3 whitespace-nowrap text-sm text-gray-800 text-center">
                                  {formatDateddmmyy(schedule.date)}
                                </td>
                                <td className=" font-serif py-3 whitespace-nowrap text-sm text-gray-800 text-center">
                                  {schedule.slot_time}
                                </td>
                                <td className=" font-serif py-3 whitespace-nowrap text-sm text-gray-800 text-center">
                                  {schedule.batch.batch_code}
                                </td>

                                {/* <td className=" font-serif py-3 whitespace-nowrap text-sm text-gray-800 text-center">
                                  {schedule.subject.subject_name}
                                </td> */}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          
          </div>
        </div>
        <div className=" max:w-full	 md:w-5/12  ">
          <div
            class="bg-gray-50 font-serif p-3 shadow-sm rounded-sm"
            // style={{ height: "50vh" }}
          >
            <div class=" font-serif items-center space-x-2  text-gray-900 leading-8">
              <div style={{ display: "flex", alignItems: "center" }}>
                <h4 className="font-bold mt-2 ml-5 text-primaryColour font-serif text-xl">
                  History
                </h4>
                <div style={{ marginLeft: "15px", marginBottom: "16px"  }}>
                  <CalenderLite
                    selectedDate={selectedDateHistorySche}
                    setSelectedDate={setSelectedDateHistorySche}
                    defaultRange={defaultHistoryDateRange}
                  />
                </div>
              </div>

              <div className="pastContaienr font-serif  overflow-y-auto bg-secondaryColour">
                <div className="listSectionOFPreviousSchedules  font-serif">
                  <div
                    className="bg-secondaryColour font-serif "
                    style={{ height: "36.5vw" }}
                  >
                    <table className="min-w-full divide-y divide-gray-400 font-serif">
                      <thead class=" bg-primaryColour text-white font-serif sticky top-0 z-9999">
                        <tr className=" bg-primaryColour  text-white font-serif">
                          <th
                            scope="col"
                            class="top-0 font-serif  sticky z-10  py-3 whitespace-nowrap text-base  text-primary"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            class="top-0 font-serif sticky z-10  py-3 whitespace-nowrap text-base  text-primary"
                          >
                            Time
                          </th>
                          <th
                            scope="col"
                            class="top-0 font-serif  sticky z-10  py-3 whitespace-nowrap text-base  text-primary"
                          >
                            Batch Code
                          </th>

                          {/* <th
                            scope="col"
                            class="top-0 font-serif  sticky z-10  py-3 whitespace-nowrap text-base  text-primary"
                          >
                            Subject
                          </th> */}
                        </tr>
                      </thead>

                      <tbody class="divide-y divide-gray-400">
                        {pastScheduleData.length === 0 ? (
                          <tr>
                            <td
                              colSpan="7"
                              className=" font-serif py-3 whitespace-nowrap text-smtext-gray-800 text-center"
                            >
                              No Schedule Found
                            </td>
                          </tr>
                        ) : (
                          pastScheduleData.map((schedule) => (
                            <tr
                              key={schedule.id}
                              class="hover:bg-gray-100 cursor-pointer"
                            >
                              <td className=" font-serif py-3 whitespace-nowrap text-sm text-gray-800 text-center">
                                {formatDateddmmyy(schedule.date)}
                              </td>
                              <td className="font-serif py-3 whitespace-nowrap text-sm text-gray-800 text-center">
                                {schedule.slot_time}
                              </td>

                              <td className="font-serif py-3 whitespace-nowrap text-sm text-gray-800 text-center">
                                {schedule.batch.batch_code}
                              </td>

                              {/* <td className="font-serif py-3 whitespace-nowrap text-sm text-gray-800 text-center">
                                {schedule.subject.subject_name}
                              </td> */}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyView;
