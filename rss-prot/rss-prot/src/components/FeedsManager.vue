<template>
    <v-container class="py-5">
        <v-row>
            <v-col cols="12" md="4">
                <h2 style="margin: 10px"class="mb-4 font-weight-bold">Mes Feeds</h2>
                <v-list dense>
                    <v-list-item
                        v-for="(feed, index) in feeds"
                        :key="index"
                        @click="selectFeed(index)"
                        class="feed-item"
                        style="border: 1px solid #e0e0e0; margin: 10px; border-radius: 8px;"
                    >
                        <v-list-item-content>
                            <v-list-item-title  style="margin: 5px">{{ feed.name }}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-btn icon  style="margin: 5px" @click.stop="removeFeed(index)">
                                <v-icon color="error">mdi-delete</v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
                <v-btn block color="primary" class="mt-4" @click="addFeed" style="margin: 10px">
                    Ajouter un nouveau feed
                </v-btn>
            </v-col>
            <v-col cols="12" md="8">
                <div v-if="selectedFeed !== null">
                    <NewsFeed :feed="feeds[selectedFeed]" />
                </div>
                <div v-else class="text-center">
                    <h3>Sélectionnez un feed pour l'afficher</h3>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import NewsFeed from './NewsFeed.vue';

export default {
    name: 'FeedsManager',
    components: { NewsFeed },
    data() {
        return {
            feeds: [
                { name: 'UFC News', website: 'espn.com', query: 'UFC' },
                { name: 'Tech Updates', website: 'techcrunch.com', query: 'Technology' },
            ],
            selectedFeed: null,
        };
    },
    methods: {
        selectFeed(index) {
            this.selectedFeed = index;')'
        },
        addFeed() {
            const newFeed = {
                name: `Feed ${this.feeds.length + 1}`,
                website: '',
                query: '',
            };
            this.feeds.push(newFeed);
            this.selectedFeed = this.feeds.length - 1;
        },
        removeFeed(index) {
            this.feeds.splice(index, 1);
            this.selectedFeed = null;
        },
    },
};
</script>

<style>
.feed-item {
    cursor: pointer;
}
.feed-item:hover {
    background-color: #f5f5f5;
}
</style>
