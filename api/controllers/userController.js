const asyncHandler = require('express-async-handler')

const User = require('../models/user')

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
  
})