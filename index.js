import express from "express";
import db from "./database/database.js";
import cookieParser from "cookie-parser";
import UserRoute from "./router/UserRoute.js";
import PhotoRoute from "./router/PhotoRoute.js";

const app = express();
const port = process.env.SERVER_PORT;

(async () => {
    await db.sync();
})();

app.use(cookieParser());
app.use(express.json());

app.use(UserRoute);
app.use(PhotoRoute);

app.listen(port, () => {
    console.log(`Web Server listening on port ${port}`);
});