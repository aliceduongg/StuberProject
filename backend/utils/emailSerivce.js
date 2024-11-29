const nodeMailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '', // email
        pass: ''
    }
});

const sendRideNotification = async (driverEmail, rideDetails) => {
    const mailOptions = {
        from: '', // email
        to: driverEmail,
        subject: 'New Ride Request Available!',
        html: `
        <h2>New Ride Request</h2>
        <p>A new ride has been posted:</p>
        <ul>
          <li>From: ${rideDetails.pickupLocation}</li>
          <li>To: ${rideDetails.destination}</li>
          <li>Date: ${rideDetails.date}</li>
          <li>Time: ${rideDetails.time}</li>
          <li>Passengers: ${rideDetails.passengers}</li>
          <li>Fare: $${rideDetails.fare}</li>
        </ul>
        <p>Log in to your Stuber account to accept this ride!</p>
      `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Notification email sent to ${driverEmail}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendRideNotification };
