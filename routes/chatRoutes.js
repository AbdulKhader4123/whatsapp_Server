const router = require('express').Router();
const ChatController = require('../controllers/ChatController')


router.get('/getmessages', ChatController.getMessages)
router.get('/getgroups', ChatController.getGroupDetails)
router.get('/getContacts', ChatController.getContacts)
router.post('/updateRead', ChatController.updateRead)
router.post('/createGroup', ChatController.createGroup)
router.post('/getUserGroupIds', ChatController.getUserGroupIds)



module.exports = ChatRouter = router