//<%= name %>
define([
    'base/tool'
], function(Tool) {

    var <%= js_name %> = Tool.extend({

        /**
         * Initializes the tool.
         * Executed once before any template is rendered.
         * @param {Object} config Initial config, with name and placeholder
         * @param {Object} options Options such as state, data, etc
         */
        init: function(config, options) {
            
            this.name = "<%= identifier %>";
            this.template = "tools/<%= subfolder %><%= identifier %>/<%= identifier %>";

	        //specifying components
            this.components = [<%
            for (var i in components) { %>{
                component: '<%= components[i].path %>',
                placeholder: '<%= components[i].placeholder %>'
                //model: ['time']  //pass this model to this component 
            },
            <% } %>];

            //constructor is the same as any tool
            this._super(config, options);
        },

        /**
         * Returns the data query for this tool, based on the tool model.
         * @param model The tool model
         */
        getQuery: function(model) {
            var state = model.state;
            return [{
                "from": "data",
                "select": ["geo", "geo.name", "time", "geo.region", "geo.category", state.show.indicator],
                "where": {
                    "geo": state.show.geo,
                    "geo.category": state.show.geo_category,
                    "time": [state.time.start + "-" + state.time.end]
                }
            }];
        },

        /**
         * Validating the tool model
         * @param model the current tool model to be validated
         */
        toolModelValidation: function(model) {

            /* Example of model validation for time, show and data 

            var state = model.state,
                data = model.data;

            //don't validate anything if data hasn't been loaded
            if(!data.getItems() || data.getItems().length < 1) {
                return;
            }
            if (state.time.start < data.getLimits('time').min) {
                state.time.start = data.getLimits('time').min;
            }
            if (state.time.end > data.getLimits('time').max) {
                state.time.end = data.getLimits('time').max;
            }

            * End of example */
        }
    });

    return <%= js_name %>;
});