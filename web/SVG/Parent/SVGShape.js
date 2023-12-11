import SVGElement from "./SVGElement.js"

export default class SVGShape extends SVGElement {
    constructor(parameters = {}) {
        super(parameters)

        const scale = this.Width / this.Height
        this.Height *= scale

        this.translationVecXY = [0, 0]
        this.rotationRads = 0
        this.scaleVecXY = [1, 1/scale]

        // is the shape draggable with the mouse
        this.Moveable = parameters.moveable || false
        // will there be end user interactions
        this.TextEditable = parameters.textEditable || false

        // the "_" at the end of the text
        this.UsePlaceholders = parameters.usePlaceholders
        if (typeof this.UsePlaceholders == "undefined") {
            this.UsePlaceholders = true
        }
        
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
        this.textLines = []
        this.GetClasses()
        this.InitialiseGroups()
        if (parameters.buttons == "default") {
            this.UsingDefaultButtons = "default"
            this.PushButton({
                shape: "rectangle", buttonType: "scale",
                x:0, y:0,
                width: "25", height: "25",
                direction: [-1, -1],
                fill: "red",
            })
            this.PushButton({
                shape: "rectangle", buttonType: "scale",
                x:1, y:1,
                width: "25px", height: "25px",
                direction: [1, 1],
                fill: "green", 
            })
            this.PushButton({
                shape: "ellipse", buttonType: "rotate",
                x:0.5, y:0,
                width: "25px", height: "25px",
                fill: "orange", 
            })
            this.PushButton({
                shape: "ellipse", buttonType: "function",
                x:0, y:1,
                width: "25px", height: "25px",
                fill: "black", 
                onClickFunction: this.Export
            })
        } else {
            this.UsingDefaultButtons = false
        }
        // a button which maps to the dbl click, enables text editing since some browsers don't support dbl click
        if (this.TextEditable) {
            this.PushButton({
                shape: "ellipse", buttonType: "function",
                x:1, y:0,
                width: "25px", height: "25px",
                fill: "#332244", 
                onClickFunction: this.DBlClickEvent.bind(this)
            })
        }
        this.ButtonVisibility = false
        this.TextVisibility = true

        this.Fill = parameters.fill
        this.Stroke = parameters.stroke
        this.StrokeWidth = parameters.strokeWidth
        // used before had the button line 74
        //this.dblClickPeriod = 1000
        //this.lastClicked = performance.now() - this.dblClickPeriod
        
        this.LineNumber = 0
        this.CharacterNumber = 0
        // ensure events are scoped to the object
        this.mouseDownEvent = this.MouseDownEvent.bind(this)
        this.mouseUpEvent = this.MouseUpEvent.bind(this)
        this.clickEvent = this.ClickEvent.bind(this)
        this.dblClickEvent = this.DBlClickEvent.bind(this)
        this.mouseMoveEvent = this.MouseMoveEvent.bind(this)
        this.keyDownEvent = this.KeyDownEvent.bind(this)
        this.mouseDownDBlClickEvent = this.MouseDownDBlClickEvent.bind(this)
        
        this.Element.onmousedown = this.mouseDownEvent
        this.Element.onclick = this.clickEvent
        this.Element.ondblclick = this.dblClickEvent

    }
    Export() {
        // logs the current shape with its attributes
        console.log(`new ${this.Parent.constructor.name}({label: ${this.Parent.Label}, buttons: ${this.Parent.UsingDefaultButtons}, parent: ${this.Parent.Parent}, width: ${this.Parent.Width}, height: ${this.Parent.Height}, x: ${this.Parent.X}, y: ${this.Parent.Y}, fill: ${this.Parent.Fill}, moveable: ${this.Parent.Moveable}, textEditable: ${this.Parent.TextEditable}, usePlaceholders: ${this.Parent.UsePlaceholders}, pointerEvent: ${this.Parent.PointerEvent}, scale: ${this.Parent.Scale}, rotation: ${this.Parent.Rotation}, translation: [${this.Parent.Translation[0]}, ${this.Parent.Translation[1]}], Fill: ${this.Parent.Fill}, Stroke: ${this.Parent.Stroke}, StrokeWidth: ${this.Parent.StrokeWidth}})`)

        
        const xAbsoluteNew = parseFloat(this.Parent.AbsoluteX) + this.Parent.Translation[0]
        const yAbsoluteNew = parseFloat(this.Parent.AbsoluteY) + this.Parent.Translation[1]

        // makes the code less verbose
        const c = CRAWLER_RENDERER.GPU.Canvas

        const xRelativeNew = xAbsoluteNew / c.AbsoluteWidth * 100
        const yRelativeNew = yAbsoluteNew / c.AbsoluteHeight * 100
        // logs the raw x and y of the current position
        console.log(`New Position: ${xAbsoluteNew}px, ${yAbsoluteNew}px`)
        console.log(`New Position: ${xRelativeNew}%, ${yRelativeNew}%`)
    }
    get UsingDefaultButtons() {
        return this.usingDefaultButtons
    }
    set UsingDefaultButtons(flag) {
        this.usingDefaultButtons = flag
    }
    get RawMatrix() {
        const Translation = this.Translation
        const Rotation = this.Rotation
        const Scale = this.Scale
        const BBoxCenter = this.BBoxCenter
        const matrix = mat2d.create()
        // widely accepted as the standard
        mat2d.translate(matrix, matrix, [Translation[0]+this.BBoxCenter[0], Translation[1]+this.BBoxCenter[1]])
        mat2d.rotate(matrix, matrix, Rotation)
        mat2d.scale(matrix, matrix, [Scale[0], Scale[1]])
        mat2d.translate(matrix, matrix, [-BBoxCenter[0], -BBoxCenter[1]])
        return matrix
    }
    
    get TransformedPoint() {
        const transformedPoint = vec2.create()
        const currentPoint = vec2.fromValues(this.AbsoluteX, this.AbsoluteY)
        
        vec2.transformMat2d(transformedPoint, currentPoint, this.RawMatrix)
        return transformedPoint
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
    get Text() {
        return this.textLines
    }
    get LineNumber() {
        return this.currentLineNumber
    }
    set LineNumber(num) {
        if (this.Text.length == 0) {
            this.currentLineNumber = Math.max(num, 0)
        } else {
            this.currentLineNumber = Math.min(
                Math.max(
                    num, 0
                ),
                this.Text.length-1
            )
        }
    }
    get CharacterNumber() {
        return this.currentCharacterNumber
    }
    set CharacterNumber(num) {
        this.currentCharacterNumber = Math.max(num, 0)
    }
    get Moveable() {
        return this.moveable
    }
    set Moveable(moveable) {
        this.moveable = moveable
    }
    get TextEditable() {
        return this.textEditable
    }
    set TextEditable(textEditable) {
        this.textEditable = textEditable
    }
    get UsePlaceholders() {
        return this.usePlaceholderFlag
    }
    set UsePlaceholders(flag) {
        this.usePlaceholderFlag = flag
    }
    get ButtonVisibility() {
        return this.buttonVisibility
    }
    set ButtonVisibility(flag) {
        this.buttonVisibility = flag
    }
    
    GetClasses() {
        const SVGRectangleButtonClass = CRAWLER_INTERFACE.SVGS.SVGRectangleButton
        const SVGEllipseButtonClass = CRAWLER_INTERFACE.SVGS.SVGEllipseButton
        const SVGTextClass = CRAWLER_INTERFACE.SVGS.SVGText
        const SVGGroupClass = CRAWLER_INTERFACE.SVGS.SVGGroup
        
        this.Classes = { group: SVGGroupClass, text: SVGTextClass, rectangle: SVGRectangleButtonClass, ellipse: SVGEllipseButtonClass }
    }
    PushButton(button) {
        const Shape = this.Classes[button.shape]
        let buttonObject
        if (button.buttonType == "scale") {
            buttonObject = new Shape({
                label: button.label,
                parent: this, parentElement: this.Groups.Button, 
                buttonType: button.buttonType, 
                relativePosition: [button.x, button.y], 
                direction: button.direction, 
                width: button.width, height: button.height, 
                fill: button.fill, stroke: button.stroke, 
                strokeWidth: button.strokeWidth,
                })
        } else if (button.buttonType == "rotate") {
            buttonObject = new Shape({
                label: button.label,
                parent: this, parentElement: this.Groups.Button, 
                buttonType: button.buttonType, 
                relativePosition: [button.x, button.y],  
                width: button.width, height: button.height, 
                fill: button.fill, stroke: button.stroke,
                strokeWidth: button.strokeWidth,
                })
        } else if (button.buttonType == "function") {
            buttonObject = new Shape({
                label: button.label,
                parent: this, parentElement: this.Groups.Button,
                buttonType: button.buttonType,
                relativePosition: [button.x, button.y],  
                onClickFunction: button.onClickFunction,
                onClickArguments: button.onClickArguments,
                width: button.width, height: button.height, 
                fill: button.fill, stroke: button.stroke,
                strokeWidth: button.strokeWidth,
                })
        } else if (button.buttonType == "slider") {
            buttonObject = new Shape({
                label: button.label,
                parent: this, parentElement: this.Groups.Button,
                buttonType: button.buttonType,
                relativePosition: [button.x, button.y],  
                width: button.width, height: button.height, 
                fill: button.fill, stroke: button.stroke,
                strokeWidth: button.strokeWidth,
                startPosition: button.startPosition,
                endPosition: button.endPosition,
                linkedFunction: button.linkedFunction,
                linkedFunctionArguments: button.linkedFunctionArguments,
                linkedObject: button.linkedObject,
            })
        }
     
        this.buttons.push(buttonObject)
        if (button.visible) {
            buttonObject.ToggleVisibility()
        }
        
        this.UpdateTransformations()
    }
    ClearText() {
        // resets the text on the SVG
        this.Text.forEach(text => {
            text.Remove()
        })
        this.textLines = []
        this.LineNumber = 0
        this.CharacterNumber = 0
    }
    // starts a new line "amount" times with the "details"
    StartNewLine(amount = 1, details) {
        for (let i = 0; i < amount; i++) {
            this.PushTextLine("", details, this.LineNumber+1)
            if (typeof this.Text[this.LineNumber].PlaceholderLocation != "undefined") {
                this.Text[this.LineNumber].RemovePlaceholder()
            }
            // update where the user would type
            this.LineNumber ++
            this.CharacterNumber = 0
            this.Text[this.LineNumber].RemovePlaceholder()
            if (this.UsePlaceholders) {
                this.Text[this.LineNumber].AddPlaceholder(this.CharacterNumber)
            }
        }
    }
    // writes to the svg, bool for if to start or end on a new line 
    Write(text, startNewLine, endNewLine, details= {}) {

        if (this.Text.length==0) {
            this.PushTextLine("", details, this.LineNumber+1)
        }
        
        if (startNewLine) {
            this.StartNewLine(1, details)
        }
        // simulates typing ensures the svg is synchronised if the user starts typing on the encoded text
        for (const char of text) {
            this.KeyDownEvent({ key: char, ctrl: false, shift: false, alt: false})
        }
        if (endNewLine) {
            this.StartNewLine(1, details)
        }
    }
    // replaces a line with the given text at the given index with the given details
    ReplaceLine(text, index, properties = {}) {
        
        if (this.Text[index]) {
            this.Text[index].Text = text
            if (properties.fontSize) {
                this.Text[index].FontSize = properties.fontSize
            }
            if (properties.fontColour) {
                this.Text[index].Fill = properties.fontColour
            }
        } else {
            this.PushTextLine(text, properties, index)
        }
    }
    // splices a new line with the given text, details at the index
    PushTextLine(text, details={}, index) {
        const Text = this.Classes.text
        const textObject = new Text({
            parent: this, parentElement: this.Groups.Text,
            text: text, lineNumber: this.LineNumber,
            fontSize: details.fontSize, 
            fill: details.fontColour,
        })
        this.textLines.splice(index, 0, textObject)
        
        this.UpdateTransformations()
    }
    // adds text to the current line
    InsertText(text, lineIndex, characterIndex) {
        
        const line = this.Text[lineIndex]
        // ensures placeholder synchronicity
        if (this.UsePlaceholders) {
            line?.RemovePlaceholder()
        }
        //console.log("LINE:",line)
        //console.log("TEXT:",this.Text)
        line.InsertText(text, characterIndex)
        
        // ensures placeholder synchronicity
        if (this.UsePlaceholders) {
            line.AddPlaceholder(characterIndex+1)
        }
    }
    // adds text at the given line, character index, replacing a certain amount with text
    SpliceText(lineIndex, characterIndex, replaceCount, text="") {
        const line = this.Text[lineIndex]
        // ensures placeholder synchronicity
        if (this.UsePlaceholders) {
            line.RemovePlaceholder()
        }
        line.SpliceText(text, characterIndex, replaceCount)
        // ensures placeholder synchronicity
        if (this.UsePlaceholders) {
            line.AddPlaceholder(characterIndex)
        }
    }
    InitialiseGroups() {
        const Group = this.Classes.group
        // order specifies the render order too, so Misc ontop Text ontop Buttons ontop shape
        this.Groups = {Button: new Group({parent: this.Parent}), Text: new Group({parent: this.Parent}), Misc: new Group({parent: this.Parent})}
    }
    MouseDownEvent(evt) {
        //console.log("Mouse Down")
        // when clicked, push the svg to the front
        this.PullForward()
        // turn the bottons on or off
        this.ToggleButtonVisibility()
        this.PreviousMouseX = evt.clientX
        this.PreviousMouseY = evt.clientY
        document.addEventListener("mousemove", this.mouseMoveEvent)
        document.addEventListener("mouseup", this.mouseUpEvent)
    }
    MouseUpEvent(evt) {
        //console.log("Mouse Up")
        this.ClickEvent(evt)
        document.removeEventListener("mousemove", this.mouseMoveEvent)
        document.removeEventListener("mouseup", this.mouseUpEvent)
    }
    ClickEvent(evt) {
        //console.log("Click")
        // legacy from when didnt have the button line 74
        //if (performance.now() - this.lastClicked <= this.dblClickPeriod) {
            //this.DBlClickEvent(evt)
            //this.lastClicked = performance.now() - this.dblClickPeriod
        //} else {
            //this.lastClicked = performance.now()
        //}
    }
    DBlClickEvent(evt) {
        console.log("Double Click")
        if (!this.TextEditable) {
            return
        }
        // ensures there is text svg to type on
        if (this.Text.length==0) {
            this.PushTextLine("", {fontSize:"20px"}, this.LineNumber+1)
        } else {
            this.LineNumber = this.Text.length
        }
        document.addEventListener("keydown", this.keyDownEvent)
        document.addEventListener("dblclick", this.mouseDownDBlClickEvent)
        this.triggeredDBlClick = performance.now()
    }
    MouseDownDBlClickEvent(evt) {
        if (performance.now()-this.triggeredDBlClick < 1) {
            return
        }
            
        console.log("Removed event")
        // hides the placeholder when not typing
        this.Text[this.LineNumber].RemovePlaceholder()
        document.removeEventListener("keydown", this.keyDownEvent)
        document.removeEventListener("dblclick", this.mouseDownDBlClickEvent)
    }
    MouseMoveEvent(evt) {
        //console.log("Mouse Move")
        // has to be left click
        if (evt.buttons != 1) {
            return
        }
        const movementX = evt.clientX - this.PreviousMouseX
        const movementY = evt.clientY - this.PreviousMouseY
        this.PreviousMouseX = evt.clientX
        this.PreviousMouseY = evt.clientY
        if (this.Moveable) {
            this.Translate([movementX, movementY])
        }
    }
    ParseLetterText(keys) {
        this.InsertText(keys.key, this.LineNumber, this.CharacterNumber++)
    }
    ParsePowerText(keys) {
        switch (keys.key) {
            case "Backspace":
                if (--this.CharacterNumber >= 0) {
                    this.SpliceText(this.LineNumber, this.CharacterNumber, 1)
                }
                break
            case "Delete":
                this.SpliceText(this.LineNumber, this.CharacterNumber, 1)
                break
            case "Enter":
                if (keys.shift) {
                    this.StartNewLine()
                }
                break
            case "ArrowUp":
                this.Text[this.LineNumber].RemovePlaceholder()
                this.LineNumber --
                this.Text[this.LineNumber].RemovePlaceholder()
                //console.log("PLACEHOLDER", this.UsePlaceholder)
                this.CharacterNumber = Math.min(this.CharacterNumber, this.Text[this.LineNumber].Text.length)
                if (this.UsePlaceholders) {
                    //console.log("A")
                    this.Text[this.LineNumber].AddPlaceholder(this.CharacterNumber)
                }
                break
            case "ArrowDown":
                this.Text[this.LineNumber].RemovePlaceholder()
                this.LineNumber ++
                this.Text[this.LineNumber].RemovePlaceholder()
               // console.log("PLACEHOLDER", this.UsePlaceholder)
                this.CharacterNumber = Math.min(this.CharacterNumber, this.Text[this.LineNumber].Text.length)
                if (this.UsePlaceholders) {
                    this.Text[this.LineNumber].AddPlaceholder(this.CharacterNumber)
                }
                break
            case "ArrowLeft":
                this.Text[this.LineNumber].RemovePlaceholder()
                this.CharacterNumber --
              //  console.log("PLACEHOLDER", this.UsePlaceholder)
                if (this.UsePlaceholders) {
                    this.Text[this.LineNumber].AddPlaceholder(this.CharacterNumber)
                }
                break
            case "ArrowRight":
                this.Text[this.LineNumber].RemovePlaceholder()
                this.CharacterNumber ++
             //   console.log("PLACEHOLDER", this.UsePlaceholder)
                if (this.UsePlaceholders) {
                    this.Text[this.LineNumber].AddPlaceholder(this.CharacterNumber)
                }
                break
            case "End":
                this.Text[this.LineNumber].RemovePlaceholder()
                this.CharacterNumber = this.Text[this.LineNumber].Text.length
                if (this.UsePlaceholders) {
                    this.Text[this.LineNumber].AddPlaceholder(this.CharacterNumber)
                }
        }
    }
    KeyDownEvent(evt) {
      //  console.log("Key Down")
         
        if (evt.key.length==1) {
            this.ParseLetterText({ key: evt.key, ctrl: evt.ctrlKey, shift: evt.shiftKey, alt: evt.altKey})
        } else {
            this.ParsePowerText({ key: evt.key, ctrl: evt.ctrlKey, shift: evt.shiftKey, alt: evt.altKey})
        }
    }
    UpdateTransformations() {
        // updates the elements positions with the transformations
        this.UpdateMatrix()
        this.UpdateButtons()
        this.UpdateText()
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
    UpdateText() {
        if (this.Text) {
            const bbox = this.BBox
            const point = vec2.fromValues(bbox.x, bbox.y)
            const transformedPoint = vec2.create()
            vec2.transformMat2d(transformedPoint, point, this.RawMatrix)
            
            let offset = 0
            for (const text of this.Text) {
                offset += parseFloat(text.FontSize)
                text.SetPosition(transformedPoint[0], transformedPoint[1]+offset)
            }
        }
    }
    UpdateMatrix() {
        // the HTMl of the svg is different so need to change the format before setting
        this.Element.setAttribute("transform", `matrix(${this.RawMatrix.join(' ')})`)
    }
    TurnCompletelyVisibility(visibility) {
        this.Visible = visibility
        this.TurnTextVisibility(visibility)
        this.TurnButtonVisibility(visibility)
    }
    TurnTextVisibility(visibility) {
        this.TextVisibility = visibility
        if (this.Text) {
            this.Text.forEach(text => {
                text.Visible = visibility
            })
        }
    }
    TurnButtonVisibility(visibility) {
        this.ButtonVisibility = visibility
        if (this.Buttons) {
            this.Buttons.forEach(button => {
                button.Visible = visibility
            })
        }
    }
    ToggleCompleteVisibility() {
        this.ToggleButtonVisibility()
        this.ToggleTextVisibility()
        this.ToggleVisibility()
    }
    ToggleTextVisibility() {
        this.TextVisibility = !this.TextVisibility
        if (this.Text) {
            this.Text.forEach(text => {
                text.ToggleVisibility()
            })
        }
    }
    ToggleButtonVisibility() {
        this.ButtonVisibility = !this.ButtonVisibility
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
    ButtonStretch(dX, dY, directionX, directionY, movementX, movementY) {
        const testVar = -1

        const WidthCHeight = parseFloat(this.Width)/parseFloat(this.Height)
        const HeightCWidth = parseFloat(this.Height)/parseFloat(this.Width)
        let rotatedDX
        let rotatedDY
        // changes based on whether it is height or width heavy.
        if (WidthCHeight < 1) {
            // standard 2D matrix rotations 
             rotatedDX = (dX*Math.cos(testVar * this.Rotation)-dY*Math.sin(testVar * this.Rotation)) * HeightCWidth
             rotatedDY = (dX*Math.sin(testVar * this.Rotation)+dY*Math.cos(testVar * this.Rotation)) * HeightCWidth
        } else {
             rotatedDX = (dX*Math.cos(testVar * this.Rotation)-dY*Math.sin(testVar * this.Rotation)) * WidthCHeight
             rotatedDY = (dX*Math.sin(testVar * this.Rotation)+dY*Math.cos(testVar * this.Rotation)) * WidthCHeight
        }

        this.Stretch([rotatedDX*directionX, rotatedDY*directionY])
    }
    Translate(translation) {
        this.Translation = [this.Translation[0] + translation[0], this.Translation[1] + translation[1]]
    }
}