describe("{$ doc.describeBlock.path $}", function() {
  beforeEach(function() {
    browser.get("{$ doc.pathPrefix $}/{$ doc.describeBlock.path $}");
  });

{$ doc.innerTest $}  
});
