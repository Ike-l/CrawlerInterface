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
        this.PositionType = "absolute"
        this.X = parameters.x
        this.Y = parameters.y
        this.ZIndex = "0"
        if (parameters.width) {
            console.log(parameters.width)
            this.Width = parameters.width
        }
        if (parameters.height) {
            console.log(parameters.height)
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
        return this.Element.style.left
    }
    set X(x) {
        if (!x) {
            return
        }
        
        if (!this.ValidatePX(x)) {
            console.error("Please provide a valid X with a 'px' component")
            return
        }
        this.Element.style.left = x
    }
    get Y() {
        return this.Element.style.top
    }
    set Y(y) {
        if (!y) {
            return
        }
        
        if (this.ValidatePX(y)) {
            console.error("Please provide a valid Y with a 'px' component")
            return
        }
        this.Element.style.top = y
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
        if (!this.ValidatePX(width)) {
            console.error("Please provide a valid Width with a 'px' component")
            return
        }
        this.element.style.width = width
    }
    get Height() {
        return this.element.style.height
    }
    set Height(height) {
        if (!height) {
            return
        }
        if (!this.ValidatePX(height)) {
            console.error("Please provide a valid Height with a 'px' component")
            return
        }
        this.element.style.height = height
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
        if (typeof value != "string" || value.indexOf("px") != value.length - 2) {
            console.error("Expected a string with a 'px' component")
            return false
        } else {
            return true
        }
    }
}