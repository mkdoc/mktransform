# Stream Transform

<? @include readme/badges.md ?>

> Inject custom stream transformations

Accepts a list of functions that should return stream classes to be injected into the transformation pipeline.

The [highlight][mkhighlight] transform implementation serves as a good example; it highlights code blocks with info strings and rewrites the document stream.

<? @include {=readme} install.md ?>

***
<!-- @toc -->
***

<? @include {=readme} usage.md example.md stream-functions.md help.md ?>

<? @exec mkapi index.js --title=API --level=2 ?>
<? @include {=readme} license.md links.md ?>
