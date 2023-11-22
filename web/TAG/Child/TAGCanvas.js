import TAGElement from "../Parent/TAGElement.js"

export default class TAGCanvas extends TAGElement {
    constructor(parameters = {}) {
        parameters.type = "CANVAS"
        super(parameters)

        this.objectBuffer = []
        if (parameters.objects) {
            this.Objects = parameters.objects
        }
        this.Context = parameters.context
        this.Fill = parameters.fill
    }
    get Objects() {
        return this.objectBuffer
    }
    set Objects(objects) {
        this.objectBuffer.push(...objects)
    }
    get Context() {
        return this.canvasContext
    }
    set Context(context) {
        this.canvasContext = this.Element.getContext(context)
    }
    get Fill() {
        return this.fillColour
    }
    set Fill(colour) {
        this.fillColour = colour
    }
    get AbsoluteWidth() {
        if (/%$/.test(this.Width)) {
            return parseFloat(this.Width)/100 * window.innerWidth
        } else {
            return parseFloat(this.Width)
        }
    }
    get AbsoluteHeight() {
        if (/%$/.test(this.Height)) {
            return parseFloat(this.Height)/100 * window.innerHeight
        } else {
            return parseFloat(this.Height)
        }
    }

    Draw() {
        this.Background()
        this.objectBuffer.forEach(object => {
            object.Draw()
        })
    }
    Background() {
        this.canvasContext.beginPath()
        this.canvasContext.fillStyle = this.Fill
        this.canvasContext.fillRect(0, 0, this.AbsoluteWidth, this.AbsoluteHeight)
        this.canvasContext.stroke()
    }
}