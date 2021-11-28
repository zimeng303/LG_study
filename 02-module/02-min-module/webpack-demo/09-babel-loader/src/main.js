import createHeading from './heading.js'
import './main.css'

import u from './u0.png'

const heading = createHeading()

document.body.append(heading)

const img = new Image()
img.src = u
document.body.append(img)
