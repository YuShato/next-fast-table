import { Button, Card, CardBody, CardHeader, Input, Textarea } from '@nextui-org/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { sendOrder } from '../utils/send-order';

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
            console.log("🚀 ~ onSubmit ~ data: FavoritesForm", data)
            // sendEmail(data);
            sendOrder(data)
            toast.success('Заявка успешно отправлена', { position: 'top-right' });
            reset()
            setEmailValue("")
            // setPhoneNumber("")
            setNameValue("")
            setMessageValue("")
        } catch (error) {
            toast.error('Произошла ошибка при отправке заявки', { position: 'top-right' });
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
    
        if (messageValue.length === 0 ||initialized && messageValue.length < 10) return true;
        return false;
    }, [messageValue, defaultFavMessage]);
    // const isPhoneNumberInvalid = React.useMemo(() => {
    //     if (phoneNumber === "") return false;
    //     return !pattern.test(phoneNumber);
    // }, [phoneNumber]);

    const isAllValid = React.useMemo(() => {
        return !isEmailInvalid && !isNameInvalid  && emailValue !== "" && nameValue !== "";
    }, [isEmailInvalid, isNameInvalid, emailValue, nameValue, messageValue]);



    return (
        <Card isBlurred className='w-full'>
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
                            size='sm'
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
                        style={{ fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: isAllValid ? "primary" : "default" }}
                        type="submit"
                        className="hover:shadow-form rounded-md  outline-none"
                        disabled={!isAllValid}>
                        Отправить
                    </Button>
                </form>
            </CardBody>
        </Card>
    )
}

export default FavoritesForm