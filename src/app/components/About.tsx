

import React from 'react'
import { Card, CardBody, CardFooter, CardHeader, Chip, Divider, Link, Tooltip } from '@nextui-org/react'
import IMG from "../../../public/img1.jpg"
import IMG2 from "../../../public/img2.jpg"
import AVATAR from "../../../public/avatar.jpg"
import AboutOrder from './AboutOrder'
import AboutImg from './AboutImg'
import Container from './Container'
import { Icon } from '@iconify/react'
import AboutNav from './AboutNav'
import Image from 'next/image'


const About = () => {

    return (
        <Container>
            <AboutNav />

            <Card radius="none" className='about-page'>
                <Card radius='none'>
                    <CardHeader>
                        <h1 id="about">О проекте:</h1>
                    </CardHeader>

                    <CardBody className='double-container card'>
                        <Image src={AVATAR} width={450} height={450} alt={"Александр Шатохин"} loading='eager' placeholder="blur"></Image>

                        <div>
                            <p>Меня зовут <b>Александр Шатохин</b>. Я автор проектов {" "}
                                <Tooltip content="Перейти на основной сайт проекта">
                                    <Link href="https://dompredkov.ru/" target="_blank" underline='hover'> "Дом предков"</Link>
                                </Tooltip>, {" "}
                                <Tooltip content="Перейти на сайт моей родословной">
                                    <Link href="https://rod-i-predki.ru/" target="_blank" underline='hover'> "Род и предки"</Link>
                                </Tooltip>.</p>

                            <p>Генеалогией я увлекаюсь с 2008 года. Уже 13 лет исследую родословные для себя и на заказ. Мою родословную вы можете посмотреть по <Link href="https://i.ibb.co/KqjV3md/image.png?fbclid=IwAR31Bxh_6jQrYTxT7VNAxACPpyGIEBG8oj6GAdSIjikOYDV0LlvxkBkOX2o" target="_blank" underline='hover'> ссылке</Link>, а отзывы клиентов посмотреть на {" "}
                                <Tooltip content="Перейти на страницу с отзывами">
                                    <Link href="https://dompredkov.ru/otzyvy-2/" target="_blank" underline='hover'>странице с отзывами</Link>
                                </Tooltip>.</p>
                        </div>


                    </CardBody>

                    <CardBody className='accent-block'>
                        <h3 id='history'>
                            История проекта:
                        </h3>

                        <p>Свою родословную я изучаю уже 15 лет. Разрядный приказ ф.210 РГАДА позволяет взглянуть на служилое сословие 16-18 века под разными ракурсами. <b>Где и когда служил человек, в каком полку, как бился в том или ином сражении, были ли поместья, как был вооружен, семья, дети, был ли ранен, убит и другие биографические подробности.</b> На все эти вопросы охотно отвечает разрядный приказ РГАДА.</p>

                        <p>Но наибольшей сложностью для меня было и остается огромное количество источников в которых можно найти те или иные сведения. Ведь на то, чтобы только их систематизировать, не говоря уже о том, что на просмотр дел уходит масса времени. И даже сейчас, с учетом опыта работы в архивах, это выглядит очень трудоемкой задачей. Я уже не говорю о чтении скорописи 17 века.</p>

                        <p>И я представляю сложности с которыми сталкивается человек только-только начавший интересоваться служилым сословием. Как пример, вот есть дело по какому-то полку за 1650 год, нужно ли его смотреть, человек задумывается, смогу ли я найти там интересную для меня персону или нет, а если смогу интересной ли будет информация. В итоге дело просматривается, но в нем не находится сведений по нужной персоне. Время потрачено, результата нет. Или наоборот не просматривается из-за вышеозначенных причин (время, деньги, сложность), а нужная информация там есть, сидит и ждет когда за ней кто-нибудь придет.</p>

                        <p>Или другой пример. Не секрет, что со второй половины 17 века засечная черта двигалась на юг и в меньшей степени на восток в результате чего к началу 18 века огромное количество служилого люда оказалось в Белгородских и Воронежских регионах и даже южнее. И у многих ступор происходит как раз в этот момент, они, посмотрев первые ревизии не знают куда продвинуться дальше.</p>

                        <p>Нашли своего предка, условного, Никифора Петрова сына Лыкова в 1 ревизии 1719 года в условном Курске, а в более ранее время на этом месте его нет. И что же делать? Тут, как и приходит на помощь база по которой можно поискать Никифоровых Лыковых, Петровых Лыковых, посмотреть по каким городам они идут, запросить выписки. Гарантия ли это , что найдете 100% Вашего? Нет, не гарантия, но это существенно увеличивает возможность нахождения.</p>




                    </CardBody>

                    <CardBody className='card'>
                        <h4 id="data">
                            Поэтому резюмируя, можно сказать, что получение информации из базы решает следующие вопросы:
                        </h4>

                        <ul>
                            <li>
                                <Icon icon="mdi:check-bold" width={20} height={20} />
                                <p>
                                    <b>Точность:</b> вы не платите “за просмотр” дела, не ищете описи, вам предоставляются данные по нужной персоне;
                                </p>
                            </li>

                            <li >
                                <Icon icon="mdi:check-bold" width={20} height={20} />

                                <p>
                                    <b>Скорость:</b> результаты пришлю в течение 1 дня (чаще нескольких часов) с момента оплаты.
                                </p>
                            </li>

                            <li >
                                <Icon icon="mdi:check-bold" width={20} height={20} />
                                <p>
                                    <b>Четкость: </b>любая информация подкреплена фотографией оригинала дела.
                                </p>
                            </li>

                            <li>
                                <Icon icon="mdi:check-bold" width={20} height={20} />
                                <p>
                                    <b>Удобство: </b>данные уже прочитаны, переведены в читаемый вид.
                                </p>
                            </li>

                            <li>
                                <Icon icon="mdi:check-bold" width={20} height={20} />
                                <p>
                                    <b>Экономия: </b>Вам не нужно заказывать дела, ехать в архив, тратить время на просмотр.
                                </p>
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                <Card radius='none' className='accent-block '>
                    <h3>Общая информация, которая содержится в базе, выглядит следующим образом:</h3>

                    <ul>
                        <li>
                            <Icon icon="mdi:check-bold" width={20} height={20} color='success' />
                            Фамилия, имя.
                        </li>
                        <li>
                            <Icon icon="mdi:check-bold" width={20} height={20} color='success' />
                            Реквизиты дела;
                        </li>
                        <li>
                            <Icon icon="mdi:check-bold" width={20} height={20} color='success' />
                            Год упоминания;
                        </li>
                        <li>
                            <Icon icon="mdi:check-bold" width={20} height={20} color='success' />
                            Город, по которому служил человек;
                        </li>
                    </ul>

                    <CardFooter>
                        <div>
                            <p>
                                <Chip className='accent-chip' variant='bordered' as={"span"}>Важно!</Chip>
                                <b> {" "} Все остальные сведения предоставляются на платной основе за плату (оплата зависит от количества покупаемых записей и от их объема).</b>
                                <br />

                                <b>Этими дополнительными сведениями может быть что угодно, от сказки с полным упоминанием состава семьи, послужным списком поместьями и вооружениями до упоминания в каком полку и чине служил человек.
                                </b>
                            </p>
                        </div>
                    </CardFooter>
                </Card>

                <Card radius='none' className='card'>
                    <CardHeader>

                        <h3 id="example">По любой из этих записей вы можете заказать выписку, в которой содержатся:</h3>

                    </CardHeader>
                    <CardBody>
                        <ul>
                            <li>
                                <Icon icon="mdi:check-bold" width={20} height={20} color='success' />

                                ФИО персоны (отчество есть в 95% записей). Если отчество указано в документе, то оно будет присутствовать в выписке;
                            </li>

                            <li>
                                <Icon icon="mdi:check-bold" width={20} height={20} color='success' />
                                Фотокопия этой страницы дела;
                            </li>

                            <li>
                                <Icon icon="mdi:check-bold" width={20} height={20} color='success' />
                                Дополнительно расшифровка текста в текстовом формате;
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                <Card radius='none' className='card accent-block'>
                    <CardHeader>
                        <h3>Пример предоставления сведений из базы служилых людей:</h3>
                    </CardHeader>

                    <CardBody>
                        <AboutImg path={IMG} alt="фото страницы с упоминанием целевой персоны" text='К каждой купленной записи прилагается фото страницы с упоминанием целевой персоны.' />

                        <p className='image-text'>К каждой купленной записи прилагается фото страницы с упоминанием целевой персоны.</p>

                        <Divider style={{ marginTop: "20px", marginBottom: "20px" }} />

                        <AboutImg path={IMG2} alt="расшифровка текста документа в электронном виде" text='Расшифровка текста документа в электронном виде' />

                        <p className='image-text'>Дополнительно к сканам я пришлю вам расшифровку текста документа в электронном виде.</p>
                    </CardBody>
                </Card>

                <Card id="order" radius='none'>
                    <AboutOrder />
                </Card>
            </Card>
        </Container>
    )
}

export default About