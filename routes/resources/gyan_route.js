const express = require("express");
const _ = require("lodash");
const router = express.Router();
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const validate = require("../../middleware/validate");
const { Gyan, validateGyan } = require("../../models/resources/gyan_model");

router.get("/:id", async (req, res) => {
  const gyan = await Gyan.findById(req.params.id);
  if (!gyan) return res.status(404).send("Gyan does not exist...");
  res.send(gyan);
});

router.get("/", async (req, res) => {
    let gyan;
  if(req.query.search){
        let tags = req.query.search.split(' ')
        tags = tags.map((tag) => tag.trim())
        // let query = tags.map((tag) => ({"title" : {$regex : tag}}))
        let query = tags.map((tag) => ({"title" : new RegExp(tag, "i")}))
        query.push({tags : {$in : tags}})

        gyan = await Gyan.find({$or : query});
        if (!gyan) return res.status(404).send("Gyan does not exist...");
  }else{
      gyan = await Gyan.find();
      if (!gyan) return res.status(404).send("Gyan does not exist...");
  }
  res.send(gyan);
});

router.post("/", [auth, admin, validate(validateGyan)], async (req, res) => {
  let gyan = Gyan(_.pick(req.body, ["title", "tags", "body","videoLink", "image", "createdDate"]));

  try {
    gyan = await gyan.save();
    res.send({..._.pick(gyan, ["_id","title"])});
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
