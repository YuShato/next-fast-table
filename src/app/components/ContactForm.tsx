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

interface ContactFormProps {
    onCloseCallback?: () => void;
}

const ContactForm: FC<ContactFormProps> = ({ onCloseCallback = () => { } }) => {
    const { register, handleSubmit, reset } = useForm<FormData>();

    function onSubmit(data: FormData) {
        try {
            sendEmail(data);
            toast.success('Заявка успешно отправлена',
                {
                    position: 'top-right',
                    duration: 1200,
                    closeButton: true,
                    style: {
                        padding: "3px",
                        paddingInline: "5px",
                        maxWidth: "200px",
                        width: "fit-content",
                    }
                });
            reset()
            // setEmailValue("")
            // setPhoneNumber("")
            // setNameValue("")
            setMessageValue("")
            onCloseCallback();
        } catch (error) {
            toast.error('Произошла ошибка при отправке заявки', {
                position: 'top-right',
                duration: 1200, 
                closeButton: true,
                style: {
                    padding: "3px",
                    paddingInline: "5px",
                    maxWidth: "200px",
                    width: "fit-content",
                }
            });
            console.log("onSubmit in ContactForm file src/app/components/Contacts", error)
        }
    }

    const validateEmail = (value) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

    const [emailValue, setEmailValue] = React.useState(() => {

        if (typeof window !== "undefined") {
            const storedEmail = localStorage.getItem("email");
            return storedEmail || "";
        }

        return "";
    });

    const [nameValue, setNameValue] = React.useState(() => {
        if (typeof window !== "undefined") {
            const storedName = localStorage.getItem("name");
            return storedName || "";
        }

        return "";
    });

    const [messageValue, setMessageValue] = React.useState("");

    const [phoneNumber, setPhoneNumber] = React.useState(() => {
        if (typeof window !== "undefined") {
            const storedPhoneNumber = localStorage.getItem("tel");
            return storedPhoneNumber || "";
        }

        return "";
    });
    const pattern = /^[\d\+][\d\(\)\ -]{4,14}\d$/;

    const messagePlaceholder = "Пришлите, пожалуйста, сведения по кому хотите получить информацию в виде :  «реквизиты дела – ФИО» . Т.е. к примеру «210-5-38 Давыдов Максим». Также у Вас всегда есть возможность более оперативно сделать это на главной странице сайта , нажав «+» по той персоне , которая требуется и потом оформив заявку. Если интересует исследование по служилым людям или другим сословиям просьба прислать исходные данные и что именно хотите найти";


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
            radius='none'
            className='light-form'
            style={{ width: "100%" }}>
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h3 className='light-form__header'>Оставить заявку</h3>
            </CardHeader>

            <Toaster richColors position="top-center" />
            <CardBody >
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                    <Input
                        isRequired
                        type="text"
                        size='sm'
                        radius='none'
                        label={<span style={{ fontWeight: 'bold' }}>Имя</span>}
                        placeholder="Имя"
                        errorMessage="Пожалуйста, введите имя"
                        isInvalid={isNameInvalid}
                        value={nameValue}
                        color={nameValue === "" ? "default" : isNameInvalid ? "warning" : "success"}
                        // onValueChange={setNameValue}
                        className="filter-input light-form__input"
                        // {...register('name', { required: true })}
                        {...register('name', {
                            required: true,
                            onChange: (e) => {
                                setNameValue(e.target.value);
                                localStorage.setItem("name", e.target.value);
                            }
                        })}

                    />
                    <Input
                        isRequired
                        type="email"
                        size='sm'
                        radius='none'
                        label={<span style={{ fontWeight: 'bold' }}>Электронная почта</span>}
                        placeholder="example@mail.ru"
                        isInvalid={isEmailInvalid}
                        color={emailValue === "" ? "default" : isEmailInvalid ? "warning" : "success"}
                        errorMessage="Пожалуйста, введите корректный адрес электронной почты"
                        // onValueChange={setEmailValue}
                        className="filter-input light-form__input"
                        value={emailValue}
                        // {...register('email', { required: true })}
                        {...register('email', {
                            required: true,
                            onChange: (e) => {
                                setEmailValue(e.target.value);
                                localStorage.setItem("email", e.target.value);
                            }
                        })}
                    />
                    <Input
                        type="tel"
                        className="filter-input light-form__input"
                        radius='none'
                        isInvalid={isPhoneNumberInvalid}
                        errorMessage="Пожалуйста, введите корректный номер телефона"
                        label={<span style={{ fontWeight: 'bold' }}>Номер телефона</span>}
                        pattern='/^[\d\+][\d\(\)\ -]{4,14}\d$/'
                        placeholder="+79267777777"
                        size='sm'
                        color={phoneNumber === "" ? "default" : isPhoneNumberInvalid ? "warning" : "success"}
                        value={phoneNumber}
                        // onValueChange={setPhoneNumber}
                        // {...register('tel', { required: false })}
                        {...register('tel', {
                            required: false,
                            onChange: (e) => {
                                setPhoneNumber(e.target.value);
                                localStorage.setItem("tel", e.target.value);
                            }
                        })}
                    />
                    <Textarea
                        isRequired
                        radius='none'
                        className="filter-input light-form__input"
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
                    <Button color={isAllValid ? "primary" : "default"} size='md' type="submit" className="standart-btn" disabled={!isAllValid}>
                        Отправить
                    </Button>
                </form>
            </CardBody>
        </Card>
    )
};

export default ContactForm;