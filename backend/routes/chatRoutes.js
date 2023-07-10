const express=require('express');
const {protect} = require("../middleware/authmiddleware");
const {accessChat,fetchchats,creategroupchat, removefromgroup, addtogroup, renamechat} = require('../controllers/chatControllers');
const router=express.Router();

router.route('/').post(protect,accessChat).get(protect,fetchchats);
router.route('/group').post(protect,creategroupchat);
router.route('/rename').put(protect,renamechat)
router.route('/groupadd').put(protect,addtogroup)
router.route('/groupremove').put(protect,removefromgroup)

module.exports=router;