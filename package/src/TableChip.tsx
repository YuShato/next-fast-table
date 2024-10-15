import { Chip } from '@nextui-org/react'
import React, { useMemo } from 'react'

const TableChip = ({ total, getQuery }) => {
    const color = useMemo(() => {
        if (getQuery.isPending) {
            return "warning"
        }

        if (getQuery.isError || total === 0) {
            return "danger"
        }

        if (total > 0) {
            return "success"
        }

        return "secondary"
    }, [total, getQuery])

    const text = useMemo(() => {
        if (getQuery.isPending || getQuery.isLoading || getQuery.isFetching) {
            return "Загрузка..."
        } else if (getQuery.isError) {
            return "Произошла ошибка"
        } else if (total > 0) {
            return `Найдено ${Intl.NumberFormat("ru").format(total)} записей`
        } else {
            return "Ничего не найдено"
        }
    }, [total, getQuery])

    return (
        <Chip color={color} variant="bordered">{text}</Chip>
    )
}

export default TableChip