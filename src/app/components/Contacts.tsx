import React from 'react'
import { Button, Card, CardBody, CardHeader, Link, Snippet, Tooltip } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import ContactForm from './ContactForm'

function SocialAndContact() {
    return (
        <Card className="flex w-fit flex-col gap-4 p-6" style={{ width: "100%", minWidth: "400px" }}>
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

function Social() {
    return (
        <Card shadow='md'>
            <CardHeader className='text-xl'>
                <h3 style={{ fontWeight: 'bold' }}>Соцсети:</h3>
            </CardHeader>
            <CardBody className='flex row-auto gap-3'>
                <div className='flex gap-3'>
                    <Tooltip content="Написать в WhatsApp">
                        <Button
                            href="https://wa.me/79264953117?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%20%D0%B7%D0%B0%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D0%BE%D0%B2%D0%B0%D0%BB%D0%B8%20%D0%B2%D0%B0%D1%88%D0%B8%20%D1%83%D1%81%D0%BB%D1%83%D0%B3%D0%B8"
                            as={Link}
                            target="_blank"
                            // color="primary"
                            isIconOnly
                            variant="solid"
                            size="lg"
                            className='hover:opacity-80 hover:scale-110'

                        >
                            <Icon icon="logos:whatsapp-icon" height={34} width={34} />
                        </Button>
                    </Tooltip>

                    <Tooltip content="Написать в VK">
                        <Button
                            href="https://vk.com/id2433917"
                            as={Link}
                            target="_blank"
                            // color="primary"
                            isIconOnly
                            variant="solid"
                            size="lg"
                            className='hover:opacity-80'

                        >
                            <Icon className='hover:opacity-80' color='#0077FF' fill='#0077FF' icon="ion:logo-vk" height={34} width={34} />
                        </Button>
                    </Tooltip>
                </div>
            </CardBody>
        </Card>
    )
}


const Contacts = () => {
    return (
        <div className="gap-2 grid p-6" style={{ gridTemplateColumns: "auto auto", gridTemplateRows: "auto auto", width: "100%", padding: "20px" }}>
            <ContactForm />

            <SocialAndContact />


        </div>
    )
}

export default Contacts