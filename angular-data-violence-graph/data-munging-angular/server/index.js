const express = require('express');
const app = express();



    const fs = require("fs");
    const readline = require("readline");

    const writerStream = fs.createWriteStream("result.json");
    writerStream.write("[", "UTF8");

    const rl = readline.createInterface({
        input : fs.createReadStream("data.csv")
    });
    let queriedData = [];
    let counter = 0;
    let extractedProps = [];
    let firstWrite = true;
    rl.on("line", (line) => {
        if (counter === 0) {
            extractedProps = line.split(",");
        } else {
            let extractedData = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            const startEntry = /^[0-9]{6}/;
            if (line !== "" &&
                startEntry.test(extractedData[0]) &&
                extractedData[0].split(",").length < 2) {
                let obj = Object.create(null);
                obj.state = extractedData[2];
                obj.killed = extractedData[5];
                obj = JSON.stringify(obj);
                if (!firstWrite) {
                    writerStream.write(",", "UTF8"); 
                }
                writerStream.write(obj, "UTF8");
                firstWrite = false;
            }
        }
        counter++; 
    }).on("close", () => {
        writerStream.write("]", "UTF8");
        console.log("file finished");
    });


app.use(express.static("../client"));

app.get("/data", (req, res) => {
    res.sendFile("./result.json", { root: '.' }, (err) => {
        console.log("sent");      
    }); 
});
app.listen(3000, () => console.log('Started on port 3000'));

