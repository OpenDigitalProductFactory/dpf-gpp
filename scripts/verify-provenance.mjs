import {provenance,migration,originalSource} from './source-baseline.mjs';
for(const entry of provenance.files)await originalSource(entry);
console.log(JSON.stringify({component:provenance.component,files:provenance.files.length,sourceRevision:provenance.sourceRevision,sourceIdentity:'pass',importOnlyDerivations:migration.rewrites.length,retiredRuntimeSources:migration.retired.length,productionConformance:false}));
