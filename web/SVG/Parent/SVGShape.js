import SVGElement from "./SVGElement.js"

export default class SVGShape extends SVGElement {
    constructor(parameters = {}) {
        super(parameters)

        this.translationVecXY = [0, 0]
        this.rotationRads = 0
        this.scaleVecXY = [1, 1]

        
        this.PointerEvent = parameters.pointerEvent || "auto"
        if (parameters.scale) {
            this.Scale = parameters.scale 
        }
        if (parameters.rotation) {
           this.Rotation = parameters.rotate
        }
        if (parameters.translation) {
            this.Translation = parameters.translate
        }

        
        this.buttons = []
        this.GetClasses().then(() => {
            this.InitialiseGroups()
            if (parameters.buttons == "default") {
                this.PushButton({
                    shape: "Rectangle", buttonType: "scale",
                    x:0, y:0,
                    width: "50px", height: "50px",
                    direction: [-1, -1],
                    fill: "red",
                })
                this.PushButton({
                    shape: "Rectangle", buttonType: "scale",
                    x:1, y:1,
                    width: "50px", height: "50px",
                    direction: [1, 1],
                    fill: "orange", 
                })
                this.PushButton({
                    shape: "Rectangle", buttonType: "rotate",
                    x:0.5, y:0,
                    width: "50px", height: "50px",
                    fill: "blue", 
                })
            }
        })

        this.Fill = parameters.fill
        this.Stroke = parameters.stroke
        this.StrokeWidth = parameters.strokeWidth

        
        this.mouseDownEvent = this.MouseDownEvent.bind(this)
        this.mouseUpEvent = this.MouseUpEvent.bind(this)
        this.clickEvent = this.ClickEvent.bind(this)
        this.dbClickEvent = this.DBClickEvent.bind(this)
        this.mouseMoveEvent = this.MouseMoveEvent.bind(this)
        
        this.Element.onmousedown = this.mouseDownEvent
        this.Element.onclick = this.clickEvent
        this.Element.ondblclick = this.dbClickEvent
    }
    get RawMatrix() {
        const Translation = this.Translation
        const Rotation = this.Rotation
        const Scale = this.Scale
        const BBoxCenter = this.BBoxCenter
        console.log(BBoxCenter)
        const matrix = mat2d.create()
        mat2d.translate(matrix, matrix, [Translation[0]+this.BBoxCenter[0], Translation[1]+this.BBoxCenter[0]])
        mat2d.rotate(matrix, matrix, Rotation)
        mat2d.scale(matrix, matrix, [Scale[0], Scale[1]])
        mat2d.translate(matrix, matrix, [-BBoxCenter[0], -BBoxCenter[0]])
        return matrix
    }
    get Matrix() {
        return this.Element.getAttribute("transform")
    }
    get Scale() {
        return this.scaleVecXY
    }
    set Scale(scale) {
        if (scale instanceof Array && scale.length == 2) {
            this.scaleVecXY[0] = scale[0]
            this.scaleVecXY[1] = scale[1]
            this.UpdateTransformations()
        } else {
            console.error("Scale needs to be an Array of length 2")
            return
        }
    }
    get Rotation() {
        return this.rotationRads
    }
    set Rotation(rotation) {
        rotation = parseFloat(rotation)
        if (!isNaN(rotation)) {
            this.rotationRads = rotation
            this.UpdateTransformations()
        } else {
            return
        }
    }
    get Translation() {
        return this.translationVecXY
    }
    set Translation(translation) {
        if (translation instanceof Array && translation.length == 2) {
            this.translationVecXY[0] = translation[0]
            this.translationVecXY[1] = translation[1]
            this.UpdateTransformations()
        } else {
            console.error("Translation needs to be an Array of length 2")
            return
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
    get Groups() {
        return this.groups
    }
    set Groups(groups) {
        this.groups = groups
    }
    get Classes() {
        return this.classes
    }
    set Classes(classes) {
        this.classes = classes
    }
    get Buttons() {
        return this.buttons
    }

    async GetClasses() {
        const SVGRectangleButtonModule = await import ("../Child/ChildButton/SVGRectangleButton.js")
        const SVGGroupModule = await import ("./SVGGroup.js")

        this.Classes = { Group: SVGGroupModule.default, Rectangle: SVGRectangleButtonModule.default }
    }
    PushButton(button) {
        const buttonObject = new this.Classes[button.shape]({
            parent: this, parentElement: this.Groups.Button, 
            buttonType: button.buttonType, 
            relativePosition: [button.x, button.y], 
            direction: button.direction, 
            width: button.width, height: button.height, 
            fill: button.fill, stroke: button.stroke, strokeWidth: button.strokeWidth,
            })
        this.buttons.push(buttonObject)
        this.UpdateTransformations()
    }
    InitialiseGroups() {
        const Group = this.Classes.Group
        this.Groups = {Button: new Group({parent: this.Parent}), Text: new Group({parent: this.Parent}), Misc: new Group({parent: this.Parent})}
    }
    MouseDownEvent(evt) {
        console.log("Mouse Down")
        this.PullForward()
        this.ToggleButtonVisibility()
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
        console.log("Mouse Move")
        if (evt.buttons != 1) {
            return
        }
        const movementX = evt.clientX - this.PreviousMouseX
        const movementY = evt.clientY - this.PreviousMouseY
        this.PreviousMouseX = evt.clientX
        this.PreviousMouseY = evt.clientY
        this.Translate([movementX, movementY])
    }
    UpdateTransformations() {
        this.UpdateMatrix()
        this.UpdateButtons()
    }
    UpdateButtons() {
        if (this.Buttons) {
            const bbox = this.BBox
            this.Buttons.forEach(button => {
                const point = vec2.fromValues(bbox.x+button.RelativePosition[0]*bbox.width, bbox.y+button.RelativePosition[1]*bbox.height)
                const transformedPoint = vec2.create()
                vec2.transformMat2d(transformedPoint, point, this.RawMatrix)
                button.SetCenter(transformedPoint[0], transformedPoint[1])
            })
        }
    }
    UpdateMatrix() {
        this.Element.setAttribute("transform", `matrix(${this.RawMatrix.join(' ')})`)
    }
    ToggleButtonVisibility() {
        if (this.Buttons) {
            this.Buttons.forEach(button => {
                button.ToggleVisibility()
            })
        }
    }
    Rotate(rotation) {
        this.Rotation = this.Rotation + rotation
    }
    Stretch(scale) {
        this.Scale = [this.Scale[0] + scale[0], this.Scale[1] + scale[1]]
    }
    ButtonStretch(dX, dY, directionX, directionY) {
        const rotatedDX = dX*Math.cos(-this.Rotation)-dY*Math.sin(-this.Rotation)
        const rotatedDY = dX*Math.sin(-this.Rotation)+dY*Math.cos(-this.Rotation)
        this.Stretch([rotatedDX*directionX, rotatedDY*directionY])
    }
    Translate(translation) {
        this.Translation = [this.Translation[0] + translation[0], this.Translation[1] + translation[1]]
    }
}