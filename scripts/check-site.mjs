import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {content,languages,articleSlugs} from '../src/content.js';
import {transform} from 'esbuild';

function shape(value){if(Array.isArray(value))return value.map(shape);if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).map(k=>[k,shape(value[k])]));return typeof value}
for(const lang of languages){assert.deepEqual(shape(content[lang]),shape(content.en),'Translation structure: '+lang);for(const value of Object.values(content[lang]))assert.notEqual(value,'');}
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/,'$1')),'..');
const file=path.join(root,'node_modules','.cache','lorbyte-verify.mjs');
const source=fs.readFileSync(path.join(root,'src','main.jsx'),'utf8').replace("import './styles.css';",'');
await build({stdin:{contents:source,resolveDir:path.join(root,'src'),loader:'jsx'},outfile:file,bundle:true,platform:'node',format:'esm',packages:'external',logLevel:'silent'});
const {App,initialLanguage,route}=await import(pathToFileURL(file).href);
globalThis.window={location:{pathname:'/',search:'',hash:'',href:'https://lorbyte.com/'},addEventListener(){},removeEventListener(){},matchMedia:()=>({matches:false,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}})};
globalThis.document={getElementById:()=>null};
globalThis.localStorage={getItem:()=>null};
let checks=0;
for(const lang of languages){for(const pathname of ['/','/contact','/how-it-works','/blog',...articleSlugs.map(s=>'/blog/'+s),'/missing']){
 window.location={pathname,search:'?lang='+lang,hash:'',href:'https://lorbyte.com'+pathname+'?lang='+lang};
 const html=renderToStaticMarkup(React.createElement(App));
 assert.ok(html.includes('<h1>'),`Heading: ${lang} ${pathname}`);
 assert.ok(html.includes('aria-label="'+{en:'English',fr:'Français',ar:'العربية'}[lang]+'" aria-pressed="true"'),`Selected language: ${lang}`);
 assert.ok(!/href="\/#\//.test(html),'No hash routes');
 assert.ok(html.includes('https://app.lorbyte.com'),'App link');
 if(pathname==='/contact'){assert.ok(html.includes('name="message"'));assert.ok(html.includes('contact@lorbyte.com'));assert.ok(html.includes(content[lang].send));assert.ok(html.includes('type="email" dir="ltr"'));}
 if(pathname==='/')assert.ok(html.includes(content[lang].hero[0]));
 if(pathname==='/missing')assert.ok(html.includes(content[lang].notFound));
 for(const article of articleSlugs)if(pathname==='/blog/'+article)assert.ok(html.includes(content[lang].articles[articleSlugs.indexOf(article)][0][1]));
 checks++;
}}
window.location.search='?lang=invalid';localStorage.getItem=()=> 'fr';assert.equal(initialLanguage(),'fr');
localStorage.getItem=()=>{throw new Error('Blocked storage')};assert.equal(initialLanguage(),'en');window.location.search='?lang=ar';assert.equal(initialLanguage(),'ar');
window.location.pathname='/contact/';assert.equal(route(),'/contact');
assert.ok(source.includes('formsubmit.co/ajax/contact@lorbyte.com'));assert.ok(source.includes("document.documentElement.dir=lang==='ar'?'rtl':'ltr'"));assert.ok(source.includes("localStorage.setItem('lorbyte-language',code)"));
const previewSource=fs.readFileSync(path.join(root,'src','WorkspacePreview.jsx'),'utf8');
const previewOutput=path.join(root,'node_modules','.cache','preview-verify.mjs');
await build({stdin:{contents:previewSource+'\nexport {ITDesk,HotelBoard,HRPlanner};',resolveDir:path.join(root,'src'),loader:'jsx'},outfile:previewOutput,bundle:true,platform:'node',format:'esm',packages:'external',logLevel:'silent'});
const previews=await import(pathToFileURL(previewOutput).href);
for(const lang of languages){const c=previews.previewCopy[lang];assert.deepEqual(shape(c),shape(previews.previewCopy.en));const ticket=renderToStaticMarkup(React.createElement(previews.ITDesk,{c}));const hotel=renderToStaticMarkup(React.createElement(previews.HotelBoard,{c}));const hr=renderToStaticMarkup(React.createElement(previews.HRPlanner,{c}));assert.ok(ticket.includes('data-preview="ticket-queue"'));assert.ok(ticket.includes(c.message));assert.ok(hotel.includes('data-preview="maintenance-board"'));assert.ok(hotel.includes(c.rooms[0]));assert.ok(hr.includes('data-preview="leave-calendar"'));assert.ok(hr.includes(c.month));assert.equal((hr.match(/class="calendar-cell/g)||[]).length,42);assert.ok(!hotel.includes('ticket-queue'));assert.ok(!hr.includes('maintenance-board'));}
const config=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));assert.ok(config.rewrites.some(r=>r.destination==='/index.html'));
console.log(`Passed: ${checks} translated routes, 9 distinct workflow preview renders, 42-cell leave calendars, translation parity, language fallback, clean routes, Arabic direction contract, and contact/Vercel configuration.`);
