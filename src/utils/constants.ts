import dotenv from 'dotenv';
dotenv.config();

export const postmarkApiKey = process.env.POSTMARK_APIKEY
export const sender = "aditi@thesocialcontinent.com"

export const welcomeEmail = {
    subject: "Hello from Postmark",
    htmlBody: "<strong>Hello</strong> dear Postmark user.",
    textBody: "Hello from Postmark!",
    messageStream: "outbound"
}