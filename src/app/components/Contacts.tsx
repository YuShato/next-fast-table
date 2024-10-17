import React from 'react'
import { Button, Card, CardBody, CardHeader, Link, Snippet, Tooltip } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import ContactForm from './ContactForm'
import Social from './Social'
import Container from './Container'

function SocialAndContact() {
    return (
        <Card className="flex flex-col gap-4 p-6" >
            <CardHeader className="text-3xl">
                <h3 style={{ fontWeight: 'bold', textTransform: 'uppercase' }} className="font-bold text-large uppercase">Контакты:</h3>
            </CardHeader>

            <CardBody className='flex flex-col gap-3'>

                <Card shadow='md'>
                    <CardHeader className='text-xl'>
                        <h3 style={{ fontWeight: 'bold' }}>Телефон:</h3>
                    </CardHeader>

                    <CardBody>
                        <Tooltip content="Копировать номер">
                            <Snippet symbol="" className='text-xl'>8-926-495-31-17</Snippet>
                        </Tooltip>
                    </CardBody>
                </Card>
                <Card shadow='md'>
                    <CardHeader className='text-xl'>
                        <h3 style={{ fontWeight: 'bold' }}>Email:</h3>
                    </CardHeader>

                    <CardBody>
                        <Tooltip content="Написать на почту">
                            <Link href="mailto:dompredkov@yandex.ru" target="_blank" className='text-xl' color='primary'>dompredkov@yandex.ru</Link>
                        </Tooltip>
                    </CardBody>
                </Card>
                <Card shadow='md'>
                    <CardHeader className='text-xl'><h3 style={{ fontWeight: 'bold' }}>Мои проекты:</h3></CardHeader>

                    <CardBody className='flex flex-col gap-3'>
                        <Link href="https://dompredkov.ru/" target="_blank" className='text-xl' color='primary' underline='always'>Сайт "Дом предков"</Link>

                        <Link href="https://rod-i-predki.ru/" target="_blank" className='text-xl' color='primary' underline='always'>Сайт моей родословнои "Род и предки"</Link>
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