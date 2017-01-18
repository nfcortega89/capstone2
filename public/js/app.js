var state = {};

function main() {

    // food search bar
    var getResults = function() {
        $('#food').on('submit', function(e) {

            e.preventDefault();
            // get the input from recipe
            var dishes = $('#dishes').val();
            // console.log('APP.JS', dishes)
            // set input value back to blank
            $('#dishes').val(null);
            // query strings
            var url = '/recipes?food=' + dishes;
            $('.jumbotron').show();
            $('footer').show();
            // make request to server
            $.ajax({
                type: 'GET',
                dataType: 'json',
                url: url
            }).done(function(data) {
                $('h3').show()
                var dish = data.matches;
                console.log(dish);
                for (var i = 0; i < dish.length; i++) {
                    var result = showResults(dish[i])
                    $('#results').append(result);
                }

            }).fail(function(err) {
                console.error('(50)Error: ' + err);
            })
        })
    }

    // clones elements for each recipe
    var showResults = function(recipes) {
        // use two classes to pick out elements
        var results = $('.template .recipe-results').clone();

        // we give each recipe it's respectable id
        results.attr('id', recipes.id);

        var image = results.find('.recipe-image img');
        image.attr('src', recipes.imageUrlsBySize["90"]);

        var recipeNames = results.find('.recipe-name');
        recipeNames.text(recipes.recipeName);

        return results;
    }

    // don't think im setting the url route
    var showDiets = function() {
        $('.diets li').on('click', 'a', function() {
            $('.jumbotron').show();
            var url = '/recipes/' + $(this).attr('id');
            $.ajax({
                type: 'GET',
                dataType: 'json',
                url: url
            }).done(function(data) {
                $('h3').show()
                var dish = data.matches;
                console.log(dish)
                for (var i = 0; i < dish.length; i++) {
                    var result = showResults(dish[i])
                    console.log($('#results'));
                    $('#results').append(result);
                }
            })
        })
    }

    // gets recipe nutritional facts
    var bindResultClickEvent = function() {
        // bind click event on results and returns detailed information
        $('#results').on('click', '.recipe-results', function() {
            // use 'this' to get attr of id
            var url = '/recipe/' + $(this).attr('id')
            $('.selected').show();
            $.ajax({
                type: 'GET',
                dataType: 'json',
                url: url
            }).done(function(data) {
                console.log(data);
                var image = data.images[0].hostedLargeUrl;
                var recipe = data.name;
                var time = data.totalTime;
                var str = "";
                var ingredients = data.ingredientLines;
                var nutri = [];
                data.nutritionEstimates.forEach(function(attr) {
                    nutri.push(attr)
                })
                console.log(nutri);
                for (var i = 0; i < ingredients.length; i++) {
                    str += '<li>' + ingredients[i] + '</li><br>';
                }
                var current = selected(image, recipe, str, time)
                $('.selected').replaceWith(current);
            })
        })
    }

    // picks out which elements will show on right container
    var selected = function(image, recipe, ingredient, time, nutritions) {
        // use two classes to pick out elements

        var results = $('.jumbotron .selected ').clone();

        var images = results.find('.select img');
        images.attr('src', image)

        var recipeNames = results.find('.recipe');
        recipeNames.text(recipe);

        var ingredients = results.find('.ingredients');
        ingredients.html(ingredient)

        var times = results.find('.time');
        times.text('Cooking Time: ' + time);

        var nutrients = results.find('.nutrition');


        return results;
    }


    // init 
    getResults();
    bindResultClickEvent();
    showDiets();
}
$(document).on('ready', main);
