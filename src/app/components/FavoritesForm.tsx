import { Button, Card, CardBody, CardHeader, Input, Textarea } from '@nextui-org/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { sendOrder } from '../utils/send-order';
import { MIN_MESSAGE_LENGTH } from './ContactForm';

export type OrderFormData = {
    email: string;
    name: string;
    message: string;
    dufavorites: any[];
}

const FavoritesForm = () => {
    const { register, handleSubmit, reset } = useForm<OrderFormData>();

    function onSubmit(data: OrderFormData) {
        try {
            sendOrder(data)
            toast.success('Заявка успешно отправлена', { position: 'top-right', duration: 2000 });
            reset()
            setEmailValue("")
            // setPhoneNumber("")
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
    // const [phoneNumber, setPhoneNumber] = React.useState("");
    // const pattern = /^[\d\+][\d\(\)\ -]{4,14}\d$/;
    const [initialized, setInitialized] = useState(false);

    const messagePlaceholder = "Тут будет текст сообщения по умолчанию";

    const defaultFavMessage = "Здравствуйте! Подскажите стоимость полной информации по этим записям."

    const isEmailInvalid = React.useMemo(() => {
        if (emailValue === "") return false;

        return validateEmail(emailValue) ? false : true;
    }, [emailValue]);

    const isNameInvalid = React.useMemo(() => {
        if (nameValue.length > 0 && nameValue.length < 2) return true;
        return false;
    }, [nameValue]);

    const isMessageInvalid = React.useMemo(() => {
        if (!initialized) return false;

        if (messageValue.length === 0 || initialized && messageValue.length < MIN_MESSAGE_LENGTH) return true;
        return false;
    }, [messageValue, defaultFavMessage]);
    // const isPhoneNumberInvalid = React.useMemo(() => {
    //     if (phoneNumber === "") return false;
    //     return !pattern.test(phoneNumber);
    // }, [phoneNumber]);

    const isAllValid = React.useMemo(() => {
        return !isEmailInvalid && !isNameInvalid && emailValue !== "" && nameValue !== "";
    }, [isEmailInvalid, isNameInvalid, emailValue, nameValue, messageValue]);



    return (
        <Card isBlurred className='w-full' radius='none'>
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h3 style={{ fontWeight: 'bold', textTransform: 'uppercase' }} className="font-bold text-large uppercase">
                    Оставить заявку
                </h3>
            </CardHeader>
            <CardBody>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
                    <div className='flex  gap-2 w-full'>
                        <Input
                            isRequired
                            type="text"
                            size='sm'
                            radius='none'
                             className='filter-input'
                            label={<span style={{ fontWeight: 'bold' }}>Имя</span>}
                            placeholder="Имя"
                            errorMessage="Пожалуйста, введите имя"
                            isInvalid={isNameInvalid}
                            value={nameValue}
                            color={nameValue === "" ? "default" : isNameInvalid ? "warning" : "success"}
                            onValueChange={setNameValue}
                            {...register('name', { required: true })}

                        />
                        <Input
                            isRequired
                            type="email"
                            size='sm'
                            radius='none'
                            className='filter-input'
                            label={<span style={{ fontWeight: 'bold' }}>Электронная почта</span>}
                            placeholder="example@mail.ru"
                            isInvalid={isEmailInvalid}
                            color={emailValue === "" ? "default" : isEmailInvalid ? "warning" : "success"}
                            errorMessage="Пожалуйста, введите корректный адрес электронной почты"
                            onValueChange={setEmailValue}
                            {...register('email', { required: true })}
                        />
                    </div>
                    {/* <Input
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
                    /> */}
                    <Textarea
                        isRequired
                        radius='none'
                         className='filter-input'
                        // isInvalid={false}
                        isInvalid={isMessageInvalid}
                        color={messageValue === "" ? "default" : isMessageInvalid ? "warning" : "success"}
                        errorMessage="Пожалуйста, введите сообщение"
                        minRows={4}
                        size='sm'
                        label={<span style={{ fontWeight: 'bold' }}>Сообщение</span>}
                        placeholder={messagePlaceholder}
                        defaultValue={initialized ? "" : defaultFavMessage}
                        {...register('message', { required: true, onChange: (e) => setMessageValue(e.target.value) })}
                    />
                    <Button
                        color={isAllValid ? "primary" : "default"}
                        size='md'
                        type="submit"
                        className="standart-btn"
                        disabled={!isAllValid}>
                        Отправить
                    </Button>
                </form>
            </CardBody>
        </Card>
    )
}

export default FavoritesForm