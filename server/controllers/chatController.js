const Chat = require("../models/chatModel");
const Message = require("../models/message");
const User = require("../models/userModel");

// ✅ Get all chats of a user (For Chat List)
const getUserChats = async (req, res) => {
  try {
    const userId = req.params.userid;

    const chats = await Chat.find({ members: userId })
      .populate("members", "name email")
      .populate({
        path: "lastMessage",
        select: "message seen timestamp",
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, chats });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching chats", error });
  }
};

// ✅ Get messages in a chat
const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chatId }).sort({ timestamp: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching messages", error });
  }
};

// ✅ Start or Get Chat
const startChat = async (req, res) => {
  try {
    const { sender, receiver } = req.body;

    let chat = await Chat.findOne({ members: { $all: [sender, receiver] } });

    if (!chat) {
      chat = new Chat({ members: [sender, receiver] });
      await chat.save();
    }

    res.status(200).json({ success: true, chat });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error starting chat", error });
  }
};

// ✅ Send a message
const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    let chat = await Chat.findOne({ members: { $all: [sender, receiver] } });

    if (!chat) {
      chat = new Chat({ members: [sender, receiver] });
      await chat.save();
    }

    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();

    chat.lastMessage = newMessage._id;
    await chat.save();

    res
      .status(201)
      .json({ success: true, message: "Message sent", newMessage });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error sending message", error });
  }
};

// ✅ Mark messages as read
const markMessagesAsRead = async (req, res) => {
  try {
    const { sender, receiver } = req.body;
    await Message.updateMany({ sender, receiver, seen: false }, { seen: true });

    res.status(200).json({ success: true, message: "Messages marked as read" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating messages", error });
  }
};

module.exports = {
  getUserChats,
  getMessages,
  startChat,
  sendMessage,
  markMessagesAsRead,
};
