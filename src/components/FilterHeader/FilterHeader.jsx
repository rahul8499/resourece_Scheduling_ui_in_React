import axios from "axios";
import { useContext, useEffect, useState } from "react";
import LocationContext from "../../context/LocationContext";
import Calender from "../Calender/Calender";
import { useLocation } from "react-router-dom";

const locationgetURL = `${process.env.REACT_APP_API_URL}/getlocation?q=&limit=20&page=1&name=1&sortBy=name&sortOrder=DESC`;

const FilterHeader = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showScheduleType, setshowScheduleType] = useState(false);
  const location = useLocation();

  const [locationState, setLocationState] = useState([]);
  const { selectedLocation, setSelectedLocation } = useContext(LocationContext);
  const { selectedScheduleType, setselectedScheduleType } = useContext(LocationContext);

  const handleSelectChange = (event) => {
    setselectedScheduleType(event.target.value);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };



  useEffect(() => {
    setShowCalendar(location.pathname === "/schedule" || location.pathname === "/reports" || location.pathname === "/");
    setshowScheduleType(location.pathname === "/schedule");
  }, [location.pathname]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await axios.get(locationgetURL);

        if (isMounted) {
          setLocationState(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };


    if (isMounted) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (locationState.length > 0 && !selectedLocation) {
      setSelectedLocation(locationState[5].id);
    }
  }, [locationState, selectedLocation]);

  return (
    <header className="box-border border-b border-gray-400 border-solid font-serif">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="flex item-center justify-start space-x-3">
          <div className=" ml-6 mt-4 font-serif dropdown">
            <select
              id="countries"
              name="location_id"
              value={selectedLocation}
              onChange={handleLocationChange}
              className={`input  bg-white border border-gray-300 text-base block p-1.5 sans-serif   text-primaryColour  dark:border-gray-200 dark:placeholder-gray-400  font-bold  hover:border-blue-900 hover:border-opacity-200 `}
              style={{ width: "14rem", height: "2.2rem", borderRadius: "5px" }}
              required
            >
              <option value="">Select Location</option>
              {locationState.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          {showCalendar && (
            <div className="calendar ml-6 mt-4 font-serif">
              <Calender />
            </div>
          )}

          {showScheduleType && (
            <div className=" ml-6 mt-4 font-serif dropdown">
              <div>
                <select
                  className={`input sans-serif  bg-white border border-gray-300 text-base block p-1.5 text-primaryColour  dark:border-gray-200 dark:placeholder-gray-400  font-bold  hover:border-blue-900 hover:border-opacity-200 `}
                  style={{
                    width: "18rem",
                    height: "2.2rem",
                    borderRadius: "5px",
                  }}
                  placeholder="Select Schedule Type"
                  value={selectedScheduleType}
                  onChange={handleSelectChange}
                >
                  <option value="" disabled selected>
                    Select Schedule Type
                  </option>

                  <option value="jee/medical">Jee/Medical</option>
                  <option value="foundation">Foundation</option>
                </select>
              </div>
            </div>
          )}

        </div>

        <div className="text-right flex items-center mt-4 sm:mt-0 mr-6">
          <div className="text-green-800 ">
            <h4 className="  text-lg sans-serif ">Admin Pune</h4>
          </div>
          <img
            className="w-10 h-10 rounded-full ml-4 mt-1 mb-1"
            src="https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"
            alt="User Avatar"
          />
        </div>
      </div>
    </header>


  );
};

export default FilterHeader;
