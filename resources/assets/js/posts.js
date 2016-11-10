import Posts from './components/posts/index.vue';

import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

Vue.http.headers.common['X-CSRF-TOKEN'] = document.querySelector('#token').getAttribute('value');

new Vue({
    el : '#posts',

    components : {
        Posts
}
})