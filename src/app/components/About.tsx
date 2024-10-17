import React from 'react'
import { Card, CardBody, CardFooter, CardHeader, Chip, Divider, Link } from '@nextui-org/react'
import IMG from "../../../public/img1.jpg"
import IMG2 from "../../../public/img2.jpg"
import AboutOrder from './AboutOrder'
import AboutImg from './AboutImg'
import Container from './Container'
import { Icon } from '@iconify/react'
import AboutNav from './AboutNav'


const About = () => {
    return (
        <Container>
            <AboutNav />
            <Card className="flex flex-col gap-4 p-6" style={{ width: "fit-content", padding: "20px" }}>


                <Card style={{ width: "fit-content", padding: "20px" }}>
                    <CardHeader className="text-3xl">
                        <h1 id="about" style={{ fontWeight: 'bold', textTransform: 'uppercase' }} className="font-bold text-large uppercase">О проекте:</h1>
                    </CardHeader>
                    <CardBody className='flex flex-col gap-3'>
                        <p>Меня зовут <b>Александр Шатохин</b>. Я автор проектов <Link href="https://dompredkov.ru/" target="_blank" underline='hover'> "Дом предков"</Link>, <Link href="https://rod-i-predki.ru/" target="_blank" underline='hover'> "Род и предки"</Link>.</p>

                        <p>Генеалогией я увлекаюсь с 2008 года. Уже 13 лет исследую родословные для себя и на заказ. Мою родословную вы можете посмотреть по <Link href="https://i.ibb.co/KqjV3md/image.png?fbclid=IwAR31Bxh_6jQrYTxT7VNAxACPpyGIEBG8oj6GAdSIjikOYDV0LlvxkBkOX2o" target="_blank" underline='hover'> ссылке</Link>, а отзывы клиентов посмотреть на <Link href="https://dompredkov.ru/otzyvy-2/" target="_blank" underline='hover'>странице с отзывами</Link>.</p>

                        <Divider style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }} />

                        <h3 style={{ fontWeight: 'bold', textTransform: 'uppercase' }} id='history'>
                            История проекта:
                        </h3>

                        <p>Свою родословную я изучаю уже 15 лет. Разрядный приказ ф.210 РГАДА позволяет взглянуть на служилое сословие 16-18 века под разными ракурсами. <b>Где и когда служил человек, в каком полку, как бился в том или ином сражении, были ли поместья, как был вооружен, семья, дети, был ли ранен, убит и другие биографические подробности.</b> На все эти вопросы охотно отвечает разрядный приказ РГАДА.</p>

                        <p>Но наибольшей сложностью для меня было и остается огромное количество источников в которых можно найти те или иные сведения. Ведь на то, чтобы только их систематизировать, не говоря уже о том, что на просмотр дел уходит масса времени. И даже сейчас, с учетом опыта работы в архивах, это выглядит очень трудоемкой задачей. Я уже не говорю о чтении скорописи 17 века.</p>

                        <p>И я представляю сложности с которыми сталкивается человек только-только начавший интересоваться служилым сословием. Как пример, вот есть дело по какому-то полку за 1650 год, нужно ли его смотреть, человек задумывается, смогу ли я найти там интересную для меня персону или нет, а если смогу интересной ли будет информация. В итоге дело просматривается, но в нем не находится сведений по нужной персоне. Время потрачено, результата нет. Или наоборот не просматривается из-за вышеозначенных причин (время, деньги, сложность), а нужная информация там есть, сидит и ждет когда за ней кто-нибудь придет.</p>

                        <p>Или другой пример. Не секрет, что со второй половины 17 века засечная черта двигалась на юг и в меньшей степени на восток в результате чего к началу 18 века огромное количество служилого люда оказалось в Белгородских и Воронежских регионах и даже южнее. И у многих ступор происходит как раз в этот момент, они, посмотрев первые ревизии не знают куда продвинуться дальше.</p>

                        <p>Нашли своего предка, условного, Никифора Петрова сына Лыкова в 1 ревизии 1719 года в условном Курске, а в более ранее время на этом месте его нет. И что же делать? Тут, как и приходит на помощь база по которой можно поискать Никифоровых Лыковых, Петровых Лыковых, посмотреть по каким городам они идут, запросить выписки. Гарантия ли это , что найдете 100% Вашего? Нет, не гарантия, но это существенно увеличивает возможность нахождения.</p>

                        <Divider style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }} />

                        <h4 id="data">
                            Поэтому резюмируя, можно сказать, что получение информации из базы решает следующие вопросы:
                        </h4>

                        <ul className="list-disc list-inside grid gap-1 ml-3">
                            <li className='flex gap-1 align-middle items-center flex-wrap'>
                                <Icon icon="mdi:check-bold" width={20} height={20} color='success' />
                                <b>Точность:</b> вы не платите “за просмотр” дела, не ищете описи, вам предоставляются данные по нужной персоне;
                            </li>

                            <li className='flex gap-1 align-middle items-center flex-wrap'>
                                <Icon icon="mdi:check-bold" width={20} height={20} color='success' />
                                <b>Скорость:</b> результаты пришлю в течение 1 дня (чаще нескольких часов) с момента оплаты.
                            </li>

                            <li className='flex gap-1 align-middle items-center flex-wrap'>
                                <Icon icon="mdi:check-bold" width={20} height={20} color='success' />
                                <b>Четкость: </b>любая информация подкреплена фотографией оригинала дела.
                            </li>

                            <li className='flex gap-1 align-middle items-center flex-wrap'>
                                <Icon icon="mdi:check-bold" width={20} height={20} color='success' />
                                <b>Удобство: </b>данные уже прочитаны, переведены в читаемый вид.
                            </li>

                            <li className='flex gap-1 align-middle items-center flex-wrap'>
                                <Icon icon="mdi:check-bold" width={20} height={20} color='success' />
                                <b>Экономия: </b>Вам не нужно заказывать дела, ехать в архив, тратить время на просмотр.
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                <Card style={{ width: "100%", padding: "20px" }}>
                    <h3>Общая информация, которая содержится в базе, выглядит следующим образом:</h3>

                    <ul className="list-disc list-inside grid gap-1 ml-3">
                        <li className='grid gap-2' style={{ gridTemplateColumns: "auto auto", alignItems: "center", justifyContent: "start" }}>
                            <Icon icon="mdi:check-bold" width={20} height={20} color='success' />
                            Фамилия, имя.
                        </li>
                        <li className='grid gap-2' style={{ gridTemplateColumns: "auto auto", alignItems: "center", justifyContent: "start" }}>
                            <Icon icon="mdi:check-bold" width={20} height={20} color='success' />
                            Реквизиты дела;
                        </li>
                        <li className='grid gap-2' style={{ gridTemplateColumns: "auto auto", alignItems: "center", justifyContent: "start" }}>
                            <Icon icon="mdi:check-bold" width={20} height={20} color='success' />
                            Год упоминания;
                        </li>
                        <li className='grid gap-2' style={{ gridTemplateColumns: "auto auto", alignItems: "center", justifyContent: "start" }}>
                            <Icon icon="mdi:check-bold" width={20} height={20} color='success' />
                            Город, по которому служил человек;
                        </li>
                    </ul>

                    <CardFooter style = {{ width: "100%", borderRadius: "10px", border: "1px solid #e2e8f0", padding: "10px", marginTop: "10px" }}>
                        <b>
                            <Chip color="primary" variant='faded'>Важно!</Chip> Все остальные сведения предоставляются на платной основе за плату (оплата зависит от количества покупаемых записей и от их объема). Этими дополнительными сведениями может быть что угодно, от сказки с полным упоминанием состава семьи, послужным списком поместьями и вооружениями до упоминания в каком полку и чине служил человек.
                        </b>
                    </CardFooter>
                </Card>

                <Card style={{ width: "100%", padding: "10px" }}>
                    <CardHeader>

                        <h3 id="example" style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>По любой из этих записей вы можете заказать выписку, в которой содержатся:</h3>

                    </CardHeader>
                    <CardBody>
                        <ul className="list-disc list-inside grid gap-1 ml-3">
                            <li className='grid gap-2' style={{ gridTemplateColumns: "auto auto", alignItems: "center", justifyContent: "start" }}>
                                <Icon icon="mdi:check-bold" width={20} height={20} color='success' />

                                ФИО персоны (отчество есть в 95% записей). Если отчество указано в документе, то оно будет присутствовать в выписке;
                            </li>

                            <li className='grid gap-2' style={{ gridTemplateColumns: "auto auto", alignItems: "center", justifyContent: "start" }}>
                                <Icon icon="mdi:check-bold" width={20} height={20} color='success' />
                                Фотокопия этой страницы дела;
                            </li>

                            <li className='grid gap-2' style={{ gridTemplateColumns: "auto auto", alignItems: "center", justifyContent: "start" }}>
                                <Icon icon="mdi:check-bold" width={20} height={20} color='success' />
                                Дополнительно расшифровка текста в текстовом формате;
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                <Card style={{ width: "100%", padding: "10px" }}>
                    <CardHeader>
                        <h3 style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Пример предоставления сведений из базы служилых людей:</h3>
                    </CardHeader>

                    <CardBody className='grid gap-3'>
                        <AboutImg path={IMG} alt="фото страницы с упоминанием целевой персоны" text='К каждой купленной записи прилагается фото страницы с упоминанием целевой персоны.' />
                        <p style={{ width: "100%", paddingTop: "10px", paddingBottom: "10px" }}>К каждой купленной записи прилагается фото страницы с упоминанием целевой персоны.</p>

                        <Divider style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }} />

                        <AboutImg path={IMG2} alt="расшифровка текста документа в электронном виде" text='Расшифровка текста документа в электронном виде' />
                        <p style={{ width: "100%", paddingTop: "10px", paddingBottom: "10px" }}>Дополнительно к сканам я пришлю вам расшифровку текста документа в электронном виде.</p>
                    </CardBody>
                </Card>

                <Card id="order" style={{ width: "100%", padding: "10px" }}>
                    <AboutOrder />
                </Card>
            </Card>
        </Container>
    )
}

export default About