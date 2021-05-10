<template>
    <v-main>
        <v-container class="flex">

            <v-container>
                <v-container>
                    <v-row>
                        <v-col>
                            <v-text-field
                                label="URL"
                                name="url"
                                v-model="url"
                                clearable
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-btn
                            depressed
                            color="primary"
                            type="button"
                            @click="getRecipe()"
                            >Get Recipe
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-container>

            <v-container class="result">
                <v-img
                    max-height="150"
                    max-width="250"
                    :src="recipe.image"
                ></v-img>
                <h2>{{ recipe.name }}</h2>
                <p>{{ recipe.summary }}</p>
                <v-list>
                    <v-list-item v-for="(ingredient, index) in recipe.ingredients_flat" :key="index" v-text="ingredient">
                    </v-list-item>
                </v-list>
            </v-container>

        </v-container>
    </v-main>
</template>

<script>
//import axios from 'axios';
export default {
    data: () => ({ 
        url: '',
        recipe: ''
    }),
    methods: {
        getRecipe() {
            fetch('http://localhost:5001/coctelia-6227/us-central1/scraper', {
                method: 'post',
                body: JSON.stringify({ url: this.url })
            })
            .then(response => response.json())
            .then(data => {
                this.recipe = data;
            })
        }
    }
}
</script>

<style scoped>
.flex {
    display: flex;
}
</style>