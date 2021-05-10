var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

// alphabetizes recipes list
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

router.post('/generate', async (req, res, next) => {

    const recipeIds = req.body.selected;
    let recipes = [];

    const requests = recipeIds.map(async id => {
        await fetch(`https://coctelia.com/wp-json/wp/v2/wprm_recipe/${id}`)
            .then(response => response.json())
            .then(data => {
                // remove <p> tags from instructions text
                data.recipe.summary = data.recipe.summary.replace(/(<([^>]+)>)/ig, '');
                data.recipe.instructions_flat = data.recipe.instructions_flat.map((instruction) => {
                    instruction.text = instruction.text.replace(/(<([^>]+)>)/ig, '');
                    return instruction;
                });
                // create anchor links
                data.recipe.anchor = "/#" + data.recipe.name.toLowerCase().replace(/\s/g, '-');
                recipes.push(data.recipe);
            })
    })

    Promise.all(requests)
        .then(() => {
            // alphabetize list
            recipes = sortedList(recipes);
            // create a table of contents
            var contents = recipes.map((data) => { return data.name; })
            res.render('ebook', { 
                data: recipes,
                table: contents,
                offset: 4
            });
        })

})

module.exports = router;
