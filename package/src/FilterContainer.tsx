import React, { useEffect, useState } from 'react'

const FilterContainer = ({ children }) => {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <div className="top-0 left-0 z-10 p-2 border-b border-gray-200 bg-foreground" style={{ width: "100%", position: isScrolled ? "fixed" : "sticky", top: 0 }}>
            {children}
        </div>
    )
}


export default FilterContainer