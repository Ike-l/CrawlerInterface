export default class Utility {
    static get RandomHexColour() {
        const red = Math.floor(Math.random() * 255)
        const green = Math.floor(Math.random() * 255)
        const blue = Math.floor(Math.random() * 255)
        const redComponent = red.toString(16).padStart(2, '0')
        const greenComponent = green.toString(16).padStart(2, '0')
        const blueComponent = blue.toString(16).padStart(2, '0')
        const colour = `#${redComponent}${greenComponent}${blueComponent}`
        return colour
    }
    static Loop(functionToCall, iterations) {
    if (iterations < 1) {
        console.error("Iterations must be greater than 0.")
        return
    }
    let i = 0
    function loop() {
      functionToCall.call(null, i, iterations)
      i++
      if (i < iterations) {
        requestAnimationFrame(loop)
      }
    }
    requestAnimationFrame(loop)
  }
    static Hold(parameters = {}) {
        if (typeof parameters.fn !== "function" || !parameters.fn?.call) {
            console.error("Please provide a function that can be called.")
            return
        }
        setTimeout(() => {
            parameters.fn?.call(parameters.scope||null, ...(parameters.args||[]))
        }, parameters.delay || 0)
    }
}

// Utility.Loop(func, Math.Infinity))
// Utility.Loop(func2, 100)