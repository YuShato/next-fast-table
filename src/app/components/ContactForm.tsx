'use client';

import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { sendEmail } from '../utils/send-email';
import { Toaster, toast } from "sonner";


import { Input, Button, Textarea, CardHeader, Card, CardBody } from '@nextui-org/react';

export type FormData = {
    name: string;
    email: string;
    message: string;
    tel?: string;
};

export const MIN_MESSAGE_LENGTH = 5;

const ContactForm: FC = () => {
    const { register, handleSubmit, reset } = useForm<FormData>();

    function onSubmit(data: FormData) {
        try {
            sendEmail(data);
            toast.success('Заявка успешно отправлена', { position: 'top-right', duration: 2000 });
            reset()
            setEmailValue("")
            setPhoneNumber("")
            setNameValue("")
            setMessageValue("")
        } catch (error) {
            toast.error('Произошла ошибка при отправке заявки', { position: 'top-right', duration: 2000 });
            console.log("onSubmit in ContactForm file src/app/components/Contacts", error)
        }
    }

    const validateEmail = (value) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

    const [emailValue, setEmailValue] = React.useState("");
    const [nameValue, setNameValue] = React.useState("");
    const [messageValue, setMessageValue] = React.useState("");
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const pattern = /^[\d\+][\d\(\)\ -]{4,14}\d$/;

    const messagePlaceholder = "Введите, пожалуйста,  исходные данные. Если речь о поиске предков, то ФИО, год и место рождения самого раннего предка/ов + другая сжатая инф-я, которая имеется. Информацию можно отправить по почте здесь в заявке(желательно) , в мессенджеры или в соцсети.  Спасибо!";

    const isEmailInvalid = React.useMemo(() => {
        if (emailValue === "") return false;

        return validateEmail(emailValue) ? false : true;
    }, [emailValue]);

    const isNameInvalid = React.useMemo(() => {
        if (nameValue.length > 0 && nameValue.length < 2) return true;
        return false;
    }, [nameValue]);

    const isMessageInvalid = React.useMemo(() => {
        if (messageValue.length > 0 && messageValue.length < MIN_MESSAGE_LENGTH) return true;
        return false;
    }, [messageValue]);

    const isPhoneNumberInvalid = React.useMemo(() => {
        if (phoneNumber === "") return false;
        return !pattern.test(phoneNumber);
    }, [phoneNumber]);

    const isAllValid = React.useMemo(() => {
        return !isEmailInvalid && !isNameInvalid && !isMessageInvalid && emailValue !== "" && nameValue !== "" && messageValue !== "";
    }, [isEmailInvalid, isNameInvalid, isMessageInvalid, emailValue, nameValue, messageValue]);

    return (
        <Card isBlurred
            className='p-4 grid gap-2'
            style={{ width: "100%", minWidth: "360px" }}>
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h3 style={{ fontWeight: 'bold', textTransform: 'uppercase' }} className="font-bold text-large uppercase">Оставить заявку</h3>
            </CardHeader>

            <Toaster richColors position="top-center" />
            <CardBody>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                    <Input
                        isRequired
                        type="text"
                        size='lg'
                        label={<span style={{ fontWeight: 'bold' }}>Имя</span>}
                        placeholder="Имя"
                        errorMessage="Пожалуйста, введите имя"
                        isInvalid={isNameInvalid}
                        value={nameValue}
                        color={nameValue === "" ? "default" : isNameInvalid ? "warning" : "success"}
                        onValueChange={setNameValue}
                        className="w-full  rounded-md  outline-none focus:shadow-md focus:shadow-blue-300 active:shadow-blue-300 target:shadow-blue-300 "
                        {...register('name', { required: true })}

                    />
                    <Input
                        isRequired
                        type="email"
                        size='lg'
                        label={<span style={{ fontWeight: 'bold' }}>Электронная почта</span>}
                        placeholder="example@mail.ru"
                        isInvalid={isEmailInvalid}
                        color={emailValue === "" ? "default" : isEmailInvalid ? "warning" : "success"}
                        errorMessage="Пожалуйста, введите корректный адрес электронной почты"
                        onValueChange={setEmailValue}
                        {...register('email', { required: true })}
                    />
                    <Input
                        type="tel"
                        isInvalid={isPhoneNumberInvalid}
                        errorMessage="Пожалуйста, введите корректный номер телефона"
                        label={<span style={{ fontWeight: 'bold' }}>Номер телефона</span>}
                        pattern='/^[\d\+][\d\(\)\ -]{4,14}\d$/'
                        placeholder="+79267777777"
                        size='lg'
                        color={phoneNumber === "" ? "default" : isPhoneNumberInvalid ? "warning" : "success"}
                        value={phoneNumber}
                        onValueChange={setPhoneNumber}
                        {...register('tel', { required: false })}
                    />
                    <Textarea
                        isRequired
                        isInvalid={isMessageInvalid}
                        color={messageValue === "" ? "default" : isMessageInvalid ? "warning" : "success"}
                        errorMessage="Пожалуйста, введите сообщение"
                        minRows={6}
                        label={<span style={{ fontWeight: 'bold' }}>Сообщение</span>}
                        placeholder={messagePlaceholder}
                        value={messageValue}
                        onValueChange={setMessageValue}
                        {...register('message', { required: true })}
                    />
                    <Button color={isAllValid ? "primary" : "default"} size='lg' style={{ width: '100%', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: isAllValid ? "primary" : "default" }} type="submit" className="hover:shadow-form rounded-md  outline-none" disabled={!isAllValid}>
                        Отправить
                    </Button>
                </form>
            </CardBody>
        </Card>
    )
};

export default ContactForm;