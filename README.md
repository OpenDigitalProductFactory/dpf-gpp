# dpf-gpp

GPP shape schema, compiler and model tooling.

A separate component source home for DPF and the DPF2 Linux business-appliance destination. This initial commit seeds the exact merged extraction; it is not a production-qualified library release or an OS service.

## Source and verification

Source: [56f3a5d2d57d](https://github.com/OpenDigitalProductFactory/opendigitalproductfactory/tree/56f3a5d2d57d751eb3ac435dcca4133c5ff46686), merged by [PR #6724](https://github.com/OpenDigitalProductFactory/opendigitalproductfactory/pull/6724). `PROVENANCE.json` pins every imported file to its original Git blob and SHA-256. Apache-2.0 license and original notices are retained; component-specific notice is in `examples/gpp-toolkit/NOTICE`.

Use Node **24.16.0**. Run `npm ci --ignore-scripts`, then `npm run check`. The pinned TypeScript **6.0.3** compiler builds and executes the original isolated consumer in a temporary directory. No DPF checkout, database, Docker, provider credential or model inference is needed. [gpp-toolkit example](examples/gpp-toolkit/README.md) explains its supported semantics and limits. Relative `.ts` imports are emitted with standard extension rewriting.

No package is published: `private:true` prevents accidental npm publication. Browser/native/professional qualification and useful company outcomes require the actual receiving implementation. Source checks and fixture smoke tests cannot establish them.

## Ownership and migration

This repository owns the candidate component's evolution. The files remain in their original relative source layout for an auditable move-only bootstrap. `DEPENDENCY-BOUNDARY.json` identifies shared frozen compatibility sources. They must not become independent forks; first consuming release requires one canonical package owner and removal of displaced snapshots after parity. Existing DPF and DPF2 consumers are unchanged.

See [MIGRATION.md](MIGRATION.md) for the transition and [CONTRIBUTING.md](CONTRIBUTING.md) for maintenance. Separate Git ownership does not imply another process, database, permission system or deployment. Company, Workroom, GPP/TAK, GAID/JSI, current admission and transactional effect/result owners retain their authority.

Upstream qualification limit: Synthetic compiler/model and mapping fixture only; no actual browser/CSP, authenticated evidence, job qualification, GPP 0.19 whole actor/session aggregation, tool execution or production admission.

## Private installed dependency candidate

`0.1.0-candidate.1` emits ESM and declarations. The root and `browser` subpath
provide the browser-compatible model API; `compiler` adds the Node compiler.
Other explicit subpaths in package.json expose schema, layout, contracts,
vocabulary, canonical JSON and individual model operations. Undeclared deep
paths are unsupported. This is a private candidate, not a registry release.

GPP depends downward on exactly Workroom `0.1.0-candidate.2`, scoped judgment
`0.1.0-candidate.1` and Zod `4.6.7`. Ten displaced runtime bodies have moved
out of `packages/` into unpublished baseline test fixtures. Process identity,
diagnostics, construct vocabulary, graph/marking/receipts, results and outcome
disposition belong to Workroom; decision scopes belong to scoped judgment.
GPP owns constructs-used-by analysis and the canonical JSON leaf. No cycle,
whole host, new serializer semantics or third-party runtime dependency is added.

PROVENANCE.json retains every original hash. IMPORT-MIGRATION.json declares
the import-only source derivations and retired runtime paths. The verifier
reverses those import rewrites and verifies original Git/SHA256 identity; it
also refuses restored retired runtime copies. The baseline test reconstructs
the original isolated example only in a temporary test directory. It cannot
be imported from this package or shipped as a competing runtime body.

`npm ci --ignore-scripts` uses integrity-pinned repository-relative foundation
archives in vendor for development. The runtime manifest uses exact versions.
A private receiver installs all three exact tarballs together; no absolute
host path or source alias is committed. The GPP runtime archive excludes
vendor, baseline source, development dependencies and application state.

`npm run check` verifies original provenance, builds, reconstructs the original
behavioral baseline and exercises a clean installed receiver. Checks cover
ordinary/adverse schema/compiler/model behavior, exact schema/generated-byte
parity (apart from the receiving type import), generated module compilation
and import, declarations, all exports, browser dependency closure and same
process identity function as Workroom. Browser execution uses Node; actual
browser/CSP, native host qualification and DPF/DPF2 acceptance remain unrun.
The build toolchain remains Node 24.16.0/TypeScript 6.0.3.

Maintenance follows this repository's AGENTS/CONTRIBUTING, GitHub Issues and
DCO PR/standalone CI. BI-ABB5587B under BI-B8A4DE44 coordinates this candidate,
reusing source extraction BI-721C467A without taking over its Workroom.
Native DPF admission is not claimed by this standalone result. DPF migration
BI-FCDCAE98 must replace actual caller imports and retire replaced bodies in
its own accepted slice; DPF2 owns its receiving adapter and retirement.
The other four component families retain their existing source-only state
until their own dependency migrations. Rollback before product adoption is
to retain the original seed/products. Any product rollback restores its exact
prior dependency and caller set; no package test changes live records.

Current DPF compatibility: before freezing this candidate, the source audit
found the existing BI-D37B2C13 camelCase tool-name fix. The schema baseline
therefore advances only that file to upstream adbea8f20f601e8e7d49693a1043c521b6d6c60d;
PROVENANCE.json retains its prior record in supersededFiles. Installed tests
first reproduced rejection of reviewDesignDoc, then verify camelCase support
while path/separator/uppercase-leading names remain rejected. All other original
source entries retain their original byte identity.

Candidate `.1` corrects runtime-engine metadata for strict installation on both
tested Node versions, 24.16.0 and 24.22.0, and pins the corresponding Workroom
`.2` / scoped-judgment `.1` artifacts. Build pins and pure source/API semantics
are unchanged; the prior candidate archives stay immutable.

Candidate `.2` pins Workroom `.3`, whose explicit Node24 `require` condition
loads the same emitted ESM bytes as `import`. This provides the required Node24 loader
compatibility without changing GPP source or introducing a second kernel.
Actual DPF framework and merged-source qualification remain pending receiving
verification. Scoped judgment remains `.1`; prior candidates remain immutable.
