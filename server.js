const http = require('http');
const fs = require('fs');

let port = 3000;

let server = http.createServer((req, res) => {

    if (req.method === 'GET' && req.url === '/kgl/procurement') {
        fs.readFile('data.json', (err, data) => {
            if (err) {
                res.writeHead(500, {
                    "content-type": "application.json"
                })
                res.write(JSON.parse({ message: err }));
                res.end();
            } else {
                try {
                    res.writeHead(200, {
                        "content-type": "application/json"
                    })
                    res.write(JSON.stringify(JSON.parse(data)));
                    res.end();
                } catch (err) {
                    res.writeHead(500, {
                        "content-type": "application.json"
                    })
                    res.write(JSON.parse({ message: err }));
                    res.end();
                }
            }
        })
    } else if (req.method === 'POST' && req.url === '/kgl/procurement') {
        let body = "";
        req.on("data", (chunk) => {
            console.log(chunk);
            body += chunk.toString();
            console.log(body);
        })

        req.on("end", () => {
            body = JSON.parse(body);

            fs.readFile("data.json", (err, data) => {
                if (!err) {
                    res.writeHead(200, {
                        "content-type": "application/json"
                    })

                    let record = JSON.parse(data);

                    record.push(body);

                    let stringRecords = JSON.stringify(record);

                    fs.writeFile("data.json", stringRecords, (err) => {
                        if (err) {
                            res.writeHead(500, {
                                "content-type": "application/js"
                            })

                            res.write(JSON.stringify({ message: err }));
                            res.end();
                        } else {

                            // res.writeHead(201, {
                            //     "content-type": "application/json"
                            // })
                            try {
                                res.write(JSON.stringify({ Message: "Data send successfully", body }));

                                res.end();
                            }catch(err){
                                res.writeHead(500, {
                                    "content-type": "application/json"
                                })
                                res.write(JSON.parse({ message: err }));
                                res.end();
                            }
                        }
                    })
                } else {
                    res.writeHead(500, {
                        "content-type": "application/json"
                    })
                    res.end(JSON.parse({ message: err }));
                }
            })
        })
    } else {
        res.writeHead(404, {
            "content-type": "application/json"
        })
        res.end("Page not found!");
    }
})

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
