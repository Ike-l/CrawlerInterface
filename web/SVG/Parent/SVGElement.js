export default class SVGElement {
    constructor(parameters = {}) {
        this.resizeFunction = this.Resize.bind(this)
        this.clickFunction = this.Click.bind(this)
        
        this.NameSpace = "http://www.w3.org/2000/svg"
        this.Type = parameters.type
        
        this.InitiateElement()
        this.Parent = parameters.parent

        this.ClickFunction = parameters.onClickFunction
        this.ClickArguments = parameters.onClickArguments
        
        this.PositionType = "absolute"
        this.ZIndex = "1"
        this.X = parameters.x
        this.Y = parameters.y
        this.AutoSize = parameters.autoSize
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

        
        this.Visible = true
        this.PointerEvent = "none"    
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
        this.parent.element.appendChild(this.Element)
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
            if (this.ParentElement == document.documentElement) {
                this.element.style.left = value
            } else {
                this.element.setAttribute("x", value)
            }
        }
    }
    get Y() {
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
            if (this.ParentElement == document.documentElement) {
                this.element.style.top = value
            } else {
                this.element.setAttribute("y", value)
            }
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
    get BBox() {
        return this.Element.getBBox()
    }
   get BBoxCenter() {
        let bbox = this.BBox
        return [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2]
    }
    get Center() {
        const a = vec2.fromValues(this.BBoxCenter[0], this.BBoxCenter[1])
        const b = vec2.create()
        vec2.transformMat2d(b, a, this.RawMatrix)
        return b
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
        this.ClickFunction.call(this, evt, this.ClickArguments)
    } 
    Resize() {
        if (this.AutoSize) {
            this.Width = this.WidthScale * window.innerWidth + "px"
            this.Height = this.HeightScale * window.innerHeight + "px"
        }
    }
    ValidatePX(value) {
        const reg = /^-?\d+(\.\d+)?(px|%)$/
        if (reg.test(value)) {
            return value
        } else if (typeof value == "number") {
            return value + "px"
        } else if (typeof parseFloat(value) == "number") {
            return value + "px"
        } else {
            false
        }
    }
    PullForward() {
        this.Remove()
        this.Display()
        if (this.Groups) {
            for (const [att, val] of Object.entries(this.Groups)) {
                val.PullForward()
            }
        }
    }
    ToggleVisibility() {
        this.Visible = !this.Visible
    }
}