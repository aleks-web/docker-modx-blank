import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  auth: {
    user: 'info@parsing-data.com',
    pass: '0ZAc1achPJE5qAnGBvfz'
  }
})

export const mailer = (subject: string, message: string) => {

    const mailOptions = {
        from: 'info@parsing-data.com',
        to: 'dok.go@yandex.ru',
        subject: subject,
        html: message
    }

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error)
            }

            resolve(info)
        })
    })
}