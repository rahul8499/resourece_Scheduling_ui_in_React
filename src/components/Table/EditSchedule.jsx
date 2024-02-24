import { useEffect, useState, useContext } from "react";
import LocationContext from "../../context/LocationContext";
import { getApiService, getDataById } from "../../Services/Services";
import Select, { components } from "react-select";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import axios from "axios";
const getBatchByIDURL = `${process.env.REACT_APP_API_URL}/showBatchById`;

export const EditSchedule = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const [facultyData, setFacultyData] = useState([]);
  const [batchData, setBatchData] = useState([]);


  const {
 
    selectedFaculty,
    setSelectedFaculty,
    time,
    setTime,
    selectedTime,
    setSelectedTime,
    setSelectedSubject,
    selectedSubject,
    modalDate,
    setModalDate,
    setSelectedSubjectid,
    selectedScheduleType,
    selectedLocation,
    editItemId,
    setEditItemId,
    selectedSubjectid,
    setModalOpenEdit,
    setScheduleRefresh,
     setFacultyHrsUpdate

    } = useContext(LocationContext);

  const getFacultyURL = `${process.env.REACT_APP_API_URL}/getfacultydata?q=&limit=${100}&page=&gender=&sortBy=updated_at&sortOrder=DESC&location_id=${selectedLocation} `;
  const getBatchURL = `${process.env.REACT_APP_API_URL}/getbatchdata?q=&limit=&page=&sortBy=updated_at&sortOrder=DESC&location_id=${selectedLocation} `;
  const [isEditMode, setIsEditMode] = useState(false);
  const getScheduleById = `${process.env.REACT_APP_API_URL}/showByIDSchedule/${editItemId}`;
  const [ScheduleData, setScheduleData] = useState();
  const fetchScheduleData = async () => {
    try {
      const response = await getApiService(getScheduleById);

      localStorage.setItem("item", response.batch_id);

      setScheduleData(response);
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };

  const fetchSingleBatch = async () => {
    try {
      const url = `${getBatchByIDURL}`;
      const id = localStorage.getItem("item");
      const response = await getDataById(url, id);
      if (response) {
        if (
          response.data.slot_times_foundations &&
          response.data.slot_times_foundations.length > 0
        ) {
          const responseSubjects = response.data.batch_stream[0].subject;
          const subjectsArray = [];

          responseSubjects.forEach((subject) => {
            const subjectDetails = {
              id: subject.id,
              subject_name: subject.subject_name,
              subject_code: subject.subject_code,
            };
            subjectsArray.push(subjectDetails);
          });
          const slotDataM = response.data.slot_times_foundations[0].slot_times;
          const slotDataA = response.data.slot_times_foundations[1].slot_times;

          const combinedTimeSlots = [];

          if (slotDataM.length > 0) {
            combinedTimeSlots.push(...slotDataM);
          }

          if (slotDataA.length > 0) {
            combinedTimeSlots.push(...slotDataA);
          }

          setTime(combinedTimeSlots);
  
          setSelectedSubject(subjectsArray);
        } else {
          const combinedTimeSlots = [];

          if (
            response.data.batch_slots &&
            response.data.batch_slots.length > 0
          ) {
            const slotDataM = response.data.batch_slots[0].slot_times;

            if (slotDataM && slotDataM.length > 0) {
              combinedTimeSlots.push(...slotDataM);
            }
          }

          if (
            response.data.batch_slots &&
            response.data.batch_slots.length > 1
          ) {
            const slotDataA = response.data.batch_slots[1].slot_times;

            // Check if slot_times property exists and has elements
            if (slotDataA && slotDataA.length > 0) {
              combinedTimeSlots.push(...slotDataA);
            }
          }

          setTime(combinedTimeSlots);

        

          const responseSubjects = response.data.batch_stream[0].subject;
          const subjectsArray = [];

          responseSubjects.forEach((subject) => {
            const subjectDetails = {
              id: subject.id,
              subject_name: subject.subject_name,
              subject_code: subject.subject_code,
            };
            subjectsArray.push(subjectDetails);
          });

          setSelectedSubject(subjectsArray);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const [facultyResponse, batchResponse] = await Promise.all([
        getApiService(getFacultyURL),
        getApiService(getBatchURL),
      ]);
      if (facultyResponse) {
        setFacultyData(facultyResponse.data);
      }

      if (selectedScheduleType === "foundation") {
        const foundationBatches = batchResponse.data.filter(
          (item) => item.batch_stream[0].stream_names === "Foundation"
        );
        setBatchData(foundationBatches);
      }
      if (selectedScheduleType === "jee/medical") {
        const jeeMedicalBatches = batchResponse.data.filter(
          (item) =>
            item.batch_stream[0].stream_names === "JEE" ||
            item.batch_stream[0].stream_names === "Medical"
        );
        setBatchData(jeeMedicalBatches);
      }
    } catch (error) {
      console.log(error);
    }
  };



  
  const navigate = useNavigate();

  useEffect(() => {
    if (editItemId) {
      fetchScheduleData();
    }
  }, [editItemId]);
  

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);
 

  useEffect(() => {
    if (ScheduleData && ScheduleData.batch_id) {
      const selectedBatch = batchData.find(
        (batch) => batch.id === ScheduleData.batch_id
      );
      if (selectedBatch) {
        setValue("batchSelect", {
          value: selectedBatch.id,
          label: selectedBatch.batch_code,
        });
        localStorage.setItem("item", selectedBatch.id);

        fetchSingleBatch();
      }
    }
  }, [ScheduleData, batchData, setValue]);

  useEffect(() => {
    if (ScheduleData && facultyData) {
      const facultyId = ScheduleData.faculty_id;

      const matchingFaculty = facultyData.find(
        (faculty) => faculty.id === facultyId
      );

      if (matchingFaculty) {
        // Use matchingFaculty as needed, for example:
        const selectedFacultyValue = {
          value: matchingFaculty.id,
          label: (
            <span>
              {`${matchingFaculty.first_name} ${matchingFaculty.last_name} `}
              <span style={{ color: "red" }}>
                {ScheduleData.subject.subject_code}
              </span>
            </span>
          ),
        };

        setValue("faculty", selectedFacultyValue);
        setSelectedFaculty(selectedFacultyValue);
      }
    }
  }, [ScheduleData, facultyData, setValue]);

  useEffect(() => {
    if (ScheduleData && batchData) {
      const scheduleSubjectId = ScheduleData.subject.id;

      const matchingSubject = batchData
        .map((batch) => batch.batch_stream[0].subject)
        .flat()
        .find((subject) => subject.id === scheduleSubjectId);

      if (matchingSubject) {
        setValue("subject", {
          value: matchingSubject.id,
          label: matchingSubject.subject_name,
        });
        setSelectedSubjectid(matchingSubject.id);
      }
    }
  }, [ScheduleData, batchData]);

  useEffect(() => {
    if (ScheduleData && ScheduleData.slot_time && time) {
   
      const scheduleTimeParts = ScheduleData.slot_time.split("-")[0].split(":");
      const scheduleHour = parseInt(scheduleTimeParts[0], 10);
      const scheduleMinute = parseInt(scheduleTimeParts[1], 10);

      const selectedSlot = time.find((slot) => {
        const slotTimeParts = slot.split("-")[0].split(":");
        const slotHour = parseInt(slotTimeParts[0], 10);
        const slotMinute = parseInt(slotTimeParts[1], 10);

        return scheduleHour === slotHour && scheduleMinute === slotMinute;
      });

      if (selectedSlot) {
        setValue("time", { value: selectedSlot, label: selectedSlot });
        setSelectedTime(selectedSlot);
      }
    }
  }, [ScheduleData, setValue, selectedSubject, time]);

  const handleFacltyDataChange = (selectedOption) => {
    const modifiedLabel = selectedOption.label.map((text, index) => {
      return index === 1 ? (
        <span style={{ color: "red" }}>&nbsp;{text}</span>
      ) : (
        text
      );
    });

    setValue("faculty", { value: selectedOption.value, label: modifiedLabel });
    setSelectedFaculty(selectedOption);
  };

  const handleBatchSlotDataTimeChange = (selectedOption) => {
    if (selectedScheduleType === "foundation") {
      setSelectedTime(selectedOption.label);
      setValue("time", {
        value: selectedOption.label,
        label: selectedOption.label,
      });
    } else {
      setSelectedTime(selectedOption.label);
      setValue("time", {
        value: selectedOption.label,
        label: selectedOption.label,
      });
    }
  };

  const handleBatchSubjectDataChange = (selectedOption) => {
    setSelectedSubjectid(selectedOption.value);
    setValue("subject", {
      value: selectedOption.value,
      label: selectedOption.label,
    });
  };
  const handleDateChange = (event) => {
    setValue("date", event.target.value);
    setModalDate(event.target.value);
  };

  useEffect(() => {
    if (ScheduleData) {
      const scheduleDate = ScheduleData.date;

      setValue("date", scheduleDate);
      setModalDate(scheduleDate);
    }
  }, [ScheduleData]);
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);
  if (!isOpen) return null;
  const CustomOption = ({ children, ...props }) => {
    const facultyName = children[0];

    const subjectCode = children[1];
    return (
      <components.Option {...props}>
        <span>{facultyName}</span>
        <span style={{ color: "red" }}>&nbsp;{subjectCode}</span>
      </components.Option>
    );
  };

  const onSubmit = (e) => {
    let updateScheudleURL = `http://dev.allen-api.com:5020/api/UpdateSchedule`;
    if (selectedScheduleType === "foundation") {
      updateScheudleURL += `/foundation/${editItemId}`;
    } else {
      updateScheudleURL += `/default/${editItemId}`;
    }

    const postData = {
      location_id: selectedLocation,
      batch_id: localStorage.getItem("item"),
      faculty_id: selectedFaculty.value,
      subject_id: selectedSubjectid,
      slot_time: selectedTime,
      date: modalDate,
    };


    const response = axios.patch(updateScheudleURL, postData).
    then(
      res=>{
        toast.success("Schedule Successfully Updated.. ", {
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
        });
        setSelectedFaculty("")
        setModalDate("")
        setSelectedSubjectid("")
        setSelectedTime("")
        setFacultyHrsUpdate(true)

        setScheduleRefresh(true)
        setEditItemId(null)
        setTimeout(() => {
          navigate("/schedule");
        }, 3000);
      }
    ).catch(err=>{
      setFacultyHrsUpdate(false)

      toast.error(err.response.data.message, {
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
      });
      setModalOpenEdit(true);

      
    })

    
    setModalOpenEdit(false);
    
  };


  return (
    <form>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        
        <div
          className="bg-white    border-2 border-gray-600  py-2"
          style={{ width: "60vw" }}
        >
          <h3  className = " text-lg py-1"style={{margin:"auto" , textAlign:"center", justifyContent:"center"}}>Reschedule</h3>
       <div style={{ borderTop: "1px solid #ccc" }}>

          <div className="flex flex-wrap p-4 " >
            <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-4 md:pr-2">
              <label
                htmlFor="dateInput"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Date
              </label>
              <input
                type="date"
                id="dateInput"
                {...register("date", { required: true })}
                onChange={handleDateChange}
                style={{ width: "25vw" }}
                className="px-3 py-2 border border-gray-300  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-4 md:pr-2">
              <div>
                <label
                  htmlFor="batchFacultySelect"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Faculty
                </label>
                <Select
                  id="batchFacultySelect"
                  {...register("  faculty", { required: true })}
                  value={watch("faculty")}
                  options={facultyData.map((faculty) => ({
                    value: faculty.id,
                    label: [
                      `${faculty.first_name} ${faculty.last_name}`,
                      `${
                        faculty.subject &&
                        faculty.subject
                          .map((subject) => subject.subject_code)
                          .join(", ")
                      }`,
                    ],
                  }))}
                  components={{ Option: CustomOption }}
                  onChange={handleFacltyDataChange}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderRadius: 0,
                      width: "25vw",
                    }),
                  }}
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-4 md:pr-2">
              <label
                htmlFor="batchSelect"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Batch
              </label>
              <Select
                id="batchSelect"
                {...register("batchSelect", { required: true })}
                onChange={(selectedOptions) => {
                  localStorage.setItem("item", selectedOptions.value);

                  setValue("batchSelect", selectedOptions);
                  
                
                  setValue("time", {});
              
                  setValue("subject", {});


                  fetchSingleBatch();
                }}
                value={watch("batchSelect")}
                options={batchData.map((batch) => ({
                  value: batch.id,
                  label: batch.batch_code,
                }))}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderRadius: 0,
                    width: "25vw",
                  }),
                }}
              />
            </div>

            <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-4 md:pr-2">
              <div>
                <label
                  htmlFor="batchSlotTimeSelect"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Slot Time
                </label>
                <Select
                  id="batchSlotTimeSelect"
                  options={time.map((t, index) => ({
                    value: t,
                    label: t,
                  }))}
                  {...register("  time", { required: true })}
                  value={watch("time")}
                  onChange={handleBatchSlotDataTimeChange}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderRadius: 0,
                      width: "25vw",
                    }),
                  }}
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-4 md:pr-2">
              <div>
                <label
                  htmlFor="batchSubjectSelect"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Subject
                </label>
                <Select
                  id="batchSubjectSelect"
                  {...register("  subject", { required: true })}
                  value={watch("subject")}
                  options={selectedSubject.map((subject) => ({
                    value: subject.id,
                    label: subject.subject_name,
                  }))}
                  onChange={handleBatchSubjectDataChange}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderRadius: 0,
                      width: "25vw",
                    }),
                  }}
                />
              </div>
            </div>
          </div>
       </div>
       
          <div className="button  px-4">
          <button
          // disabled={
          //   !selectedFaculty ||
          //   !selectedTime ||
          //   !selectedSubjectid ||
          //   !modalDate
          // }
className="focus:outline-none text-white bg-primaryColour hover:bg-primaryColour-1000  font-medium  text-sm px-5 py-2.5 me-2 "              onClick={onSubmit}
            >
              Update
            </button>
            <button
className="text-gray-900   bg-gray-50 border border-gray-300 focus:outline-none hover:bg-gray-100  font-medium  text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:border-gray-600 dark:focus:ring-gray-800"              onClick={onClose}
            >
              Cancel
            </button>

          </div>
        </div>
      </div>
    </form>
  );
};
