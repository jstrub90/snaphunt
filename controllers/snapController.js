const db = require("../models");
const Clarifai = require('clarifai');
require('dotenv').config();

const ClarifaiApp = new Clarifai.App({
  apiKey: process.env.REACT_APP_CLARIFAI_API_KEY
});

// Defining methods for the snapController
module.exports = {
  findAll: function (req, res) {
    db.Snap
      .find(req.query)
      .sort({ createdAt: -1 })
      .populate('user', 'username')
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findByUserId: function (req, res) {
    db.Snap
      .findById(req.params.userId)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function (req, res) {
    db.Snap
      .findById(req.params.id)
      .populate('user', 'username')
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function (req, res) {
    const { imageData, location, userId, huntId, keyword } = req.body;
    // ClarifaiApp.models.initModel({ id: Clarifai.GENERAL_MODEL, version: "aa7f35c01e0642fda5cf400f543e7c40" })
    //   .then(generalModel => {
    //     return generalModel.predict(imageData.replace('data:image/jpeg;base64,', ''), { maxConcepts: 15 });
    //   })
    //   .then(response => {
    //     let concepts = response['outputs'][0]['data']['concepts'],
    //       tags = [];
    //     concepts.forEach(function (item) {
    //       tags.push((item.name).toLowerCase())
    //     });
    //     console.log(tags);
    //     console.log('Tag matched? ' + tags.indexOf(keyword.toLowerCase()));
    //   })
    // console.log(req.body);
    ClarifaiApp.inputs.create({
      base64: imageData.replace('data:image/jpeg;base64,', ''), // needed to remove modify the base64 code
      geo: { latitude: location.lat, longitude: location.lng },
    }).then(
      function (response) {
        console.log('Upload to clarifai successful');
        // console.log(response['0']);
        // console.log(response['0'].imageUrl);
        const imageUrl = response['0'].imageUrl;
        // const imageUrl = "https://peopledotcom.files.wordpress.com/2018/02/two-tone-cat.jpg"; // for testing...
        // console.log(imageUrl);
        ClarifaiApp.models.initModel({ id: Clarifai.GENERAL_MODEL, version: "aa7f35c01e0642fda5cf400f543e7c40" })
          .then(generalModel => {
            return generalModel.predict(imageUrl, { maxConcepts: 15 });
          })
          .then(response => {
            let concepts = response['outputs'][0]['data']['concepts'],
              tags = [],
              snapData = {
                url: imageUrl,
                location: location,
                user: userId,
                hunt: huntId
              };
            // console.log(concepts);
            concepts.forEach(function (item) {
              tags.push((item.name).toLowerCase())
            });
            // console.log(tags);
            // console.log(keyword);
            // if the image returns a tag that macthes the keyword then save the image
            // at the same time it it matcher modify the user's inProgressHunts
            console.log('Tag matched? ' + tags.indexOf(keyword.toLowerCase()));
            if (tags.indexOf(keyword.toLowerCase()) >= 0) {
              snapData.tags = tags;
              // this will need to be inside the clarifai .then statement
              db.Snap.create(snapData) // will need to be an object
                .then(function (dbSnap) {
                  console.log(dbSnap._id);
                  console.log(userId);
                  db.User.findByIdAndUpdate(userId, { $push: { snaps: dbSnap._id } }, { new: true })
                    .then(function (userData) {
                      db.User.findById(userId)
                        .then(userData => {
                          // console.log(userData);
                          let { inProgressHunts } = userData;
                          // console.log(inProgressHunts[0]);
                          let huntData = {};
                          inProgressHunts.forEach(element => {
                            // console.log(element._id);
                            // console.log(huntId);
                            if (element._id == huntId) {
                              console.log("This is it: " + element._id);
                              console.log(element.keywords);
                              // set the matched keyword to true...
                              element.keywords[keyword] = true;
                              huntData = {
                                _id: huntId,
                                huntName: element.huntName,
                                keywords: element.keywords
                              }
                            }
                          })

                          db.User.findOneAndUpdate({ _id: userId, "inProgressHunts._id": huntId }, { $set: { "inProgressHunts.$.keywords": huntData.keywords } }, { new: true })
                            .then(userData2 => {
                              // console.log(userData.data);
                              if (userData2.data != null && userData2.data.errmsg == null) {
                                console.log(userData2.data);
                                // const { _id, huntName, location, keywords, user } = userData.data;
                              }
                            })
                            .catch(err => console.log(err));
                        })
                    })
                })
                .then(dbModel => res.json(dbModel))
                .catch(err => res.status(422).json(err));
            }
            else {
              res.json({ "err": "The snap doesn't match the keyword." })
            }
          });
      },
      function (err) {
        console.log('there was an error');
      }
    );
  },
  update: function (req, res) {
    db.Snap
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function (req, res) {
    db.Snap
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
