const express = require("express");
const _ = require("lodash");
const router = express.Router();
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const validate = require("../../middleware/validate");
const { Gyan, validateGyan } = require("../../models/resources/gyan_model");
const subAdmin = require("../../middleware/subAdmin");
const adminSubAdmin = require("../../middleware/adminSubAdmin");

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
    let query = [
      { _id: { $ne: gyan._id } },
      { tags: { $in: gyan.tags } },
      { disabled: { $ne: true } },
    ];
    let byTags = await Gyan.find({ $and: query });
    if (!byTags) return [];
    if (byTags.length <= 0) return [];
    console.log("2");
    return byTags;
  };

  const getByMedia = async (gyan) => {
    if (!gyan.mediaType) return [];
    let query = [
      { _id: { $ne: gyan._id } },
      { mediaType: gyan.mediaType },
      { disabled: { $ne: true } },
    ];
    let byMedia = await Gyan.find({ $and: query });
    if (!byMedia) return [];
    if (byMedia.length <= 0) return [];
    return byMedia;
  };

  let currentGyan;
  let allFound = [];

  let query = {};
  if (req.query.currentGyan) {
    query = { _id: { $ne: req.query.currentGyan } };
    currentGyan = await Gyan.findById(req.query.currentGyan);
    if (!currentGyan) return res.status(404).send("Gyan does not exist...");
  }

  let byTags = await getByTags(currentGyan);
  if (byTags.length >= 3) return res.send([byTags[0], byTags[1], byTags[2]]);
  console.log(1);
  let byMedia = await getByMedia(currentGyan);
  allFound = [...byTags, ...byMedia];
  if (allFound.length >= 3)
    return res.send([allFound[0], allFound[1], allFound[2]]);
  console.log(3);

  gyan = await Gyan.find({ $and: [query, { disabled: { $ne: true } }] });
  if (!gyan) {
    if (allFound.length === 0)
      return res.status(404).send("Gyan does not exist...");
    return res.send(allFound);
  }
  console.log(4);
  let recommended = getRandom(gyan, 3);
  allFound = [...allFound, ...recommended];
  if (allFound.length < 3) return res.send(allFound);
  console.log(5);
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
  gyan = gyan.filter((v) => !v.disabled);
  if (gyan.length === 0) return res.status(404).send("Gyan does not exist...");
  res.send(gyan);
});

router.get("/pending", [auth, subAdmin], async (req, res) => {
  let gyan;
  // gyan = await Gyan.find({ adminId: req.user._id });
  if (!gyan) return res.status(404).send("Gyan does not exist...");
  gyan = gyan.filter((g) => g.disabled);
  if (gyan.length === 0) return res.status(404).send("Gyan does not exist...");
  res.send(gyan);
});

router.post("/", [auth, validate(validateGyan)], async (req, res) => {
  if (req.user.isSubAdmin) req.body.disabled = true;
  let gyan = Gyan(
    _.pick(req.body, [
      "title",
      "tags",
      "body",
      "mediaLink",
      "mediaType",
      "image",
      "createdDate",
      "disabled",
      "adminId",
    ])
  );
  try {
    gyan = await gyan.save();
    res.send({ ..._.pick(gyan, ["_id", "title"]) });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/enable/:id", [auth, admin], async (req, res) => {
  try {
    const gyan = await Gyan.findByIdAndUpdate(
      req.params.id,
      { diabled: false },
      { new: true, useFindAndModify: false, strict: false }
    );
    res.send({ ..._.pick(gyan, ["_id", "title"]) });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete("/:id", [auth, adminSubAdmin], async (req, res) => {
  try {
    const gyan = await Gyan.findByIdAndDelete(req.params.id, {
      new: false,
      useFindAndModify: false,
      strict: false,
    });
    if (!gyan) return res.status(404).send("Gyan does not exist...");
    res.status(200).send();
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
