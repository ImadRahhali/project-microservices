const nodemailer = require('nodemailer');

exports.sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.imitate.email',
        port: 587,
        secure: false,
        auth: {
            user: 'ZpSN8uAFnE2jrAGT3zIsRg',
            pass: 'eBaiYYDCkcY4h8x3iDqS'
        }
    });

    const mailOptions = {
        from: 'you@acme.com',
        to,
        subject,
        text,
    };

    await transporter.sendMail(mailOptions);
};
