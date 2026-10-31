import "dotenv/config";
import app from "./app.js";
import {connectDB} from "./config/DB.js";

const PORT = process.env.PORT || 5000;

async function startServer():Promise<void>{
await connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
}

startServer();