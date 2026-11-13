// Builds dist/ -> bundles server -> injects into a Windows node.exe (Node SEA). Output: release/s-uvazheniem.exe
import {execSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {build} from 'esbuild';
const root=path.resolve(import.meta.dirname,'..');const out=path.join(root,'release');const tmp=path.join(out,'tmp');
const run=c=>execSync(c,{cwd:root,stdio:'inherit'});
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(tmp,{recursive:true});
run('npx vite build');
await build({entryPoints:[path.join(root,'desktop/main.js')],bundle:true,platform:'node',target:'node22',format:'cjs',outfile:path.join(tmp,'app.cjs'),logLevel:'warning'});
const dist=path.join(root,'dist');const list=[];
const walk=d=>{for(const f of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,f.name);f.isDirectory()?walk(p):list.push(path.relative(dist,p).split(path.sep).join('/'));}};walk(dist);
fs.writeFileSync(path.join(tmp,'manifest.json'),JSON.stringify(list));
const assets={'manifest.json':path.join(tmp,'manifest.json')};for(const f of list)assets['dist/'+f]=path.join(dist,f);
fs.writeFileSync(path.join(tmp,'sea.json'),JSON.stringify({main:path.join(tmp,'app.cjs'),output:path.join(tmp,'sea.blob'),disableExperimentalSEAWarning:true,useCodeCache:false,assets}));
run(`node --experimental-sea-config "${path.join(tmp,'sea.json')}"`);
const ver=process.version;const cache=path.join(root,'.cache');fs.mkdirSync(cache,{recursive:true});
const nodeExe=path.join(cache,`node-${ver}-win-x64.exe`);
if(!fs.existsSync(nodeExe)){const r=await fetch(`https://nodejs.org/dist/${ver}/win-x64/node.exe`);if(!r.ok)throw new Error(`download node.exe: ${r.status}`);fs.writeFileSync(nodeExe,Buffer.from(await r.arrayBuffer()));}
const exe=path.join(out,'s-uvazheniem.exe');fs.copyFileSync(nodeExe,exe);
run(`npx postject "${exe}" NODE_SEA_BLOB "${path.join(tmp,'sea.blob')}" --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2`);
fs.copyFileSync(path.join(root,'.env.example'),path.join(out,'.env.example'));
if(!process.env.KEEP_TMP)fs.rmSync(tmp,{recursive:true,force:true});
console.log('Готово:',exe);
