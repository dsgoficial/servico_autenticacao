import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const styles = makeStyles(theme => ({
  background: {
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed'
  }
}))

const BackgroundImages = props => {
  const classes = styles()

  const images = ['img-1.jpg', 'img-2.jpg', 'img-3.jpg', 'img-4.jpg', 'img-5.jpg']
  const randomNumber = Math.floor(Math.random() * images.length);
  const imageUrl = `${process.env.PUBLIC_URL}/${images[randomNumber]}`

  return (
    <div className={classes.background} style={{ backgroundImage: `url(${imageUrl})` }}>
      {props.children}
    </div>
  )
}

export default BackgroundImages
