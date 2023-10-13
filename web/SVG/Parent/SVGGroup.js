import SVGElement from "./SVGElement.js"

export default class SVGGroup extends SVGElement {
    constructor(parameters = {}) {
        parameters.type = "g"
        super(parameters)
    }
}