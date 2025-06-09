import React from 'react'

export default function Footer() {
  return (
    <div className='ftr'>
        <img src={`${import.meta.env.BASE_URL}logoMED.svg`} alt="logoMED" className="logoIMG" height={100}/>
    <p className='credentials'>©MB 2024/25.</p>
    </div>
  )
}
