// Importer la bibliothèque Nodemailer
const nodemailer = require('nodemailer');

// Créer un objet transporteur
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'rocky.bednar24@ethereal.email',
        pass: 'mJHRq8KrtMS2W1Mje6'
    }
});

// Function to send email
async function sendEmail(customerEmail, startTime, endTime, description) {
    console.log(`Preparing to send email to: ${customerEmail}`);
    console.log(`Email subject: 'Workshop Maintenance Schedule'`);
    console.log(`Email body: Your vehicle maintenance is scheduled from ${startTime} to ${endTime}. Description: ${description}`);

    const mailOptions = {
        from: 'rocky.bednar24@ethereal.email',
        to: customerEmail,  // Dynamic customer email
        subject: 'Workshop Maintenance Schedule',
        text: `Your vehicle maintenance is scheduled from ${startTime} to ${endTime}. Description: ${description}`,
    };

    try {
        // Log before sending the email
        console.log('Attempting to send email...');

        await transporter.sendMail(mailOptions);
        
        // Log if email is sent successfully
        console.log('Notification sent to customer');
    } catch (error) {
        // Log the exact error if sending fails
        console.error('Error sending email:', error);
    }
}

module.exports = { sendEmail };
