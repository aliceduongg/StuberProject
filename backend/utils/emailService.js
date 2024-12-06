const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // email
        pass: process.env.EMAIL_PASS,

    }
});
// function for sending email to the driver when a new ride is posted

const sendRideNotification = async (driverEmail, rideDetails) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // email
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
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Propagate the error
    }
};

// function for sending email to the rider when the driver accepts the ride
const sendRideAcceptedNotification = async (riderEmail, rideDetails, driverName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: riderEmail,
        subject: 'Your Ride Has Been Accepted!',
        html: `
        <h2> Ride Accepted </h2>
        <p>Your ride has been accepted by ${driverName}:</p>
        <ul>
            <li>From: ${rideDetails.pickupLocation}</li>
            <li>To: ${rideDetails.destination}</li>
            <li>Date: ${rideDetails.date}</li>
            <li>Time: ${rideDetails.time}</li>
            <li>Passengers: ${rideDetails.passengers}</li>
            <li>Fare: $${rideDetails.fare}</li>
        </ul>
        <p>Your driver will meet you at the pickup location at the scheduled time.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Acceptance notification email sent to rider ${riderEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Add the following function to send cancellation notification to rider or driver
const sendRideCancelledNotification = async (recipientEmail, rideDetails, cancelledBy) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: 'Ride Cancellation Notice',
        html: `
        <h2> Ride Cancelled </h2>
        <p>The ride has been cancelled by ${cancelledBy}:</p>
        <ul>
            <li>From: ${rideDetails.pickupLocation}</li>
            <li>To: ${rideDetails.destination}</li>
            <li>Date: ${rideDetails.date}</li>
            <li>Time: ${rideDetails.time}</li>
            <li>Passengers: ${rideDetails.passengers}</li>
            <li>Fare: $${rideDetails.fare}</li>
        </ul>
        <p>We apologize for any inconvenience caused.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Cancellation notification email sent to ${recipientEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending cancellation email:', error);
        throw error;
    }
};

module.exports = { sendRideNotification, sendRideAcceptedNotification, sendRideCancelledNotification };


