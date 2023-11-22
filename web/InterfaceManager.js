// Parent TAG
import TAGElement from "./TAG/Parent/TAGElement.js"
// Child TAG
import TAGCanvas from "./TAG/Child/TAGCanvas.js"
// Parent SVG
import SVGElement from "./SVG/Parent/SVGElement.js"
import SVGShape from "./SVG/Parent/SVGShape.js"
import SVGButton from "./SVG/Parent/SVGButton.js"
import SVGGroup from "./SVG/Parent/SVGGroup.js"
import SVGText from "./SVG/Parent/SVGText.js"
import SVGMenu from "./SVG/Parent/SVGMenu.js"
// Child SVG
import SVGSVG from "./SVG/Child/SVGSVG.js"
import SVGRectangle from "./SVG/Child/ChildShape/SVGRectangle.js"
import SVGEllipse from "./SVG/Child/ChildShape/SVGEllipse.js"
import SVGRectangleButton from "./SVG/Child/ChildButton/SVGRectangleButton.js"
import SVGEllipseButton from "./SVG/Child/ChildButton/SVGEllipseButton.js"
// Utility
import Utility from "./HELPER/Utility.js"
// Consolidation
const TAGS = { TAGElement, TAGCanvas,}
const UTILITY = { Utility, }
const SVGS = { SVGElement, SVGSVG, SVGShape, SVGRectangle, SVGEllipse, SVGButton, SVGRectangleButton, SVGEllipseButton, SVGGroup, SVGText, SVGMenu}

window.CRAWLER_INTERFACE = { TAGS, SVGS, UTILITY,}
