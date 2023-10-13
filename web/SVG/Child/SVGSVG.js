import SVGElement from "../Parent/SVGElement.js"

export default class SVGSVG extends SVGElement {
    constructor(parameters = {}) {
        parameters.type = "svg"
        super(parameters)

        this.objectBuffer = []
        if (parameters.objects) {
            this.Objects = parameters.objects
        }
        // objects buffer
    }
    get Objects() {
        return this.objectBuffer
    }
    set Objects(objects) {
        if (objects instanceof Array) {
            this.objectBuffer.push(...objects)
        } else {
            console.error("'Objects' expects an Array")
        }
    }
}