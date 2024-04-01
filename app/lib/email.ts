import nodemailer from "nodemailer";

type profile = {name: string; email: string};

interface EmailOptions {
    profile : profile,
    subject : 'verification' | 'forget-password' | 'password-changed',
    linkUrl ?: string 
}

const generateMailTransport = () => {
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "192561666499d0",
          pass: "6cfa5a173259f7"
        }
      });

      return transport;
}

const sendEmailVerificationLink = async (profile : profile, linkUrl: string) => {
    const transport = generateMailTransport();
    
      await transport.sendMail({
        from : 'verification@ecommerce.com',
        to : profile.email,
        html: `<h2>Please verify your email by clicking on <a href="${linkUrl}" >this link</a></h2>`
      })
}
const sendForgetPasswordLink = async (profile : profile, linkUrl: string) => {
    const transport = generateMailTransport();
    
      await transport.sendMail({
        from : 'verification@ecommerce.com',
        to : profile.email,
        html: `<h2>Please verify your email by clicking on <a href="${linkUrl}" >this link</a> to reset your password.</h2>`
      })
}
const sendUpdatePasswordConfirmation = async (profile : profile) => {
    const transport = generateMailTransport();
    
      await transport.sendMail({
        from : 'verification@ecommerce.com',
        to : profile.email,
        html: `<h2>Your password is now changed.</h2>`
      })
}

export const sendEmail = (options : EmailOptions) => {

    const {profile,subject,linkUrl}= options;

    switch(subject){
        case 'verification' :
            return sendEmailVerificationLink(profile, linkUrl!)
        case 'forget-password' :
            return sendForgetPasswordLink(profile, linkUrl!)
        case 'password-changed' :
            return sendUpdatePasswordConfirmation(profile)
    }
}