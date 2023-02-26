const express = require('express')
const nodemailer = require('nodemailer')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const smtp_login = process.env.SMTP_LOGIN
const smtp_password = process.env.SMTP_PASSWORD
const smtp_receivers_email = process.env.SMTP_RECEIVERS_EMAIL

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: smtp_login,
        pass: smtp_password
    }
})


app.post('/', async function (req, res) {

    const {name, phone, email, companyOrProject, site, ageOfCompany, message, interest} = req.body

    const mailOptions = {
        from: name, // sender address
        to: smtp_receivers_email, // list of receivers
        subject: "Анкета клиента Silevans", // subject line
        html: `<h1>Новое письмо от потенциального заказчика.</h1>
<div>Посетитем сайта была заполнена и отравлена анкета. Данные клиента:
<div>Имя: ${name}, email: ${email}, телефон: ${phone}, компания\проект: ${companyOrProject}, сайт: ${site}, возраст компани: ${ageOfCompany}, сообщение: ${message}.</div>
<div>Интересует: ${interest}.</div>
</div>`
    };

    await transporter.sendMail(mailOptions);
    res.send("Ok")
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})