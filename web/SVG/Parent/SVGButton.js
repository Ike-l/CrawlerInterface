import SVGElement from "./SVGElement.js"

export default class SVGButton extends SVGElement {
    constructor(parameters = {}) {
        super(parameters)
        this.PointerEvent = parameters.pointerEvent || "auto"
        this.ButtonType = parameters.buttonType
        this.ParentElement = parameters.parentElement
        this.Display() // need this?
        if (this.ButtonType == "scale") {
            this.Direction = parameters.direction
        } else if (this.ButtonType == "slider") {
            this.StartPosition = parameters.startPosition
            this.EndPosition = parameters.endPosition
            this.InitialStart = {x: parameters.startPosition.x, y: parameters.startPosition.y}
            this.InitialEnd = {x: parameters.endPosition.x, y: parameters.endPosition.y}
            this.LinkedFunction = parameters.linkedFunction
            this.LinkedFunctionArguments = parameters.linkedFunctionArguments || []
            this.LinkedObject = parameters.linkedObject
        }

        this.RelativePosition = parameters.relativePosition
        
        this.Fill = parameters.fill
        this.Stroke = parameters.stroke
        this.StrokeWidth = parameters.strokeWidth

        this.Visible = false

        this.mouseDownEvent = this.MouseDownEvent.bind(this)
        this.mouseUpEvent = this.MouseUpEvent.bind(this)
        this.clickEvent = this.Click.bind(this)
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
       // console.log("Mouse Down")
        this.PreviousMouseX = evt.clientX
        this.PreviousMouseY = evt.clientY
        document.addEventListener("mousemove", this.mouseMoveEvent)
        document.addEventListener("mouseup", this.mouseUpEvent)
    }
    MouseUpEvent(evt) {
      //  console.log("Mouse Up")

        document.removeEventListener("mousemove", this.mouseMoveEvent)
        document.removeEventListener("mouseup", this.mouseUpEvent)
    }
    // ClickEvent(evt) {
    //     console.log("Click")
    // }
    DBClickEvent(evt) {
        console.log("Double Click")
    }
    MouseMoveEvent(evt) {
        if (evt.buttons != 1) {
            return
        }
        const movementX = evt.clientX - this.PreviousMouseX
        const movementY = evt.clientY - this.PreviousMouseY
        if (this.ButtonType == "scale") {
            const ScaleFactorX = parseFloat(this.Parent.Width) / 2
            const ScaleFactorY = parseFloat(this.Parent.Height) / 2
            this.Parent.ButtonStretch(movementX/ScaleFactorX, movementY/ScaleFactorY, this.Direction[0], this.Direction[1], movementX, movementY)
        } else if (this.ButtonType == "rotate") {
            this.Parent.Rotate(this.getAngle(movementX, movementY))
        } else if (this.ButtonType == "slider") {

            this.PreviousValueX = this.ValueX
            this.PreviousValueY = this.ValueY
            this.PreviousValueXY = this.ValueXY
            
            const ScaleFactorX = parseFloat(this.Parent.Width) 
            const ScaleFactorY = parseFloat(this.Parent.Height) 

            
            let sfX 
            let xOffset = 0
            if (Math.abs(this.EndPosition.x - this.StartPosition.x) > 0) {
                sfX = 1
            } else {
                sfX = 0
                xOffset = this.StartPosition.x
            }
            let sfY
            let yOffset = 0
            if (Math.abs(this.EndPosition.y - this.StartPosition.y) > 0) {
                sfY = 1
            } else {
                sfY = 0
                yOffset = this.StartPosition.y
            }
            
             const SX = parseFloat(this.Width)/2 / (this.Parent.Scale[0] * parseFloat(this.Parent.Width))
             const SY = parseFloat(this.Height)/2 / (this.Parent.Scale[1] * parseFloat(this.Parent.Height))
             this.StartPosition.x = (SX + this.InitialStart.x) * sfX + xOffset
             this.StartPosition.y = (SY + this.InitialStart.y) * sfY + yOffset

            this.EndPosition.x = (this.InitialEnd.x-SX) * sfX + xOffset
            this.EndPosition.y = (this.InitialEnd.y-SY) * sfY + yOffset
            
            const adjustedMovementX = (movementX/ScaleFactorX)/this.Parent.Scale[0]
            const adjustedMovementY = (movementY/ScaleFactorY)/this.Parent.Scale[1]
            
            this.RelativePosition = [
                Math.min(
                    Math.max(
                        this.RelativePosition[0] + adjustedMovementX,
                        this.StartPosition.x
                    ),
                    this.EndPosition.x),
                Math.min(
                    Math.max(
                        this.RelativePosition[1] + adjustedMovementY,
                        this.StartPosition.y
                    ), 
                    this.EndPosition.y
                )
            ]
            const value = this.EndPosition.value - this.StartPosition.value

           
            this.ValueX = ((value * (this.RelativePosition[0] - this.StartPosition.x)) / (this.EndPosition.x - this.StartPosition.x)) - (Math.abs(this.StartPosition.value))
            this.ValueY = ((value * (this.RelativePosition[1] - this.StartPosition.y)) / (this.EndPosition.y - this.StartPosition.y)) //- 0.5*(this.StartPosition.Value + this.EndPosition.Value)
            this.ValueXY = ((this.ValueX/value)**2+(this.ValueY/value)**2)**0.5 / 2**0.5

            const changeX = this.ValueX - this.PreviousValueX
            const changeY = this.ValueY - this.PreviousValueY
            const changeXY = this.ValueXY - this.PreviousValueXY

            if (this.LinkedObject) {
                this.LinkedObject.valueX = this.ValueX
                this.LinkedObject.valueY = this.ValueY
                this.LinkedObject.valueXY = this.ValueXY
                this.LinkedObject.changeX = changeX
                this.LinkedObject.changeY = changeY
                this.LinkedObject.changeXY = changeXY
            }
            if (this.LinkedFunction) {
                this.LinkedFunction(this.ValueX, this.ValueY, this.ValueXY, changeX, changeY, changeXY, this.LinkedFunctionArguments)
            }
            this.Parent.UpdateTransformations()
        }
        this.PreviousMouseX = evt.clientX
        this.PreviousMouseY = evt.clientY
       // console.log("Mouse Move Button")
    }
    getAngle(movementX, movementY) {
        const centerPoint = this.Parent.Center
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
        return this.parentElement?.element
    }
    set ParentElement(element) {
       this.parentElement = element 
    }
    get Direction() {
        return this.direction
    }
    set Direction(direction) {
        if (!direction) {
            console.error("No direction given to button!")
            return
        }
        if (direction.length == 2 && !isNaN(direction[0]) && !isNaN(direction[1])) {
            this.direction = direction
        }
    }
    get StartPosition() {
        return this.startPosition
    }
    set StartPosition(startPosition) {
        if (!startPosition) {
            console.error("No start Position given to button, please provide in the format {x: , y: , value: }")
            return
        }
        this.startPosition = startPosition
    }
    get EndPosition() {
        return this.endPosition
    }
    set EndPosition(endPosition) {
        if (!endPosition) {
            console.error("No start Position given to button, please provide in the format {x: , y: , value: }")
            return
        }
        this.endPosition = endPosition
    }
    get InitialStart() {
        return this.initialStart
    }
    set InitialStart(inStart) {
        this.initialStart = inStart
    }
    get InitialEnd() {
        return this.initialEnd
    }
    set InitialEnd(inEnd) {
        this.initialEnd = inEnd
    }
    get ValueX() {
        return this.valueX || 0
    }
    set ValueX(valueX) {
        this.valueX = valueX 
    }
    get ValueY() {
        return this.valueY || 0
    }
    set ValueY(valueY) {
        this.valueY = valueY
    }
    get ValueXY() {
        return this.valueXY || 0
    }
    set ValueXY(valueXY) {
        this.valueXY = valueXY
    }
    get PreviousValueX() {
        return this.previousValueX || 0
    }
    set PreviousValueX(previousValueX) {
        this.previousValueX = previousValueX 
    }
    get PreviousValueY() {
        return this.previousValueY || 0
    }
    set PreviousValueY(previousValueY) {
        this.previousValueY = previousValueY
    }
    get PreviousValueXY() {
        return this.previousValueXY || 0
    }
    set PreviousValueXY(previousValueXY) {
        this.previousValueXY = previousValueXY
    }
    get LinkedFunction() {
        return this.linkedFunction
    }
    set LinkedFunction(linkedFunction) {
        this.linkedFunction = linkedFunction
    }
    get LinkedFunctionArguments() {
        return this.linkedFunctionArguments 
    }
    set LinkedFunctionArguments(args) {
        this.linkedFunctionArguments = args
    }
    get LinkedObject() {
        return this.linkedObject
    }
    set LinkedObject(linkedObject) {
        this.linkedObject = linkedObject
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