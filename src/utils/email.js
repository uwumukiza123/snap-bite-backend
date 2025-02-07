const nodemailer =  require("nodemailer")
const { google } = require("googleapis")
const dotenv = require("dotenv")

dotenv.config();

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground" 
);

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const sendEmail = async (to, subject, text) => {
    try {
        const accessToken = await oauth2Client.getAccessToken();

        if(!accessToken) {
            throw new Error('failed to retrieve access token')
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        const mailOptions = {
            from: `your App <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully");
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw new Error("Failed to send email");
    }
};

module.exports = { sendEmail}
