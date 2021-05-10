<template>
    <v-main>
      <v-container class="flex">

        <v-container v-if="tags.length > 0" class="tag-list">
          <v-list-item v-for="(tag, index) in tags" :key="index">
            <v-list-item-content>
              <v-list-item-title @click="getRecipes(tag.id)"> {{ tag.name }} ({{ tag.count }}) </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-container>

        <v-container class="results-list">
          <v-progress-circular
            v-show="loading"
            indeterminate
            color="primary"
          ></v-progress-circular>

          <v-form ref="form" action="http://localhost:3000/pdf/generate" method="post">
            <v-list-item v-for="(recipe, index) in recipes" :key="index">
              <v-list-item-content>
                <v-img
                  max-height="150"
                  max-width="250"
                  :src="recipe.image_url"
                  @click="saveToLocalStorage(recipe.id)"
                ></v-img>
                <v-container fluid>
                  <v-checkbox
                    v-model="selected"
                    :label="recipe.name"
                    :value="recipe.id"
                    name="selected"
                  ></v-checkbox>
                </v-container>
              </v-list-item-content>
            </v-list-item>

            <v-btn
              v-if="recipes.length > 0"
              depressed
              color="primary"
              type="submit"
            >Create Ebook
            </v-btn>

          </v-form>

        </v-container>

      </v-container>

    </v-main>
</template>

<script>
  export default {
    data: () => ({ 
      tags: [],
      recipes: [],
      savedLocally: [],
      selected: [],
      right: null,
      loading: false
    }),
    mounted() {
      this.getTags();
    },
    methods: {
      getTags() {
        fetch("https://coctelia.com/wp-json/wp/v2/tags?per_page=100")
          .then(response => response.json())
          .then(data => {
            data.map(tag => {
              this.tags.push(tag);
            })
          })
      },
      getRecipes(id) {
        // empty out the recipes array before adding new recipes
        this.recipes = [];
        this.loading = true;

        fetch(`https://coctelia.com/wp-json/wp/v2/posts?tags=${id}&per_page=100`)
          .then(response => response.json())
          .then(data => {
            data.map(post => {
              this.recipes.push(post.recipe);
            })
          })
          .finally(() => { this.loading = false; })
      },
      saveToLocalStorage(recipe) {
        this.savedLocally.push(recipe);
        const parsed = JSON.stringify(this.savedLocally);
        localStorage.setItem('recipes', parsed);
      },
    }
  }
</script>

<style scoped>
.flex {
  display: flex;
}
.v-progress-circular {
  margin: 1rem;
}
</style>