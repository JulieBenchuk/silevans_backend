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
const port = process.env.PORT

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
        subject: "Новая анкета на сайте Silevans", // subject line
        html: `<h1>Новое письмо от потенциального заказчика.</h1>
<h2>Посетителем сайта была заполнена и отравлена анкета. Данные клиента:
<h3><b>Имя: ${name}, email: ${email}, телефон: ${phone}, компания или проект: ${companyOrProject ? companyOrProject : "нет данных"}, сайт: ${site ? site : "нет данных"}, возраст компани: ${ageOfCompany ? ageOfCompany : "нет данных"}, сообщение: ${message ? message : "нет данных"}.</b></h3>
<h3><b>Интересует: ${interest.length>0 ? interest : "не выбрано"}.</b></h3>
</h2>`
    };

    await transporter.sendMail(mailOptions);
    res.send("Ok")
})

app.post('/callback', async function(req, res){
    const {name, phone} = req.body

    const mailOptions = {
        from: name, // sender address
        to: smtp_receivers_email, // list of receivers
        subject: "Заказан звонок на сайте Silevans", // subject line
        html: `<h1>Новое письмо от потенциального заказчика.</h1>
                <h2>Посетителем сайта был заказан звонок. Данные клиента:
                <h3><b>Имя: ${name}, телефон: ${phone}.</b></h3>
                </h2>`
    };

    await transporter.sendMail(mailOptions);
    res.send("Ok")
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})