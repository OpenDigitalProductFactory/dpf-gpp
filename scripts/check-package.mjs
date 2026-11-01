import assert from 'node:assert/strict';
import {mkdtemp,mkdir,readFile,writeFile,rm,lstat,readdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import ts from 'typescript';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8'));
assert.equal(manifest.exports?.['./browser']?.import,'./dist/validators/src/gpp/browser.js','Declare portable installed GPP exports');
assert.equal(manifest.dependencies?.['@opendigitalproductfactory/dpf-workroom'],'0.1.0-candidate.4','Use the canonical Workroom artifact');
assert.equal(manifest.dependencies?.['@opendigitalproductfactory/dpf-scoped-judgment'],'0.1.0-candidate.2','Use the canonical scoped judgment artifact');
assert.equal(manifest.private,true);assert.equal(process.version,'v24.16.0');
const temp=await mkdtemp(join(tmpdir(),'gpp-installed-'));
const env={...process.env,NODE_PATH:'',NODE_OPTIONS:''};
function run(command,args,cwd=root){const result=spawnSync(command,args,{cwd,env,encoding:'utf8',maxBuffer:12*1024*1024});assert.equal(result.status,0,`${command} ${args.join(' ')}:\n${result.stdout}${result.stderr}`);return result.stdout;}
function moduleImports(contents,path){const imports=[];const source=ts.createSourceFile(path,contents,ts.ScriptTarget.Latest,true);function walk(node){if((ts.isImportDeclaration(node)||ts.isExportDeclaration(node))&&node.moduleSpecifier)imports.push(node.moduleSpecifier.text);if(ts.isCallExpression(node)&&node.expression.kind===ts.SyntaxKind.ImportKeyword){assert(ts.isStringLiteral(node.arguments[0]),'Dynamic package import must be inspectable');imports.push(node.arguments[0].text);}ts.forEachChild(node,walk);}walk(source);return imports;}
try{
  const baseline=JSON.parse(run(process.execPath,[join(root,'scripts/check-baseline.mjs')]));
  const packed=JSON.parse(run('npm',['pack','--json','--ignore-scripts','--pack-destination',temp]))[0];
  assert(!packed.files.some(file=>/^(?:packages|node_modules|vendor|examples\/_baseline)(?:\/|$)/.test(file.path)),'No frozen source or dependency transport inside runtime artifact');
  const forbidden=['action-result','decision-scopes','outcome-disposition','gpp/diagnostics','gpp/element-ids','gpp/executable-constructs','workroom/flow-graph','workroom/index','workroom/marking','workroom/receipts'];
  for(const path of forbidden)assert(!packed.files.some(file=>file.path.startsWith('dist/validators/src/'+path+'.')),'Retired runtime copy shipped: '+path);
  const tarball=join(temp,packed.filename),consumer=join(temp,'consumer');await mkdir(join(consumer,'src'),{recursive:true});
  await writeFile(join(consumer,'package.json'),JSON.stringify({name:'installed-gpp-consumer',private:true,type:'module'}));
  const dependencies=['opendigitalproductfactory-dpf-workroom-0.1.0-candidate.4.tgz','opendigitalproductfactory-dpf-scoped-judgment-0.1.0-candidate.2.tgz'].map(name=>join(root,'vendor',name));
  run('npm',['install','--engine-strict','--ignore-scripts','--no-audit','--no-fund','--package-lock=false',tarball,...dependencies,'@types/node@26.6.5','undici-types@8.9.0'],consumer);
  const installed=join(consumer,'node_modules',...manifest.name.split('/'));
  for(const name of [manifest.name,'@opendigitalproductfactory/dpf-workroom','@opendigitalproductfactory/dpf-scoped-judgment'])assert(!(await lstat(join(consumer,'node_modules',...name.split('/')))).isSymbolicLink());
  for(const name of (await readdir(join(root,'examples/gpp-toolkit/src'))).filter(name=>name.endsWith('.ts'))){
    let source=await readFile(join(root,'examples/gpp-toolkit/src',name),'utf8');
    for(const [from,to]of [['../kernel/gpp/browser.js',manifest.name+'/browser'],['../kernel/gpp/compiler.js',manifest.name+'/compiler'],['../kernel/workroom/index.js','@opendigitalproductfactory/dpf-workroom'],['../kernel/gpp/work-shape-contracts.js',manifest.name+'/contracts']])source=source.replaceAll(from,to);
    await writeFile(join(consumer,'src',name),source);
  }
  const allExports=Object.keys(manifest.exports).map((key,i)=>`import * as publicExport${i} from '${manifest.name}${key==='.'?'':key.slice(1)}';void publicExport${i};`).join('\n');
  await writeFile(join(consumer,'src/exports.ts'),allExports+`\nimport {stageElementId as gppId} from '${manifest.name}/browser';import {stageElementId as roomId} from '@opendigitalproductfactory/dpf-workroom/process/element-ids';if(gppId!==roomId)throw Error('Competing process identity body');\n`);
  const compiler=join(root,'node_modules/typescript/bin/tsc');
  const options={target:'ES2022',module:'NodeNext',moduleResolution:'NodeNext',strict:true,skipLibCheck:false,noEmitOnError:true,rootDir:'src',outDir:'dist'};
  await writeFile(join(consumer,'tsconfig.browser.json'),JSON.stringify({compilerOptions:{...options,lib:['ES2022','DOM'],types:[],outDir:'browser-dist'},include:['src/browser-smoke.ts','src/fixtures.ts']}));
  run(process.execPath,[compiler,'--project',join(consumer,'tsconfig.browser.json')],consumer);
  const browser=JSON.parse(run(process.execPath,['--input-type=module','--eval',"const {runBrowserSmoke}=await import('./browser-dist/browser-smoke.js');console.log(JSON.stringify(await runBrowserSmoke()));"],consumer));
  assert.deepEqual(browser,baseline.browser.passed,'Browser contract behavior changed');
  run(process.execPath,['--input-type=module','--eval',`const {routineDocument}=await import('./browser-dist/fixtures.js');const {parseShapeDocument}=await import('${manifest.name}/browser');for(const tool of ['reviewDesignDoc','saveBuildEvidence','read_synthetic']){const value=routineDocument();value.stages[0].tools=[tool];if(!parseShapeDocument(JSON.stringify(value)).accepted)throw Error('Registered tool identity rejected: '+tool)}for(const tool of ['../reviewDesignDoc','review/DesignDoc','ReviewDesignDoc','review.DesignDoc']){const value=routineDocument();value.stages[0].tools=[tool];if(parseShapeDocument(JSON.stringify(value)).accepted)throw Error('Invalid tool path admitted: '+tool)}`],consumer);
  await writeFile(join(consumer,'tsconfig.json'),JSON.stringify({compilerOptions:{...options,lib:['ES2022'],types:['node']},include:['src/**/*.ts']}));
  run(process.execPath,[compiler,'--project',join(consumer,'tsconfig.json')],consumer);
  run(process.execPath,[join(consumer,'dist/exports.js')],consumer);
  const node=JSON.parse(run(process.execPath,['--input-type=module','--eval',"const {runNodeSmoke}=await import('./dist/node-smoke.js');console.log(JSON.stringify(await runNodeSmoke()));"],consumer));
  assert.deepEqual(node.passed,baseline.nodeCompiler.passed,'Compiler/mapping adverse behavior changed');
  assert.equal(node.qualification,baseline.nodeCompiler.qualification);
  assert.equal(node.generatedModule,baseline.baselineGeneratedModule.replaceAll('../kernel/gpp/work-shape-contracts.js',manifest.name+'/contracts'),'Generated bytes changed beyond declared receiving type import');
  await writeFile(join(consumer,'src/generated.ts'),node.generatedModule);
  run(process.execPath,[compiler,'--project',join(consumer,'tsconfig.json')],consumer);
  run(process.execPath,['--input-type=module','--eval',"const {SYNTHETIC_READ_1_2_3}=await import('./dist/generated.js');if(SYNTHETIC_READ_1_2_3.key!=='synthetic-read'||SYNTHETIC_READ_1_2_3.version!=='1.2.3')throw Error('Generated receiving module differs');"],consumer);
  const schema=JSON.parse(run(process.execPath,['--input-type=module','--eval',`const {gppShapeJsonSchema}=await import('${manifest.name}/schema');console.log(JSON.stringify(gppShapeJsonSchema()));`],consumer));
  assert.deepEqual(schema,baseline.baselineShapeSchema,'Published schema changed');
  // Traverse the actual installed browser closure, including canonical foundation exports.
  const seen=new Set();async function browserClosure(path){if(seen.has(path))return;seen.add(path);for(const specifier of moduleImports(await readFile(path,'utf8'),path)){assert(!specifier.startsWith('node:'),'Node builtin reached by browser export');if(specifier.startsWith('.'))await browserClosure(resolve(dirname(path),specifier));else if(specifier.startsWith('@opendigitalproductfactory/')){const pieces=specifier.split('/'),name=pieces.slice(0,2).join('/'),subpath=pieces.length===2?'.':'./'+pieces.slice(2).join('/'),home=join(consumer,'node_modules',...name.split('/'));const pkg=JSON.parse(await readFile(join(home,'package.json'),'utf8'));assert(pkg.exports[subpath]?.import,'Undeclared foundation export');await browserClosure(join(home,pkg.exports[subpath].import));}else {assert.equal(specifier,'zod','Unexpected third-party browser dependency');const home=join(consumer,'node_modules/zod');const pkg=JSON.parse(await readFile(join(home,'package.json'),'utf8'));assert.equal(typeof pkg.exports['.'].import,'string');await browserClosure(join(home,pkg.exports['.'].import));}}}
  await browserClosure(join(installed,manifest.exports['./browser'].import));
  async function inspect(directory){for(const entry of await readdir(directory,{withFileTypes:true})){const path=join(directory,entry.name);assert(!entry.isSymbolicLink());if(entry.isDirectory())await inspect(path);else if(/\.(?:js|ts)$/.test(entry.name))for(const specifier of moduleImports(await readFile(path,'utf8'),path)){assert(!specifier.endsWith('.ts'),'Source import leaked');assert(!specifier.startsWith('@dpf/'),'Monorepo alias leaked');if(specifier.startsWith('.'))assert((await lstat(resolve(dirname(path),specifier))).isFile());}}}
  await inspect(join(installed,'dist'));
  run(process.execPath,['--input-type=module','--eval',`for(const path of ['${manifest.name}/dist/validators/src/gpp/browser.js','${manifest.name}/packages/validators/src/gpp/browser.ts']){try{await import(path);throw Error('Unexported path admitted')}catch(error){if(error.code!=='ERR_PACKAGE_PATH_NOT_EXPORTED')throw error}}`],consumer);
  console.log(JSON.stringify({package:`${manifest.name}@${manifest.version}`,tarballSha256:createHash('sha256').update(await readFile(tarball)).digest('hex'),installedConsumer:'pass',declarations:'pass',browserClosureFiles:seen.size,projectFoundationBrowserClosureFiles:[...seen].filter(path=>!path.includes('/node_modules/zod/')).length,thirdPartyBrowserClosure:'Zod ESM imports traversed',browserContractCases:browser,nodeCompilerCases:node.passed,schemaParity:'exact',generatedModuleParity:'exact except explicit consumer type import',retiredRuntimeCopies:forbidden.length,qualification:node.qualification,productionConformance:false},null,2));
}finally{await rm(temp,{recursive:true,force:true});}
