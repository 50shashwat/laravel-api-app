import Graph from './Graph';

export default Graph.extend({
    template: `
        <div>
            <h1>Users registrations graph</h1>
            <div>
                <label>How Many Days?</label>

                <select v-model="range" @change="reload">
                    <option v-for="n in 365">{{ n }}</option>
                </select>
            </div>

            <canvas width="600" height="400" v-el:canvas></canvas>

        </div>
    `,

    props: {
        range: { default: 7 }
    },

    methods: {
        fetchData() {
            return this.$http.post(
                this.url, { range: this.range }
            );
        }
    }
});