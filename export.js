const fs = require("fs");
const xml2js = require("xml2js");
const util = require("util");
const { parse } = require("path");

const parser = new xml2js.Parser();

fs.readFile("xml/model.xml", (err, data) => {
    parser.parseString(data, (err, result) => {
        const final = util.inspect(result, false, null, true);
        fs.writeFile("export/bpTemporary.json", JSON.stringify(result), err => {
            if (err) throw err; 
            console.log("Done writing!");
        });
    });
});
