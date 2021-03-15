
// export const TrafficPointRenderer= {
//   render(context, point)
// }

export const TrafficPointCircleRenderer = {
  // radius='',
  // backgroundColor,
  // borderColor,
  // lineWidth,

  constructor(radius, backgroundColor, borderColor, lineWidth) {
    // super()
    this.radius = radius
    this.backgroundColor = backgroundColor
    this.borderColor = borderColor
    this.lineWidth = lineWidth
  },

  render(context, point) {
    context.fillStyle = this.backgroundColor
    context.strokeStyle = this.borderColor
    context.lineWidth = this.lineWidth
    context.beginPath()
    context.arc(point.x, point.y, this.radius, 0, 2 * Math.PI, true)
    context.stroke()
    context.fill()
  }
}

export const TrafficPointConcentricDiamondRenderer = {
  outerDiamond: '',
  innerDiamond: '',

  diamondPath(context, point, diamond) {
    context.fillStyle = diamond.backgroundColor
    context.strokeStyle = diamond.borderColor
    context.lineWidth = diamond.lineWidth
    context.beginPath()
    context.moveTo(point.x, point.y - diamond.radius)
    context.lineTo(point.x + diamond.radius, point.y)
    context.lineTo(point.x, point.y + diamond.radius)
    context.lineTo(point.x - diamond.radius, point.y)
    context.lineTo(point.x, point.y - diamond.radius)
    context.stroke()
    context.fill()
  },

  constructor(outerDiamond, innerDiamond) {
    // super(),
    this.outerDiamond = outerDiamond
    this.innerDiamond = innerDiamond
  },

  render(context, point) {
    TrafficPointConcentricDiamondRenderer.diamondPath(context, point, this.outerDiamond)
    TrafficPointConcentricDiamondRenderer.diamondPath(context, point, this.innerDiamond)
  }
}

export class Diamond {
  radius
  backgroundColor
  borderColor
  lineWidth

  constructor(radius, backgroundColor, borderColor, lineWidth) {
    this.radius = radius
    this.backgroundColor = backgroundColor
    this.borderColor = borderColor
    this.lineWidth = lineWidth
  }
}
