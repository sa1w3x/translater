// Desktop entry: one .exe that serves the built UI from embedded assets and opens the browser.
import dotenv from 'dotenv';
import path from 'node:path';
import {spawn} from 'node:child_process';
import sea from 'node:sea';
import {createApp,errorHandler} from '../server/app.js';
dotenv.config({path:path.join(path.dirname(process.execPath),'.env'),quiet:true});
const files=JSON.parse(sea.getAsset('manifest.json','utf8'));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.json':'application/json','.woff2':'font/woff2'};
const app=createApp();
app.use((req,res,next)=>{
 if(req.method!=='GET'&&req.method!=='HEAD')return next();
 let name=decodeURIComponent(req.path).replace(/^\/+/,'');
 if(!files.includes(name))name='index.html';
 res.type(types[path.extname(name)]||'application/octet-stream');
 if(name.startsWith('assets/'))res.setHeader('Cache-Control','public, max-age=31536000, immutable');
 res.send(Buffer.from(sea.getRawAsset('dist/'+name)));
});
app.use(errorHandler);
const open=url=>{const [cmd,args]=process.platform==='win32'?['cmd',['/c','start','""',url]]:process.platform==='darwin'?['open',[url]]:['xdg-open',[url]];spawn(cmd,args,{stdio:'ignore',detached:true,windowsHide:true}).on('error',()=>{}).unref();};
const listen=port=>{const server=app.listen(port,'127.0.0.1',()=>{const url=`http://localhost:${server.address().port}`;
 console.log(`С УВАЖЕНИЕМ. запущено: ${url}\nAI: ${(process.env.ANTHROPIC_API_KEY||process.env.AI_API_KEY)?'подключён':'не подключён (работают 40 готовых примеров). Положите .env с ANTHROPIC_API_KEY рядом с .exe'}\nЗакройте это окно, чтобы выйти.`);open(url);});
 server.on('error',e=>{if(e.code==='EADDRINUSE'&&port!==0)listen(0);else{console.error(e);process.exitCode=1;}});};
listen(Number(process.env.PORT)||3000);
