import SVGElement from "../Parent/SVGElement.js"

export default class SVGSVG extends SVGElement {
    constructor(parameters = {}) {
        parameters.type = "svg"
        super(parameters)

        this.objectBuffer = []
        if (parameters.objects) {
            this.Objects = parameters.objects
        }
    }
    get Objects() {
        return this.objectBuffer
    }
    set Objects(objects) {
        // ensure the parameter is an array so the spread syntax doesnt error
        if (objects instanceof Array) {
            this.objectBuffer.push(...objects)
        } else {
            console.error("'Objects' expects an Array")
        }
    }
}