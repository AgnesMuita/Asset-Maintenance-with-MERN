import express from "express";
import bodyParser from "body-parser";
import caseRoutes from "./routes/cases.js";
import authRoutes from "./routes/auth.js";
import assetRoutes from "./routes/assets.js";
import userRoutes from "./routes/users.js";
import kArticleRoutes from "./routes/knowledge-articles.js";
import activityRoutes from "./routes/activities.js";
import documentRoutes from "./routes/documents.js";
import allocationformsRoutes from "./routes/allocation-forms.js";
import queueRoutes from "./routes/queues.js";
import searchRoutes from "./routes/search.js";
import announcementRoutes from "./routes/announcement.js";
import eventRoutes from "./routes/events.js";
import maintenanceRoutes from "./routes/maintenance.js";
import mediaRoutes from "./routes/media.js";
import newsRoutes from "./routes/news.js";
import countRoutes from "./routes/item-count.js";
import conversationRoutes from "./routes/conversations.js";
import trashRoutes from "./routes/trash.js";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { errorHandler, notFound } from "./src/middlewares.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const port = process.env.PORT || 8800;
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

app.use(cors());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/cases", caseRoutes);
app.use("/api/v1/assets", assetRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/karticles", kArticleRoutes);
app.use("/api/v1/activities", activityRoutes);
app.use("/api/v1/documents", documentRoutes);
app.use("/api/v1/allocationforms", allocationformsRoutes);
app.use("/api/v1/queues", queueRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/announcements", announcementRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/maintenance", maintenanceRoutes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/count", countRoutes);
app.use("/api/v1/conversation", conversationRoutes);
app.use("/api/v1/trash", trashRoutes);

//middlewares
app.use(notFound);
app.use(errorHandler);

io.on("connection", (socket) => {
	console.log("Client Connected");

	// Disconnection
	socket.on("disconnect", () => {
		console.log("Client Disconnected");
	});
});

export { server, io };

server.listen(port, () => {
	console.log(`Server Connected! on port:${port}`);
});
