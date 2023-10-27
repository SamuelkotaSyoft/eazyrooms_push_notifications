import express from "express";
import UserModal from "../models/userModel.js";

import { getMessaging, getToken } from "firebase/messaging";
import { sendPushNotifications } from "../core/firebase-push.js";
const router = express.Router();

async function sendPushNotificationRequest(req, res) {
  try {
    const { includeAllStaff, staffId, store, notificationData } = req.body;
    let users = [];

    const storeAdmin = await UserModal.findOne({
      stores: { $in: [store._id] },
      role: "storeAdmin",
    });
    users.push(storeAdmin);
    if (includeAllStaff) {
      const staffUsers = await UserModal.find({
        stores: { $in: [store._id] },
        role: "staff",
      });
      users = [...users, ...staffUsers];
    }
    if (staffId) {
      const staffUser = await UserModal.findOne({
        _id: staffId,
        role: "staff",
      });
      users.push(staffUser);
    }
    const registrationTokens = users?.map((user) => user?.token);

    const message = {
      tokens: registrationTokens,
    };
    if (notificationData) {
      message.data = notificationData.data;
      messsage.notification = notificationData.notification;
      message.topic = notificationData.topic;
    }
    if (users?.length > 0) {
      const status = await sendPushNotifications(
        users,
        message,
        registrationTokens
      );
      if (status) {
        res.status(200).send({ status: "success" });
      } else {
        res.status(200).send({ status: "failed" });
      }
    } else {
      res.status(200).send({ status: "failed" });
    }
  } catch (err) {
    res.status(200).json({ status: "failed" });
  }
}
export default router.post("/", sendPushNotificationRequest);
