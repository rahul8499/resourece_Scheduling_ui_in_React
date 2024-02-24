


import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import TableHeader from "../../../components/TableHeader/TableHeader";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
// import './FacultyCreate.css'

const FacultyCreate = () => {
  const { id } = useParams();
  const getFacultyByIdURL = `http://dev.allen-api.com:5020/api/showfacultyById/${id}`;

  const [facultyData, setFacultyData] = useState({});
  const [locationData, setlocationData] = useState([]);
  const [batchSlotData, setBatchSlotData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  

  const [isEditMode, setIsEditMode] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [select, setSelect] = useState([])



  const navigate = useNavigate();

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  //   setValue
  // } = useForm();
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();


  const fetchFacultyData = () => {
    axios
      .get(`http://dev.allen-api.com:5020/api/showfacultyById/${id}`)
      .then((res) => {
        // try {
        //   const mappingResponse = res.batch_slot.map((response) => {
        //     return { label: response.name, value: response.name, id: response.id };
        //   });
        //   setlocationData(mappingResponse);
        // } catch (error) {
        //   console.log(error);
        // }
        setFacultyData(res.data.data);
        // console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log("facultydata",facultyData)
  const getDataOfFacultyById = async () => {
    if (id) {
      setIsEditMode(true);
      fetchFacultyData();
    }
  };

  const getLocationData = async () => {
    axios
      .get(
        `http://dev.allen-api.com:5020/api/getlocation?q=&limit=&page=&name=&sortBy=name&sortOrder=DESC`
      )
      .then((res) => {
        // console.log("res",res)
        try {
          const mappingResponse = res.data.map((response) => {
            return { label: response.name, value: response.id };

          });
          setlocationData(mappingResponse);
          // if (isEditMode && facultyData.location) {
          //   const selectedOptions = mappingResponse.filter(
          //     (option) =>
          //       facultyData.location.find(
          //         (location) => location.pivot.location_id === option.value
          //       )
          //   );
          //   console.log("location",selectedOptions)
          //   setValue("location", selectedOptions);
          //       }
        } catch (error) {
          console.log(error);
        }
      });
  };

  const getBatchSlotData = async () => {
    axios
      .get(
        `http://dev.allen-api.com:5020/api/getBatchslot?q=&limit=5&page=1&name=1&sortBy=name&sortOrder=DESC`
      )
      .then((res) => {
        try {
          const mappingResponse = res.data.map((response) => {
            return { label: response.name, value: response.id };

          });
          setBatchSlotData(mappingResponse);

          // if (isEditMode && facultyData.batch_slot) {
          //   const selectedOptions = mappingResponse.filter(
          //     (option) =>
          //       facultyData.batch_slot.find(
          //         (batchSlot) => batchSlot.pivot.batch_slot_id === option.value
          //       )
          //   );
          //   setValue("batchSlot", selectedOptions);
          //   // console.log(selectedOptions)
          // }
        
        } catch (error) {
          console.log(error);
        }
      });
  };


  const getSubjectData = async () => {
    axios
      .get(
        `http://dev.allen-api.com:5020/api/getSubject`
      )
      .then((res) => {
        try {
          const mappingResponse = res.data.map((response) => {
            return { label: response.subject_name, value: response.id };

          });
          setSubjectData(mappingResponse);
          // console.log("subjectfwfg",mappingResponse)
          // if (isEditMode && facultyData.subject
          //   ) {
          //   const selectedOptions = mappingResponse.filter(
          //     (option) =>
          //       facultyData.subject.find(
          //         (subject
          //           ) => subject
          //           .pivot.subject_id
          //           === option.value
          //       )
          //   );
          //   setValue("subject", selectedOptions);
          //   // console.log("subject",selectedOptions)
          // }
        } catch (error) {
          console.log(error);
        }
      });
  };

 

  const onSubmit = async (data) => {
    console.log(data)
    // const subjectIds = data.subject.map((item) => item.id);
    // const locationIds = data.locations.map((item) => item.id);
    // const batchSlotIds = data.batchSlot.map((item) => item.id);

    // const postData = {
    //   first_name: data.firstname,
    //   last_name: data.lastname,
    //   mail: data.email,
    //   phone: data.phoneNumber,
    //   address: data.address,
    //   gender: data.gender,
    //   subject_id: subjectIds,
    //   age: data.age,
    //   experience: data.experience,
    //   location_id: locationIds,
    //   batch_slot_id: batchSlotIds
    // };

    // axios.post(`http://dev.allen-api.com:5020/api/createfaculty`, postData);  //post method
    // navigate("/facultylist") 
  };

  


 



  
  
  
  // useEffect(() => {

 
    
  //   getDataOfFacultyById()
  //         fetchFacultyData();

  //   getLocationData();
  //   getSubjectData();
  //   getBatchSlotData();

  // },[]);

  useEffect(() => {
    const fetchData = async () => {
      await getDataOfFacultyById();
      // await fetchFacultyData();
      await getLocationData();
      await getSubjectData();
      await getBatchSlotData();
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    if (isEditMode && facultyData.location) {
      const selectedLocationOptions = locationData.filter((option) =>
        facultyData.location.find((location) => location.pivot.location_id === option.value)
      );
      setValue("location", selectedLocationOptions);
    }
  }, [isEditMode, facultyData.location, locationData]);
  
  useEffect(() => {
    if (isEditMode && facultyData.batch_slot) {
      const selectedBatchSlotOptions = batchSlotData.filter((option) =>
        facultyData.batch_slot.find((batchSlot) => batchSlot.pivot.batch_slot_id === option.value)
      );
      setValue("batchSlot", selectedBatchSlotOptions);
    }
  }, [isEditMode, facultyData.batch_slot, batchSlotData]);
  
  useEffect(() => {
    if (isEditMode && facultyData.subject) {
      const selectedSubjectOptions = subjectData.filter((option) =>
        facultyData.subject.find((subject) => subject.pivot.subject_id === option.value)
      );
      setValue("subject", selectedSubjectOptions);
    }
  }, [isEditMode, facultyData.subject, subjectData]);

  
  
  
  
  
  
  


  

 

  

  return (
    <>
      <div className="  ">
        <>
          <ToastContainer />
        </>
        <TableHeader pagename={isEditMode ? "Edit Faculty" : "Create Faculty"} />
     

        <div className=" bg-white ml-4 mr-4   h-auto  mb-4  "  >

     
<form onSubmit={handleSubmit(onSubmit)}>
  <div className=" mt-4" >
    <div className="  grid grid-cols-12 ml-6 pt-5  ">

   
    <div className=" col-span-6">
    <label className="text-xl  mb-1 mt-3 text-primary">First Name</label>
    <div>
    <input
          id="firstname"
          type="text"
          placeholder=" First Name"
          style={{height:"40px"}}
          {...register("firstname", { required: true,}, {backgroundColor:"green"})}
          className= 'input  bg-gray-300  text-xl'
          // value={isEditMode ? facultyData.first_name : ""}
          defaultValue={isEditMode ? facultyData.first_name : ""}

          


        />
       <div>
        {errors.firstname && errors.firstname.type === "required" && (
          <span className="validationcolor" >This is required</span>
        )}
        </div> 
        </div>

    </div>
    <div className=" col-span-6">
    <label className="text-xl mb-1 mt-3 text-primary">Last Name</label>
    <div>
        <input
          id="lastname"
          type="text"
          style={{height:"40px"}}
          placeholder="Last Name"
          {...register("lastname", { required: true,})}
          className="input bg-gray-300 text-xl"
          defaultValue={isEditMode ? facultyData.last_name : ""}

        />
       <div> {errors.lastname && errors.lastname.type === "required" && (
          <span className="validationcolor">This is required</span>
        )}
        </div>
        </div>
    </div>
    <div className=" col-span-6 mt-1" > 
    <label className="text-xl mb-1 mt-3 text-primary">Email</label>
    <div>

    <input
          id="email"
          type="email"
          style={{height:"40px"}}
         placeholder="Email"
          {...register("email", { required: true,})}
          className={`input   bg-gray-300  border-gray-400 text-xl`}
          defaultValue={isEditMode ? facultyData.mail : ""}

        />
      <div>


        {errors.email && errors.email.type === "required" && (
          <span className="validationcolor">This is required</span>
        )}
        </div>  
    </div>
    </div>
    <div className=" col-span-6 mt-1">
    <label className="text-xl mb-1 mt-3 text-primary">Contact</label>
    <div>
    <input
          id="number"
          type="number"
          style={{height:"40px"}}
          placeholder="Contact"
          {...register("phoneNumber", { required: true,})}
          className= " input  bg-gray-300 text-xl"
          defaultValue={isEditMode ? facultyData.phone : ""}

        />
       <div>


        {errors.phoneNumber && errors.phoneNumber.type === "required" && (
          <span className="validationcolor">This is required</span>
        )}
        </div> 
        
    </div>
    </div>


    <div className=" col-span-4 mt-1" style={{width: '30vw'}}>
    <label className="text-xl mb-1 mt-3 text-primary">Locations</label>
    <Select
  className="  text-xl"
    isMulti
    // options={subjectData}
              options={locationData}
              value={watch("location")} 


    // {[
    //   { value: "location1", label: "Location 1" },
    //   { value: "location2", label: "Location 2" },
    //   // Add more options as needed
    // ]}
    {...register("subject", { required: true })}
    onChange={(selectedOptions) => {
      // Set the value using react-hook-form's setValue
      setValue("location", selectedOptions);
    }}

    styles={{
      control: (provided, state) => ({
        ...provided,
        backgroundColor: 'lightgray', // Change the background color of the control (input)
      }),
      // menu: (provided, state) => ({
      //   ...provided,
      //   backgroundColor: 'lightgray', // Change the background color of the dropdown menu
      // }),
      // option: (provided, state) => ({
      //   ...provided,
      //   backgroundColor: state.isSelected ? 'blue' : 'white', // Change the background color of each option
      //   color: state.isSelected ? 'white' : 'black', // Change the text color of each option
      // }),
    }}
  />
  <div>
    {errors.subject && (
    <p className="error validationcolor ">This is required</p>
  )}
    </div>
    </div>

    {/* <div className=" col-span-4 mt-1" style={{width: '30vw'}}>
    <label className="text-xl mb-1 mt-3 text-primary">Locations</label>
    <Select
  className="text-xl"
    isMulti
    options={locationData}
    value={watch("location")} 

    // {[
    //   { value: "location1", label: "Location 1" },
    //   { value: "location2", label: "Location 2" },
    //   // Add more options as needed
    // ]}
    {...register("locations", { required: true })}
    onChange={(selectedOptions) => {
      // Set the value using react-hook-form's setValue
      setValue("locations", selectedOptions);
    }}

    styles={{
      control: (provided, state) => ({
        ...provided,
        backgroundColor: 'lightgray', // Change the background color of the control (input)
      }),
      // menu: (provided, state) => ({
      //   ...provided,
      //   backgroundColor: 'lightgray', // Change the background color of the dropdown menu
      // }),
      // option: (provided, state) => ({
      //   ...provided,
      //   backgroundColor: state.isSelected ? 'blue' : 'white', // Change the background color of each option
      //   color: state.isSelected ? 'white' : 'black', // Change the text color of each option
      // }),
    }}
  />
  <div>
    {errors.locations && (
    <p className="error validationcolor">This is required</p>
  )}
    </div>
    </div> */}
<div  className=" col-span-2 mt-1">

</div>

{/* <div className="col-span-6 mt-1">
<label className="text-xl mb-1 mt-3 text-primary">Gender</label>
<div>
<Select
{...register("gender", { required: true })}
className="   text-xl"
styles={{
  control: (provided) => ({
    ...provided,
    height: '40px',
    width: '30vw',
    backgroundColor: 'lightgray',
    // fontSize: 'xl',
  }),
}}
placeholder="Select Gender"
options={[
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
]}
/>

<div>
{errors.gender && errors.gender.type === "required" && (
  <span className="validationcolor">This is required</span>
)}
</div>
</div>
</div> */}








<div className="col-span-6 mt-1">
  <label className="text-xl mb-1 mt-3 text-primary">Gender</label>
  <div>
  <select name="dropdown"         style={{ height: "40px", width: "30vw" }}
    {...register("gender", { required: true })}
    className="bg-gray-300 text-xl"
          placeholder="Select Gender"


>
        <option value="option1">male</option>
        <option value="option2">female</option>
        <option value="option3">other</option>
      </select>
    {/* <select
      {...register("gender", { required: true })}
      style={{ height: "40px", width: "30vw" }}
      className="bg-gray-300 text-xl"
      placeholder="Select Gender"
      // defaultValue={isEditMode ? facultyData.gender || "" : ""}
            defaultValue={isEditMode ? facultyData.gender || "" : ""}


    >
      <option value="" disabled selected>
        Select Gender
      </option>
      <option value="female">Female</option>
      <option value="male">Male</option>
      <option value="other">Other</option>
    </select> */}

    {errors.gender && errors.gender.type === "required" && (
      <span className="validationcolor">This is required</span>
    )}
  </div>
</div>


    <div className=" col-span-6  mt-1 ">

        <label className="text-xl mb-1 mt-3 text-primary">Age</label>
        <div>

       
        <input
          id="age"
          type="number"
          style={{height:"40px"}}
placeholder="Age"
defaultValue={isEditMode ? facultyData.age : ""}

          {...register("age", { required: true,})}
          className={`input  bg-gray-300   text-xl`}
        />
       <div>
         {errors.age && errors.age.type === "required" && (
          <span className="validationcolor">This is required</span>
        )}
         </div>
        </div>
    </div>
    <div className=" col-span-6 mt-1">
    <label className="text-xl mb-1 mt-3 text-primary">Experience</label>
    <div>

   
    <input
          id="experience"
          type="number"
          style={{height:"40px"}}
placeholder="Experience"
defaultValue={isEditMode ? facultyData.experience: ""}

          {...register("experience", { required: true,})}
          className={`input bg-gray-300  border-gray-400 text-xl`}
        />
       <div>
        {errors.experience && errors.experience.type === "required" && (
          <span className="validationcolor">This is required</span>
        )}
        </div> 
        </div>
    </div>

    <div className=" col-span-6  rounded-sm	 mt-1 ">
    <label className="text-xl mb-1 mt-3 text-primary">Address</label>
    <div>
    <input
          id="address"
          type="text"
          style={{height:"40px"}}
placeholder="Address"
defaultValue={isEditMode ? facultyData.address : ""}

          {...register("address", { required: true,})}
          className={`input    bg-gray-300  border-gray-400 text-xl`}
        />
      <div>
      {errors.address && errors.address.type === "required" && (
          <span className="validationcolor">This is required</span>
        )}
        </div>  
    </div>
    </div>
    <div className=" col-span-4 mt-1" style={{width: '30vw'}}>
    <label className="text-xl mb-1 mt-3 text-primary">Subjects</label>
    <Select
  className="  text-xl"
    isMulti
    // options={subjectData}
              options={subjectData}
              value={watch("subject")} 


    // {[
    //   { value: "location1", label: "Location 1" },
    //   { value: "location2", label: "Location 2" },
    //   // Add more options as needed
    // ]}
    {...register("subject", { required: true })}
    onChange={(selectedOptions) => {
      // Set the value using react-hook-form's setValue
      setValue("subject", selectedOptions);
    }}

    styles={{
      control: (provided, state) => ({
        ...provided,
        backgroundColor: 'lightgray', // Change the background color of the control (input)
      }),
      // menu: (provided, state) => ({
      //   ...provided,
      //   backgroundColor: 'lightgray', // Change the background color of the dropdown menu
      // }),
      // option: (provided, state) => ({
      //   ...provided,
      //   backgroundColor: state.isSelected ? 'blue' : 'white', // Change the background color of each option
      //   color: state.isSelected ? 'white' : 'black', // Change the text color of each option
      // }),
    }}
  />
  <div>
    {errors.subject && (
    <p className="error validationcolor ">This is required</p>
  )}
    </div>
    </div>

    <div className="  col-span-4 mt-1" style={{width: '30vw'}}>
    {/* <div className="  col-span-4" style={{width: '600px'}}> */}

    <label className="text-xl mb-1 mt-3 text-primary">Batch Slots</label>
    <Select
  className=" text-xl"
    // placeholder = "Select Batch Slots"
    isMulti
              options={batchSlotData}
              
              // defaultValue={watch("batchSlot")}
              // defaultValue={batchSlotDefaultValue}

              // defaultValue =  {defaultValue}
              value={watch("batchSlot")} 
              // defaultValue={watch("batchSlot")}




    // {[
    //   { value: "location1", label: "Location 1" },
    //   { value: "location2", label: "Location 2" },
    //   // Add more options as needed
    // ]} 
     
        // value={isEditMode ? { label: facultyData.batch_slot, value: facultyData.batch_slot.value } : null}
        // value={isEditMode ? batchSlotData.find(option => option.value === facultyData.batch_slot) : null}
        // value={isEditMode && facultyData.batch_slot
        //   ? batchSlotData.find(option => option.id === facultyData.batch_slot)
        //   : null}

        // value={isEditMode && facultyData.batch_slot_id
        //   ? batchSlotData.find(option => option.value === facultyData.batch_slot_id, )
        //   : null}


    {...register("batchSlot", { required: true })}
    onChange={(selectedOptions) => {
      // Set the value using react-hook-form's setValue
      setValue("batchSlot", selectedOptions);
    }}

    styles={{
      control: (provided, state) => ({
        ...provided,
        backgroundColor: 'lightgray', // Change the background color of the control (input)
      }),
      // menu: (provided, state) => ({
      //   ...provided,
      //   backgroundColor: 'lightgray', // Change the background color of the dropdown menu
      // }),
      // option: (provided, state) => ({
      //   ...provided,
      //   backgroundColor: state.isSelected ? 'blue' : 'white', // Change the background color of each option
      //   color: state.isSelected ? 'white' : 'black', // Change the text color of each option
      // }),
    }}
  />
  <div>
    {errors.batchSlot && (
    <p className="error validationcolor">This is required</p>
  )}
    </div>
    </div>
  </div>
 
    <section className=" flex ml-8 mt-4" >
        <button className="bg-primary btn text-xl" type="submit">
          Save
        </button>
        <Link to={"/facultylist"}>
          {" "}
          <button className=" bg-primary  bg-opacity-80   btn text-xl">Cancel</button>
        </Link>
      </section>
      </div>
</form>
</div>
      </div>
    </>
  );
};

export default FacultyCreate;
