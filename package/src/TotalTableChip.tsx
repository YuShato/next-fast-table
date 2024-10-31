import React, { useMemo } from 'react'
import { Chip } from '@nextui-org/react'

const TotalTableChip = ({ total, getQuery }) => {
    const text = useMemo(() => {
        if (getQuery.isPending || getQuery.isLoading || getQuery.isFetching) {
            return "Загрузка..."
        } else if (getQuery.isError) {
            return "Произошла ошибка"
        } else if (total > 0) {
            return (
                <>
                    Всего в базе данных <b>{Intl.NumberFormat("ru").format(total)}</b> записей
                </>
            )
        } else {
            return "Ничего не найдено"
        }
    }, [total, getQuery])

    return (
        <Chip radius='none' variant="faded" style={{color: "#B14101", borderColor: "#B14101"}}>{text}</Chip>
    )
}

export default TotalTableChip