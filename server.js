const http = require('http');
const {readFile} = require('fs');
const path = require('path');

const read = async (path) => {
    return new Promise((resolve,reject)=>{
        readFile(path,"utf-8",(err,data)=>{
            if(data){resolve(data);}
            else{reject(err);}
        });
    });
}


const server = http.createServer(async(req,res)=>{
    const extname = path.extname(req.url);

    switch(req.url){
        case "/":
            const html = await read('./client/index.html');
            res.writeHead(200,{"Content-type":"text/html"});
            res.write(html);
            res.end()
            break;
    }

    switch(extname){
        case ".css":
            const css = await read(path.join(__dirname,"client",req.url));
            res.writeHead(200,{"Content-type":"text/css"});
            res.write(css);
            res.end();
            break;
        case ".js":
            const js = await read(path.join(__dirname,"client",req.url));
            res.writeHead(200,{"Content-type":"application/js"});
            res.write(js);
            res.end();
            break;
    }
});
server.listen(3000);