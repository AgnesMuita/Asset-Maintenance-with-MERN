export const generateUniqueCaseNumber = () => {
	// Get the current date and time
	const currentDate = new Date();

	// Extract relevant date and time components
	const month = (currentDate.getMonth() + 1).toString(); // Months are zero-indexed
	const day = currentDate.getDate().toString();
	const microsecs = currentDate.getMilliseconds().toString().padStart(3, "0");

	let randomString = "";
	let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";

	for (let i = 0; i < 6; i++) {
		randomString += characters.charAt(
			Math.floor(Math.random() * characters.length)
		);
	}

	// Combine components to create a unique case number
	const uniqueCaseNumber = "CAS-".concat(
		`${day}${month}${microsecs}-${randomString}`
	);

	return uniqueCaseNumber;
};
