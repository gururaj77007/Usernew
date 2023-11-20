const express = require("express");
const axios = require("axios");
const house = require("./routes/Houseid");

const app = express();
const PORT = process.env.PORT || 3004;
app.use(express.json());
app.use("/find", house);
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.get("/getAddress", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const apiKey = "fd0487a43edd49188ba722ed342f08b4"; // Replace with your Geoapify API key

    if (!lat || !lon || !apiKey) {
      return res
        .status(400)
        .json({ error: "Latitude, Longitude, and API Key are required." });
    }

    const apiUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${apiKey}`;
    const response = await axios.get(apiUrl);
    console.log(response.data);

    const address = response.data.results[0];
    function calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Radius of the earth in kilometers
      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
          Math.cos(toRadians(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in kilometers

      return distance;
    }

    // Function to convert degrees to radians
    function toRadians(degrees) {
      return (degrees * Math.PI) / 180;
    }

    // Mock office locations
    const officeLocations = [
      {
        Houseid: 1,
        name: "Office 1",
        latitude: 12.331051666666667,
        longitude: 76.632225,
      },
      //{ id: 2, name: "Office 2", latitude: 13.0827, longitude: 80.2707 },
      // Add more office locations as needed
    ];

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ error: "Invalid client coordinates" });
    }

    const thresholdDistance = 13; // Threshold distance in kilometers

    // Check if the client is near any office location
    const nearOffices = officeLocations.filter(
      (office) =>
        calculateDistance(lat, lon, office.latitude, office.longitude) <=
        thresholdDistance
    );

    if (address) {
      res.json({ address, nearOffices });
    } else {
      res
        .status(404)
        .json({ error: "Address not found for the provided coordinates." });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
