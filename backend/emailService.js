import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
	service: 'Gmail', // or your email provider
	auth: {
		user: process.env.EMAIL_USERNAME,
		pass: process.env.EMAIL_PASSWORD,
	},
})

export const sendEmail = async (to, subject, text, html) => {
	try {
		const mailOptions = {
			from: `"Your Store" <${process.env.EMAIL_USERNAME}>`,
			to,
			subject,
			text,
			html,
		}

		await transporter.sendMail(mailOptions)
		console.log('Email sent successfully')
	} catch (error) {
		console.error('Error sending email:', error)
		throw error
	}
}
