import {
	ArrowDownIcon,
	ArrowRightIcon,
	ArrowUpIcon,
	CheckCircledIcon,
	QuestionMarkCircledIcon,
	StopwatchIcon,
} from "@radix-ui/react-icons";
import {
	AlertCircle,
	Circle,
	CircleEllipsis,
	PauseCircle,
	ShieldAlertIcon,
} from "lucide-react";

export const statuses = [
	{
		value: "OPEN",
		label: "Open",
		icon: Circle,
	},
	{
		value: "IN_PROGRESS",
		label: "In Progress",
		icon: StopwatchIcon,
	},
	{
		value: "ON_HOLD",
		label: "On Hold",
		icon: PauseCircle,
	},
	{
		value: "WAITING_FOR_DETAILS",
		label: "Waiting For Details",
		icon: QuestionMarkCircledIcon,
	},
	{
		value: "RESEARCHING",
		label: "Researching",
		icon: CircleEllipsis,
	},
	{
		value: "PROBLEM_SOLVED",
		label: "Problem Solved",
		icon: CheckCircledIcon,
	},
	{
		value: "INFORMATION_PROVIDED",
		label: "Information Provided",
		icon: AlertCircle,
	},
];

export const priorities = [
	{
		label: "Low",
		value: "LOW",
		icon: ArrowDownIcon,
	},
	{
		label: "Normal",
		value: "NORMAL",
		icon: ArrowRightIcon,
	},
	{
		label: "High",
		value: "HIGH",
		icon: ArrowUpIcon,
	},
	{
		label: "Urgent",
		value: "URGENT",
		icon: ShieldAlertIcon,
	},
];

export const caseTemplates = [
	{
		value: "Hardware",
		label: "Hardware",
	},
	{
		value: "Software",
		label: "Software",
	},
];

export const caseSubjects = [
	{
		value: "Network Issue",
		label: "Network Issue",
	},
	{
		value: "SAP Issue",
		label: "SAP Issue",
	},
	{
		value: "Email Issue",
		label: "Email Issue",
	},
	{
		value: "Printer Issue",
		label: "Printer Issue",
	},
	{
		value: "Hardware Issue",
		label: "Hardware Issue",
	},
];

export const softwares = [
	{
		value: "Outlook",
		label: "Outlook",
	},
	{
		value: "SAP",
		label: "SAP",
	},
	{
		value: "Microsoft Excel",
		label: "Microsoft Excel",
	},
	{
		value: "Microsoft Word",
		label: "Microsoft Word",
	},
	{
		value: "Microsoft Powerpoint",
		label: "Microsoft Powerpoint",
	},
	{
		value: "Google Chrome",
		label: "Google Chrome",
	},
	{
		value: "Microsoft Edge",
		label: "Microsoft Edge",
	},
	{
		value: "Anydesk",
		label: "Anydesk",
	},
	{
		value: "Printer Drivers",
		label: "Printer Drivers",
	},
];

export const hardwares = [
	{
		value: "Monitor",
		label: "Monitor",
	},
	{
		value: "System Unit",
		label: "System Unit",
	},
	{
		value: "Keyboard",
		label: "Keyboard",
	},
	{
		value: "Mouse",
		label: "Mouse",
	},
	{
		value: "Laptop",
		label: "Laptop",
	},
	{
		value: "Kyocera Printer",
		label: "Kyocera Printer",
	},
	{
		value: "Epson Dot Matrix Printer",
		label: "Epson Dot Matrix Printer",
	},
	{
		value: "Extension Phone",
		label: "Extension Phone",
	},
	{
		value: "Router",
		label: "Router",
	},
	{
		value: "Network Switch",
		label: "Network Switch",
	},
	{
		value: "Access Point",
		label: "Access Point",
	},
];

export const colors = [
	"Red",
	"Silver",
	"Black",
	"Grey",
	"White",
	"Piano Black",
	"Two tone",
	"Cream",
	"Dark Grey",
];
export const locations = [
	{
		label: "Finance",
		value: "Finance",
	},
	{
		label: "ICT",
		value: "ICT",
	},
	{
		label: "Production",
		value: "Production",
	},
	{
		label: "HR",
		value: "HR",
	},
	{
		label: "Dispatch",
		value: "Dispatch",
	},
	{
		label: "Loading",
		value: "Loading",
	},
	{
		label: "Quality Assurance",
		value: "Quality Assurance",
	},
	{
		label: "Server Room",
		value: "Server Room",
	},
];

export const categories = [
	{
		value: "Buildings",
		label: "Buildings",
	},
	{
		value: "Computer",
		label: "Computer & Equipments",
	},
	{
		value: "Equipment",
		label: "Office & Equipments",
	},
	{
		value: "Furniture",
		label: "Furniture & Fittings",
	},
	{ value: "Land", label: "Land" },
	{
		value: "MotorVehicle",
		label: "Motor Vehicle",
	},
	{
		value: "Plant",
		label: "Plant,Machinery & Equipment",
	},
	{
		value: "Software",
		label: "Software",
	},
];

export const manufacturers = [
	"HP",
	"Lenovo",
	"Acer",
	"Asus",
	"Dell",
	"Apple",
	"Mikrotik International",
	"Ubiquiti Inc.",
	"Cisco",
	"Toshiba",
	"Sophos",
	"D-Link",
	"TP-Link",
	"Safaricom",
	"Western Digital",
];

export const ROLES = [
	{
		label: "Basic",
		value: "BASIC",
	},
	{
		label: "T1",
		value: "T1",
	},
	{
		label: "T2",
		value: "T2",
	},
	{
		label: "Technician",
		value: "TECHNICIAN",
	},
	{
		label: "Administrator",
		value: "ADMIN",
	},
	{
		label: "Super Admin",
		value: "SUPER_ADMIN",
	},
	{
		label: "Developer",
		value: "DEVELOPER",
	},
];

export const DEPARTMENTS = [
	{
		label: "Global",
		value: "GLOBAL",
	},
	{
		label: "Personal",
		value: "PERSONAL",
	},
	{
		label: "Administration",
		value: "ADMINISTRATION",
	},
	{
		label: "Plant",
		value: "PLANT",
	},
	{
		label: "Logistics",
		value: "LOGISTICS",
	},
	{
		label: "Sales",
		value: "SALES",
	},
];

export const CONTACT_METHOD = ["Email", "Phone"];

export const Resolution_Types = [
	"Problem Solved",
	"Information Provided",
	"Out of Scope",
];
export const Cancel_Types = ["CANCELLED", "MERGED", "RESOLVED", "DUPLICATE"];

export const modules = {
	toolbar: [
		[{ header: "1" }, { header: "2" }, { font: [] }],
		[{ size: [] }],
		["bold", "italic", "underline", "strike", "blockquote", "direction"],
		[
			{ list: "ordered" },
			{ list: "bullet" },
			{ indent: "-1" },
			{ indent: "+1" },
		],
		["color", "background"],
		[{ script: "sub" }, { script: "super" }],
		["link", "image", "video"],
		["code", "code-block"],
		["clean"],
	],
	clipboard: {
		// toggle to add extra line breaks when pasting HTML:
		matchVisual: false,
	},
};

export const modules_light = {
	toolbar: [
		[{ header: "1" }, { header: "2" }, { font: [] }],
		[{ size: [] }],
		["bold", "italic", "blockquote"],
		[{ list: "ordered" }, { list: "bullet" }],
		["link"],
	],
	clipboard: {
		// toggle to add extra line breaks when pasting HTML:
		matchVisual: false,
	},
};

export const formats = [
	"header",
	"font",
	"size",
	"bold",
	"italic",
	"underline",
	"strike",
	"blockquote",
	"direction",
	"list",
	"bullet",
	"indent",
	"align",
	"link",
	"color",
	"background",
	"script",
	"code",
	"code-block",
	"image",
	"video",
];

export const formats_light = [
	"header",
	"font",
	"size",
	"bold",
	"italic",
	"blockquote",
	"list",
	"bullet",
	"link",
];

export const publishSubject = [
	{
		label: "General",
		value: "General",
	},
	{
		label: "Suggestions",
		value: "Suggestions",
	},
	{
		label: "Unexpected shutdown",
		value: "Unexpected shutdown",
	},
	{
		label: "ICT Hardware",
		value: "ICT Hardware",
	},
	{
		label: "Computer Software",
		value: "Computer Software",
	},
	{
		label: "Troubleshooting",
		value: "Troubleshooting",
	},
];

export const articleStatus = [
	{
		label: "Published",
		value: "Published",
	},
	{
		label: "Needs Review",
		value: "Needs Review",
	},
	{
		label: "Updating",
		value: "Updating",
	},
	{
		label: "In Review",
		value: "In Review",
	},
	{
		label: "Proposed",
		value: "Proposed",
	},
	{
		label: "Draft",
		value: "Draft",
	},
];

export const articleStages = [
	{ label: "Approval", value: "Approval" },
	{ label: "Review", value: "Review" },
	{ label: "Published", value: "Published" },
];

export const visibilities = ["INTERNAL", "EXTERNAL"];

export const docTypes = [
	{
		label: "Policy",
		value: "Policy",
	},
	{
		label: "SOP",
		value: "SOP",
	},
	{
		label: "Form",
		value: "Form",
	},
	{
		label: "General",
		value: "General",
	},
	{
		label: "Template",
		value: "Template",
	},
];

export const docCategories = [
	{
		label: "Application Forms",
		value: "Application Forms",
	},
	{
		label: "Legal",
		value: "Legal",
	},
	{
		label: "General",
		value: "General",
	},
];

export const assetTemplates = [
	{
		label: "ICT",
		value: "ICT",
	},
	{
		label: "General",
		value: "General",
	},
];

export const assetStatus = [
	{
		label: "New",
		value: "New",
	},
	{
		label: "Reallocated",
		value: "Reallocated",
	},
];

export const assetConditions = [
	{ label: "Broken", value: "Broken" },
	{ label: "Fair", value: "Fair" },
	{ label: "Faulty", value: "Faulty" },
	{ label: "Good", value: "Good" },
	{ label: "Junk", value: "Junk" },
	{ label: "Obsolete", value: "Obsolete" },
	{ label: "Wornout", value: "Wornout" },
	{ label: "Very Good", value: "Very Good" },
	{ label: "Wornout Fabric", value: "Wornout Fabric" },
];

export const messageTypeList = [
	{ type: "text" },
	{ type: "location" },
	{ type: "photo" },
	{ type: "video" },
	{ type: "meeting" },
	{ type: "system" },
	{ type: "file" },
	{ type: "meetingLink" },
	{ type: "audio" },
	{ type: "spotify" },
];

export const logType = [
	{
		label: "Quarterly Maintenance Schedule",
		value: "Quarterly Maintenance Schedule",
	},
	{
		label: "Annual Maintenance Schedule",
		value: "Annual Maintenance Schedule",
	},
	{
		label: "Weekly Maintenance Schedule",
		value: "Weekly Maintenance Schedule",
	},
	{
		label: "Impromptu Maintenance Schedule",
		value: "Impromptu Maintenance Schedule",
	},
];
