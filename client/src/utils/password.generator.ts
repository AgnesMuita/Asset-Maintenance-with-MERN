export const generatePassword = ({
	length = 12,
	useUpperCase = true,
	useLowerCase = true,
	useNumbers = true,
	useSymbols = true,
}) => {
	let charset = "";

	if (useUpperCase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	if (useLowerCase) charset += "abcdefghijklmnopqrstuvwxyz";
	if (useNumbers) charset += "0123456789";
	if (useSymbols) charset += "!@#$%^&*()[]{}-=/|;:~`?,.";

	let password = "";
	for (let i = 0; i < length; i++) {
		password += charset.charAt(Math.floor(Math.random() * charset.length));
	}

	return password;
};