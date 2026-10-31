import "dotenv/config";

const mongoUri = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_ACCESS_SECRET;
const nodeEnv = process.env.NODE_ENV ?? "development";
const emailHost = process.env.EMAIL_HOST;
const emailPort = Number(process.env.EMAIL_PORT ?? 587);
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const emailFrom = process.env.EMAIL_FROM;
const frontendUrl = process.env.FRONTEND_URL;

if (!mongoUri) {
  throw new Error("MONGO_URI is not defined in the environment variables.");
}

if(!jwtSecret) {
  throw new Error("JWT_ACCESS_SECRET is not defined in the environment variables.");
}

const env = {
  mongoUri,
  jwtSecret,
  nodeEnv,
  emailHost,
  emailPort ,
  emailUser ,
  emailPassword ,
  emailFrom,
  frontendUrl,
};

export default env;