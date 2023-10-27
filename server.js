import "./firebase-config.js";
import express from "express";
const app = express();
app.use(express.json());

// These registration tokens come from the client FCM SDKs.
app.use(
  "/sendPusNotifications",
  (await import("./routes/sendPushNotifications.js")).default
);

app.listen(4010, () => {
  console.log("server is running on port 4010");
});
