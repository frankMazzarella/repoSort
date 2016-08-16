/*
    Sort the Arch Linux repos

    This script will create output.json in the directory
    that it is sitting in. It grabs the JSON from
    https://www.archlinux.org/mirrors/status/json/
    and will spit out only US results sorted by score.
    If you need to reverse the direction of the sort,
    please see the documentation in sortThatShit()

    NOTE:
    i didnt test this much at all cause family guy is on
*/

'use strict';

var https = require('https');
var fs = require('fs');

// Get the JSON from the Arch bros
var url = 'https://www.archlinux.org/mirrors/status/json/';
https.get(url, function(res) {
    var body = '';

    res.on('data', function(chunk) {
        body += chunk;
    })

    res.on('end', function() {
        var obj = JSON.parse(body);
        obj = sortThatShit(obj);
        writeToFile(obj);
    })

    // I have no idea if this is actually works
    res.on('error', function(err) {
        console.log('Shit just happened: ' + err)
    })
})

function sortThatShit(obj) {

    // return only US
    for (var i = 0; i < obj.urls.length; i++) {
        if (obj.urls[i].country_code != "US") {
            obj.urls.splice(i, 1);
            i--;
        }
    }

    // sort by score
    obj.urls.sort(function(a, b) {
        // If you need to reverse the direction of the
        // sort, then swap these params around below
        // DISCLAIMER: The MDN mentioned briefly that
        // the Array.prototype.sort() function may not
        // exactly be stable. #YOLODEPLOY
        return b.score - a.score;
    })

    return obj;
}

function writeToFile(obj) {
    fs.writeFile(__dirname + '/output.json', JSON.stringify(obj), function(err) {
        if (err) {
            return console.log(err);
        } else {
            console.log('The file has been created!');
        }
    })
}
