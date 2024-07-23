export function resizeImageAsDataURI(
	file: File,
	maxWidth: number,
	maxHeight: number
): Promise<string> {
	return new Promise((resolve, reject) => {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		if (!ctx) {
			reject(new Error("Failed to create canvas context"));
			return;
		}

		const image = new Image();
		image.onload = () => {
			let width = image.width;
			let height = image.height;

			// Calculate new dimensions while preserving aspect ratio
			if (width > maxWidth) {
				height *= maxWidth / width;
				width = maxWidth;
			}
			if (height > maxHeight) {
				width *= maxHeight / height;
				height = maxHeight;
			}

			// Resize the canvas to the new dimensions
			canvas.width = width;
			canvas.height = height;

			// Draw the image onto the canvas with the new dimensions
			ctx.drawImage(image, 0, 0, width, height);

			// Get the resized image as a data URI
			const resizedDataURI = canvas.toDataURL(file.type);

			resolve(resizedDataURI);
		};

		image.onerror = () => {
			reject(new Error("Failed to load image"));
		};

		// Load the image from the File object
		image.src = URL.createObjectURL(file);
	});
}
