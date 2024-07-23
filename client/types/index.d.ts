declare interface IUserProps {
	id: string;
	firstName: string;
	lastName: string;
	fullName: string;
	password: string;
	avatar: string;
	email: string;
	phone: string;
	jobTitle: string;
	department: string;
	contactMethod: string;
	active: boolean;
	role: string;
	createdAt: string;
	updatedAt: string;
	cases: ICaseProps[];
	assets: IAssetProps[];
	history: IAssetHistoryProps[];
	announcements: IAnnouncementProps[];
	events: IEventProps[];
	news: INewsProps[];
	maintenancLogs: IMaintenanceLogProps[];
	knowledgeArticles: IKnowledgeArticleProps[];
	conversations: IConversationProps[];
}

declare interface ICaseProps {
	id: string;
	caseTitle: string;
	caseNumber: string;
	subject: string;
	priority: string;
	status: string;
	currStatus: string;
	origin: string;
	Description: string;
	resolution: string;
	resolType: string;
	resolved: boolean;
	cancelled: boolean;
	technician: string;
	createdAt: string;
	updatedAt: string;
	owner: IUserProps;
	asset: IAssetProps;
	conversation: IConversationProps;
}

declare interface IConversationProps {
	id: string;
	messages: IMessageProps[];
	createdAt: string;
	updatedAt: string;
	creator: IUserProps;
	case: ICaseProps;
}

declare interface IMessageProps {
	id: string;
	content: string;
	createdAt: string;
	sender: IUserProps;
	converstation: IConversationProps;
}

declare interface IMediaProps {
	id: string;
	articleId: string;
	data: string;
	fileMeta: IFileMeta[];
	createdOn: string;
}

declare interface ITagProps {
	id: string;
	text: string;
}

declare interface IKnowledgeArticleProps {
	id: string;
	title: string;
	articlePublicNo: string;
	articleSubject: string;
	stage: string;
	status: string;
	description: string;
	content: string;
	visibility: string;
	keywords: ITagProps[];
	media: IMediaProps[];
	majorVNo: number;
	minorVNo: number;
	views: number;
	language: string;
	reviewStatus: string;
	published: boolean;
	draft: boolean;
	approved: boolean;
	publishSubject: string;
	createdAt: string;
	modifiedAt: string;
	expirationDate: date;
	publishedOn: string;
	owner: IUserProps;
	modifier: IUserProps;
	relatedArticle: IKnowledgeArticleProps;
}

declare interface IAssetHistoryProps {
	id: string;
	assetLocation: string;
	assetConditionalNotes: string;
	assetCondtion: string;
	assetStatus: string;
	issuedAt: string;
	issuedBy: IUserProps;
	user: IUserProps;
	asset: IAssetProps;
	allocationForm: IAllocationFormProps;
}

declare interface IAssetProps {
	id: string;
	tag: string;
	name: string;
	deviceName: string;
	color: string;
	category: string;
	manufacturer: string;
	model: string;
	serialNo: string;
	ports: string;
	location: string;
	issuedBy: string;
	accessories: string;
	batterySNo: string;
	adaptorRatings: string;
	department: string;
	condition: string;
	assetStatus: string;
	active: boolean;
	specification: string;
	conditionalNotes: string;
	createdAt: string;
	updatedAt: string;
	issuedAt: string;
	user: IUserProps;
	cases: ICaseProps[];
	maintenanceLogs: IMaintenanceLogProps[];
	history: IAssetHistoryProps[];
	allocationForms: IAllocationFormProps[];
}

declare interface IEventProps {
	id: string;
	title: string;
	description: string;
	tags: ITagProps[];
	eventDate: Date;
	active: boolean;
	createdAt: string;
	updatedAt: string;
	createdBy: IUserProps;
}

declare interface IMaintenanceLogProps {
	id: string;
	title: string;
	description: string;
	tags: ITagProps[];
	remarks: string;
	createdAt: string;
	performedBy: IUserProps;
	asset: IAssetProps;
}

declare interface INewsProps {
	id: string;
	title: string;
	description: string;
	tags: ITagProps[];
	active: boolean;
	createdAt: string;
	updatedAt: string;
	createdBy: IUserProps;
}

declare interface IAnnouncementProps {
	id: string;
	title: string;
	tags: ITagProps[];
	announcement: string;
	active: boolean;
	severity: string;
	createdAt: string;
	updatedAt: string;
	createdBy: IUserProps;
}

declare interface IFileMeta {
	fileName: string;
	size: number;
	mimeType: string;
}

declare interface IDocumentProps {
	id: string;
	fileMeta: IFileMeta[];
	data: string;
	docType: string;
	docCategory: string;
	department: string;
	createdAt: string;
	updatedAt: string;
	createdBy: IUserProps;
	modifiedBy: IUserProps;
}

declare interface IAllocMeta {
	Author?: string;
	Title?: string;
	Subject?: string;
	Keywords?: string;
	Creator?: string;
	Producer?: string;
	CreationDate?: Date;
	ModDate?: Date;
	PDFFormatVersion?: string;
}

declare interface IAllocationFormProps {
	id: string;
	fileMeta: IAllocMeta[];
	data: string;
	createdAt: string;
	updatedAt: string;
	createdBy: IUserProps;
	modifiedBy: IUserProps;
	relatedAsset: IAssetProps;
}

declare interface ITrashProps {
	id: string;
	createdAt: string;
	trashedArticle: IKnowledgeArticleProps;
	trashedUser: IUserProps;
	trashedAsset: IAssetProps;
	trashedCase: ICaseProps;
	trashedBy: IUserProps;
}

declare interface IHrefProps {
	title: string;
	href: "PROFILE" | "APPEARANCE" | "NOTIFICATIONS";
}
