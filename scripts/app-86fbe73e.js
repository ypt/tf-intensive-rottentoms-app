angular.module("search",["core"]).config(function(){}).constant("SEARCHURL","app/modules/search/"),angular.module("search").factory("PaginatedMovies",["BaseCollection",function(e){var t=e.extend({total:0,pagination:{},setPagination:function(e){this.resetPagination(),angular.extend(this.pagination,e)},resetPagination:function(){for(var e in this.pagination)delete this.pagination[e]}});return new t}]),angular.module("search").constant("SEARCH_ENDPOINT","movies.json").factory("httpMoviesGateway",["httpGateway","SEARCH_ENDPOINT",function(e,t){return{search:function(n,r){return e.jsonp(t,_.defaults({},r,{q:n}))}}}]),angular.module("search").directive("searchForm",["formBuilder","SEARCHURL",function(e,t){return e({templateUrl:t+"components/form.tmpl.html",formName:"searchForm"})}]),angular.module("search").value("paginationDefaults",{page_limit:10}).factory("searchMovies",["PaginatedMovies","paginationDefaults","httpMoviesGateway",function(e,t,n){return function(r,o){return o=_.defaults(o||{},t),n.search(r,o).then(function(t){e.set(t.data.movies),e.total=t.data.total,e.setPagination(_.extend({total:t.data.total},o))})}}]),angular.module("login",["ngStorage","core"]).constant("LOGINURL","app/modules/login/"),angular.module("login").directive("signinForm",["formBuilder","LOGINURL",function(e,t){return e({templateUrl:t+"components/form.tmpl.html",formName:"signinForm"})}]),angular.module("login").factory("login",["User","localStorageUserGateway","cfpLoadingBar",function(e,t,n){return function(r){return n.start(),t.validCredentials(r).then(function(){user={username:r.username,isLoggedIn:!0},t.saveToClient(user),e.set(user),n.complete()})}}]),angular.module("routes",["core","modules","ui.router"]).constant("ROUTESURL","app/routes/").constant("URLMAP",{home:"/",search:"/search",signin:"/login"}).config(["$stateProvider","$urlRouterProvider","$locationProvider",function(e,t){e.state("root",{"abstract":!0,template:"<ui-view></ui-view>"}),t.otherwise("/")}]).factory("globalResolve",["$q","fetchUserFromClient",function(e,t){return e.all([t()])}]).run(["$rootScope","$stateParams",function(e){e.$on("$stateChangeError",function(e,t,n,r,o,a){console.error(a)})}]),angular.module("routes").config(["$stateProvider","URLMAP","ROUTESURL",function(e,t,n){e.state("root.search",{url:t.search,templateUrl:n+"search/search.tmpl.html",controllerAs:"search",controller:"SearchCtrl",resolve:{}})}]).controller("SearchCtrl",["searchMovies","PaginatedMovies",function(e,t){var n=this;n.searchResults=t.get(),n.searchTotal=t.total,n.pagination=t.pagination,n.entity={keyword:"Jaws"},n.submitSearch=function(){return e(n.entity.keyword,{page:1})}}]),angular.module("routes").config(["$stateProvider","URLMAP","ROUTESURL",function(e,t,n){e.state("root.signin",{url:t.signin,templateUrl:n+"signin/signin.tmpl.html",controller:"SigninCtrl",controllerAs:"signin",publicRoute:!0,resolve:{redir:["User","$location",function(e,t){e.isLoggedIn()&&t.path("/")}]}})}]).controller("SigninCtrl",["login","$state",function(e,t){var n=this;n.user={},n.submitLogin=function(){return e(n.user).then(function(){t.go("root.home")})}}]),angular.module("routes").config(["$stateProvider","URLMAP","ROUTESURL",function(e,t,n){e.state("root.home",{url:t.home,templateUrl:n+"home/home.tmpl.html",controller:"HomeCtrl",publicRoute:!0,resolve:{}})}]).controller("HomeCtrl",function(){}),angular.module("navbar",["core","mgcrea.ngStrap","ui.router"]).constant("NAVBARURL","app/modules/navbar/").directive("navigationBar",["NAVBARURL",function(e){return{scope:{navigation:"="},templateUrl:e+"navbar.tmpl.html",controllerAs:"navbar",bindToController:!0,controller:function(){var e=this;e.brand=_.find(e.navigation,{brand:!0})||e.navigation[0]}}}]),angular.module("example",["core","mgcrea.ngStrap","ngMessages"]).constant("FORMSURL","app/modules/example/"),angular.module("example").factory("UserList",function(){return{get:function(){return[]}}}).factory("uniqueNameAndEmailValidator",["UserList",function(e){return function(t,n){var r=!1,o=_.where(e.get(),{name:t.name});return null!=t.id&&_.isEqual(t,n)?r=!0:o.length?_.find(o,{email:t.email})||(r=!0):r=!0,r}}]),angular.module("example").directive("newUserForm",["formBuilder","EXAMPLEURL","uniqueNameAndEmailValidator",function(e,t,n){return e({templateUrl:FORMSURL+"new-user-form.tmpl.html",formName:"newUserForm",validators:{notUnique:n}})}]),angular.module("core",["ngCookies","ngTouch","ngAnimate","ngSanitize","angular-loading-bar"]).constant("COREURL","app/core/").config(["cfpLoadingBarProvider",function(e){e.includeSpinner=!1}]),angular.module("core").factory("User",["BaseEntity",function(e){var t=e.extend({constructor:function(){e.apply(this,arguments),this.set("isLoggedIn",!1)},isLoggedIn:function(){return this.get("isLoggedIn")}});return new t}]),angular.module("core").provider("iocMap",["$provide",function(e){this.map=function(t){_.each(t,function(t,n){var r=function(e){return e};r.$inject=[t],e.factory(n,r)})},this.$get=[function(){return{}}]}]),angular.module("core").factory("formBuilder",["$q",function(e){return function(t){return angular.extend({},{scope:{entity:"=entity",submitFn:"&submitFn"},transclude:!0,bindToController:!0,controllerAs:"form",controller:function(n){if(null==this.entity)throw new Error("Form requires entity");var r=this.original=angular.copy(this.entity);this.submit=function(){e.when(this.submitFn()(this.entity)).then(function(){n[t.formName].$setPristine(),n[t.formName].$setUntouched()})},n.$watchCollection("form.entity",function(e){return n[t.formName].$pristine?(null==e.id&&angular.extend(n.form.entity,t.defaults),!0):void angular.forEach(t.validators,function(o,a){n[t.formName].$setValidity(a,o(e,r))})}),this.modelOptions={updateOn:"default blur",debounce:{"default":200,blur:0}}}},t)}}]),angular.module("core").factory("extendPrototype",function(){return function(e,t){var n,r=this;n=e&&_.has(e,"constructor")?e.constructor:function(){return r.apply(this,arguments)},_.assign(n,r,t);var o=function(){this.constructor=n};return o.prototype=r.prototype,n.prototype=new o,e&&_.assign(n.prototype,e),n.__super__=r.prototype,n}}),angular.module("core").factory("baseAction",["$q",function(e){return function(t){return e(function(e,n){var r=t();r?e(r):n()})}}]),angular.module("core").factory("BaseEntity",["extendPrototype",function(e){function t(){this.data={}}return t.prototype.set=function(e,t){"string"==typeof e?this.data[e]=t:(this.reset(),this.assign(this.data,e))},t.prototype.get=function(e){return null==e?this.data:this.data[e]},t.prototype.reset=function(){for(var e in this.data)delete this.data[e]},_.each(["assign","has","findKey","forIn","isEmpty","keys","clone","pick","mapValues"],function(e){t.prototype[e]=function(){var t=Array.prototype.slice.call(arguments,0);return _[e].apply(_,[this.data].concat(t))}}),t.extend=e,t}]),angular.module("core").factory("BaseCollection",["extendPrototype",function(e){function t(){this.list=[]}return t.prototype.get=function(e){return null!=e?this.find({id:e}):this.list},t.prototype.add=function(e){this.list.push(e)},t.prototype.set=function(e){this.reset(),angular.extend(this.list,e)},t.prototype.reset=function(){this.list.length=0},_.each(["where","find","filter","forEach","map","max","min","pluck","sortBy","reject","remove"],function(e){t.prototype[e]=function(){var t=Array.prototype.slice.call(arguments,0);return _[e].apply(_,[this.list].concat(t))}}),t.extend=e,t}]),angular.module("core").constant("SECRETPASSWORD","cheese").constant("USER_KEY","localStorageUser").factory("localStorageUserGateway",["$q","$localStorage","USER_KEY","SECRETPASSWORD",function(e,t,n,r){return{validCredentials:function(t){return e(function(e,n){t.password==r?e():n()})},saveToClient:function(r){return e(function(e){t[n]=r,e()})},getFromClient:function(){return e(function(e){e(t[n])})}}}]),angular.module("core").value("API_BASE_URL",null).value("API_KEY",null).factory("httpGateway",["$http","API_BASE_URL","API_KEY",function(e,t,n){function r(){if(_.isEmpty(t))throw Error("http requires API_BASE_URL");if(_.isEmpty(n))throw Error("http requires API_KEY")}function o(t){return r(),e(_.defaults({},t,{cache:!0})).error(function(e){console.error(e)})}return{jsonp:function(e,r){return o({method:"JSONP",url:t+e,params:_.defaults({},r||{},{apikey:n,callback:"JSON_CALLBACK"})})}}}]),angular.module("core").factory("fetchUserFromClient",["User","localStorageUserGateway",function(e,t){return function(){return t.getFromClient().then(function(t){null!=t&&e.set(t)})}}]),angular.module("routes").run(["globalResolve","$rootScope","User","$state","$stateParams","cfpLoadingBar",function(e,t,n,r){t.$on("$stateChangeStart",function(o,a,i,s,l){return a.publicRoute?!0:(o.preventDefault(),void e.then(function(){1!=n.isLoggedIn()?r.transitionTo("root.signin"):r.transitionTo(a.name,i,{notify:!1}).then(function(){t.$broadcast("$stateChangeSuccess",a,i,s,l)})}))}),t.$on("$stateChangeSuccess",function(){})}]),angular.module("modules",["search","navbar","login","example"]),angular.module("config",[]).value("LOCAL_CONFIG",!1).constant("NAVIGATION",{guestNav:[{name:"root.signin",label:"Signup"}],userNav:[{name:"root.home",label:"Home"},{name:"root.search",label:"Search"}]}).constant("API_KEY","nd3uzzypjhqxjqhujpqukdsu").constant("API_BASE_URL","http://api.rottentomatoes.com/api/public/v1.0/"),angular.module("config").constant("LOCAL_CONFIG",{env:"DEV"}).config(function(){}).run(["User",function(){}]),angular.module("tfIntensiveRottentomsApp",["config","core","routes","navbar"]).run(["$rootScope","LOCAL_CONFIG","NAVIGATION","User",function(e,t,n,r){t&&console.info("Current Local Config:",t),e.user=r.get(),e.navigation=n.guestNav,e.$watch("user.isLoggedIn",function(t){e.navigation=t?n.userNav:n.guestNav})}]),angular.module("tfIntensiveRottentomsApp").run(["$templateCache",function(e){e.put("app/modules/example/new-user-form.tmpl.html",'<form name="newUserForm" ng-submit="form.submit()" novalidate=""><fieldset ng-if="form.entity.id != null" class="form-group required"><label for="id" class="control-label">User Id</label> <input ng-if="form.entity.id != null" ng-model="form.entity.id" name="id" type="number" disabled="disabled" class="form-control"></fieldset><fieldset class="form-group required"><label for="name" class="control-label">User Name</label> <input ng-model="form.entity.name" id="userName" type="text" name="name" ng-model-options="{ updateOn: \'default blur\', debounce: { \'default\': 200, \'blur\': 0 } }" required="" ng-pattern="/[A-Z]{3,}-\\d{3,3}$/" class="form-control"><div ng-messages="newUserForm.name.$error" ng-if="newUserForm.$submitted || newUserForm.name.$touched"><p ng-message="required" class="text-danger">A user name is required</p><p ng-message="minlength" class="text-danger">User names must be 4 characters or more</p><p ng-message="pattern" class="text-danger">User name format should be <em>ABC-123</em></p></div></fieldset><fieldset class="form-group required"><label for="name" class="control-label">User Name</label> <input ng-model="form.entity.name" id="userEmail" type="email" name="email" class="form-control"><div ng-messages="newUserForm.version.$error" ng-if="newUserForm.$submitted || newUserForm.email.$touched"><p ng-message="required" class="text-danger">A user Email is required</p><p ng-message="email" class="text-danger">The Email must be valid</p></div></fieldset><div ng-messages="newUserForm.$error" ng-if="newUserForm.$submitted || newUserForm.email.$touched"><p ng-message="notUnique" class="text-danger">You must supply a unique user name and email</p></div><div class="controls"><button ng-disabled="newUserForm.$invalid" type="submit" class="btn btn-success">Create</button></div></form>'),e.put("app/modules/navbar/navbar.tmpl.html",'<div class="navbar navbar-default" role="navigation" bs-navbar=""><div class="navbar-header"><a class="navbar-brand" ui-sref="{{::navbar.brand.name}}">Angular Intensive</a></div><ul class="nav navbar-nav"><li ng-repeat="nav in navbar.navigation" ui-sref-active="active"><a ui-sref="{{::nav.name}}">{{::nav.label}}</a></li></ul></div>'),e.put("app/routes/home/home.tmpl.html",'<div class="container"><div class="jumbotron text-center"><h1>\'Allo, \'Allo!</h1><p class="lead"><img src="assets/images/yeoman.png" alt="I\'m Yeoman"><br>Always a pleasure scaffolding your apps.</p><p><a class="btn btn-lg btn-success" ng-href="#">Splendid!</a></p></div></div>'),e.put("app/routes/search/search.tmpl.html",'<div class="container"><search-form entity="search.entity" submit-fn="search.submitSearch"></search-form><h3>Search</h3><table class="table table-striped table-hover" ng-if="search.searchResults.length"><thead><tr><th>Title</th><th>Year</th><th>Rating</th><th>Runtime</th></tr></thead><tbody><tr ng-repeat="movie in search.searchResults track by movie.id"><td>{{ :: movie.title }}</td><td>{{ :: movie.year }}</td><td>{{ :: movie.mpaa_rating }}</td><td>{{ :: movie.runtime }}</td></tr></tbody></table><pre>{{ search.searchTotal | json}}</pre><pre>{{ search.pagination | json}}</pre></div>'),e.put("app/routes/signin/signin.tmpl.html",'<div class="container"><h3>Sign in</h3><signin-form entity="signin.user" submit-fn="signin.submitLogin"></signin-form></div>'),e.put("app/modules/login/components/form.tmpl.html",'<form name="signinForm" ng-submit="form.submit(form.entity)" novalidate=""><fieldset class="form-group required"><label for="keyword" class="control-label">User Name:</label> <input type="text" class="form-control" ng-model="form.entity.username" name="username" id="username" ng-model-options="{ updateOn: \'default blur\', debounce: { \'default\': 200, \'blur\': 0 } }" required=""></fieldset><fieldset class="form-group required"><label for="Keyword" class="control-label">Password:</label> <input type="password" class="form-control" ng-model="form.entity.password" name="password" id="password" ng-model-options="{ updateOn: \'default blur\', debounce: { \'default\': 200, \'blur\': 0 } }" required=""></fieldset><div class="controls"><button ng-disabled="signinForm.$invalid" type="submit" class="btn btn-success">Save</button></div></form>'),e.put("app/modules/search/components/form.tmpl.html",'<form name="searchForm" ng-submit="form.submit()" novalidate=""><fieldset class="form-group required"><label for="keyword" class="control-label">Search:</label> <input type="text" class="form-control" ng-model="form.entity.keyword" name="keyword" id="keyword" ng-model-options="{ updateOn: \'default blur\', debounce: { \'default\': 200, \'blur\': 0 } }" required=""></fieldset><div class="controls"><button ng-disabled="searchForm.$invalid" type="submit" class="btn btn-success">Search</button></div></form>')}]);