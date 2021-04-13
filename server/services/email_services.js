const nodemailer = require('nodemailer');
const Logger = require('./logger_services');

const logger = new Logger('app');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.SERVICE_EMAIL_ADDRESS,
    pass: process.env.SERVICE_EMAIL_PASSWORD,
  },
});

const emailNotification = (details, subject, text) => {
  const mailOptions = {
    from: process.env.SERVICE_EMAIL_ADDRESS,
    to: process.env.ADMIN_EMAIL_ADDRESS,
    subject,
    text: `${text} :${details}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(error);
    } else {
      logger.info(`Email sent: ${info.response}`);
    }
  });
};

module.exports = { emailNotification };
