const TeLocation = require("../model/TeLocationModel");
const ManagerLocation = require("../model/ManagerLocation");

const ManagerSaveLocation = async (req, res) => {
  try {
    const { userId, longitude, latitude } = req.body;

    const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format

    // Find the location document for the user
    let location = await ManagerLocation.findOne({ userId });

    if (!location) {
      // If the location document does not exist, create a new one
      location = new ManagerLocation({
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
const ManagerGetLocationByDate = async (req, res) => {
  try {
    const { userId, date } = req.params;

    // Ensure userId and date are provided
    if (!userId || !date) {
      return res.status(400).json({ error: "userId and date are required" });
    }

    // Find the location document for the user
    const location = await ManagerLocation.findOne({ userId });

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
  ManagerSaveLocation,
  ManagerGetLocationByDate,
  TeSaveLocation,
  TeGetLocationByDate,
};
