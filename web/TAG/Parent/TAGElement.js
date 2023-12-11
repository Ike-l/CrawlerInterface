export default class TAGElement {
    constructor(parameters = {}) {
        this.resizeFunction = this.Resize.bind(this)
        this.clickFunction = this.Click.bind(this)
        
        this.Type = parameters.type
        this.InitiateElement()
        this.Parent = parameters.parent

        this.ClickFunction = parameters.onClickFunction
        this.ClickArguments = parameters.onClickArguments

        this.AutoSize = parameters.autoSize
        if (this.AutoSize) {
            this.WidthScale = parameters.widthScale
            this.HeightScale = parameters.heightScale
        }
        this.PointerLock = parameters.pointerLock

        this.Text = parameters.text
        // so i can use absolute x and y as coords
        this.PositionType = "absolute"
        this.X = parameters.x
        this.Y = parameters.y
        this.ZIndex = "0"
        if (parameters.width) {
            this.Width = parameters.width
        }
        if (parameters.height) {
            this.Height = parameters.height 
        }
    }
    get Element() {
        return this.element
    }
    set Element(element) {
        this.element = element
    }
    get Parent() {
        return this.parent
    }
    set Parent(Parent) {
        if (!Parent) {
            // sets parent to top level DOM
            this.parent = { element: document.documentElement }
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
        this.ParentElement.appendChild(this.Element)
    }
    get Type() {
        return this.type
    }
    set Type(type) {
        this.type = type
    }
    get ParentElement() {
        return this.parent.element
    }
    get ClickFunction() {
        return this.onClickFunction
    }
    set ClickFunction(newFunction) {
        this.onClickFunction = newFunction
        if (this.onClickFunction) {
            this.Element.onclick = this.clickFunction
        }
    }
    get ClickArguments() {
        return this.onClickArguments
    }
    set ClickArguments(newArguments) {
        this.onClickArguments = newArguments
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
    get PointerLock() {
        return this.pointerLockFlag
    }
    set PointerLock(flag) {
        this.pointerLockFlag = flag
        if (this.pointerLockFlag) {
            this.Element.onclick = this.DefaultClick.bind(this)
        } else if (this.ClickFunction) {
            this.Element.onclick = this.clickFunction
        } else {
            this.Element.onclick = undefined
        }
    }
    get Text() {
        return this.Element.innerHTML
    }
    set Text(text) {
        if (text) {
            this.Element.innerHTML = text.toString()
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
        const value = this.ValidateX(x)
        if (value) {
            // top level uses CSS, other uses attributes
            this.Element.style.left = x
        } else {
            console.error("Please provide a valid value for 'x'")
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
            this.Element.style.top = y
        } else {
            console.error("Please provide a valid value for 'y'")
        }
    }
    get ZIndex() {
        return this.Element.style.zIndex
    }
    set ZIndex(zIndex) {
        if (Number.isInteger(parseFloat(zIndex)) && zIndex === parseFloat(zIndex).toString()) {
            this.Element.style.zIndex = zIndex
        }
    }
    get Width() {
        return this.element.style.width
    }
    set Width(width) {
        if (!width) {
            return
        }
        const value = this.ValidatePX(width)
        if (value) {
            this.element.style.width = width
        } else {
            console.error("Please provide a valid value for 'width'")
        }
    }
    get Height() {
        return this.element.style.height
    }
    set Height(height) {
        if (!height) {
            return
        }
        const value = this.ValidatePX(height)
        if (value) {
            this.element.style.height = height
        } else {
            console.error("Please provide a valid value for 'height'")
        }
    }

    InitiateElement() {
        if (this.Type) {
            this.Element = document.createElement(this.Type)
        } else {
            console.error("TAGElement tried 'IntitiateElement'")
        }
    }
    Resize() {
        this.Width = this.widthScale * window.innerWidth + "px"
        this.Height = this.heightScale * window.innerHeight + "px"
    }
    DefaultClick() {
        // browser issue
        console.warn("Pointer Lock has a delay of ~1 second. It will error if you click too quickly.")
        this.Element.requestPointerLock()
    }
    Click(evt) {
        this.ClickFunction.call(this, evt,  ...this.ClickArguments)
    }
    Remove() {
        if (!this.ParentElement) {
            console.error("Removing failed, no valid parent element")
            return
        }
        this.ParentElement.removeChild(this.Element)
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
}