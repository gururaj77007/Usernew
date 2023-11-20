// officeRouter.js

const express = require("express");
const router = express.Router();

// Function to calculate the Haversine distance between two points
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

// Endpoint to check if the client is near any office location
router.post("/checkNearOffice", (req, res) => {
  console.log(req.body);
  const clientCoordinates = {
    latitude: parseFloat(req.body.latitude),
    longitude: parseFloat(req.body.longitude),
  };

  if (isNaN(clientCoordinates.latitude) || isNaN(clientCoordinates.longitude)) {
    return res.status(400).json({ error: "Invalid client coordinates" });
  }

  const thresholdDistance = 13; // Threshold distance in kilometers

  // Check if the client is near any office location
  const nearOffices = officeLocations.filter(
    (office) =>
      calculateDistance(
        clientCoordinates.latitude,
        clientCoordinates.longitude,
        office.latitude,
        office.longitude
      ) <= thresholdDistance
  );

  res.json({ isNearOffice: nearOffices.length > 0, nearOffices });
});

module.exports = router;
