import React from 'react'

import styles from './styles.css'

const Spinner = props => {

  const { size } = props

  return (
    <div className={`${styles['la-ball-clip-rotate']} ${size ? styles[`la-${size}x`] : styles['la-sm']}`}>
    	<div></div>
    </div>
  )
}

export default Spinner
