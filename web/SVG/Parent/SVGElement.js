export default class SVGElement {
    constructor(parameters = {}) {
        // ensure scope
        this.resizeFunction = this.Resize.bind(this)
        this.clickFunction = this.Click.bind(this)
        this.NameSpace = "http://www.w3.org/2000/svg"
        this.Type = parameters.type
        this.Label = parameters.label
        
        this.InitiateElement()
        this.Parent = parameters.parent

        this.ClickFunction = parameters.onClickFunction
        this.ClickArguments = parameters.onClickArguments || []
        // so i can use x, y as coords
        this.PositionType = "absolute"
        this.ZIndex = "1"
        this.AutoSize = parameters.autoSize
        window.addEventListener("resize", this.resizeFunction)
        if (this.AutoSize) {
            this.WidthScale = parameters.widthScale
            this.HeightScale = parameters.heightScale
        }
        if (parameters.width) {
            this.Width = parameters.width
        }
        if (parameters.height) {
            this.Height = parameters.height
        }

        this.X = parameters.x
        this.Y = parameters.y
        
        if (typeof parameters.visible != "undefined") {
            this.Visible = parameters.visible
        } else {
            this.Visible = true
        }
        this.PointerEvent = "none"    
    }
    get UsingScaleXY() {
        // checks for a "%" at the end of the string
        return /%$/.test(this.X) || /%$/.test(this.Y)
    }
    get AbsoluteWidth() {
        
        // checks for a "%" at the end of the string
        if (/%$/.test(this.Width)) {
            return parseFloat(this.Width)/100 * window.innerWidth
        } else {
            return parseFloat(this.Width)
        }
    }
    get AbsoluteHeight() {
        // checks for a "%" at the end of the string
        if (/%$/.test(this.Height)) {
            return parseFloat(this.Height)/100 * window.innerHeight
        } else {
            return parseFloat(this.Height)
        }
    }
    get AbsoluteX() {
        // checks for a "%" at the end of the string
        if (/%$/.test(this.X)) {
            return parseFloat(this.X)/100 * window.innerWidth
        } else {
            return parseFloat(this.X)
        }
    }
    get AbsoluteY() {
        // checks for a "%" at the end of the string
        if (/%$/.test(this.Y)) {
            return parseFloat(this.Y)/100 * window.innerHeight
        } else {
            return parseFloat(this.Y)
        }
    }
    get Label() {
        return this.label
    }
    set Label(label) {
        this.label = label
    }
    get PointerEvent() {
        return this.element.getAttribute("pointer-events")
    }
    set PointerEvent(val) {
        this.element.setAttribute("pointer-events", val)
    }
    get Element() {
        return this.element
    }
    set Element(element) {
        this.element = element
    }
    get NameSpace() {
        return this.nameSpace
    }
    set NameSpace(nameSpace) {
        this.nameSpace = nameSpace
    }
    get Parent() {
        return this.parent
    }
    set Parent(Parent) {
        if (!Parent) {
            // sets parent to top level DOM
            this.Parent = { element: document.documentElement }
            this.ParentElement.appendChild(this.Element)
            return
        }
        if (!Parent.element) {
            console.warn("Please provide an element property in the parent")
            return
        }
        if (!Parent.element.tagName) {
            console.warn("The parent doesn't have a valid element, ensure it is a HTML tag")
            return
        }
        this.parent = Parent
        if (this.ParentElement) {
            this.ParentElement.appendChild(this.Element)
        }
    }
    get ParentElement() {
        return this.parent.element
    }
    get Type() {
        return this.type
    }
    set Type(type) {
        this.type = type
    }
    get Width() {
        return this.element.getAttribute("width")
    }
    set Width(width) {
        if (!width) {
            return
        }
        const value = this.ValidatePX(width)
        if (value) {
            this.element.setAttribute("width", value)
        }
    }
    get Height() {
        return this.element.getAttribute("height")
    }
    set Height(height) {
        if (!height) {
            return
        }
        const value = this.ValidatePX(height)
        if (value) {
            this.element.setAttribute("height", value)
        }
    }
    get AutoSize() { 
        return this.autoSizeFlag
    }
    set AutoSize(flag) {
        this.autoSizeFlag = flag
        if (this.autoSizeFlag) {
            window.addEventListener("resize", this.resizeFunction)
            return
        } else {
            window.removeEventListener("resize", this.resizeFunction)
        } 
    }
    get WidthScale() {
        return this.widthScale
    }
    set WidthScale(width) {
        if (!isNaN(width)) {
            this.widthScale = width
        } else {
            console.error("WidthScale must be a number")
        }
    }
    get HeightScale() {
        return this.heightScale
    }
    set HeightScale(height) {
        if (!isNaN(height)) {
            this.heightScale = height
        } else {
            console.error("HeightScale must be a number")
        }
    }
    get X() {
        // top level uses CSS, other uses attributes
        if (this.ParentElement == document.documentElement) {
            return this.element.style.left
        } else {
            return this.element.getAttribute("x")
        }
    }
    set X(x) {
        if (!x) {
            return
        }
        const value = this.ValidatePX(x)
        if (value) {
        // top level uses CSS, other uses attributes
            if (this.ParentElement == document.documentElement) {
                this.element.style.left = value
            } else {
                this.element.setAttribute("x", value)
            }
        }
    }
    get Y() {
        // top level uses CSS, other uses attributes
        if (this.ParentElement == document.documentElement) {
            return this.element.style.top
        } else {
            return this.element.getAttribute("y")
        }
    }
    set Y(y) {
        if (!y) {
            return
        }
        const value = this.ValidatePX(y)
        if (value) {
        // top level uses CSS, other uses attributes
            if (this.ParentElement == document.documentElement) {
                this.element.style.top = value
            } else {
                this.element.setAttribute("y", value)
            }
        } else {
            console.error("Please provide a valid value for 'y'")
        }
    }
    get PositionType() {
        return this.Element.style.position
    }
    set PositionType(type) {
        if (!typeof type == "string") {
            console.error("Position type needs to be a string")
            return
        }
        this.Element.style.position = type
    }
    get ZIndex() {
        return this.Element.style.zIndex
    }
    set ZIndex(zIndex) {
        if (Number.isInteger(parseFloat(zIndex)) && zIndex === parseFloat(zIndex).toString()) {
            this.Element.style.zIndex = zIndex
        }
    }
    get ClickFunction() {
        return this.onClickFunction
    }
    set ClickFunction(newFunction) {
        this.onClickFunction = newFunction
        if (this.onClickFunction) {
            this.Element.onclick = this.clickFunction
        } else {
            this.Element.onclick = undefined
        }
    }
    get ClickArguments() {
        return this.onClickArguments
    }
    set ClickArguments(newArguments) {
        this.onClickArguments = newArguments
    }
    // the smallest rectangle able to encapsulate the svg where the shape is without transformations
    get BBox() {
        return this.Element.getBBox()
    }
   get BBoxCenter() {
        let bbox = this.BBox
        return [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2]
    }
    get Center() {
        const rawCenter = vec2.fromValues(this.BBoxCenter[0], this.BBoxCenter[1])
        const transformedCenter = vec2.create()
        vec2.transformMat2d(transformedCenter, rawCenter, this.RawMatrix)
        return transformedCenter
    }
    get Visible() {
        return this.Element.style.visibility == "visible"
    }
    set Visible(flag) {
        if (flag) {
            this.Element.style.visibility = "visible"
        } else {
            this.Element.style.visibility = "hidden"
        }
    }
    
    InitiateElement() {
        if (this.Type) {
            this.Element = document.createElementNS(this.NameSpace, this.Type)
        } else {
            console.error("SVGElement tried 'InitiateElement'")
        }
    }
    Remove() {
        if (!this.ParentElement) {
            console.error("Removing failed, no valid parent element")
            return
        }
        this.ParentElement.removeChild(this.Element)
    }
    Display() {
        if (!this.ParentElement) {
            console.error("Adding failed, no valid parent element")
            return
        }
        this.ParentElement.appendChild(this.Element)
    }
    Click(evt) {
        //console.log("Clicked")
        if (this.ClickFunction) {
            this.ClickFunction.call(this, evt, ...this.ClickArguments)
        }
    } 
    Resize() {
        if (this.AutoSize) {
            this.Width = this.WidthScale * window.innerWidth + "px"
            this.Height = this.HeightScale * window.innerHeight + "px"
        }
        if (this.UsingScaleXY) {
            this?.UpdateTransformations()
        }
    }
    ValidatePX(value) {
        const reg = /^-?\d+(\.\d+)?(px|%)$/ // https://regexper.com/ 👍
        if (reg.test(value)) {
            return value
        } else if (typeof value == "number" || typeof parseFloat(value) == "number") {
            return parseFloat(value) + "px"
        } else {
            return false
        }
    }
    // removes and re adds the svg to make it look on top of others
    PullForward() {
        this.Remove()
        this.Display()
        if (this.Groups) {
            // also needs to do it for any buttons or text (text ontop buttons ontop shape)
            for (const [_, group] of Object.entries(this.Groups)) {
                group.PullForward()
            }
        }
    }
    ToggleVisibility() {
        this.Visible = !this.Visible
    }
}