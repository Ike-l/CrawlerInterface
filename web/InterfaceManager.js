// Parent TAG
import TAGElement from "./TAG/Parent/TAGElement.js"
// Child TAG
import TAGCanvas from "./TAG/Child/TAGCanvas.js"
// Parent SVG
import SVGElement from "./SVG/Parent/SVGElement.js"
import SVGShape from "./SVG/Parent/SVGShape.js"
import SVGButton from "./SVG/Parent/SVGButton.js"
import SVGGroup from "./SVG/Parent/SVGGroup.js"
// Child SVG
import SVGSVG from "./SVG/Child/SVGSVG.js"
import SVGRectangle from "./SVG/Child/ChildShape/SVGRectangle.js"
import SVGRectangleButton from "./SVG/Child/ChildButton/SVGRectangleButton.js"
// Utility
import Utility from "./HELPER/Utility.js"
// Consolidation
const TAGS = { TAGElement, TAGCanvas,}
const UTILITY = { Utility, }
const SVGS = { SVGElement, SVGSVG, SVGShape, SVGRectangle, SVGButton, SVGRectangleButton, SVGGroup}

window.CRAWLER_INTERFACE = { TAGS, SVGS, UTILITY,}
