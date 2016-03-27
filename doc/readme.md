# Stream Transform

<? @include readme/badges.md ?>

> Inject custom stream transformations

Accepts a list of functions that should return stream classes to be injected into the transformation pipeline.

<? @include {=readme} install.md ?>

***
<!-- @toc -->
***

## Usage

Create stream transform function(s) and pass in the `transforms` array:

<? @source {javascript=s/\.\.\/index/mktransform/gm} usage.js ?>

<? @include {=readme} example.md help.md ?>

<? @exec mkapi index.js --title=API --level=2 ?>
<? @include {=readme} license.md links.md ?>
