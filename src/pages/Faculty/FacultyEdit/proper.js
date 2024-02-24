


import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import TableHeader from "../../../components/TableHeader/TableHeader";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
// import './FacultyCreate.css'



const FacultyFormEdit = () => {



  const { id } = useParams();
  const getFacultyByIdURL = `http://dev.allen-api.com:5020/api/showfacultyById/${id}`;

  const [facultyData, setFacultyData] = useState({});
  const [locationData, setlocationData] = useState([]);
  const [batchSlotData, setBatchSlotData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  

  const [isEditMode, setIsEditMode] = useState(false);




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
         
        } catch (error) {
          console.log(error);
        }
      });
  };

 
 

  




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

  
  
  
 
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [firstName, setFirstName] = useState(isEditMode ? facultyData.first_name : "");
  const [email, setEmail] = useState(""); 
  const [phoneNumber, setPhoneNumber] = useState(""); 
  const [lastName, setLastName] = useState(isEditMode ? facultyData.last_name : "");
  const [age, setAge] = useState(isEditMode ? facultyData.age : "");
  const [experience,  setexperience] = useState(isEditMode ? facultyData.experience : "");
  const [gender, setGender] = useState(isEditMode ? facultyData.gender : "");
  console.log(gender)


  const [address, setAddress] = useState(isEditMode ? facultyData.address : "");


  



  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFirstNameChange = (event) => {
    const words = event.target.value.split(" ");
    const capitalizedWords = words.map((word) => {
      if (word.length > 0) {
        const lowercaseWord = word.toLowerCase();
        return lowercaseWord.charAt(0).toUpperCase() + lowercaseWord.slice(1);
      }
      return word;
    });
    const capitalizedValue = capitalizedWords.join(" ");
    setFirstName(capitalizedValue);
  };

 

  const handleLastNameChange = (event) => {
    
    const words = event.target.value.split(" ");
    const capitalizedWords = words.map((word) => {
      if (word.length > 0) {
        const lowercaseWord = word.toLowerCase();
        return lowercaseWord.charAt(0).toUpperCase() + lowercaseWord.slice(1);
      }
      return word;
    });
    const capitalizedValue = capitalizedWords.join(" ");
    setLastName(capitalizedValue);
    console.log(capitalizedWords)
  };
  


  const handleAddressChange = (event) => {
    const words = event.target.value.split(" ");
    const capitalizedWords = words.map((word) => {
      if (word.length > 0) {
        const lowercaseWord = word.toLowerCase();
        return lowercaseWord.charAt(0).toUpperCase() + lowercaseWord.slice(1);
      }
      return word;
    });
    const capitalizedValue = capitalizedWords.join(" ");
    setAddress(capitalizedValue);
  };


  useEffect(() => {
    if (isEditMode) {
      setGender(facultyData.gender);

      setFirstName(facultyData. first_name)
      setLastName(facultyData.last_name);
      setAddress(facultyData.address)
      setAge(facultyData.age)
      // setEmail(facultyData.email)
      setEmail(isEditMode ? facultyData.mail : "");
      setPhoneNumber(isEditMode ? facultyData.phone : "");
      setexperience(facultyData.experience)
      
      // setexperience(facultyData.experience)
      
    }
  }, [isEditMode, facultyData.first_name, facultyData.phone, gender ]);

  
  useEffect(() => {
    setValue("lastname", lastName);
    setValue("firstname",firstName)
    setValue("address", address)
    setValue("age", age)
setValue("experience", experience) 
setValue("gender", gender);
setValue("email", email)
setValue("phoneNumber", phoneNumber)

  }, [lastName, firstName, address,age,experience, gender,email, phoneNumber, setValue]);

 

  


  
  const onSubmit = async (data) => {
    console.log(data);
  
    const subjectIds = data.subject ? data.subject.map((item) => item.value) : [];
    const locationIds = data.location ? data.location.map((item) => item.value) : [];

    // console.log("locationidsss",locationIds)
    const batchSlotIds = data.batchSlot ? data.batchSlot.map((item) => item.value) : [];
  
    console.log("subjectIds", subjectIds);
    // console.log("locationIds", locationIds);
    console.log("batchSlotIds", batchSlotIds);
  
    const postData = {
      "first_name": data.firstname,
      "last_name": data.lastname,
      "mail": data.email,
      "phone": data.phoneNumber,
      "address": data.address,
      "gender": data.gender,
      "subject_id": subjectIds,
      "age": data.age,
      "experience": data.experience,
      "location_id": locationIds,
      "batch_slot_id": batchSlotIds
    };
  
    console.log("postData", postData);
    
    try {
      await axios.patch(`http://dev.allen-api.com:5020/api/updatefaculty/${id}`, postData);
      navigate("/facultylist");
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };
  
 

  

  return (
    <>
      <div className="  ">
        <>
          <ToastContainer />
        </>
        <TableHeader pagename={isEditMode ? "Edit Faculty" : "Create Faculty"} />
     

        <div className=" bg-white ml-4 mr-4  h-auto pb-6   mb-4" >

        <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" mt-4 " >
          <div className="  grid grid-cols-12 ml-6 pt-5  ">

         
          <div className=" col-span-6">
          <label className="  text-lg  mb-1 mt-3 text-primary">First Name</label>
          <div>
          <input
                id="firstname"
                type="text"
                placeholder=" First Name"
                style={{height:"35px",  outline:"none"}}
                {...register("firstname", {
                  required: "This field is required",

                  // required: true,
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message: "This is not a valid First Name"
                  },
                  validate: {
                    startsWithLetter: (value) => /^[A-Za-z]/.test(value) || "First character should be a letter"
                  }
                })}
                
                // {...register("firstname", { required: true,}, {backgroundColor:"green"})}
                //    {...register('first_name',{pattern:{value:/^[aA-zZ\s]+$/, message:"This is not a valid First Name"}})} />

                className= 'input  bg-gray-300  '
                onChange={handleFirstNameChange}
                // value={firstName}
                defaultValue={firstName}




                autoFocus
              />
             <div>
             {errors.firstname && (
          <span className="validationcolor">{errors.firstname.message} </span>
        )}
              {/* {errors.firstname && errors.firstname.type === "required" && (
                <span className="validationcolor" >This is required</span>
              )} */}
              </div> 
              </div>

          </div>
          <div className=" col-span-6 ">
          <label className="text-lg mb-1 mt-3 text-primary">Last Name</label>
          <div>
              <input
                id="lastname"
                type="text"
                style={{height:"35px", outline:"none"}}
                placeholder="Last Name"
                {...register("lastname", {
                  required: "This field is required",

                  // required: true,
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message: "This is not a valid First Name"
                  },
                  validate: {
                    startsWithLetter: (value) => /^[A-Za-z]/.test(value) || "First character should be a letter"
                  }
                })}
                // {...register("lastname", { required: true,})}
                className="input bg-gray-300 "
                onChange={handleLastNameChange}

                defaultValue={lastName} // Set the default value here

                // value={lastName}
              />
             <div>
             {errors.firstname && (
          <span className="validationcolor">{errors.lastname.message} </span>
        )}
              </div>
              </div>
          </div>
          <div className=" col-span-6 mt-1" > 
          <label className=" text-lg mb-1 mt-3 text-primary">Email</label>
          <div>

          <input
                id="email"
                type="email"
                style={{height:"35px", outline:"none"}}
                defaultValue={isEditMode ? facultyData.mail : ""}

               placeholder="Email"
               {...register("email", {
                required: "This field is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
                // {...register("email", { required: true,})}
                className={`input   bg-gray-300  border-gray-400 `}
              />
            <div>

            {errors.email && (
          <span className="validationcolor">{errors.email.message} </span>
        )}
              {/* {errors.email && errors.email.type === "required" && (
                <span className="validationcolor">This is required</span>
              )} */}
              </div>  
          </div>
          </div>
          <div className=" col-span-6 mt-1">
          <label className=" text-lg mb-1 mt-3 text-primary">Contact</label>
          <div>
          <input
                id="number"
                type="number"
                style={{height:"35px", outline:"none"}}
                placeholder="Contact"
                defaultValue={isEditMode ? facultyData.phone : ""}

                {...register("phoneNumber", {
                  required: "This field is required",
                  pattern: {
                    value: /^(\+\d{1,3}[- ]?)?\d{10}$/,
                    message: "This is not a valid phone number"
                  }
                })}
                // {...register("phoneNumber", { required: true,})}
                className= " input  bg-gray-300 "
              />
             <div>


             {errors.phoneNumber && (
      <span className="validationcolor">{errors.phoneNumber.message}</span>
    )}
              </div> 
              
          </div>
          </div>

          <div className="  col-span-4 mt-1" style={{width: '30vw'}}>
    <label className="text-lg mb-1 mt-3 text-primary">Locations</label>
    <Select
  // className="  text-lg"
    isMulti
    // options={subjectData}
              options={locationData}
              value={watch("location")} 


    
    {...register("subject", { required: true })}
    onChange={(selectedOptions) => {
      // Set the value using react-hook-form's setValue
      setValue("location", selectedOptions);
    }}

    styles={{
      control: (provided, state) => ({
        ...provided,
        backgroundColor: 'lightgray', // Change the background color of the control (input)
         borderRadius: 0,
         border: "none",
  outline: "none",
  boxShadow: "none",
      }),
      dropdownIndicator: (provided) => ({
        ...provided,
        color: "black", // Customize the color of the dropdown indicator
      }),
     
    }}
  />
  <div>
    {errors.subject && (
    <p className="error validationcolor ">This is required</p>
  )}
    </div>
    </div>



          {/* // */}
        







          
<div  className=" col-span-2 mt-1">

</div>



          <div className=" col-span-6  mt-1   ">
          <label className="text-lg mb-1 mt-3 text-primary ">Gender</label>
          <div>
            <select
                {...register("gender", { required: true,})}
                style={{height:"35px", width:"30vw" ,outline:"none"}}

      onChange={(e) => setGender(e.target.value)}
      // value={{gender}}
                defaultValue={gender} // Set the defaultValue


                className=" bg-gray-300  "

                placeholder="Select Gender" // Add placeholder attribute

              >
                <option >Female</option>
                <option >Male</option>
                <option >Other</option>
              </select>

             <div>
              {errors.gender && errors.gender.type === "required" && (
                <span className="validationcolor">This is required</span>
              )}
              </div> 
            </div>
          </div>

          <div className=" col-span-6  mt-1 ">

              <label className="text-lg mb-1 mt-3 text-primary">Age</label>
              <div>

             
              <input
                id="age"
                type="number"
                style={{height:"35px", outline:"none"}}
                defaultValue={age}
                // value={isEditMode ? facultyData.age : ""}

     placeholder="Age"
    //  defaultValue={isEditMode ? facultyData.age : ""}

     {...register("age", {
      required: "This field is required",
      
      pattern: {
        value: /^[0-9]*$/,
        message: "Please enter a valid age"
      }
    })}
                // {...register("age", { required: true,})}
                className={`input  bg-gray-300   `}
              />
             <div>
             {errors.age && (
      <span className="validationcolor">{errors.age.message}</span>
    )}
               </div>
              </div>
          </div>

          <div className=" col-span-6  mt-1 ">

<label className="text-lg mb-1 mt-3 text-primary">experience</label>
<div>


<input
  id="age"
  type="text"
  style={{height:"35px", outline:"none"}}
  defaultValue={experience}
  // value={isEditMode ? facultyData.age : ""}

placeholder="experience"
//  defaultValue={isEditMode ? facultyData.age : ""}

{...register("experience", {
required: "This field is required",

pattern: {
value: /^[0-9]*$/,
message: "Please enter a valid age"
}
})}
  // {...register("age", { required: true,})}
  className={`input  bg-gray-300   `}
/>
<div>
{errors.age && (
<span className="validationcolor">{errors.age.message}</span>
)}
 </div>
</div>
</div>

          {/* <div className=" col-span-6 mt-1">
          <label className=" text-lg mb-1 mt-3 text-primary">Experience</label>
          <div>

         
          <input
                id="experience"
                type="number"
                defaultValue={experience}

                style={{height:"35px", outline:"none"}}
 placeholder="Experience"
 {...register("experience", {
  required: "This field is required",
  pattern: {
    value: /^[0-9]*$/,
    message: "Please enter a valid age"
  }
})}
                // {...register("experience", { required: true,})}
                className={`input bg-gray-300  border-gray-400 `}
              />
             <div>
             {errors.age && (
      <span className="validationcolor">{errors.age.message}</span>
    )}
              </div> 
              </div>
          </div> */}

          <div className=" col-span-6  rounded-sm	 mt-1 ">
          <label className="text-lg mb-1 mt-3 text-primary">Address</label>
          <div>
          <input
                id="address"
                type="text"
                style={{height:"35px", outline:"none"}}
  placeholder="Address"
  {...register("address", { required: "This field is required" })}

                // {...register("address", { required: true,})}
                onChange={handleAddressChange}
                defaultValue={address}
                // value={address}
                className={`input    bg-gray-300  border-gray-400 `}
              />
            <div>
            {errors.address && (
      <span className="validationcolor">{errors.address.message}</span>
    )}
              </div>  
          </div>
          </div>
          <div className=" col-span-4 mt-1" style={{width: '30vw', outline:"none"}}>
          <label className="text-lg mb-1 mt-3 text-primary">Subjects</label>
          <Select
        // className="  text-xl"
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
              borderRadius: 0,
              border: "none",
       outline: "none",
       boxShadow: "none",

            }),
            dropdownIndicator: (provided) => ({
              ...provided,
              color: "black", // Customize the color of the dropdown indicator
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

          <label className="text-lg mb-1 mt-3 text-primary">Batch Slots</label>
          <Select
        // className=" text-xl"
          placeholder = "Batch Slots"
          value={watch("batchSlot")} 

          isMulti
          // options={subjectData}
                    options={batchSlotData}
                    style = {{outline:"none", border:"none"}}

          // {[
          //   { value: "location1", label: "Location 1" },
          //   { value: "location2", label: "Location 2" },
          //   // Add more options as needed
          // ]}
          {...register("batchSlot", { required: true })}
          onChange={(selectedOptions) => {
            // Set the value using react-hook-form's setValue
            setValue("batchSlot", selectedOptions);
          }}
          className="custom-select" // Add a custom CSS class
          classNamePrefix="custom-select" // Add a custom CSS class prefix
          styles={{
            control: (provided, state) => ({
              ...provided,
              backgroundColor: 'lightgray', // Change the background color of the control (input)
               borderRadius: 0,
               border: "none",
        outline: "none",
        boxShadow: "none",
            }),
            dropdownIndicator: (provided) => ({
              ...provided,
              color: "black", // Customize the color of the dropdown indicator
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
          <div className="col-span-2">
            </div>

<div className=" col-span-6  	 mt-1 ">
          <label className="text-lg mb-1  text-primary">Upload Picture:</label>
          <div>
          <input
                type="file"
                 id="file"
                  onChange={handleFileChange}
                style={{height:"40px", outline:"none"}}
  // placeholder="Address"
  className="file-input  input    bg-gray-300  border-gray-400 "
                // className={`input    bg-gray-300  border-gray-400 text-xl`}
              />
            <div>
            {/* {errors.address && errors.address.type === "required" && (
                <span className="validationcolor">This is required</span>
              )} */}
              </div>  
          </div>
          </div>
       
      <div className="  col-span-6 	   flex mt-4 " >
      <div >

      
              <button className="bg-primary text-lg " type="submit" style={{ height:"35px", width:"7vw", color:"white", marginRight:"1vw"}}>
                Save
              </button>
              </div>
              

              <Link to={"/facultylist"} style={{color:"white" }}>
                <button className="   text-lg cancebtn  " style={{height:"35px", width:"7vw",  }} >
                  
                  Cancel
                
              {/* </Link> */}
                </button></Link>
                {" "}
              </div>
        </div>
       
          {/* <section className=" flex ml-8 mt-4 " > */}
            {/* </section> */}
           
            </div>

      </form>

</div>
      </div>
    </>
  );
};

export default FacultyFormEdit
