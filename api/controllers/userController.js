const asyncHandler = require('express-async-handler')

const User = require('../models/user')
const Image = require('../models/image')

exports.searchBar = asyncHandler(async(req, res, next) => {
  try{
     const searchedUsers = await User.find({ username: { $regex: `^${req.body.searchQuery}`, $options: 'i' } });

      if (!searchedUsers) {
        return res.status(404).json({ error: 'No Users Found' });
    }

    res.json(searchedUsers)
  } catch(err){
    console.log(err)
    res.status(500).json({error: 'Server Error.'})
  }})


exports.editUsername = asyncHandler(async(req, res, next) => {
  try{
    const userId = req.params.userId;
    const newUsername = req.body.newUsername;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username: newUsername },
      {
         new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(updatedUser);
  } catch(err){
    console.log(err)
    res.status(500).json({error: 'Server Error.'})
  }
})



exports.editDescription = asyncHandler(async(req, res, next) => {
  try{
    const userId = req.params.userId;
    const newDescription = req.body.newDescription;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { description: newDescription },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(updatedUser);
  } catch(err){
    console.log(err)
    res.status(500).json({error: 'Server Error.'})
  }
})


exports.setProfilePic = asyncHandler(async(req, res, next) => {
  try {
    const image = new Image({
        name: req.file.originalname,
        image: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
        },
    });

    const userId = req.params.userId;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: image },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    await image.save()
    res.json(image._id)

  } catch(err){
    console.log(err)
    res.status(500).json({error: 'Server Error.'})
  } 
})


exports.getProfilePic = asyncHandler(async(req, res, next) => {
  try {
    const { picId } = req.params;

    const image = await Image.findById(picId);

    if (!image || !image.image.data) {
      return res.status(404).json({ error: 'Profile picture not found.' });
    }

    res.contentType(image.image.contentType);

    res.send(image.image.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while retrieving profile picture.' });
  }
});