<template>
    <v-container class="pl-10">
        <h2 class="text-center mb-6">{{ feed.name }}</h2>
        <v-row class="mb-4" dense>
            <v-col cols="12" md="6">
                <v-text-field
                    v-model="query"
                    label="Rechercher un sujet"
                    clearable
                    prepend-icon="mdi-magnify"
                    outlined
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
                <v-text-field
                    v-model="website"
                    label="Site web"
                    clearable
                    prepend-icon="mdi-domain"
                    outlined
                ></v-text-field>
            </v-col>
        </v-row>
        <v-btn
            color="primary"
            block
            class="mb-6"
            @click="getNews"
            :loading="isLoading"
            :disabled="isLoading"
        >
            Rechercher
        </v-btn>
        <div v-if="isLoading" class="text-center">
            <v-progress-circular indeterminate color="primary" size="40"></v-progress-circular>
            <p class="mt-3">Chargement des actualités...</p>
        </div>
        <v-alert type="info" v-else-if="news.length === 0" outlined>
            Aucune actualité trouvée.
        </v-alert>
        <v-row v-else dense>
            <v-col cols="12" v-for="article in news" :key="article.url">
                <v-card class="mb-4" outlined>
                    <v-card-text>
                        <a :href="article.url" target="_blank" rel="noopener noreferrer" class="text-decoration-none">
                            <h3 class="mb-2 font-weight-medium">{{ article.title }}</h3>
                        </a>
                        <p class="text-muted mb-2">{{ article.description }}</p>
                        <small class="d-block text-right">
                            <strong>{{ article.source.name }}</strong> • {{ formatDate(article.publishedAt) }}
                        </small>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { fetchNews } from '@/services/newsApi';

export default {
    name: 'NewsFeed',
    props: {
        feed: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            news: [], 
            isLoading: false,
            query: this.feed.query || '',
            website: this.feed.website || '',
        };
    },
    methods: {
        async getNews() {
            this.isLoading = true;
            this.news = await fetchNews(this.website.trim(), this.query.trim());
            this.isLoading = false;
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        },
    },
    mounted() {
        this.getNews();
    },
};
</script>
