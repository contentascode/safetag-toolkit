---
id: {{id}}
name: {{title}}
description: {{description}}
{{#if origin}}origin: {{origin}}{{/if}}
{{#if origin_path}}origin_path: {{origin_path}}{{/if}}
{{#each tag}}
{{key}}: {{value}}
{{/each}}
---
# {{title}}

{{#if summary}}
## Summary

{{{summary}}}
{{/if}}

{{#if checklist}}
## Overview

{{{checklist}}}
{{/if}}

{{#if materials}}
## Materials Needed

{{{materials}}}
{{/if}}

{{#if opsec}}
## Considerations

{{{opsec}}}
{{/if}}

{{#if instructions}}
## Walkthrough

{{{instructions}}}
{{/if}}

{{#if recommendations}}
## Recommendation

{{{recommendations}}}
{{/if}}
