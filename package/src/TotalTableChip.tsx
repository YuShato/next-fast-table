import React, { useMemo } from 'react'
import { Chip } from '@nextui-org/react'

const TotalTableChip = ({ total, getQuery }) => {
    const text = useMemo(() => {
        if (getQuery.isPending || getQuery.isLoading || getQuery.isFetching) {
            return "Загрузка..."
        } else if (getQuery.isError) {
            return "Произошла ошибка"
        } else if (total > 0) {
            return `Всего в базе данных ${Intl.NumberFormat("ru").format(total)} записей`
        } else {
            return "Ничего не найдено"
        }
    }, [total, getQuery])

    return (
        <Chip color={"primary"} variant="faded">{text}</Chip>
    )
}

export default TotalTableChip