import SVGElement from "./SVGElement.js"

export default class SVGButton extends SVGElement {
    constructor(parameters = {}) {
        super(parameters)
        this.PointerEvent = parameters.pointerEvent || "auto"
        this.ButtonType = parameters.buttonType
        this.ParentElement = parameters.parentElement
        this.Display()
        if (this.ButtonType == "scale") {
            this.Direction = parameters.direction
        }

        this.RelativePosition = parameters.relativePosition
        
        this.Fill = parameters.fill
        this.Stroke = parameters.stroke
        this.StrokeWidth = parameters.strokeWidth

        this.Visible = false

        this.mouseDownEvent = this.MouseDownEvent.bind(this)
        this.mouseUpEvent = this.MouseUpEvent.bind(this)
        this.clickEvent = this.ClickEvent.bind(this)
        this.dbClickEvent = this.DBClickEvent.bind(this)
        this.mouseMoveEvent = this.MouseMoveEvent.bind(this)

        this.Element.onmousedown = this.mouseDownEvent
        this.Element.onclick = this.clickEvent
        this.Element.ondblclick = this.dbClickEvent
    }
    SetCenter(x, y) {
        this.X = (x - parseFloat(this.Width) / 2) + "px"
        this.Y = (y - parseFloat(this.Height) / 2) + "px"
    }
    MouseDownEvent(evt) {
        console.log("Mouse Down")
        this.PreviousMouseX = evt.clientX
        this.PreviousMouseY = evt.clientY
        document.addEventListener("mousemove", this.mouseMoveEvent)
        document.addEventListener("mouseup", this.mouseUpEvent)
    }
    MouseUpEvent(evt) {
        console.log("Mouse Up")

        document.removeEventListener("mousemove", this.mouseMoveEvent)
        document.removeEventListener("mouseup", this.mouseUpEvent)
    }
    ClickEvent(evt) {
        console.log("Click")
    }
    DBClickEvent(evt) {
        console.log("Double Click")
    }
    MouseMoveEvent(evt) {
        if (evt.buttons != 1) {
            return
        }
        const movementX = evt.clientX - this.PreviousMouseX
        const movementY = evt.clientY - this.PreviousMouseY
        console.log(movementX, movementY)
        if (this.ButtonType == "scale") {
            const ScaleFactorX = parseFloat(this.Parent.Width)/2
            const ScaleFactorY = parseFloat(this.Parent.Height)/2
            this.Parent.ButtonStretch(movementX/ScaleFactorX, movementY/ScaleFactorY, this.Direction[0], this.Direction[1])
        } else if (this.ButtonType == "rotate") {
            this.Parent.Rotate(this.getAngle(movementX, movementY))
        }
        this.PreviousMouseX = evt.clientX
        this.PreviousMouseY = evt.clientY
        console.log("Mouse Move Button")
    }
    getAngle(movementX, movementY) {
        const centerPoint = this.Parent.Center
        console.log(centerPoint)
        const oldPoint = vec2.fromValues(this.PreviousMouseX, this.PreviousMouseY)
        const oldPointDirection = vec2.create()
        vec2.subtract(oldPointDirection, oldPoint, centerPoint)
        const newPoint = vec2.fromValues(this.PreviousMouseX+movementX, this.PreviousMouseY+movementY)
        const newPointDirection = vec2.create()
        vec2.subtract(newPointDirection, newPoint, centerPoint)
        const crossProduct = oldPointDirection[0] * newPointDirection[1] - oldPointDirection[1] * newPointDirection[0]
        const sign = Math.sign(crossProduct)
        const angle = vec2.angle(newPointDirection, oldPointDirection) * sign
        return angle
    }
    get RelativePosition() {
        return this.relativePositions
    }
    set RelativePosition(value) {
        this.relativePositions = value
    }
    get ParentElement() {
        return this.parentElement.element
    }
    set ParentElement(element) {
       this.parentElement = element 
    }
    get Direction() {
        return this.direction
    }
    set Direction(direction) {
        if (direction.length == 2 && !isNaN(direction[0]) && !isNaN(direction[1])) {
            this.direction = direction
        }
    }
    get ButtonType() {
        return this.buttonType
    }
    set ButtonType(type) {
        if (type) {
            this.buttonType = type
        } else {
            console.error("Button has no type!")
        }
    }
    get Fill() {
        return this.element.getAttribute("fill")
    }
    set Fill(colour) {
        this.element.setAttribute("fill", colour)
    }
    get Stroke() {
        return this.element.getAttribute("stroke")
    }
    set Stroke(colour) {
        this.element.setAttribute("stroke", colour)
    }
    get StrokeWidth() {
        return this.element.getAttribute("stroke-width")
    }
    set StrokeWidth(width) {
        this.element.setAttribute("stroke-width", width)
    }
}