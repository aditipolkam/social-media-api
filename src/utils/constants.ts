import dotenv from 'dotenv';
dotenv.config();

export const postmarkApiKey = process.env.POSTMARK_APIKEY as string;
export const sender = "aditi@thesocialcontinent.com"
export const mongoUri = process.env.MONGO_URI as string;
export const jwtSecret = process.env.JWT_SECRET as string;

export const welcomeEmail = {
    subject: "Hello from Postmark",
    htmlBody: "<strong>Hello</strong> dear Postmark user.",
    textBody: "Hello from Postmark!",
    messageStream: "outbound"
}