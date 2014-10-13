//<%= name %>
define([
    'd3',
    'underscore',
    'base/component'
], function(d3, _, Component) {

	var <%= js_name %> = Component.extend({

		/*
         * INIT:
         * Executed once, before template loading
         */
        init: function(context, options) {
            this.name = <%= identifier %>;
            this.template = "components/<%= subfolder %><%= identifier %>/<%= identifier %>";
            this.tool = context;
            <% for(var i in components) { %>
            this.addComponent('<%= components[i].path %>', {
                placeholder: '<%= components[i].placeholder %>'
            });
            <% } %>
            this._super(context, options);
        },

        /*
         * POSTRENDER:
         * Executed after template is loaded
         * Ideally, it contains instantiations related to template
         */
        postRender: function() {
        	//E.g: graph = this.element.select('#graph');
        },


        /*
         * UPDATE:
         * Executed whenever data is changed
         * Ideally, it contains only operations related to data events
         */
        update: function() {
            //code here
        },

        /*
         * RESIZE:
         * Executed whenever the container is resized
         * Ideally, it contains only operations related to size
         */
        resize: function() {
            //code here
        },


    });

    return <%= js_name %>;

});