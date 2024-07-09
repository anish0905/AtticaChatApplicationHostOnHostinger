const Location = require("../model/locationModel");
const TeLocation = require("../model/TeLocationModel");

const saveLocation = async (req, res) => {
  const { managerId, longitude, latitude } = req.body;

  try {
    let location = await Location.findOne({ managerId });

    if (location) {
      // Update existing location object by pushing new location into the array
      location.locations.push({ longitude, latitude });
    } else {
      // If no location object exists, create a new one with the initial location
      location = new Location({
        managerId,
        locations: [{ longitude, latitude }],
      });
    }

    await location.save();
    res.status(201).send(location);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getLocation = async (req, res) => {
  const { id } = req.params;
  try {
    const location = await Location.find({ managerId: id });
    if (location) {
      res.status(200).json({ location });
    } else {
      res.status(404).json({ message: "Location not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Adjust the path to your actual model file

// Controller to add a new location
const TeSaveLocation = async (req, res) => {
  try {
    const { userId, longitude, latitude } = req.body;

    const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format

    // Find the location document for the user
    let location = await TeLocation.findOne({ userId });

    if (!location) {
      // If the location document does not exist, create a new one
      location = new TeLocation({
        userId,
        dateLocations: [{ date: today, locations: [{ longitude, latitude }] }],
      });
    } else {
      // Check if there's an entry for today
      const dateLocation = location.dateLocations.find(
        (dl) => dl.date === today
      );

      if (dateLocation) {
        // If an entry for today exists, add the new location to it
        dateLocation.locations.push({ longitude, latitude });
      } else {
        // If there's no entry for today, create a new one
        location.dateLocations.push({
          date: today,
          locations: [{ longitude, latitude }],
        });
      }
    }

    // Save the updated location document
    await location.save();

    res.status(200).json({ message: "Location added successfully", location });
  } catch (err) {
    res.status(500).json({
      error: "An error occurred while adding the location",
      details: err.message,
    });
  }
};

// Controller to get data according to date
const TeGetLocationByDate = async (req, res) => {
  try {
    const { userId, date } = req.params;

    // Find the location document for the user
    const location = await TeLocation.findOne({ userId });

    if (!location) {
      return res
        .status(404)
        .json({ error: "No location data found for this user" });
    }

    // Find the dateLocation entry for the specified date
    const dateLocation = location.dateLocations.find((dl) => dl.date === date);

    if (!dateLocation) {
      return res
        .status(404)
        .json({ error: "No location data found for this date" });
    }

    res.status(200).json({ dateLocation });
  } catch (err) {
    res.status(500).json({
      error: "An error occurred while fetching the location data",
      details: err.message,
    });
  }
};

module.exports = {
  saveLocation,
  getLocation,
  TeSaveLocation,
  TeGetLocationByDate,
};
