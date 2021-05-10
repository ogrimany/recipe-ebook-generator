<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense nav>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <router-link :to="item.route">
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </router-link>

        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view :key="$route.path"/>
    </v-main>

  </v-app>
</template>

<script>
  export default {
    data: () => ({ 
      drawer: null,
      items: [
        { title: 'Home', icon: 'mdi-view-dashboard', route: '/' },
        { title: 'Collections', icon: 'mdi-layers-triple', route: '/collections' },
        { title: 'Fetch from URL', icon: 'mdi-file-link', route: '/url-fetch' },
      ],
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