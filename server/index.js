import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createApp,errorHandler} from './app.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const app=createApp();
app.use(errorHandler);
if(process.argv.includes('--production')||process.env.NODE_ENV==='production'){
 app.use(express.static(path.join(root,'dist')));
 app.get('/{*path}',(_req,res)=>res.sendFile(path.join(root,'dist/index.html')));
}else{
 const {createServer}=await import('vite');const vite=await createServer({root,server:{middlewareMode:true},appType:'spa'});app.use(vite.middlewares);
}
const port=Number(process.env.PORT)||3000;
app.listen(port,'0.0.0.0',()=>console.log(`С УВАЖЕНИЕМ. http://localhost:${port} · AI ${process.env.AI_API_KEY?'подключён':'не подключён (демопримеры доступны)'}`));
