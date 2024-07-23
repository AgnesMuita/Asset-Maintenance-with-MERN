// import { admin } from "firebase-admin";

// // Initialize Firebase Admin SDK
// admin.initializeApp({
// 	credential: admin.credential.cert(serviceAccount),
// });

// // Function to send notification
// export function sendNotificationToClients(newCase) {
// 	const message = {
// 		notification: {
// 			title: "A new case has been created.",
// 			body: newCase.caseTitle,
// 		},
// 		topic: "new_case", // Send notification to a specific topic
// 	};

// 	// Send the message
// 	admin
// 		.messaging()
// 		.send(message)
// 		.then((response) => {
// 			console.log("Successfully sent message:", response);
// 		})
// 		.catch((error) => {
// 			console.error("Error sending message:", error);
// 		});
// }
