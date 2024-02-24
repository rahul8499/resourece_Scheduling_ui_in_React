import "./App.css";
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import FilterHeader from "./components/FilterHeader/FilterHeader";
import SchedulingPage from "./pages/Scheduling/Scheduling";
import BatchList from "./pages/Batch/BatchList/BatchList";
import FacultyList from "./pages/Faculty/Facultylist/FacultyList";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import BatchCreate from "./pages/Batch/BatchCreate/BatchCreate";
import BatchEdit from "./pages/Batch/BatchEdit/BatchEdit";
import FacultyCreate from "./pages/Faculty/FacultyCreate/FacultyCreate";
import FacultyView from "./pages/Faculty/FacultyView/FacultyView";
import FacultyFormEdit from "./pages/Faculty/FacultyEdit/FacultyFormEdit";
import Reports from "./pages/Reports/Reports";
import Logout from "./pages/Logout";
import Forgot from "./pages/Forgot";
import LeaveList from './pages/Leave/LeaveList'
import LeaveCreate from './pages/Leave/LeaveCreate'
import LeaveEdit  from "./pages/Leave/LeaveEdit";
import ResetPassword from "./pages/ResetPassword";
import CreateUser from './pages/CreateUser'
import Users from "./pages/Users";
import CreatPassword from "./pages/CreatPassword";
import UserEdit from "./pages/UserEdit";
import PivoteTablePage from "./PivoteTables/PivoteTablePage";
function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    console.log("token", token);
    console.log(token);
    if (token) {
      setIsLoggedIn(true);
    }
  }, [isLoggedIn]); //

  return (
    <div className="pagecolor  ">
      {isLoggedIn ? (
        <div className="grid grid-cols-12">
          <div className=" ">
            <Sidebar />
          </div>
          <div className="col-span-12   border-gray-400 border-solid  ml-24">
            <FilterHeader />
            <Routes>
              <Route path="/schedule" element={<SchedulingPage />} />
              <Route path="/" element={<PivoteTablePage />} />
              {/* /user */}
              <Route path="/user" element={<Users />} />

              <Route path="/batchlist" element={<BatchList />} />
              <Route path="/batchcreate" element={<BatchCreate />} />
              <Route path="/batchformedit/:id" element={<BatchEdit />} />
              <Route path="/facultylist" element={<FacultyList />} />
              <Route path="/facultycreate" element={<FacultyCreate />} />
              <Route path="/facultyview/:id" element={<FacultyView />} />
              <Route path="/LeaveList" element={<LeaveList/>} />
              <Route path="/leavecreate" element={<LeaveCreate/>} />
              <Route path="/leaveEdit/:id" element={<LeaveEdit/>} />
              <Route path="/userEdit/:id" element={<UserEdit/>} />

         
              <Route path="/createUser" element={<CreateUser/>} />

              {/* /createUser */}

              <Route
                path="/facultyformedit/:id"
                element={<FacultyFormEdit />}
              />
              {/* <Route path="/reports" element={<Reports />} /> */}
         
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </div>

          <div
  className="bg-primaryColour text-sm"
  style={{
    position: "absolute",
    bottom: 0,
    width: "100%",
    color: "white",
    textAlign: "center",
    padding: "10px",
    cursor: "pointer", // Add cursor style to indicate it's clickable
  }}
>
  <a
    href="https://webassic.com/"
    target="_blank" // Add this if you want the link to open in a new tab/window
    rel="noopener noreferrer" // Recommended for security when using target="_blank"
    style={{ textDecoration: "none", color: "inherit" }}
  className=" font-serif "
 >
    &copy; Developed By Webassic IT Solutions PVT. LTD.
  </a>
</div>

        </div>
      ) : (
        <Routes>
                    {/* <Route path="/" element={<CreateUser />} /> */}

          <Route path="/" element={<Login />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/createPassword" element={<CreatPassword />} />

          <Route path="/resetPassword" element={<ResetPassword />} />

        </Routes>
      )}
    </div>
  );
}

export default App;
