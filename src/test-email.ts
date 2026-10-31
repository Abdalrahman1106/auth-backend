import "dotenv/config";
import {sendEmail} from "./services/email.service.js";

async function main():Promise<void> {
    try{
        await sendEmail(
            "test@example.com",
            "Mailtrap Test",
            "This is a test email from my Auth Backend project.",
        );

        console.log("Email sent successfully!");
    }catch(error){
        console.log("failed to send email:",error);
        process.exitCode = 1;
    }
}

main();


