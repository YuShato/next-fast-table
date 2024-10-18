import { type NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer'



export async function POST(request: NextRequest) {
    const data = await request.json();
    if (!data) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    try {
        const transport = nodemailer.createTransport({
            host: 'smtp.yandex.ru',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_PASSWORD, 
            },
        });

           const mailOptions: Mail.Options = {
        from: process.env.MY_EMAIL,
        to: process.env.MY_EMAIL,
        subject: `Заявка из базы избранного от ${data.name} (${data.email})`,
        date: new Date(),
        text: `
            Имя: ${data.name}
            Email: ${data.email}
            Сообщение: ${data.message}
            Данные избранных записей:
            ${Array.isArray(data.dufavorites) ? data.dufavorites.map((item, index) => `
                ${index + 1}. ${item.userName} (${item.userNumber}) - ${item.userYear} г.
                Город: ${item.userCity}
                Ссылка: ${item.userLink}
            `).join('\n') : 'пользователь не указал'}
            Дата: ${new Date()}
        `,
    };

        const sendMailPromise = () =>
            new Promise<string>((resolve, reject) => {
                transport.sendMail(mailOptions, function (err) {
                    if (!err) {
                        resolve('Email sent ORDER');
                    } else {
                        reject(err.message);
                    }
                });
            });

        try {
            await sendMailPromise();
            return NextResponse.json({ message: 'Заявка успешно отправлена' }, { status: 200 });
        } catch (err) {
            console.error(err);
            return NextResponse.json({ error: 'Ошибка при отправке заявки' }, { status: 500 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}