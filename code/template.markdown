$if(titleblock)$
$titleblock$

$endif$
$for(header-includes)$
$header-includes$

$endfor$
$for(include-before)$
$include-before$
$endfor$

$if(toc)$
<h1>Table of Contents</h1>

$toc$

$endif$

$body$
$for(include-after)$

$include-after$
$endfor$
