import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { generateUniqueCaseNumber } from "../src/utils/generateUniqueCaseNumber.js";
import bcrypt from "bcryptjs";
import { createCustomAvatar } from "../src/utils/createCustomAvatar.js";

const prisma = new PrismaClient();
const salt = bcrypt.genSaltSync(12);

export const assetStatus = ["New", "Reallocated"];

export const assetConditions = [
	"Broken",
	"Fair",
	"Faulty",
	"Good",
	"Junk",
	"Obsolete",
	"Wornout",
	"Very Good",
	"Wornout Fabric",
];

async function main() {
	// Cleanuṗ existing users
	await prisma.user.deleteMany({});
	// await prisma.case.deleteMany({});
	// await prisma.knowledgeArticle.deleteMany({});
	// await prisma.activity.deleteMany({});
	// await prisma.asset.deleteMany({});
	// await prisma.queue.deleteMany({});
	// await prisma.user.deleteMany({});

	// create 1000 random users
	const users = Array.from({ length: 2000 }, () => ({
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		password: bcrypt.hashSync(faker.internet.password(), salt),
		avatar: createCustomAvatar(),
		email: faker.internet.email(),
		department: "ADMINISTRATION",
		phone: faker.phone.number(),
		jobTitle: faker.person.jobTitle(),
		contactMethod: faker.person.jobArea(),
	}));

	// for (const user of users) {
	// 	await prisma.user.create({ data: user });
	// }

	// create unique user
	const user = {
		firstName: "Mike",
		lastName: "OxLong",
		password: bcrypt.hashSync("123456789", salt),
		avatar: createCustomAvatar(),
		email: "moxlong@gmail.com",
		department: "ADMINISTRATION",
		phone: "07123456789",
		jobTitle: "Software Engineer",
		contactMethod: "Email",
		role: "DEVELOPER",
	};

	await prisma.user.create({ data: user });

	//create 1000 cases
	const cases = Array.from({ length: 1000 }, () => ({
		caseTitle: faker.lorem.sentence(5),
		caseNumber: generateUniqueCaseNumber(),
		subject: faker.lorem.text(),
		Description: faker.lorem.paragraphs(),
		technician: faker.person.fullName(),
	}));

	// for (const caseX of cases) {
	// 	await prisma.case.create({ data: caseX });
	// }

	//create 1000 knowledge articles
	const karticles = Array.from({ length: 1000 }, () => ({
		title: faker.lorem.sentence(5),
		status: "Published",
		description: faker.lorem.paragraph(),
		content: faker.lorem.paragraphs(3),
		majorVNo: 1,
		minorVNo: 0,
	}));

	// for (const karticle of karticles) {
	// 	await prisma.knowledgeArticle.create({ data: karticle });
	// }

	// Create 1000 activities
	const activities = Array.from({ length: 1000 }, () => ({
		subject: faker.lorem.sentence(5),
		activityType: faker.word.verb(),
		priority: "Normal",
		status: faker.word.verb(),
		description: faker.lorem.paragraphs(2),
		regarding: faker.string.sample(),
		startDate: faker.date.anytime(),
		dueDate: faker.date.anytime(),
	}));

	// for (const activity of activities) {
	// 	await prisma.activity.create({ data: activity });
	// }

	// create 1000 assets
	const assets = Array.from({ length: 1000 }, () => ({
		tag: faker.airline.recordLocator({ allowNumerics: true }),
		name: faker.lorem.sentence(),
		category: faker.word.noun(),
		location: faker.commerce.department(),
		category: faker.lorem.text(),
		accessories: faker.lorem.sentence(5),
		batterySNo: faker.airline.recordLocator({ allowNumerics: true }),
		adaptorRatings: faker.number.int({ max: 100 }).toString(),
		condition:
			assetConditions[Math.floor(Math.random() * assetConditions.length)],
		assetStatus:
			assetStatus[Math.floor(Math.random() * assetStatus.length)],
		manufacturer: faker.lorem.text(),
		model: faker.lorem.text(),
		serialNo: faker.lorem.text(),
		specification: faker.lorem.paragraphs(2),
		conditionalNotes: faker.lorem.paragraphs(2),
	}));
	//
	// for (const asset of assets) {
	// 	await prisma.asset.create({ data: asset });
	// }

	//create 1000 queues
	const queues = Array.from({ length: 1000 }, () => ({
		name: faker.lorem.sentence(),
		title: faker.lorem.words(),
		type: faker.word.noun(),
		description: faker.lorem.paragraphs(2),
		status: faker.word.noun(),
		technician: faker.person.fullName(),
	}));

	// for (const queue of queues) {
	// 	await prisma.queue.create({ data: queue });
	// }

	//create 100 maintenance
	const maintenances = Array.from({ length: 1000 }, () => ({
		title: faker.lorem.words(),
		description: faker.lorem.paragraphs(2),
		remarks: faker.lorem.paragraphs(2),
	}));

	// for (const maintenance of maintenances) {
	// 	await prisma.maintenance.create({ data: maintenance });
	// }

	//create 100 events
	const events = Array.from({ length: 1000 }, () => ({
		title: faker.lorem.words(),
		description: faker.lorem.paragraphs(2),
		eventDate: faker.date.anytime(),
	}));

	// for (const event of events) {
	// 	await prisma.event.create({ data: event });
	// }

	//create 1000 news articles
	const news = Array.from({ length: 1000 }, () => ({
		title: faker.lorem.words(),
		description: faker.lorem.paragraphs(2),
	}));

	// for (const article of news) {
	// 	await prisma.news.create({ data: article });
	// }

	//create 1000 announcements
	const announcements = Array.from({ length: 1000 }, () => ({
		title: faker.lorem.words(),
		announcement: faker.lorem.paragraphs(2),
	}));

	// for (const announcement of announcements) {
	// 	await prisma.announcement.create({ data: announcement });
	// }

	console.log("Database has been seeded. 🌱");
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.log(e);
		await prisma.$disconnect();
		process.exit(1);
	});
