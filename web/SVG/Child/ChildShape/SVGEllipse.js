import SVGShape from "../../Parent/SVGShape.js"

export default class SVGEllipse extends SVGShape {
    constructor(parameters = {}) {
        parameters.type = "ellipse"
        super(parameters)
    }
    get Width() {
        // gets the radius as a string so converts it to float and * 2, then adds "px"
        return (parseFloat(this.Element.getAttribute("rx")) * 2) + "px"
    }
    set Width(width) {
        if (!width) {
            return
        }
        // ensure the width is valid before adding it
        const value = this.ValidatePX(parseFloat(width) / 2)
        if (value) {
            this.Element.setAttribute("rx", value)
        }
    }
    get Height() {
        // gets the radius as a string so converts it to float and * 2, then adds "px"
        return (parseFloat(this.Element.getAttribute("ry")) * 2) + "px"
    }
    set Height(height) {
        if (!height) {
            return
        }
        // ensure the height is valid before adding it
        const value = this.ValidatePX(parseFloat(height) / 2)
        if (value) {
            this.Element.setAttribute("ry", value)
        }
    }
    get X() {
        // when at top level of DOM the styling is CSS
        if (this.ParentElement == document.documentElement) {
            return (parseFloat(this.element.style.left) - parseFloat(this.Width) / 2) + "px"
        } else {
            // otherwise its an attribute
            return (parseFloat(this.Element.getAttribute("cx")) - parseFloat(this.Width) / 2) + "px"
        }
    }
    set X(x) {
        if (!x) {
            return
        }
        const value = this.ValidatePX(parseFloat(x) + parseFloat(this.Width) / 2)
        if (value) {
            // when at top level of DOM the styling is CSS
            if (this.ParentElement == document.documentElement) {
                this.element.style.left = value
            } else {
                // otherwise its an attribute
                this.Element.setAttribute("cx", value)
            }
        }
    }
    get Y() {
        // when at top level of DOM the styling is CSS
        if (this.ParentElement == document.documentElement) {
            return (parseFloat(this.element.style.top) - parseFloat(this.Height) / 2) + "px"
        } else {
            // otherwise its an attribute
            return (parseFloat(this.Element.getAttribute("cy")) - parseFloat(this.Height) / 2) + "px"
        }
    }
    set Y(y) {
        if (!y) {
            return
        }
        const value = this.ValidatePX(parseFloat(y) + parseFloat(this.Height) / 2)
        if (value) {
            // when at top level of DOM the styling is CSS
            if (this.ParentElement == document.documentElement) {
                this.element.style.top = value
            } else {
                // otherwise its an attribute
                this.Element.setAttribute("cy", value)
            }
        } else {
            console.error("Please provide a valid value for 'y'")
        }
    }
}