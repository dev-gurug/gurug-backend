const express = require("express");
const _ = require("lodash");
const router = express.Router();
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const validate = require("../../middleware/validate");
const { Gyan, validateGyan } = require("../../models/resources/gyan_model");
const subAdmin = require("../../middleware/subAdmin");
const adminSubAdmin = require("../../middleware/adminSubAdmin");

const englishId = "6434f70f3d6fb343e525882f";
const hindiId = "6434f73b3d6fb343e5258830";

router.get("/recommended",[auth], async (req, res) => {
  let language = req.user.language;
  let english;
  if (language === englishId) english = true;

  let gyan;

  function getRandomItems(array, count) {
    const copyArray = array.slice();
    const randomItems = []
    while (randomItems.length < count && copyArray.length > 0) {
      const randomIndex = Math.floor(Math.random() * copyArray.length);
      const selectedItem = copyArray.splice(randomIndex, 1)[0];
      const isDuplicate = randomItems.some(item => item._id === selectedItem._id);
      if (!isDuplicate) {
        randomItems.push(selectedItem);
      }
    }
    return randomItems;
  }

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
    if(english) query.push({ language: { $ne: hindiId } })
    let byTags = await Gyan.find({ $and: query });
    if (!byTags) return [];
    if (byTags.length <= 0) return [];
    console.log("2","Length "+byTags.length);
    return byTags;
  };

  const getByMedia = async (gyan) => {
    if (!gyan.mediaType) return [];
    let query = [
      { _id: { $ne: gyan._id } },
      { mediaType: gyan.mediaType },
      { disabled: { $ne: true } },
    ];
    if(english) query.push({ language: { $ne: hindiId } })
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
  if (byTags.length >= 3) return res.send(getRandomItems(byTags, 3));
  console.log(1);
  let byMedia = await getByMedia(currentGyan);
  allFound = [...byTags, ...byMedia];
  if (allFound.length >= 3)
    return res.send(getRandomItems(allFound, 3));
  console.log(3);

  let query1 = [
    query, { disabled: { $ne: true } }
  ]

  if(english) query1.push({ language: { $ne: hindiId }})

  gyan = await Gyan.find({ $and: [query1] });
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
  return res.send(getRandomItems(allFound, 3));
});

router.get("/pending", [auth, subAdmin], async (req, res) => {
  let gyan;
  gyan = await Gyan.find({ adminId: req.user._id });
  if (!gyan) return res.send([]);
  gyan = gyan.filter((g) => g.disabled);
  if (gyan.length === 0) return res.send([]);
  res.send(gyan);
});

router.get("/allPending", [auth, admin], async (req, res) => {
  let gyan;
  gyan = await Gyan.find();
  if (!gyan) return res.send([]);
  gyan = gyan.filter((g) => g.disabled);
  if (gyan.length === 0) return res.send([]);
  res.send(gyan);
});

router.get("/:id", async (req, res) => {
  const gyan = await Gyan.findById(req.params.id);
  if (!gyan) return res.status(404).send("Gyan does not exist...");
  res.send(gyan);
});

router.get("/", [auth],async (req, res) => {
  let language = req.user.language;
  let english;
  if (language === englishId && !req.user.isAdmin) english = true;

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
  if(english) gyan = gyan.filter((g) => g.language !== hindiId)
  gyan = gyan.filter((v) => !v.disabled);
  if (gyan.length === 0) return res.status(404).send("Gyan does not exist...");
  res.send(gyan);
});

router.post("/", [auth, validate(validateGyan)], async (req, res) => {
  if (req.user.isSubAdmin) req.body.disabled = true;
  req.body.adminId = req.user._id.toString()
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
      "language",
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

router.put("/", [auth, admin], async (req, res) => {
  try {
    const gyan = await Gyan.findByIdAndUpdate(
      req.body._id,
      req.body,
      { new: true, useFindAndModify: false, strict: false }
    );
    res.send({ ..._.pick(gyan, ["_id", "title"]) });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/enable/:id", [auth, admin], async (req, res) => {
  try {
    const gyan = await Gyan.findByIdAndUpdate(
      req.params.id,
      { disabled: false },
      { new: true, useFindAndModify: false, strict: false }
    );
    res.send({ ..._.pick(gyan, ["_id", "title"]) });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete("/:id", [auth, adminSubAdmin], async (req, res) => {
  try {
    const gyan = await Gyan.findByIdAndDelete(req.params.id);
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
