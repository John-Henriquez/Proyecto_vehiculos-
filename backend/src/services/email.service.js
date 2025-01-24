import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendEmail(to, subject, text) {
    try {
        let info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });
        console.log("Mensaje enviado: %s", info.messageId);
    } catch (error) {
        console.error("Error al enviar el correo:", error);
    }
}


