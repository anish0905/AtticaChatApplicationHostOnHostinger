const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const DateLocationSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Store date as a string in 'YYYY-MM-DD' format
  locations: [LocationSchema],
});

const ManagerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ManagerDetails",
    required: true,
  },
  dateLocations: [DateLocationSchema],
});

// Define NewLocationSchema and NewLocation model outside the middleware
const NewManagerLocationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ManagerDetails",
    required: true,
  },
  date: { type: String, required: true },
  locations: [LocationSchema],
});

const NewManagerLocation = mongoose.model(
  "NewManagerLocation",
  NewManagerLocationSchema
);

// Middleware to handle saving longitude and latitude when the date changes
ManagerSchema.pre("save", async function (next) {
  if (this.isModified("dateLocations")) {
    const latestDateLocation =
      this.dateLocations[this.dateLocations.length - 1];
    const previousDateLocation =
      this.dateLocations[this.dateLocations.length - 2];

    if (previousDateLocation && latestDateLocation) {
      const latestDate = new Date(latestDateLocation.date);
      const previousDate = new Date(previousDateLocation.date);

      if (latestDate.toDateString() !== previousDate.toDateString()) {
        const newLocation = new NewManagerLocation({
          userId: this.userId,
          date: latestDateLocation.date,
          locations: latestDateLocation.locations,
        });

        try {
          await newLocation.save();
        } catch (err) {
          return next(err);
        }
      }
    }
  }
  next();
});

const ManagerLocation = mongoose.model("ManagerLocation", ManagerSchema);

module.exports = ManagerLocation;
