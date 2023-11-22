import SVGShape from "../../Parent/SVGShape.js"

export default class SVGEllipse extends SVGShape {
    constructor(parameters = {}) {
        parameters.type = "ellipse"
        super(parameters)
    }
    get Width() {
        return (parseFloat(this.Element.getAttribute("rx")) * 2) + "px"
    }
    set Width(width) {
        if (!width) {
            return
        }
        const value = this.ValidatePX(parseFloat(width) / 2)
        if (value) {
            this.Element.setAttribute("rx", value)
        }
    }
    get Height() {
        return (parseFloat(this.Element.getAttribute("ry")) * 2) + "px"
    }
    set Height(height) {
        if (!height) {
            return
        }
        const value = this.ValidatePX(parseFloat(height) / 2)
        if (value) {
            this.Element.setAttribute("ry", value)
        }
    }
    get X() {
        if (this.ParentElement == document.documentElement) {
            return (parseFloat(this.element.style.left) - parseFloat(this.Width) / 2) + "px"
        } else {
            return (parseFloat(this.Element.getAttribute("cx")) - parseFloat(this.Width) / 2) + "px"
        }
    }
    set X(x) {
        if (!x) {
            return
        }
        const value = this.ValidatePX(parseFloat(x) + parseFloat(this.Width) / 2)
        if (value) {
            if (this.ParentElement == document.documentElement) {
                this.element.style.left = value
            } else {
                this.Element.setAttribute("cx", value)
            }
        }
    }
    get Y() {
        if (this.ParentElement == document.documentElement) {
            return (parseFloat(this.element.style.top) - parseFloat(this.Height) / 2) + "px"
        } else {
            return (parseFloat(this.Element.getAttribute("cy")) - parseFloat(this.Height) / 2) + "px"
        }
    }
    set Y(y) {
        if (!y) {
            return
        }
        const value = this.ValidatePX(parseFloat(y) + parseFloat(this.Height) / 2)
        if (value) {
            if (this.ParentElement == document.documentElement) {
                this.element.style.top = value
            } else {
                this.Element.setAttribute("cy", value)
            }
        } else {
            console.error("Please provide a valid value for 'y'")
        }
    }
}