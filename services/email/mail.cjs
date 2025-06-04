require('dotenv').config();
const nodemailer = require("nodemailer");

let currentDate = new Date().toJSON().slice(0, 10);

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

const Mail = async (email, username, request_id, status) => {
    const mailOptions = {
        from: 'Portal de Viajes" <tu-correo@gmail.com>',
        to: email,
        subject: "Actualización de Solicitud de Viaje",
        html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Actualización de tu solicitud</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
      <tr>
        <td style="width: 100px; vertical-align: middle;">
          <img src="https://res.cloudinary.com/dw3ipwzwz/image/upload/v1749059816/Logo101Cocons%C3%BClting_p04mhi.png" alt="Logo del portal" style="max-width: 70px; height: auto;">
        </td>
        <td style="text-align: left; vertical-align: middle;">
          <h2 style=" margin: 0;">Actualización de tu solicitud de viaje</h2>
        </td>
      </tr>
    </table>

    <p>Hola <strong>${username}</strong>,</p>

    <p>Queremos informarte que el estado de tu solicitud de viaje ha cambiado. A continuación te compartimos los nuevos detalles:</p>

    <ul>
      <li><strong>Número de solicitud: </strong>${request_id}</li>
      <li><strong>Estado actual: </strong> ${status}</li>
      <li><strong>Fecha de actualización:</strong> ${currentDate}</li>
    </ul>

    <p>Si deseas consultar más detalles, puedes ingresar a tu portal para revisar toda la información y dar seguimiento a tu viaje. Saludos Coordiales.</p>
  </div>
</body>
</html>
    `,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email Sent Succesfully: " + info.response);
    } catch (error) {
        console.error("Error sending email: ", error, email);
        throw new Error("Error sending email");
    }
};

exports.Mail = Mail;