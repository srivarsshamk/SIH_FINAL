const axios = require('axios');

const testRequest = async () => {
  try {
    const response = await axios.post(
      "https://web-production-dab9b.up.railway.app/api/api1/",
      {
        message: "kajal agarwal",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
  }
};

testRequest();
