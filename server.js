const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
<<<<<<< HEAD
=======
const RANGE = .05; // kilometers
>>>>>>> 2e23879ab6ca0214085f865c0f3f33a4b6507ef5

app.use(bodyParser.json());

class SegmentTree {
  constructor(minLat, maxLat, minLon, maxLon) {
    this.root = new Node(minLat, maxLat, minLon, maxLon);
  }

  update(user) {
    this._remove(this.root, user.id);
    this._insert(this.root, user);
  }

  _remove(node, userId) {
    if (!node) return;
    node.users = node.users.filter(u => u.id !== userId);
    if (!node.isLeaf()) {
      this._remove(node.nw, userId);
      this._remove(node.ne, userId);
      this._remove(node.sw, userId);
      this._remove(node.se, userId);
    }
  }

  _insert(node, user) {
    if (!node.contains(user.lat, user.lon)) return;
    node.users.push(user);
    if (node.isLeaf()) return;

    const midLat = (node.minLat + node.maxLat) / 2;
    const midLon = (node.minLon + node.maxLon) / 2;

    if (!node.nw) node.nw = new Node(node.minLat, midLat, node.minLon, midLon);
    if (!node.ne) node.ne = new Node(node.minLat, midLat, midLon, node.maxLon);
    if (!node.sw) node.sw = new Node(midLat, node.maxLat, node.minLon, midLon);
    if (!node.se) node.se = new Node(midLat, node.maxLat, midLon, node.maxLon);

    this._insert(node.nw, user);
    this._insert(node.ne, user);
    this._insert(node.sw, user);
    this._insert(node.se, user);
  }

  findNearbyUsers(lat, lon, range) {
    const results = new Set();
    this._findNearbyUsers(this.root, lat, lon, range, results);
    return Array.from(results);
  }

  _findNearbyUsers(node, lat, lon, range, results) {
    if (!node.intersects(lat, lon, range)) return;

    for (const user of node.users) {
      if (this.calculateDistance({lat, lon}, user) <= range) {
        results.add(user);
      }
    }

    if (node.isLeaf()) return;

    if (node.nw) this._findNearbyUsers(node.nw, lat, lon, range, results);
    if (node.ne) this._findNearbyUsers(node.ne, lat, lon, range, results);
    if (node.sw) this._findNearbyUsers(node.sw, lat, lon, range, results);
    if (node.se) this._findNearbyUsers(node.se, lat, lon, range, results);
  }

  calculateDistance(point1, point2) {
    const R = 6371;
    const dLat = this.deg2rad(point2.lat - point1.lat);
    const dLon = this.deg2rad(point2.lon - point1.lon);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(point1.lat)) * Math.cos(this.deg2rad(point2.lat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }
}

class Node {
  constructor(minLat, maxLat, minLon, maxLon) {
    this.minLat = minLat;
    this.maxLat = maxLat;
    this.minLon = minLon;
    this.maxLon = maxLon;
    this.users = [];
    this.nw = null;
    this.ne = null;
    this.sw = null;
    this.se = null;
  }

  contains(lat, lon) {
    return lat >= this.minLat && lat <= this.maxLat &&
           lon >= this.minLon && lon <= this.maxLon;
  }

  intersects(lat, lon, range) {
    const closestLat = Math.max(this.minLat, Math.min(lat, this.maxLat));
    const closestLon = Math.max(this.minLon, Math.min(lon, this.maxLon));
    const latDiff = lat - closestLat;
    const lonDiff = lon - closestLon;
    return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) <= range;
  }

  isLeaf() {
    return !this.nw && !this.ne && !this.sw && !this.se;
  }
}

const globalMinLat = -90, globalMaxLat = 90, globalMinLon = -180, globalMaxLon = 180;
const db = new SegmentTree(globalMinLat, globalMaxLat, globalMinLon, globalMaxLon);
const users = {};

function updateUser(user) {
  users[user.id] = user;
  db.update(user);
  console.log(`Updated user (ID: ${user.id}) to location (${user.lat}, ${user.lon})`);
}

function findNearbyUsers(userId, range) {
  const user = users[userId];
  
  if (!user) {
    console.log(`User with ID ${userId} not found.`);
    return [];
  }

  console.log(`Searching for users near (ID: ${user.id})`);
  console.log(`User's location: lat ${user.lat}, lon ${user.lon}`);
  console.log(`Search range: ${range} km`);

  const nearbyUsers = db.findNearbyUsers(user.lat, user.lon, range);
  return nearbyUsers.filter(u => u.id !== userId);
}

app.get('/', async(req,res)=>{
  return res.json({ message: 'Server running!' });
});

app.post('/coordinates', (req, res) => {
  const { latitude, longitude, userID } = req.body;
  console.log('Coordinates received:', latitude, longitude, userID);
  const user = { id: userID, lat: latitude, lon: longitude };
  updateUser(user);
  res.json({ status: 'Coordinates updated' });
});

app.post('/getNearbyCoordinates', (req, res) => {
  const { userID, range } = req.body;
  const searchRange = range || 0.025; // Default to 25 meters if no range specified
  const nearbyUsers = findNearbyUsers(userID, searchRange);
  res.json(nearbyUsers);
});

app.listen(PORT, () => {
<<<<<<< HEAD
  console.log(`Server running on port ${PORT}`);
});
=======
  console.log(`Server running...`);
});
>>>>>>> 2e23879ab6ca0214085f865c0f3f33a4b6507ef5
