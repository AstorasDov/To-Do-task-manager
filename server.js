const http = require('http');
const {readFile,writeFile} = require('fs');
const path = require('path');

const read = async (path) => {
    return new Promise((resolve,reject)=>{
        readFile(path,"utf-8",(err,data)=>{
            if(data){resolve(data);}
            else{reject(err);}
        });
    });
}

const write = async (path,data) => {
    return new Promise((resolve,reject)=>{
        writeFile(path,data,'utf-8',(err)=>{
            if(err)reject(err);
            else resolve();
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
        case "/api/tasks":
            const json = await read('./tasks.json');
            res.writeHead(200,{"Content-Type":"application/json"});
            res.end(json);
            break;
    }

    if(req.method=="POST"&&req.url=="/api/addTask"){
        let body = '';
        req.on('data',chunk=>body+=chunk.toString());
        req.on('end',async()=>{
            const text = await read('./tasks.json');
            const tasks = await JSON.parse(text);
            const task = JSON.parse(body);
            if(!(tasks.some(t=>t.name===task.name))){
                tasks.push(task);
            };const json = JSON.stringify(tasks);
            await write('./tasks.json',json,'utf-8');
            res.end();
        })
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
            res.writeHead(200,{"Content-type":"application/javascript"});
            res.write(js);
            res.end();
            break; 
    }
});
server.listen(3000);
