---
title: "Optimal transport for multi-commodity routing on networks"
collection: publications
permalink: /publication/lonardi2020optimal
authors: "Alessandro Lonardi, Enrico Facca, Mario Putti and Caterina De Bacco"
date: 27-10-2020
paperurl: <a href="https://arxiv.org/abs/2010.14377">arXiv</a> / <a href="https://github.com/aleable/McOpt">GitHub</a>
excerpt: ' '
---

## Links

* <b>arXiv:</b> <a href="https://arxiv.org/abs/2010.14377">2010.14377</a>
* <b>OS code (GitHub):</b> <a href="https://github.com/aleable/McOpt">aleable/McOpt</a>

## Abstract

We present a model for finding optimal multi-commodity flows on networks based on optimal transport theory. The model relies on solving a dynamical system of equations. We prove that its stationary solution is equivalent to the solution of an optimization problem that generalizes the one-commodity framework. In particular, it generalizes previous results in terms of optimality, scaling, and phase transitions obtained in the one-commodity case. Remarkably, for a suitable range of parameters, the optimal topologies have loops. This is radically different to the one-commodity case, where within an analogous parameter range the optimal topologies are trees. This important result is a consequence of the extension of Kirkchoff's law to the multi-commodity case, which enforces the distinction between fluxes of the different commodities. Our results provide new insights into the nature and properties of optimal network topologies. In particular, they show that loops can arise as a consequence of distinguishing different flow types, and complement previous results where loops, in the one-commodity case, were arising as a consequence of imposing dynamical rules to the sources and sinks or when enforcing robustness to damage. Finally, we provide an efficient implementation for each of the two equivalent numerical frameworks, both of which achieve a computational complexity that is more efficient than that of standard optimization methods based on gradient descent. As a result, our model is not merely abstract but can be efficiently applied to large datasets. We give an example of concrete application by studying the network of the Paris metro.

## Cite as

<b>BibTeX:</b>

function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<p id="p1">P1: I am paragraph 1</p>
<p id="p2">P2: I am a second paragraph</p>
<button onclick="copyToClipboard('#p1')">Copy P1</button>
<button onclick="copyToClipboard('#p2')">Copy P2</button>
<br/><br/><input type="text" placeholder="Paste here for test" />

@misc{lonardi2020optimal,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;title={Optimal transport for multi-commodity routing on networks},<br/>
&nbsp;&nbsp;&nbsp;&nbsp;author={Alessandro Lonardi and Enrico Facca and Mario Putti and Caterina De Bacco},<br/>
&nbsp;&nbsp;&nbsp;&nbsp;eprint={2010.14377},<br/>
&nbsp;&nbsp;&nbsp;&nbsp;archivePrefix={arXiv},<br/>
&nbsp;&nbsp;&nbsp;&nbsp;primaryClass={physics.soc-ph}<br/>
}
