import Vue from 'vue';
import VueResource from 'vue-resource';

import LoginsGraph from './components/LoginsGraph';
import RegistrationsGraph from './components/RegistrationsGraph';

Vue.use(VueResource);

Vue.http.headers.common['X-CSRF-TOKEN'] = document.querySelector('#token').getAttribute('value');

new Vue({
    el: 'body',

    components: { LoginsGraph, RegistrationsGraph }
});