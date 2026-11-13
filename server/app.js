import express from 'express';
import {translate} from './translate.js';
// Shared Express app: API routes + security headers. Static/SPA handling is added by the caller.
export function createApp(){
 const app=express();app.disable('x-powered-by');
 // Set TRUST_PROXY=1 only behind one trusted reverse proxy.
 if(process.env.TRUST_PROXY==='1')app.set('trust proxy',1);
 app.use((req,res,next)=>{res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');res.setHeader('Content-Security-Policy',"frame-ancestors 'self' https://web.telegram.org");next();});
 app.use('/api',express.json({limit:'48kb'}));
 app.get('/api/status',(_req,res)=>res.json({ai:Boolean(process.env.ANTHROPIC_API_KEY||process.env.AI_API_KEY)}));
 const requests=new Map();
 const sweep=setInterval(()=>{const now=Date.now();for(const [key,value] of requests)if(now>value.reset)requests.delete(key);},60000);sweep.unref();
 app.post('/api/translate',async(req,res,next)=>{
  res.setHeader('Cache-Control','no-store');
  const site=req.get('sec-fetch-site');if(site==='cross-site')return res.status(403).json({error:'Запросы доступны только из приложения.'});
  const key=req.ip;const now=Date.now();let bucket=requests.get(key);
  if(!bucket||now>bucket.reset){bucket={count:0,reset:now+60000};requests.set(key,bucket);}
  if(++bucket.count>20){res.setHeader('Retry-After','60');return res.status(429).json({error:'Слишком много синергии. Подождите минуту и попробуйте ещё раз.'});}
  try{res.json(await translate(req.body));}catch(error){next(error);}
 });
 app.use('/api',(_req,res)=>res.status(404).json({error:'Такого API-маршрута нет.'}));
 return app;
}
export function errorHandler(error,_req,res,_next){res.status(error.status||500).json({error:error.status?error.message:'Ошибка сервера. Попробуйте ещё раз.'});}
