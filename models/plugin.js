/**
 * dependencies
 */

var _                   = require('lodash')
  , Backbone            = require('backbone')
  , utils               = require('../libs/utils')
  , ComicsCollection    = require('../collections/comics')
  , ComicModel          = require('../models/comic')
  , ChaptersCollection  = require('../collections/chapters')
  , ChapterModel        = require('../models/chapter')
  , PagesCollection     = require('../collections/pages')
  , PageModel           = require('../models/page');


/**
 * super constructor global variable
 */

var Super = Backbone.Model; // base model class


/**
 * plugin model definition
 */

var PluginModel = Super.extend({


  /**
   * defaults
   *
   * @description used to specify the default attributes for your model
   * @help http://backbonejs.org/#Model-defaults
   */

  defaults: {

    // unique id for plugin identification
    // id: 'mangaeden',

    // available languages for this plugin
    // languages: [ 'en', 'it' ],

    // website url for credits
    // url: 'http://www.mangaeden.com/',

    // label used by GUI, default from ID
    // name: 'Manga Eden',

    // thumbnail image used into gallery
    // thumbnail: 'http://cdn.mangaeden.com/images/logo2.png',

    // short description
    // description: 'Manga Eden plugin for GRABBIX',

    // plugin creator credits
    // credits: 'greguz',

    // max time allowed for plugin functions to end
    timeout: 60 * 1000

  },


  /**
   * model initialization
   *
   * @description function that will be invoked when the model is created
   * @help http://backbonejs.org/#Model-constructor
   */

  initialize: function() {

    // this plugin instance ID
    var pluginID = this.get('id');

    // create new comic collection
    var comics = new ComicsCollection();

    // "new comic" plugin's event
    var event = pluginID + ':comic';

    // start event listening
    utils.dispatcher.on(event, function(comic) {

      // save comic to comics collection
      comics.add(comic);

    }, this); // bind function to this

    // save comics collection internally
    this.comics = comics;

    // register API to global dispatcher
    utils.dispatcher.on(pluginID + ':searchComics', this.searchComics, this);
    utils.dispatcher.on(pluginID + ':loadChapters', this.loadChapters, this);
    utils.dispatcher.on(pluginID + ':loadPages', this.loadPages, this);

  },


  /**
   * trigger callbacks for the given event, or space-delimited list of events
   * @help http://backbonejs.org/#Events-trigger
   *
   * @param {String} event
   * @param {*..} arg
   */

  trigger: function(event, arg) {

    // get all arguments
    var args = _.values(arguments);

    // call super function (without arguments modification)
    Super.prototype.trigger.apply(this, args);

    // create event ID for global dispatcher
    var globalEvent = this.get('id') + ':' + event;

    // create arguments array for global dispatcher's trigger function
    var globalArgs = [ globalEvent ].concat(args.slice(1));

    // call global dispatcher's trigger function
    utils.dispatcher.trigger.apply(utils.dispatcher, globalArgs);

  },


  /**
   * logging utility
   *
   * @param {String} level    log level: 'error', 'warn', 'success', 'info', 'verbose' or 'debug'
   * @param {*} message       toString-able message
   * @param {Object} [data]   optional JS object
   */

  log: function(level, message, data) {

    this.trigger(level, message, data);

    // TODO add other logging alias functions

  },


  /**
   * TODO write docs
   * @private
   *
   * @param {Array} terms       searched terms
   * @param {Array} languages   requested languages
   * @param {Function} add
   * @param {Function} end
   */

  _searchComics: function(terms, languages, add, end) {

    end(new Error('searchComics function not implemented'));

  },


  /**
   * TODO write docs
   *
   * @param {Array} terms           searched terms
   * @param {Array} languages       requested languages
   * @param {Function} [callback]   optional end callback
   */

  searchComics: function(terms, languages, callback) {

    // this plugin instance
    var plugin = this;

    // create new result collection
    var comics = new ComicsCollection();

    // create "end" callback ensuring it will be invoked only one time
    var end = _.once(_.bind(function(err) {

      // log error
      if (err) this.log('error', err);

      // call callback (what a useful comment)
      if (callback) callback(err, comics);

    }, this)); // bind function to plugin

    // create debounced end function (for timeout)
    var debounded = _.debounce(end, this.get('timeout'));

    // create "add comic" callback
    var add = _.bind(function(attrs) {

      // tick timer
      debounded();

      // unique comic ID
      var id = [ plugin.get('id'), utils.normalize(attrs.title), attrs.language];

      // extend attributes with references and unique ID
      _.extend(attrs, {
        plugin: plugin.get('id'),
        id: id.join('_')
      });

      // create comic model instance
      var comic = new ComicModel(attrs);

      // save comic to result collection
      comics.add(comic);

      // emits "new comic" event
      this.trigger('comic', comic);

    }, this); // bind function to plugin

    // start timer
    debounded();

    // call private function
    this._searchComics(terms, languages, add, end);

  },


  /**
   * TODO write docs
   * @private
   *
   * @param {ComicModel} comic    comic model
   * @param {Function} add
   * @param {Function} end
   */

  _loadChapters: function(comic, add, end) {

    end(new Error('plugin.loadChapters not implemented'));

  },


  /**
   * TODO write docs
   *
   * @param {ComicModel} comic      comic model
   * @param {Function} [callback]   optional end callback
   */

  loadChapters: function(comic, callback) {

    // create new result collection
    var chapters = new ChaptersCollection();

    // create "end" callback ensuring it will be invoked only one time
    var end = _.once(_.bind(function(err) {

      // log error
      if (err) this.log('error', err);

      // call callback (what a useful comment)
      if (callback) callback(err, chapters);

    }, this)); // bind function to plugin

    // create debounced end function (for timeout)
    var debounded = _.debounce(end, this.get('timeout'));

    // create "add chapter" callback
    var add = _.bind(function(attrs) {

      // tick timer
      debounded();

      // extend attributes with references and unique ID
      _.extend(attrs, {
        plugin: comic.get('plugin'),
        comic: comic.get('id'),
        id: comic.get('id') + '_' + attrs.number
      });

      // create chapter model instance
      var chapter = new ChapterModel(attrs);

      // save chapter to result collection
      chapters.add(chapter);

      // emits "new chapter" event
      this.trigger('chapter', chapter);

    }, this); // bind function to plugin

    // start timer
    debounded();

    // call private function
    this._loadChapters(comic, add, end);

  },


  /**
   * TODO write docs
   * @private
   *
   * @param {ChapterModel} chapter    chapter model
   * @param {Function} add
   * @param {Function} end
   */

  _loadPages: function(chapter, add, end) {

    end(new Error('plugin.loadPages not implemented'));

  },


  /**
   * TODO write docs
   *
   * @param {ChapterModel} chapter    chapter model
   * @param {Function} [callback]     optional end callback
   */

  loadPages: function(chapter, callback) {

    // TODO write plugin.loadPages

  }


});


/**
 * export plugin constructor
 */

module.exports = PluginModel;
