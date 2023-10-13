import SVGButton from "../../Parent/SVGButton.js"

export default class SVGRectangleButton extends SVGButton {
    constructor(parameters = {}) {
        parameters.type = "rect"
        super(parameters)
    }
}