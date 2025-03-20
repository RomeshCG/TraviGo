const express = require('express');
const router = express.Router();

//Test route
router.get('/test', (req,res)=>{
    res.json({message:'Backend is working!'});
})

module.exports = router;