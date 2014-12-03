//<%= name %>
define([
    'd3',
    'base/component'
], function(d3, Component) {

    var <%= js_name %> = Component.extend({

        /**
         * Initializes the component (<%= name %>).
         * Executed once before any template is rendered.
         * @param {Object} config The options passed to the component
         * @param {Object} context The component's parent
         */
        init: function(config, context) {
            this.template = "components/<%= subfolder %><%= identifier %>/<%= identifier %>";

            //determine which models this component expects
            //Example:
            //this.model_expects = ["rows", "time"];

            //specifying subcomponents
            this.components = [<%
            for (var i in components) { %>{
                component: '<%= components[i].path %>',
                placeholder: '<%= components[i].placeholder %>'
                //model: ['time']  //pass this model to this component 
            },
            <% } %>];

            //contructor is the same as any component
            this._super(config, context);
        },

        /**
         * Executes after the template is loaded and rendered.
         * Ideally, it contains HTML instantiations related to template
         * At this point, this.element and this.placeholder are available as d3 objects
         */
        domReady: function() {
            //E.g: var graph = this.element.select('.vzb-graph');

            /* You may also listen to changes in model:

            this.model.time.on({
                "change": function(evt) {
                    console.log("Time model changed:", evt);
                },
                "change:start": function() {
                    console.log("The start of time has changed");
                }
            });

             */
        },

        /**
         * Executes everytime there's an update event.
         * Ideally, only operations related to changes in the model
         * At this point, this.element is available as a d3 object
         */
        modelReady: function() {
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