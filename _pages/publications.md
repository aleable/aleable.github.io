---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---

<h2>Preprint</h2>
{% for post in site.publications reversed %}
  {% if post.pubtype == 'preprint' %}
      {% include archive-single.html %}
  {% endif %}
{% endfor %}

<h2>Journal Articles</h2>
{% for post in site.publications reversed %}
  {% if post.pubtype == 'journal' %}
      {% include archive-single.html %}
  {% endif %}
{% endfor %}

<h2>Conference Papers</h2>
{% for post in site.publications reversed %}
  {% if post.pubtype == 'conference' %}
      {% include archive-single.html %}
  {% endif %}
{% endfor %}

{% if author.googlescholar %}
  You can also find my articles on <u><a href="{{author.googlescholar}}">my Google Scholar profile</a>.</u>
{% endif %}

{% include base_path %}

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}
