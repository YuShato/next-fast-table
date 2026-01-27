'use client'

import { FiSun, FiMoon } from "react-icons/fi"
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Image from "next/image"
import {
    Button,
    Tooltip,
} from "@nextui-org/react";

export default function ThemeSwitch() {
    const [mounted, setMounted] = useState(false)
    const { setTheme, resolvedTheme } = useTheme()

    useEffect(() => setMounted(true), [])

    // Render placeholder during SSR and initial hydration to prevent mismatch
    if (!mounted) {
        return (
            <Button
                className="switch-theme-btn"
                isIconOnly
                size="sm"
                isDisabled
            >
                <Image
                    src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
                    width={20}
                    height={20}
                    sizes="20x20"
                    alt="Loading Light/Dark Toggle"
                    priority={false}
                    title="Loading Light/Dark Toggle"
                />
            </Button>
        )
    }

    const isDark = resolvedTheme === 'dark'

    return (
        <Tooltip content={isDark ? "Переключить на светлый режим" : "Переключить на темный режим"}>
            <Button
                onPress={() => setTheme(isDark ? 'light' : 'dark')}
                className={`switch-theme-btn switch-theme-btn--${isDark ? 'dark' : 'light'}`}
                isIconOnly
                size="sm"
            >
                {isDark ? <FiSun /> : <FiMoon />}
            </Button>
        </Tooltip>
    )
}