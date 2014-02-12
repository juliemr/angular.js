describe("{$ doc.describeBlock.path $}", function() {
  beforeEach(function() {
    browser.get("{$ doc.pathPrefix $}/{$ doc.describeBlock.path $}");
  });

  beforeEach(function() {
    // Switch to the example iframe.
    browser.switchTo().frame("{$ doc.exampleId $}");
  });

{$ doc.innerTest $}  
});
