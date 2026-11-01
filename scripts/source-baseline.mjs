import assert from 'node:assert/strict';
import {readFile,lstat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {dirname,resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';

export const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const provenance=JSON.parse(await readFile(join(root,'PROVENANCE.json'),'utf8'));
export const migration=JSON.parse(await readFile(join(root,'IMPORT-MIGRATION.json'),'utf8'));
function safe(path){assert(!path.startsWith('/')&&!path.split('/').includes('..'),'Unsafe provenance path');return join(root,path);}
export async function originalSource(entry){
  const retired=migration.retired.find(item=>item.path===entry.path);
  if(retired){
    const current=await lstat(safe(entry.path)).catch(error=>{if(error.code!=='ENOENT')throw error;});
    assert(!current,`Retired runtime source still exists: ${entry.path}`);
  }
  const path=safe(retired?.baselinePath??entry.path),stat=await lstat(path);
  assert(stat.isFile()&&!stat.isSymbolicLink(),`Expected regular source: ${path}`);
  let bytes=await readFile(path);
  for(const rewrite of migration.rewrites.filter(item=>item.path===entry.path)){
    let count=0;
    const text=bytes.toString('utf8').replace(/((?:from\s*|import\s*\())(["'])([^"']+)\2/g,(all,prefix,quote,specifier)=>{
      if(specifier!==rewrite.to)return all;
      count++;return prefix+quote+rewrite.from+quote;
    });
    assert(count>0,`Unused import rewrite: ${entry.path}: ${rewrite.to}`);bytes=Buffer.from(text);
  }
  assert.equal(bytes.length,entry.bytes,`Original byte count drift: ${entry.path}`);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256,`Non-import source drift: ${entry.path}`);
  assert.equal(createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),entry.gitBlob,`Original Git identity drift: ${entry.path}`);
  return bytes;
}
