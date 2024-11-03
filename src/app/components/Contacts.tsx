import React from 'react'
import { Button, Card, CardBody, CardHeader, Link, Snippet, Tooltip } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import ContactForm from './ContactForm'
import Social from './Social'
import Container from './Container'

function SocialAndContact() {
    return (
        <Card radius='none' className='light-form'>
            <CardHeader>
                <h2 className='light-form__header'>Контакты:</h2>
            </CardHeader>

            <CardBody className='contacts-block' >
                <Card radius="none">
                    <CardHeader>
                        <h3>Телефон:</h3>
                    </CardHeader>

                    <CardBody>
                        <Tooltip content="Копировать номер">
                            <Snippet symbol="" size='md' radius='none' variant='flat'>8-926-495-31-17</Snippet>
                        </Tooltip>
                    </CardBody>
                </Card>
                <Card radius="none">
                    <CardHeader>
                        <h3>Email:</h3>
                    </CardHeader>

                    <CardBody>
                        <Tooltip content="Написать на почту">
                            <Link href="mailto:dompredkov@yandex.ru" target="_blank">dompredkov@yandex.ru</Link>
                        </Tooltip>
                    </CardBody>
                </Card>
                <Card radius="none">
                    <CardHeader>
                        <h3>Мои проекты:</h3>
                    </CardHeader>

                    <CardBody>
                        <Link href="https://dompredkov.ru/" target="_blank" >
                            Сайт "Дом предков"
                        </Link>

                        <Link href="https://rod-i-predki.ru/" target="_blank" >
                            Сайт моей родословной "Род и предки"
                        </Link>
                    </CardBody>
                </Card>

                <Social />
            </CardBody>
        </Card>)
}




const Contacts = () => {
    return (
        <Container>
            <div className='contacts'>
                <SocialAndContact />

                <ContactForm />
            </div>
        </Container>

    )
}

export default Contacts