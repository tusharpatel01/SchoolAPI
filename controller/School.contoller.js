import db from '../config/DB.js';
const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = deg => deg * Math.PI / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a = Math.sin(dLat/2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

// POST /addSchool
export const addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;
  if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ message: "Invalid input fields" });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );
    res.status(201).json({ message: "School added successfully", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Error inserting school", error: err.message });
  }
};

// GET /listSchools
export const listSchools = async (req, res) => {
  const userLat = parseFloat(req.query.latitude);
  const userLon = parseFloat(req.query.longitude);

  if (isNaN(userLat) || isNaN(userLon)) {
    return res.status(400).json({ message: "Invalid user location" });
  }

  try {
    const [schools] = await db.execute('SELECT * FROM schools');

    const schoolsWithDistance = schools.map(school => ({
      ...school,
      distance: getDistance(userLat, userLon, school.latitude, school.longitude)
    }));

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);
  } catch (err) {
    res.status(500).json({ message: "Error fetching schools", error: err.message });
  }
};
