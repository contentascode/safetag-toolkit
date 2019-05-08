---
id: {{id}}
name: {{{title}}}
description: {{{description}}}
{{#if origin}}origin: {{origin}}{{/if}}
{{#if origin_path}}origin_path: {{origin_path}}{{/if}}
{{#if authors}}authors: {{authors}}{{/if}}
{{#if org_size_under}}org_size_under: {{org_size_under}}{{/if}}
{{#if remote_options}}remote_options: {{remote_options}}{{/if}}
{{#if skills_required}}skills_required: {{skills_required}}{{/if}}
{{#if time_required_minutes}}time_required_minutes: {{time_required_minutes}}{{/if}}
{{#if approach_category}}approach: {{approach_category}}{{/if}}
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
## Operational Security

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


{{#if output}}
## Outputs

{{{output}}}
{{/if}}

{{#if special}}{{{special}}}{{/if}}

{{#if footnotes}}{{{footnotes}}}{{/if}}
