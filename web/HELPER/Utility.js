export default class Utility {
    // generate a random colour for RGB 0-255
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
    // loops over the given function, for {iterations}, takes a bool for if to calculate the FPS
    static Loop(functionToCall, iterations, calculateFPS) {
        // Need to ensure iterations are >= 1
        if (iterations < 1) {
            console.error("Iterations must be greater than 0.")
            return
        }

        let args = arguments
        const times = []
        let iterationsPerSecond
        
        let i = 0
        // is the actual loop function
        function loop() {
            if (calculateFPS) {
                const now = performance.now()
                // while the array is not empty and the first element is less or equal to 1 second ago, shift the array (get rid of first element)
                while (times.length > 0 && times[0] <= now - 1000) {
                    times.shift()
                }
                // adds the current time to the array
                times.push(now)
                iterationsPerSecond = times.length
            }
            // calls with a null scope
            functionToCall.call(null, i, iterations, iterationsPerSecond, ...Object.values(args).splice(3))
            i++
            if (i < iterations) {
            requestAnimationFrame(loop)
            }
        }
        requestAnimationFrame(loop)
    }
    // delays a function for a given time
    static Hold(parameters = {}) {
        // makes sure the parameters are passed correctly
        if (typeof parameters.fn !== "function" || !parameters.fn?.call) {
            console.error("Please provide a function that can be called.")
            return
        }
        setTimeout(() => {
            parameters.fn?.call(parameters.scope||null, ...(parameters.args||[]))
        }, parameters.delay || 0)
    }
}