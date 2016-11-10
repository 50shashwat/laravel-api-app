var Vue = require('vue');

var vue = new Vue({
    el : 'tbody',

    data : {
        pusher : {},
        channel : {}
    },

    ready : function(){
        this.pusher = new Pusher('4033b042d2f424247fd6', {
            cluster: 'eu',
            encrypted: true
        });

        this.channel = this.pusher.subscribe('activity_channel');
        this.channel.bind('activity_event', function(data) {
            this.notify(data.type);
            this.addPartial(data.type,data.partial);
        }.bind(this));
    },

    methods : {
        notify : function(type)
        {
            $.notify('There are new ' + type + ' type activity',{
                className : 'info',
                clickToHide: true,
                autoHide: false
            });
        },

        addPartial : function(type,partial)
        {
            $('#activities-' + type.toLowerCase()).append(partial);
        }
    }
});