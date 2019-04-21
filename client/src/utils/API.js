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
  // Gets all users
  getUsers: function() {
    return axios.get("/api/users");
  },
  // Gets the user with the given username
  loginUser: function(loginData) {
    return axios.get("/api/login" + loginData);
  },
  // Gets the user with the given id
  getUser: function(id) {
    return axios.get("/api/users/" + id);
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
