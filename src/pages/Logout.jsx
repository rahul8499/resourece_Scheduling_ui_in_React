import axios from 'axios';
import React, { useEffect } from 'react'

const Logout = () => {
  const handleLogout = async (event) => {
    try {
      event.stopPropagation(); 
      await axios.post("http://dev.allen-api.com:5020/api/logout");
      
      localStorage.removeItem('access_token');
  
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
 
}

export default Logout