'use client';

import React from 'react';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { sendEmail11 } from '../utils/send-email';

export type FormData = {
    name: string;
    email: string;
    message: string;
    tel?: string;
};

const ContactForm11: FC = () => {
    const { register, handleSubmit } = useForm<FormData>();

    function onSubmit(data: FormData) {
        sendEmail11(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-5'>
                <label
                    htmlFor='name'
                    className='mb-3 block text-base font-medium text-black'
                >
                    Имя
                </label>
                <input
                    type='text'
                    placeholder='Имя'
                    className='w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-purple-500 focus:shadow-md'
                    {...register('name', { required: true })}
                />
            </div>
            <div className='mb-5'>
                <label
                    htmlFor='email'
                    className='mb-3 block text-base font-medium text-black'
                >
                    Электронная почта
                </label>
                <input
                    type='email'
                    placeholder='example@domain.com'
                    className='w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-purple-500 focus:shadow-md'
                    {...register('email', { required: true })}
                />
            </div>
            <div className='mb-5'>
                <label
                    htmlFor='tel'
                    className='mb-3 block text-base font-medium text-black'
                >
                    Телефон
                </label>
                <input
                    type='tel'
                    placeholder='+79267777777'
                    className='w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-purple-500 focus:shadow-md'
                    {...register('tel', { required: false })}
                />
            </div>
            <div className='mb-5'>
                <label
                    htmlFor='message'
                    className='mb-3 block text-base font-medium text-black'
                >
                    Сообщение
                </label>
                <textarea
                    rows={4}
                    placeholder='Type your message'
                    className='w-full resize-none rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-purple-500 focus:shadow-md'
                    {...register('message', { required: true })}
                ></textarea>
            </div>
            <div>
                <button type='submit' className='hover:shadow-form rounded-md bg-purple-500 py-3 px-8 text-base font-semibold text-white outline-none'>
                    Submit
                </button>
            </div>
        </form>
    );
};

export default ContactForm11;