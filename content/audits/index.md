---
layout: audit.pug
metalsmith: ../audit.yml
metadata:
  organisation:
  start-date:
  end-date:
---

# Audit $organisation$
$start-date$ - $end-date$

## Plan

$for(activities)$$activities.name$$sep$, $endfor$
