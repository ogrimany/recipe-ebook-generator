var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

router.post('/', async (req, res, next) => {
console.log(req.body);
  // alphabetizes
  function sortedList(list) {
      function compare(a, b) {
          if (a.name < b.name) {
              return -1;
          }
          if (a.name > b.name) {
              return 1;
          }
          return 0;
      }
      return list.sort(compare);
  }

  fetch(req.body.url) // WPRM API URL
      .then(response => response.json())
      .then(data => {
          var recipes = data.map((data) => {
              // grab the post's featured image
              data.recipe.image_url = data.fimg_url;
              // remove <p> tags from instructions text
              data.recipe.summary = data.recipe.summary.replace(/(<([^>]+)>)/ig, '');
              data.recipe.instructions_flat = data.recipe.instructions_flat.map((instruction) => {
                  instruction.text = instruction.text.replace(/(<([^>]+)>)/ig, '');
                  return instruction;
              });
              // create anchor links
              data.recipe.anchor = "/#" + data.recipe.name.toLowerCase().replace(/\s/g, '-');
              return data.recipe;
          });

          // alphabetize list
          recipes = sortedList(recipes);

          // create a table of contents
          var contents = recipes.map((data) => { return data.name; })

          res.render('pdf', { 
              data: recipes,
              table: contents,
              title: req.body.title,
              offset: 4
          });
      });
});

module.exports = router;
