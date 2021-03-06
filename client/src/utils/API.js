import axios from "axios";

export default {
  // Gets all snaps
  getSnaps: function() {
    return axios.get("/api/snaps");
  },
  // Gets the snap with the given id
  getSnap: function(id) {
    return axios.get("/api/snap/" + id);
  },
  // Deletes the snap with the given id
  deleteSnap: function(id) {
    return axios.delete("/api/snap/" + id);
  },
  // Saves a snap to the database
  saveSnap: function(snapData) {
    return axios.post("/api/snaps", snapData);
  },
  // Gets all hunts
  getHunts: function() {
    return axios.get("/api/hunts");
  },
  // Gets all hunts near me
  getHuntsNearMe: function(locationData) {
    console.log(locationData);
    let { lng, lat } = locationData;
    return axios.get(`/api/hunts/near-me/?lng=${lng}&lat=${lat}`);
  },
  // Gets the hunt with the given id
  getHunt: function(id) {
    return axios.get("/api/hunts/" + id);
  },
  // Adds the hunt to the users inProgressHunts list
  playHunt: function(id, huntData) {
    return axios.put("/api/users/hunt/" + id, huntData);
  },
  // Deletes the hunt with the given id
  deleteHunt: function(id) {
    return axios.delete("/api/hunts/" + id);
  },
  // Saves a hunt to the database
  saveHunt: function(huntData) {
    return axios.post("/api/hunts", huntData);
  },
  // Gets all users
  getUsers: function() {
    return axios.get("/api/users");
  },
  // Gets the user with the given username
  loginUser: function(loginData) {
    let { username, password } = loginData;
    // console.log(username, password)
    return axios.get(`/api/login/?username=${username}&password=${password}`);
  },
  // Gets the user with the given id
  getUser: function(id) {
    return axios.get("/api/users/" + id);
  },
  // update user with the given id
  updateUser: function(id, userData) {
    return axios.put("/api/users/" + id, userData);
  },
  // Deletes the user with the given id
  deleteUser: function(id) {
    return axios.delete("/api/users/" + id);
  },
  // Saves a user to the database
  saveUser: function(userData) {
    return axios.post("/api/users", userData);
  }
};
