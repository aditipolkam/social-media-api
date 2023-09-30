import { ServerClient } from "postmark";
import { postmarkApiKey } from "../utils/constants";
import { sender } from "../utils/constants";

const sendEmail = async(recepient:string, subject:string, htmlBody:string, textBody:string, messageStream:string) => {
  try{
    const client = new ServerClient(postmarkApiKey);

    const response = await client.sendEmail({
        "From": sender,
        "To": recepient,
        "Subject": subject,
        "HtmlBody": htmlBody,
        "TextBody": textBody,
        "MessageStream": messageStream
      });

      return response
  }
  catch(error){
    console.log(error)
  }
  
}


export default sendEmail


