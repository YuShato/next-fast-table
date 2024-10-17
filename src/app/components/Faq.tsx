'use client'
import React from 'react'
import { Accordion, AccordionItem, Card, CardBody, CardHeader, Link } from "@nextui-org/react";
import { Icon } from '@iconify/react';

const Faq = () => {
    const [selectedKeys] = React.useState(["1", "2", "3"]);

    return (
        <Card style={{ width: "100%", padding: "10px" }}>
            <CardHeader>
                <h3 style={{ textTransform: 'uppercase' }} >
                    Советы по поиску в базе служилых людей:
                </h3>
            </CardHeader>
            <CardBody>
                <Accordion
                    selectedKeys={selectedKeys}
                    // onSelectionChange={setSelectedKeys}
                >
                    <AccordionItem key="1" aria-label="Фамилия, имя" title="Фамилия, имя:"
                        startContent={<Icon icon="wpf:name" />}
                    >
                        <p>Пробуйте разное написание фамилии и имени. </p>
                        <p>Например, фамилия <b>Абатуров</b> может упоминаться как "Оботуров" или "Абатуров", "Аботуров". </p>
                        <p><b>Василий</b> может быть записан как "Васка", <b>Иван</b> может быть записан как "Ивашка", "Ивашко".</p>
                    </AccordionItem>

                    <AccordionItem key="2" aria-label="Город" title="Город:"
                        startContent={<Icon icon="ic:round-castle" />}
                    >
                        <p>"Москва" в графе город означает служилых людей московских чинов или московских стрельцов. </p>
                    </AccordionItem>

                    <AccordionItem key="3" aria-label="Номер документа" title="Номер документа:"
                        startContent={<Icon icon="fa-solid:book" />}>
                        <p>Вы можете искать в отдельном конкретном документе, это сузит круг поиска.</p>
                        <p>Для этого на странице поиска <Link href="/" target='_blank'>Базы служилых людей</Link> укажите точный (или частичный) номер документа.</p>
                        <p>
                            Описание каждого документа <b>отдельно по городам</b>  есть на моем основном сайте {" "}
                            <Link href="https://dompredkov.ru/baza-dannyh-sluzhilogo-sosloviya-xviiv/" target='_blank' title='Перейти на сайт Дом предков'>Дом предков</Link>.
                        </p>
                        <p>
                            В описании указаны реквизиты дела, год, город, перечень фамилий и должности.
                        </p>
                    </AccordionItem>
                </Accordion>
            </CardBody>
        </Card>
    )
}

export default Faq