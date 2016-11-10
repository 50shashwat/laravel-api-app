<style>
.post__image {
    width: 50% !important;
}
.margin-btm-10 {
    margin-bottom: 10px;
}
.post__user__avatar img {
    width: 15%;
    border-radius: 50%;
    margin-top: -80px;
}
</style>

<template>
    <div class="row" v-for="post in posts">
        <div class="col-md-12">
            <section class="panel">
                <div class="row">
                    <div class="col-md-6">
                        <div class="k-avatar">
                            <img class='post__image' v-bind:src="post.thumbImg" alt=""/>
                            <a class="post__user__avatar" :href="getUserAvatar(post.user)">
                                <img v-bind:src="post.userAvatar" alt="">
                            </a>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="panel-body text-center">
                            <div class="k-item margin-btm-10">
                                Created at -
                            </div>
                            <div class="k-item margin-btm-10">
                                {{ post.created_at }}
                            </div>
                            <div class="k-item margin-btm-10">
                                Expiring at -
                            </div>
                            <div class="k-item margin-btm-10">
                                {{ post.expired_at }}
                            </div>
                            <div class="k-info margin-btm-10">
                                <h2>{{ post.title }}</h2>
                                <p>{{ post.description }}</p>
                            </div>
                            <button @click="disable(post)" v-if="post.deleted_at == NULL" class="btn btn-dark">Disable</button>
                            <button @click="enable(post)" v-if="post.deleted_at != NULL" class="btn btn-dark">Enable</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
             return {
                 posts : []
             }
        },

        ready(){
            this.fetchPosts();
        },

        methods : {
            fetchPosts()
            {
                this.$http.get('/posts/fetch')
                          .then(response => {
                                this.$set('posts',response.data);
                            })
            },

            enable(post)
            {
                post.deleted_at = null
                this.$http.post('/posts/enable/' + post.id,{})
                          .then(response => {
                            console.debug(response);
                          })
            },

            disable(post)
            {
                post.deleted_at = 1
                this.$http.post('/posts/disable/' + post.id,{})
                        .then(response => {
                    console.debug(response);
                })
            },

            getUserAvatar(user)
            {
                return '/users/' + user.id
            }
        }
    }
</script>