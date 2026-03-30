import express from "express"
import { createMessage, deleteMessage, getAllMessages, getOneMessage, updateMessageStatus } from "../controller/message.controller"
import { protect } from "../middleware/auth.middleware"

const router = express.Router()

router.get('/', protect, getAllMessages)
router.get('/:id', protect, getOneMessage)

router.post('/', createMessage)
router.patch('/:id', protect, updateMessageStatus)

router.delete('/:id', protect, deleteMessage)

export default router