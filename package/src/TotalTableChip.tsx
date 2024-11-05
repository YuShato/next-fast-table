import React, { useMemo } from 'react'
import { Chip } from '@nextui-org/react'

export const MobileTableChip = ({ finded = 0, total = 0, getQuery }) => {
    const text = useMemo(() => {
        if (getQuery.isPending || getQuery.isLoading || getQuery.isFetching) {
            return "Загрузка..."
        } else if (getQuery.isError) {
            return "Произошла ошибка"
        } else if (total > 0) {
            return (
                <>
                    Найдено <b>{Intl.NumberFormat("ru").format(finded)}</b><br/> из <b>{Intl.NumberFormat("ru").format(total)}</b> ед.
                </>
            )
        } else {
            return (<>
                По запросу ничего не найдено. <br/> Всего в базе <b>{Intl.NumberFormat("ru").format(total)}</b> ед.
            </>
            )
        }
    }, [total, getQuery])

    return (
        <Chip radius='none' variant="faded" style={{ color: "#B14101", borderColor: "#B14101", display: "flex", alignItems: "center", flexWrap: "wrap", height: "fit-content", fontSize: "12px", width: "100%", maxWidth: "140px", textAlign: "center" }}>{text}</Chip>
    )

}

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
        <Chip radius='none' variant="faded" style={{ color: "#B14101", borderColor: "#B14101" }}>{text}</Chip>
    )
}

export default TotalTableChip