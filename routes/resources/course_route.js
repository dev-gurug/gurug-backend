const express = require("express");
const _ = require("lodash");
const router = express.Router();
const auth = require("../../middleware/auth");
const guru = require("../../middleware/guru");
const validate = require("../../middleware/validate");
const {
  Course,
  validateCourse,
} = require("../../models/resources/course_model");
const {
  CourseProgress,
  validateCourseProgress,
} = require("../../models/resources/courseProgress_model");

const englishId = "6434f70f3d6fb343e525882f";
const hindiId = "6434f73b3d6fb343e5258830";

router.get("/", [auth],async (req, res) => {
  let language = req.user.language;
  let english;
  if (language === englishId) english = true;

  let course;
  if(english){
    course = await Course.find({language : {$ne : hindiId}});
  }else{
    course = await Course.find();
  }

  if (!course) return res.status(404).send("Course does not exist...");
  res.send(course);
});

//   router.get("/user", [auth],async (req, res) => {
//     console.log(req.user._id)
//     const post = await Posts.find({user : req.user._id});
//     if (!post) return res.status(404).send("Posts do not exist...");
//     res.send(post);
//   });

router.get("/find", [auth], async (req, res) => {
  let language = req.user.language;
  let english;
  if (language === englishId) english = true;

  let course;
  if (req.query.search) {
    let tags = req.query.search.split(" ");
    tags = tags.map((tag) => tag.trim());
    // let query = tags.map((tag) => ({"title" : {$regex : tag}}))
    let query = tags.map((tag) => ({ title: new RegExp(tag, "i") }));
    query.push({ tags: { $in: tags } });

    course = await Course.find({ $or: query });
    if(english) course = course.filter((c) => c.language !== hindiId)
    if (!course) return res.status(404).send("Course does not exist...");
  } else {
    if(english){
      course = await Course.find({language : {$ne : hindiId}});
    }else{
      course = await Course.find();
    }
    if (!course) return res.status(404).send("Course does not exist...");
  }
  res.send(course);
});

router.get("/guru/:id", [auth], async (req, res) => {
  console.log(req.params.id);
  const courses = await Course.find({ user: req.params.id });
  if (!courses) return res.status(404).send("Courses do not exist...");
  res.send(courses);
});

router.get("/myCourses", [auth], async (req, res) => {
  const allProgress = await CourseProgress.find({ user: req.user._id });
  if (!allProgress) return res.status(404).send("No Courses Started...");
  res.send(allProgress);
});

router.get("/user-progress/:id", [auth], async (req, res) => {
  const courses = await CourseProgress.find({
    user: req.user._id,
    courseId: req.params.id,
  });
  if (!courses) return res.status(404).send("Courses do not exist...");
  if (courses.length === 0)
    return res.status(404).send("Courses do not exist...");
  res.send(courses);
});

router.post(
  "/create-progress",
  [auth, validate(validateCourseProgress)],
  async (req, res) => {
    let courseProgress = CourseProgress(
      _.pick(req.body, ["title", "courseId", "progress", "createdDate", "user"])
    );
    console.log("1");
    try {
      courseProgress = await courseProgress.save();
      console.log("2");
      res.send({
        ..._.pick(courseProgress, ["_id", "courseId", "user", "title"]),
      });
      console.log("3");
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

router.get("/:id",[auth], async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).send("Course does not exist...");
  res.send(course);
});

router.post("/", [auth, guru, validate(validateCourse)], async (req, res) => {
  let course = Course(
    _.pick(req.body, [
      "title",
      "duration",
      "requirements",
      "description",
      "tags",
      "modules",
      "image",
      "createdDate",
      "user",
      "language"
    ])
  );

  try {
    course = await course.save();
    res.send({ ..._.pick(course, ["_id", "title"]) });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/", [auth, guru], async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.body._id,
      _.pick(req.body, [
        "title",
        "duration",
        "requirements",
        "description",
        "tags",
        "modules",
        "image",
        "language"
      ]),
      { new: true, useFindAndModify: false, strict: false }
    );
    if (!course) return res.status(404).send("Course does not exist...");
    res.send(course);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete("/:id", [auth], async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).send("Course does not exist...");
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
