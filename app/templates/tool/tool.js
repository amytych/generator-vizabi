//<%= name %>
define([
    'base/tool'
], function(Tool) {

    var <%= js_name %> = Tool.extend({

        /**
         * Initializes the tool.
         * Executed once before any template is rendered.
         * @param options The options passed to the tool
         */
        init: function(options) {
            
            this.name = <%= identifier %>;
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
            this._super(options);
        },

        /**
         * Returns the data query for this tool, based on the tool model.
         * @param toolModel The tool model, automatically instantiated by every tool. It contains state info.
         */
        getQuery: function(toolModel) {
            return [{
                "from": "data",
                "select": ["geo", "geo.name", "time", "geo.region", "geo.category", toolModel.get("show.indicator")],
                "where": {
                    "geo": toolModel.get("show.geo"),
                    "geo.category": toolModel.get("show.geo_category"),
                    "time": [toolModel.get("show.time_start") + "-" + toolModel.get("show.time_end")]
                }
            }];
        },

        /**
         * Performs model validation
         * It returns the changed model if changes occur or 'false' if no changes occur
         * Ideally, it validates correlation between submodels (data, time, show, etc)
         * @param toolModel The tool model, automatically instantiated by every tool. It contains state info.
         */
        toolModelValidation: function(model) {
            var changes = false;

            /* Example of model validation for time, show and data 

            if (!model.get("show.time_start") || model.get("time.start") != model.get("show.time_start")) {
                model.set("show.time_start", model.get("time.start"));
                changes = model;
            }
            if (!model.get("show.time_end") || model.get("time.end") != model.get("show.time_end")) {
                model.set("show.time_end", model.get("time.end"));
                changes = model;
            }
            if (model.get("show.time_start") < model.get("data.time_start")) {
                model.set("show.time_start", model.get("data.time_start"));
                changes = model;
            }
            if (model.get("show.time_end") > model.get("data.time_end")) {
                model.set("show.time_end", model.get("data.time_end"));
                changes = model;
            }
            if (model.get("time.start") < model.get("show.time_start")) {
                model.set("time.start", model.get("show.time_start"));
                changes = model;
            }
            if (model.get("time.end") > model.get("show.time_end")) {
                model.set("time.end", model.get("show.time_end"));
                changes = model;
            }

            * End of example */

            return changes;
        }
    });

    return <%= js_name %>;
});