import * as XLSX from "xlsx";

export const handleExportToExcel = (data: any[], filename: string) => {
	const columns = Object.keys(data[0]);

	const rows = data.map((obj) => columns.map((col) => obj[col]));

	rows.unshift(columns);

	const wb = XLSX.utils.book_new();

	const ws = XLSX.utils.aoa_to_sheet(rows);

	XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

	XLSX.writeFile(wb, filename + ".xlsx");
};
