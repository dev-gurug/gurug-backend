const express = require("express");
const _ = require("lodash");
const router = express.Router();
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const validate = require("../../middleware/validate");
const { Gyan, validateGyan } = require("../../models/resources/gyan_model");

router.get("/recommended", async (req, res) => {
  let gyan;

  const getRandom = (array, numberOfItems) => {
    let returnArray = [];
    const getIndex = (reducedArray) => {
      if (returnArray.length === numberOfItems) return returnArray;
      let Index = Math.floor(Math.random() * reducedArray.length);
      returnArray.push(reducedArray[Index]);
      return getIndex(reducedArray.filter((arr, i) => i !== Index));
    };
    return getIndex(array);
  };

  const getByTags = async (gyan) => {
    if (!gyan.tags) return [];
    let query = [{ _id: { $ne: gyan._id } }, { tags: { $in: gyan.tags } }]
    let byTags = await Gyan.find({ $and: query });
    if (!byTags) return [];
    if (byTags.length <= 0) return [];
    console.log("2")
    return byTags;
  };

  const getByMedia = async (gyan) => {
    if (!gyan.mediaType) return [];
    let query = [{ _id: { $ne: gyan._id } }, { mediaType: gyan.mediaType }]
    let byMedia = await Gyan.find({ $and: query });
    if (!byMedia) return [];
    if (byMedia.length <= 0) return [];
    return byMedia;
  };

  let currentGyan;
  let allFound = [];

  let query;
  if (req.query.currentGyan) {
    query = { _id: { $ne: req.query.currentGyan } };
    currentGyan = await Gyan.findById(req.query.currentGyan);
    if (!currentGyan) return res.status(404).send("Gyan does not exist...");
  }


  let byTags = await getByTags(currentGyan);
  if (byTags.length >= 3) return res.send([byTags[0], byTags[1], byTags[2]]);
  console.log(1)
  let byMedia = await getByMedia(currentGyan);
  allFound = [...byTags, ...byMedia];
  if (allFound.length >= 3) return res.send([allFound[0], allFound[1], allFound[2]]);
  console.log(3)

  gyan = await Gyan.find(query);
  if (!gyan) {
    if (allFound.length === 0) return res.status(404).send("Gyan does not exist...");
    return res.send(allFound);
  }
  console.log(4)
  let recommended = getRandom(gyan, 3);
  allFound = [...allFound, ...recommended];
  if (allFound.length < 3) return res.send(allFound);
  console.log(5)
  return res.send([allFound[0], allFound[1], allFound[2]]);

});

router.get("/:id", async (req, res) => {
  const gyan = await Gyan.findById(req.params.id);
  if (!gyan) return res.status(404).send("Gyan does not exist...");
  res.send(gyan);
});

router.get("/", async (req, res) => {
  let gyan;
  if (req.query.search) {
    let tags = req.query.search.split(" ");
    tags = tags.map((tag) => tag.trim());
    // let query = tags.map((tag) => ({"title" : {$regex : tag}}))
    let query = tags.map((tag) => ({ title: new RegExp(tag, "i") }));
    query.push({ tags: { $in: tags } });

    gyan = await Gyan.find({ $or: query });
    if (!gyan) return res.status(404).send("Gyan does not exist...");
  } else {
    gyan = await Gyan.find();
    if (!gyan) return res.status(404).send("Gyan does not exist...");
  }
  res.send(gyan);
});

router.post("/", [auth, validate(validateGyan)], async (req, res) => {
  let gyan = Gyan(
    _.pick(req.body, [
      "title",
      "tags",
      "body",
      "mediaLink",
      "mediaType",
      "image",
      "createdDate",
    ])
  );

  try {
    gyan = await gyan.save();
    res.send({ ..._.pick(gyan, ["_id", "title"]) });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;

// User.find( { $or:[ {'_id':objId}, {'name':param}, {'nickname':param} ]},
//   function(err,docs){
//     if(!err) res.send(docs);
// });

// PersonModel.find({favouriteFoods: {"$in": ["sushi", "hotdog"]}})
