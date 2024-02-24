import axios from 'axios';

export const getApiService = async (url, method = 'GET', data = null) => {
  try {
    const config = {
      method,
      url,
      data,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Fetch data by ID
export const getDataById = async (url, id) => {
  const apiUrl = `${url}/${id}`;
  return await getApiService(apiUrl);
};

// Update data
export const updateData = async (url, id, data) => {
  const apiUrl = `${url}/${id}`;
  return await getApiService(apiUrl, 'PUT', data);
};

// Delete data
export const deleteData = async (url, id) => {
  const apiUrl = `${url}/${id}`;
  return await getApiService(apiUrl, 'DELETE');
};

// Create new data
export const createData = async (url, data) => {
  return await getApiService(url, 'POST', data);
};
