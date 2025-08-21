export const axiosWithToken = (data, isMultipart = false) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
    Authorization: "Bearer " + data?.token,
  };

  return { headers }; 
};
