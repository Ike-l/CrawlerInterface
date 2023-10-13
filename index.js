let express = require('express');
let cors = require("cors");
// create the express object
let exp = express();
exp.use(cors())
exp.use(express.static('web'))
let web = exp.listen(3000, function() {
  console.log("Running")
})



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