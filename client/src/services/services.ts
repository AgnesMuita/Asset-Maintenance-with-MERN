import { client } from "./axiosClient";

export const register = ({
	firstName,
	lastName,
	password,
	email,
	phone,
	department,
	jobTitle,
	contactMethod,
	role,
}: IUserProps): Promise<any> => {
	return client.post(
		"http://localhost:8800/api/v1/auth/register",
		{
			firstName,
			lastName,
			password,
			email,
			phone,
			department,
			jobTitle,
			contactMethod,
			role,
		},
		{ authorization: false }
	);
};

export const login = ({
	email,
	password,
}: {
	email: string;
	password: string;
}): Promise<any> => {
	return client.post(
		"http://localhost:8800/api/v1/auth/login",
		{ email, password },
		{ authorization: false }
	);
};
