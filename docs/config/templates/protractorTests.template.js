{% for describeBlock in desribeBlocks -%}
describe("{$ describeBlock.section $}/{$ describeBlock.id $}", function() {
  beforeEach(function() {
    browser.get("{$ pathPrefix $}/{$ describeBlock.section $}/{$ describeBlock.id $}");
  });

  {% for itClause in describeBlock.itClauses %}
    {$ itClause.code $}
  {% endfor %}  
  });
});
{%- endfor %}