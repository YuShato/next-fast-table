import { Chip } from '@nextui-org/react'
import React, { useMemo } from 'react'

const TableChip = ({ total, getQuery }) => {
    const color = useMemo(() => {
        if (getQuery.isPending) {
            return "#ffdb58"
        }

        if (getQuery.isError || total === 0) {
            return "#ff9797"
        }

        if (total > 0) {
            return "#ffd6a8"
        }

        return "secondary"
    }, [total, getQuery])

    const text = useMemo(() => {
        if (getQuery.isPending || getQuery.isLoading || getQuery.isFetching) {
            return "Загрузка..."
        } else if (getQuery.isError) {
            return "Произошла ошибка"
        } else if (total > 0) {
            return (
                <>
                    Найдено <b> {Intl.NumberFormat("ru").format(total)}</b> записей
                </>
            )
        } else {
            return "Ничего не найдено"
        }
    }, [total, getQuery])

    return (
        <Chip radius='none' variant="bordered" style={{ color: color, borderColor: color }}>{text}</Chip>
    )
}

export default TableChip