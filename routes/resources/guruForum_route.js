const express = require("express");
const _ = require("lodash");
const router = express.Router();
const auth = require("../../middleware/auth");
// const guru = require("../../middleware/guru");
const validate = require("../../middleware/validate");
const {
  GuruForumPost,
  validateGuruForumPost,
} = require("../../models/resources/guruForumPost_model");
const {User} = require("../../models/user")


router.get("/post/:id",[auth], async (req, res) => {
    // console.log(req.user._id)
    const post = await GuruForumPost.findById(req.params.id);
    if (!post) return res.status(404).send("Forum Post does not exist...");

    let userId = post.user
    let user = await User.findById(userId)

    post.user = _.pick(user, ["_id", "image", "firstName", "lastName", "isUser", "isGuru", "isAdmin"])
    res.send(post);
});

router.get("/getAllPosts/:id",[auth], async (req, res) => {
    // console.log(req.user._id)
    let posts = await GuruForumPost.find({guru: req.params.id});
    if(posts.length === 0 ) return res.send([])

    if(req.query.limit){
        if(posts.length >= parseInt(req.query.limit)){
            posts.sort((post, nPost) => post.views - nPost.views)
            let l = 0
            let tempPosts = []
            while(l < parseInt(req.query.limit)){
                tempPosts.push(posts[l])
                l = l+1
            }
            posts = tempPosts
        }
    }

    let userIds = posts.map((post) => post.user)
    let users = await User.find({_id : {$in : userIds}})

    users = users.map((user) => ({_id : user._id, image : user.image, firstName : user.firstName, lastName : user.lastName, isUser : user.isUser, isGuru : user.isGuru, isAdmin : user.isAdmin}))
    posts.forEach((post, i) =>{
        users.forEach((user) =>{
            if(user._id.toString() === post.user.toString()) {
                posts[i].user = user
            }
        })
    })

    posts.sort((post, nPost) => nPost.createdDate - post.createdDate)
    res.send(posts);
});


router.post("/:id", [auth, validate(validateGuruForumPost)], async (req, res) => {
    let forumPost = GuruForumPost(_.pick(req.body, ["title","body","createdDate","user","guru","likes","views","comments"]));
    
    try {
        forumPost = await forumPost.save();
        res.send({ ..._.pick(forumPost, ["_id", "title"]) });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.put("/post",[auth], async (req, res) => {
    
    const postId = req.body._id
    const userId = req.user._id
    
    let post = await GuruForumPost.findById(postId);
    if (!post) return res.status(404).send("Forum Post does not exist...");
    if(post.user !== userId) return res.status(401).send("You do not have permission to delete.");

    let postupdate = {
        body : req.body.body,
        title : req.body.title
    }

    try{
        post = await GuruForumPost.findByIdAndUpdate(postId, postupdate, {new : true})
        res.send(post)
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.put("/post/incrementViews/:id",[auth], async (req, res) => {
    // console.log(req.user._id)
    let post = await GuruForumPost.findById(req.params.id);
    if (!post) return res.status(404).send("Forum Post does not exist...");
    
    try{
        post = await GuruForumPost.findByIdAndUpdate(post._id, {$set: {views : post.views+1}}, {new : true})
        res.send(post)
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.put("/post/incrementComments/:id",[auth], async (req, res) => {
    // console.log(req.user._id)
    let post = await GuruForumPost.findById(req.params.id);
    if (!post) return res.status(404).send("Forum Post does not exist...");

    try{
        post = await GuruForumPost.findByIdAndUpdate(post._id, {$set: {comments : post.comments+1}}, {new : true})
        res.send(post)
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.put("/post/toggleLike",[auth], async (req, res) => {
    // console.log(req.user._id)
    const postId = req.body.postId
    const userId = req.body.userId
    const likeState = req.body.likeState
    
    if(!postId || !userId) return res.status(404).send("Please provide post Id and user Id...");
    
    let post = await GuruForumPost.findById(postId);
    if (!post) return res.status(404).send("Forum Post does not exist...");
    
    let likes = post.likes
    likes = likes.filter((user) => user !== userId)
    
    if(likeState){
        likes.push(userId)
    }
    
    try{
        post = await GuruForumPost.findByIdAndUpdate(post._id, {$set: {likes}}, {new : true})
        res.send(post)
    } catch (error) {
        res.status(400).send(error.message);
    }
});


router.delete("/post/:id", [auth] , async (req, res) => {
    let post = await GuruForumPost.findById(req.params.id);
    if (!post) return res.status(404).send("Forum Post does not exist...");
    if(post.user !== req.user._id) return res.status(401).send("You do not have permission to delete.");

    try{
        await GuruForumPost.findByIdAndDelete(post._id)
        res.send()
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
