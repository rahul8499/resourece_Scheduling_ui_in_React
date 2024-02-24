import { useEffect, useState, useContext } from "react";
import LocationContext from "../../context/LocationContext";
import { getApiService, getDataById } from "../../Services/Services";
import Select, { components } from "react-select";
import { useForm } from "react-hook-form";

const getBatchByIDURL = `${process.env.REACT_APP_API_URL}/showBatchById`;

export const Modal = ({ isOpen, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
    // const { formData, setFormData } = useState([]);
    const [formData, setFormData] = useState({
      faculty: "",
      batch: "",
      batchslot: "",
      subject: "",
    });

  const [facultyData, setFacultyData] = useState([]);
  const [batchData, setBatchData] = useState([]);
  const [batchSlot, setBatchSlot] = useState([]);
  const [batchStream, setBatchStream] = useState([]);
  

  const {
    selectedSubjectid,
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
  } = useContext(LocationContext);

  const getFacultyURL = `${process.env.REACT_APP_API_URL}/getfacultydata?q=&limit=&page=&gender=&sortBy=updated_at&sortOrder=DESC&location_id=${selectedLocation} `;
  const getBatchURL = `${process.env.REACT_APP_API_URL}/getbatchdata?q=&limit=&page=&sortBy=updated_at&sortOrder=DESC&location_id=${selectedLocation} `;

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

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, selectedScheduleType]);
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
          console.log("combinedTimeSlots", combinedTimeSlots);

          // Check if batch_slots array exists and has at least one element
          if (
            response.data.batch_slots &&
            response.data.batch_slots.length > 0
          ) {
            const slotDataM = response.data.batch_slots[0].slot_times;

            // Check if slot_times property exists and has elements
            if (slotDataM && slotDataM.length > 0) {
              combinedTimeSlots.push(...slotDataM);
            }
          }

          // Check if batch_slots array has at least two elements
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




  const handleFacltyDataChange = (selectedOption) => {
    setSelectedFaculty(selectedOption);
  };
  const handleBatchDataChange = (selectedOption) => {
    localStorage.setItem("item", selectedOption.value);
    fetchSingleBatch();
  };



  const handleBatchSlotDataTimeChange = (selectedOption) => {
    if (selectedScheduleType === "foundation") {
      setSelectedTime(selectedOption.label);
    } else {
      setSelectedTime(selectedOption.label);
    }
  };

 
  const handleBatchSubjectDataChange = (selectedOption) => {
    setSelectedSubjectid(selectedOption.value);
  };
  const handleDateChange = (event) => {
    setModalDate(event.target.value);
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);
  if (!isOpen) return null;
  
  // const isCreateButtonDisabled = () => {
  //   return Object.values(formData).some((value) => !value);
  // }
  //-------------------------------------------------created for fauclty only--------------------------
  const CustomOption = ({ children, ...props }) => {
    const facultyName = children[0];
    const subjectCode = children[1];
    return (
      <components.Option {...props}>
        <span>{facultyName}</span>
        <span style={{ color: "red" }}>{subjectCode}</span>
      </components.Option>
    );
  };

  //-------------------------------------------------------------------------------

  return (
<form onSubmit={handleSubmit}>
    <div className="fixed inset-0 flex items-center justify-center z-50" >
      <div
        className="bg-white   border-2 border-gray-600 py-2 "
        style={{ width: "60vw" }}
      >
                  <h3  className = " text-lg py-1"style={{margin:"auto" , textAlign:"center", justifyContent:"center"}}>Create Schedule</h3>
                  <div style={{ borderTop: "1px solid #ccc" }}>

        <div className="flex flex-wrap p-4">
          <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-4 md:pr-2">
            <label
              htmlFor="dateInput"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
               Date
            </label>
            <input
                            {...register("date", { required: true })}

              type="date"
              id="dateInput"
              value={modalDate}
              onChange={handleDateChange}
              style={{width:"25vw"}}
              className="  px-3 py-2 border border-gray-300  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
              <div>
                  {errors.date && (
                    <p className="error validationcolor">
                      This is required{" *"}{" "}
                    </p>
                  )}
                </div>
          </div>
          <div className=" md:w-1/2 lg:w-1/2 xl:w-1/2 mb-4 md:pr-2">
            <div>
              <label
                htmlFor="batchFacultySelect"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
               Faculty
              </label>
              <Select
                                          {...register("faculty", { required: true })}

                id="batchFacultySelect"
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
                    width:"25vw"
                  }),
                }}
                value={selectedFaculty}
              />
              {errors.faculty && (
                    <p className="error validationcolor">
                      This is required{" *"}{" "}
                    </p>
                  )}
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
                                                      {...register("batch", { required: true })}

              id="batchSelect"
              options={batchData.map((batch) => ({
                value: batch.id,
                label: batch.batch_code,
              }))}
              onChange={handleBatchDataChange}
              // value={formData}
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderRadius: 0,
                  width:"25vw"
                }),
              }}
            />
             {errors.batch && (
                    <p className="error validationcolor">
                      This is required{" *"}{" "}
                    </p>
                  )}
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
                                                                    {...register("batchslot", { required: true })}

                id="batchSlotTimeSelect"
                options={time.map((t, index) => ({
                  value:  t,
                  label: t,
                }))}
                onChange={handleBatchSlotDataTimeChange}
                // value={formData}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderRadius: 0,
                    width:"25vw"
                  }),
                }}
              />
              {errors.batchslot && (
                    <p className="error validationcolor">
                      This is required{" *"}{" "}
                    </p>
                  )}
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
                 {...register("subject", { required: true })}

                id="batchSubjectSelect"
                options={selectedSubject.map((subject) => ({
                  value: subject.id,
                  label: subject.subject_name,
                }))}
                onChange={handleBatchSubjectDataChange}
                // value={formData}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderRadius: 0,
                    width:"25vw"
                  }),
                }}
              />
              {errors.subject && (
                    <p className="error validationcolor">
                      This is required{" *"}{" "}
                    </p>
                  )}
            </div>
          </div>

          {/* <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-4 md:pr-2">
            <div>
              <label
                htmlFor="batchFacultySelect"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Select Batch Faculty
              </label>
              <Select
                id="batchFacultySelect"
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
                  }),
                }}
                value={selectedFaculty}
              />
            </div>
          </div> */}
        </div>
        </div>
        <div className="button px-4">
                  <button
className="focus:outline-none text-white bg-primaryColour hover:bg-primaryColour-1000  font-medium  text-sm px-5 py-2.5 me-2 "             onClick={onSubmit}
// disabled={isCreateButtonDisabled()}
// disabled={!selectedFaculty || !selectedTime || !selectedSubject || !modalDate}
disabled={
  !selectedFaculty ||
  !selectedTime ||
  !selectedSubjectid ||
  !modalDate
}

       >
            Create
          </button>
          <button
className="text-gray-900   bg-gray-50 border border-gray-300 focus:outline-none hover:bg-gray-100  font-medium  text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:border-gray-600 dark:focus:ring-gray-800"            onClick={onClose}
          >
            Cancel
          </button>

        </div>
      </div>
    </div>
    </form>
  );
};
