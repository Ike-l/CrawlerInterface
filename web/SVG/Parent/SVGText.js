import SVGElement from "./SVGElement.js"

export default class SVGText extends SVGElement {
    constructor(parameters = {}) {
        parameters.type = "text"
        super(parameters)
        this.ParentElement = parameters.parentElement
        // this.Display()?
        this.Parent = parameters.parent
        this.Text = parameters.text
        this.FontSize = parameters.fontSize || "20px"
        this.LineNumber = parameters.lineNumber
        this.Fill = parameters.fill
    }
    get FontSize() {
        return this.Element.getAttribute("font-size")
    }
    set FontSize(size) {
        this.Element.setAttribute("font-size", size)
    }
    get Fill() {
        return this.Element.getAttribute("fill")
    }
    set Fill(fill) {
        this.Element.setAttribute("fill", fill)
    }
    get LineNumber() {
        return this.lineNumber
    }
    set LineNumber(num) {
        this.lineNumber = num
    }
    get PlaceholderLocation() {
        return this.currentPlaceHolderLocation
    }
    set PlaceholderLocation(location) {
        this.currentPlaceHolderLocation = location
    }
    get Text() {
        return this.text
    }
    set Text(text) {
        this.text = text
        this.Element.textContent = this.text
    }
    get ParentElement() {
        return this.parentElement?.element
    }
    set ParentElement(element) {
       this.parentElement = element 
    }
    RemovePlaceholder() {
        // I had like 4 bugs and all fixed by checking if strictly false and then changing it to false
        if (this.PlaceholderLocation!==false) {
            //console.log("PLL:", this.PlaceholderLocation)
            //console.log("PLACE:", typeof this.PlaceholderLocation != "undefined" ? this.PlaceholderLocation : this.Text.length-1)
            //console.log(typeof this.PlaceholderLocation != "undefined" ? this.PlaceholderLocation : this.Text.length, "ABC")
            this.SpliceText("", typeof this.PlaceholderLocation != "undefined" ? this.PlaceholderLocation : this.Text.length, 1)
            this.PlaceholderLocation = false
        }
    }
    AddPlaceholder(location) {
        // clamps placeholder to last character since text SVGs cant have spaces anyways
        this.PlaceholderLocation = Math.min(location, this.Text.length)
        this.InsertText("_", this.PlaceholderLocation)
    }
    AppendText(text) {
        this.Text = this.Text + text
    }
    InsertText(text, index) {
        this.Text = this.Text.slice(0, index) + text + this.Text.slice(index)
    }
    SpliceText(text, index, replaceCount) {
        // converts to array to allow splitting
        const TextArr = Array.from(this.Text)
        TextArr.splice(index, replaceCount, text)
        // makes it back into a string
        this.Text = TextArr.join("")
    }
    SetPosition(x, y) {
        this.X = x
        this.Y = y
    }
}
