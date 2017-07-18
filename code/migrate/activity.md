---
id: {{id}}
name: {{title}}
description: Tour the office to take into account the physicality of devices, backup drives, servers, and hard-wired networks.
{{#each tag}}
{{key}}: {{value}}
{{/each}}
duration: 2
template:
  minimum-viable:
    - walk-around: small-office
    - interview: 3-interviewees
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
