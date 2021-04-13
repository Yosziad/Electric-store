const nodemailer = require('nodemailer');
const Logger = require('./logger_services');

const logger = new Logger('app');

const SERVICE_EMAIL_ADDRESS = 'kingmonkey409@gmail.com';
const ADMIN_EMAIL_ADDRESS = 'ziadeyusef@gmail.com';
const EMAIL_SERVICE = 'GMAIL';
const SERVICE_EMAIL_PASSWORD = 'Test112233?';

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: SERVICE_EMAIL_ADDRESS,
    pass: SERVICE_EMAIL_PASSWORD,
  },
});

const emailNotification = (details, subject, text) => {
  const mailOptions = {
    from: SERVICE_EMAIL_ADDRESS,
    to: ADMIN_EMAIL_ADDRESS,
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
