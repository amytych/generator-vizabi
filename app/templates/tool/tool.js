//<%= name %>
define([
    'base/tool'
], function(Tool) {

    var <%= js_name %> = Tool.extend({
        init: function(parent, options) {
            
            this.name = <%= identifier %>;
            this.template = "tools/<%= subfolder %><%= identifier %>/<%= identifier %>";
            this.placeholder = options.placeholder;

            this.state = options.state;

	        //add components
            <% for(var i in components) { %>
            this.addComponent('<%= components[i].path %>', {
                placeholder: '<%= components[i].placeholder %>'
            });
            <% } %>

            this._super(parent, options);
        },

        //TODO: Check mapping options

        getQuery: function() {
            //build query with state info
            var query = [{
                    select: [
                        'geo',
                        'time',
                        'geo.name',
                        'geo.category', 
                        this.model.getState("indicator")
                    ],
                    where: {
                        geo: this.model.getState("show").geo,
                        'geo.category': this.model.getState("show")['geo.category'],
                        time: this.model.getState("timeRange")
                    }}];

            return query;
        }
    });

    return <%= js_name %>;
});