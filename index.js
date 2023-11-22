let express = require('express');
let cors = require("cors");
// create the express object
let exp = express();
exp.use(cors())
exp.use(express.static('web'))
let web = exp.listen(3000, function() {
  console.log("Running")
})

// 1551 Lines 31/10/2023
/*
console.log("Calculating Center, a:", a, "b:", b, "matrix:", this.RawMatrix)
console.log("MovementX:", movementX, "MovementY:",movementY)
console.log("Center Point when 'get angle': ",centerPoint)
console.log("Begginning Log for:", this.Fill)
console.log("Translation: ", Translation)
console.log("BBoxCenter: ", this.BBoxCenter)
console.log("Rotation: ", Rotation)
console.log("Scale: ", Scale)
console.log("-BBoxCenter: ", [-BBoxCenter[0], -BBoxCenter[1]])
console.log("Ending Log for:", this.Fill)
 had BBox[0] for translating realised when logging everything and noticed that when the x and y were equal was when the bug occured
 tried every combinations
 even used an extension to see if the coords were where they were supposed to be
 was scared it was a logic error because tested my previous and it didnt work but i fixed that bug at same time apparently
 - bug was when width != height the scale would move wrongly
*/


/*
TEST FOR CHECKING IF X CHECK WORKS 
const x = ["12px", 13, "px", "14", "15pxpx", "px16px", "0px", "12332312px"]
x.forEach((val, index) => {
    if (typeof val != "string" || val.length <= 2 || val.indexOf("px") != val.length-2) {
        console.log("FAIL", val, index)
    } else {
        console.log("PASSED", val, index)
    }
})

// expected:
// PASSED, FAIL, FAIL, FAIL, FAIL, FAIL, PASSED, PASSED
// got:
// PASSED, FAIL, FAIL, FAIL, FAIL, FAIL, PASSED, PASSED
*/