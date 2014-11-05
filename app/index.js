'use strict';
var util = require('util'),
    fs = require('fs.extra'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    colog = require('colog');

var tool_groups = [],
    component_groups = [],
    existing_components = [],
    type,
    name;

var VizabiGenerator = yeoman.generators.Base.extend({
    initializing: function() {
        this.pkg = require('../package.json');

        // Greet the user
        colog.success('=======================================================');
        colog.success(' Welcome to the Vizabi generator ');
        colog.log(' This tool will help you scaffold tools and components ');
        colog.success('=======================================================');
        colog.success(' ');

        //check if it's in the correct folder
        //TODO: check if this is actually Vizabi project
        if (!fs.existsSync('./Gruntfile.js')) {
            colog.error("This generator must run in the the root folder of Vizabi.");
            process.exit(0);
        }

        findGroups('./src/tools', function(err, results) {
            if (err) throw err;
            tool_groups = results.map(function(result) {
                return result.replace('./src/tools/', '');
            });
            tool_groups.push("No group");
        });

        findGroups('./src/components', function(err, results) {
            if (err) throw err;
            component_groups = results.map(function(result) {
                return result.replace('./src/components/', '');
            });
            component_groups.push("No group");
        });

        findComponents('./src/components', function(err, results) {
            if (err) throw err;
            existing_components = results.map(function(result) {
                return result.replace('./src/components/', '');
            });
        });

    },

    prompting_type: function() {
        var done = this.async();

        var prompts = [{
            type: 'list',
            name: 'type',
            message: 'Are you starting a new vizabi tool or a new vizabi component?',
            choices: ['component', 'tool'],
            default: 'component'
        }];

        this.prompt(prompts, function(props) {
            this.type = props.type;
            done();

        }.bind(this));
    },

    prompting_details: function() {

        var done = this.async(),
            prompts = [];

        if (this.type === "tool") {
            prompts = [{
                type: 'input',
                name: 'name',
                message: "What's the name of the new tool? (e.g.: Bar Chart Tool, Bubble Graph Tool)",
                validate: function(input) {
                    if (input.length < 2) return "Too short. Choose a longer name :)";
                    else return true;
                }
            }, {
                type: 'input',
                name: 'identifier',
                message: "What's the unique identifier of your tool? (e.g.: barchart-tool, bubble-graph)",
                validate: function(input) {
                    if (input.length < 2) return "Too short. Think of a better identifier :)";
                    else return true;
                }
            }, {
                type: 'list',
                name: 'domain',
                message: "In which group would you like to save your tool?",
                choices: tool_groups,
                default: '_gapminder'
            }, {
                type: 'checkbox',
                name: 'existing_components',
                message: "Select existing components your tool will include.",
                choices: existing_components,
                default: ['_gapminder/header', '_gapminder/timeslider', '_gapminder/buttonlist']
            }];
        } else {
            prompts = [{
                type: 'input',
                name: 'name',
                message: "What's the name of the new component? (e.g.: Timeslider, Play Button)",
                validate: function(input) {
                    if (input.length < 2) return "Too short. Choose a longer name :)";
                    else return true;
                }
            }, {
                type: 'input',
                name: 'identifier',
                message: "What's the unique identifier of your component? (e.g.: timeslider, play-btn)",
                validate: function(input) {
                    if (input.length < 2) return "Too short. Think of a better identifier :)";
                    else return true;
                }
            }, {
                type: 'list',
                name: 'domain',
                message: "In which group would you like to save your component?",
                choices: component_groups,
                default: '_gapminder'
            }, {
                type: 'checkbox',
                name: 'existing_components',
                message: "Select existing sub-components your component will include.",
                choices: existing_components,
                default: []
            }];
        }

        //TODO: allow user to create new components at this point

        this.prompt(prompts, function(props) {
            this.name = props.name;
            this.identifier = props.identifier.replace(/ /g,'').toLowerCase();
            this.subfolder = props.domain;
            this.components = props.existing_components;

            done();
        }.bind(this));
    },

    writing: function() {
        //create folder
        var dir = "./src/";
        if (this.type == "tool") {
            colog.success(" > SCAFFOLDING TOOL");
            dir += "tools/";
        } else {
            colog.success(" > SCAFFOLDING COMPONENT");
            dir += "components/";
        }

        this.subfolder = (this.subfolder == "No group") ? "" : this.subfolder + "/";

        dir += this.subfolder + this.identifier;

        try {
            colog.info("   Creating directory: "+dir);
            fs.mkdirpSync(dir);
        } catch (e) {
            colog.error("   Error scaffolding folder structure");
            throw e;
            process.exit(0);
        }

        //build components structure
        var components = [],
            timeslider = false,
            buttonlist = false,
            header = false;
        for(var i=0, size=this.components.length; i<size; i++) {
            var comp_path = this.components[i];
            var placeholder = ".vzb-your-placeholder";

            //quick fix to improve quality of generated template
            if(comp_path.indexOf("header") != -1) {
                placeholder = ".vzb-tool-title";
                header = true;
            }
            if(comp_path.indexOf("time") != -1) {
                placeholder = ".vzb-tool-timeslider";
                timeslider = true;
            }
            if(comp_path.indexOf("button") != -1) {
                placeholder = ".vzb-tool-buttonlist";
                buttonlist = true;
            }

            var id = comp_path.split("/").reverse()[0];
            components.push({
                path: comp_path,
                path_scss: comp_path + "/" + id,
                placeholder: placeholder
            });
        }

        //copy files
        colog.info("   Copying and generating files...");

        var context = {
          name: this.name,
          identifier: this.identifier,
          subfolder: this.subfolder,
          js_name: this.name.replace(/ /g,''),
          components: components,
          header: header,
          timeslider: timeslider,
          buttonlist: buttonlist
        }

        var src = this.type + "/" + this.type;

        this.template(src+".js", dir+"/"+this.identifier+".js", context);
        this.template(src+".html", dir+"/"+this.identifier+".html", context);
        this.template(src+".scss", dir+"/_"+this.identifier+".scss", context);

    },

    end: function() {
        colog.success(" > ALL DONE!");
    }
});

function findGroups(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            var file_path = dir + '/' + file;
            fs.stat(file_path, function(err, stat) {
                if (stat && stat.isDirectory() && file[0] == "_") {
                    //its a group if it's a folder and starts with _
                    results.push(file_path);
                    findGroups(file_path, function(err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    next();
                }
            });
        })();
    });
};

function findComponents(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            var file_path = dir + '/' + file;
            fs.stat(file_path, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    //its a component, it's a folder and the name doesn't have _
                    if (file[0] != "_") {
                        results.push(file_path);
                        next();
                    } else {
                        findComponents(file_path, function(err, res) {
                            results = results.concat(res);
                            next();
                        });
                    }
                } else {
                    next();
                }
            });
        })();
    });
};

module.exports = VizabiGenerator;