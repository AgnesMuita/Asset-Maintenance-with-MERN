import { client } from "@/services/axiosClient";
import { useAuthStore } from "@/stores/auth.store";
import { RowSelectionState } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

const HandleRefresh = async ({
	setData,
	setRowSelection,
}: {
	setData: React.Dispatch<React.SetStateAction<ICaseProps[]>>;
	setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
}) => {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");

	if (isLoggedIn) {
		if (
			currentUser.role === "TECHNICIAN" ||
			currentUser.role === "ADMIN" ||
			currentUser.role === "SUPER_ADMIN" ||
			currentUser.role === "DEVELOPER"
		) {
			try {
				const res = await client.get(
					"http://localhost:8800/api/v1/cases"
				);
				setData(res.data);
			} catch (error) {
				console.log(error);
			}
		} else {
			// fetch user cases
			try {
				const res = await client.get(
					`http://localhost:8800/api/v1/cases/user/${currentUser.id}`
				);
				setData(res.data);
			} catch (error) {
				console.log(error);
			}
		}
		setRowSelection({});
	} else {
		navigate("/signin");
	}
};

export default HandleRefresh;
