//<%= name %>
define([
    'd3',
    'lodash',
    'base/utils',
    'base/component'
], function(d3, _, utils, Component) {

    var <%= js_name %> = Component.extend({

        /**
         * Initializes the component.
         * Executed once before any template is rendered.
         * @param options The options passed to the component
         * @param context The component's parent component or tool
         */
        init: function(options, context) {
            this.template = "components/<%= subfolder %><%= identifier %>/<%= identifier %>";

            //specifying subcomponents
            this.components = [<%
            for (var i in components) { %>{
                component: '<%= components[i].path %>',
                placeholder: '<%= components[i].placeholder %>'
                //model: ['time']  //pass this model to this component 
            },
            <% } %>];

            //contructor is the same as any component
            this._super(options, context);
        },

        /**
         * Executes after the template is loaded and rendered.
         * Ideally, it contains HTML instantiations related to template
         * At this point, this.element and this.placeholder are available as a d3 objects
         */
        postRender: function() {
            //E.g: var graph = this.element.select('#graph');
        },

        /**
         * Executes everytime there's an update event.
         * Ideally, only operations related to changes in the model
         * At this point, this.element is available as a d3 object
         */
        update: function() {
            //E.g: var year = this.model.get('value');
        },

        /**
         * Executes everytime the container or vizabi is resized
         * Ideally,it contains only operations related to size
         */
        resize: function() {
            //E.g: var height = this.placeholder.style('height');
        },


    });

    return <%=js_name %> ;

});