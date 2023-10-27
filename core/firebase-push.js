import { getMessaging, getToken } from "firebase/messaging";
export async function sendPushNotifications(message, registrationTokens) {
  try {
    getMessaging()
      .sendMulticast(message)
      .then((response) => {
        if (response.failureCount > 0) {
          const failedTokens = [];
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              failedTokens.push(registrationTokens[idx]);
            }
          });
          console.log("List of tokens that caused failures: " + failedTokens);
          return false;
        } else {
          return true;
        }
      });
  } catch (err) {}
}
