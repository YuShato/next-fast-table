"use client";

import { useState } from 'react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default function AdminPage() {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
                <h2 className="text-lg font-bold mb-4">Загрузить файл</h2>
                <input
                    type="file"
                    accept=".xlsx"
                    className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
                    onChange={handleFileChange}
                />
                {error && (
                    <p className="text-red-500 mb-4">{error}</p>
                )}
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    onClick={() => {
                        if (!file) {
                            setError(error);
                            return;
                        }
                        setError(null);
                        console.log(file);
                    }}
                    disabled={false}
                >
                    Загрузить
                </button>
                {file && file instanceof File && <p>Загружен файл: {file.name}</p>}
            </div>
        </div>
    );
}