import SVGShape from "../../Parent/SVGShape.js"

export default class SVGRectangle extends SVGShape {
    constructor(parameters = {}) {
        parameters.type = "rect"
        super(parameters)
    }
}