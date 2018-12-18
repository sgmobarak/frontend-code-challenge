Vue.component("tweet", {
  props: ['tweet'],
  template: '<li class="list-group-item">'
    + '<div class="tweet">'
    + '<div class="user-avatar"><img v-bind:src="tweet.user.profile_image_url_https"></div>'
    + '<div><strong>{{tweet.user.name}}</strong> <span class="text-muted">@{{tweet.user.screen_name}}</span><br>'
    + '<small>{{getPostedTime(tweet.created_at)}}</small></div>'
    + '<div>{{ tweet.text }}</div>'
    + '<div class="tools">'
    + '<span class="tool"><i class="fa fa-retweet"></i> {{tweet.retweet_count}}</span>'
    + '<span class="tool"><i class="fa fa-heart"></i> {{tweet.favorite_count}}</span>'
    + '<a v-bind:href="getTwitterLink(tweet)" target="_blank" class="tool"><i class="fa fa-external-link-alt"></i></a></div>'
    + '</div>'
    + '</li>',
  methods: {
    getTwitterLink: function (t) {
      return "https://twitter.com/" + t.user.screen_name + '/status/' + t.id_str;
    },
    getPostedTime: function (dt) {
      //Mon Dec 10 22:31:14 +0000 2018
      var _dt = moment(dt, "ddd MMM DD HH:mm:ss ZZ YYYY");
      return _dt.fromNow();
    }
  }
});

var settings = {
  apiEndpoint: "http://localhost:7890/1.1/statuses/user_timeline.json",
  lsPrefKey: 'pref'
}

var appFeed = new Vue({
  el: '#appFeed',
  data: {
    screens: [
      {
        name: "makeschool",
        loading: false,
        tweets: null
      },
      {
        name: "newsycombinator",
        loading: false,
        tweets: null,
      },
      {
        name: "ycombinator",
        loading: false,
        tweets: null
      }
    ],
    pref: {
      limit: 30,
      screens: ['makeschool', 'newsycombinator', 'ycombinator']
    }
  },
  methods: {
    init: function () {
      if (localStorage.getItem(settings.lsPrefKey)) {
        this.pref = JSON.parse(localStorage.getItem(settings.lsPrefKey));
      }
      this.loadTweets();
    },
    loadTweets: function () {
      var _this = this;
      _.each(_this.screens, function (s) {
        _this.getTwitterFeed(s);
      });
    },
    getScreens: function () {
      var _ret = [], _this = this;
      _.each(_this.pref.screens, function (s) {
        var _screen = _this.getScreen(s);
        if (_screen) {
          _ret.push(_this.getScreen(s));
        }
      });
      return _ret;
    },
    getScreen: function (screenName) {
      var _this = this;
      return _.findWhere(_this.screens, { name: screenName });
    },
    getTwitterFeed: function (screen) {
      if (screen) {
        screen.loading = true;
        axios({
          method: 'get',
          url: settings.apiEndpoint,
          //url: "localTweets.json",
          params: {
            count: this.pref.limit,
            screen_name: screen.name
          },
          responseType: 'json'
        })
          .then(function (response) {
            screen.tweets = response.data;
            screen.loading = false;
          })
          .catch(function (error) {
            console.log(error);
            screen.loading = false;
          });
      }

    },
    persist: function () {
      localStorage.setItem(settings.lsPrefKey, JSON.stringify(this.pref));
    },
    onScreenMoved: function (ev) {
      this.persist();
    }
  }
});

appFeed.init();
