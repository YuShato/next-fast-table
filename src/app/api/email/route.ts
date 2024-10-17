import { type NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export async function POST(request: NextRequest) {
  const { email, name, message, tel } = await request.json();

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
    subject: `Заявка из базы от  ${name} (${email}) ${tel ? 'Телефон: ' + tel : ''}`,
    date: new Date(),
    text: `Имя: ${name}\nEmail: ${email}\nТелефон: ${tel ? tel : 'Не указан в заявке'}\nТекст сообщения: ${message}\nДата: ${new Date()}`,
  };

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve('Email sent');
        } else {
          reject(err.message);
        }
      });
    });

    try {
        await sendMailPromise();
        return NextResponse.json({ message: 'Заявка успешно отправлена' });
      } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Ошибка при отправке заявки' }, { status: 500 });
      }
}