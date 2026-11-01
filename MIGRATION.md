# Migration and release boundary

1. Bootstrap with exact public upstream sources and original isolated examples. Verify every imported byte and retain notices. This step creates a source home only.
2. Maintain the declared component responsibility here. Resolve shared graph, vocabulary and canonical-JSON ownership in DEPENDENCY-BOUNDARY.json before editing shared semantics or publishing a consuming release. Do not create cycles, a second work engine or competing serializers to avoid a dependency.
3. Produce a versioned package interface and full dependency closure after the source identity baseline passes. Characterize old and new input, output, digest, receipt, canonicalization, loader and emitted-module behavior. Unsupported formats refuse; missing data never becomes authority.
4. Migrate each actual DPF/DPF2 caller through its existing governed lifecycle. In that same accepted slice retire only replaced source/snapshots and record compatibility consumers and their removal condition. No source in either consumer changes merely because this repository exists.
5. A release must have an accountable maintainer, compatibility policy, security reporting path, exact check evidence and received useful outcome where applicable. Native or production claims need their actual qualification. Do not fabricate upstream integration/browser results or inherit them from a merge.

These are migration obligations, not extra per-tool human approvals. Ordinary authorized checks and independent review retain their current meaning; actual required human consent remains distinct.

## Private installed dependency candidate

`0.1.0-candidate.0` emits ESM and declarations. The root and `browser` subpath
provide the browser-compatible model API; `compiler` adds the Node compiler.
Other explicit subpaths in package.json expose schema, layout, contracts,
vocabulary, canonical JSON and individual model operations. Undeclared deep
paths are unsupported. This is a private candidate, not a registry release.

GPP depends downward on exactly Workroom `0.1.0-candidate.1`, scoped judgment
`0.1.0-candidate.0` and Zod `4.6.7`. Ten displaced runtime bodies have moved
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
