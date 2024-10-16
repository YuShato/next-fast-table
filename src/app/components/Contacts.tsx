'use client';

import React from 'react';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { sendEmail } from '../utils/send-email';
import { Toaster, toast } from "sonner";


import { Input, Button, Textarea } from '@nextui-org/react';

export type FormData = {
    name: string;
    email: string;
    message: string;
    tel?: string;
};

const ContactForm: FC = () => {
    const { register, handleSubmit, reset } = useForm<FormData>();

    function onSubmit(data: FormData) {
        try {
            sendEmail(data);
            toast.success('Заявка успешно отправлена', { position: 'top-right' });
            reset()
        } catch (error) {

            console.log("onSubmit in ContactForm file src/app/components/Contacts", error)
        }
    }

    return (
        <div>
            <Toaster richColors position="top-center" />

            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    type="text"
                    label="Имя"
                    placeholder="Имя"
                    className="w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:shadow-md"
                    {...register('name', { required: true })}
                />
                <Input
                    type="email"
                    label="Электронная почта"
                    placeholder="example@domain.com"
                    className="w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none  focus:shadow-md"
                    {...register('email', { required: true })}
                />
                <Input
                    type="tel"
                    label="Телефон"
                    placeholder="+79267777777"
                    className="w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:shadow-md"
                    {...register('tel', { required: false })}
                />
                <Textarea
                    rows={4}
                    label="Сообщение"
                    placeholder="Type your message"
                    className="w-full resize-none rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-purple-500 focus:shadow-md"
                    {...register('message', { required: true })}
                />
                <Button variant='bordered' color="primary" type="submit" className="hover:shadow-form rounded-md  outline-none">
                    Submit
                </Button>
            </form>
        </div>
    )
};

export default ContactForm;