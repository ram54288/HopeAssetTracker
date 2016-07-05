var myApp = angular.module('myApp', ['ng-admin']);
myApp.config(['NgAdminConfigurationProvider', function (nga) {
              // create an admin application
              var admin = nga.application('Hope Asset Tracker Admin')
              .baseApiUrl('http://hopefoundation-1316.appspot.com/'); // main API endpoint
            
              
              var asset = nga.entity('Assets')
                        .identifier(nga.field('eid'));

              
              var history = nga.entity('History')
                        .identifier(nga.field('tid'));
              
              var user = nga.entity('CreateUser')
                        .identifier(nga.field('uname'));
              
              /**/
                     admin.addEntity(asset);
                     admin.addEntity(history);
                     admin.addEntity(user)
 
              
              //Our Assets Table should be mapped here
              // set the fields of the user entity list view
              asset.listView().fields([
                                      nga.field('eDlocation'),
                                      nga.field('eid'),
                                      nga.field('etype'),
                                      nga.field('tstatus'),
                                      nga.field('eOlocation'),
                                      nga.field('eowner'),
                                      nga.field('eDDate','date').format('dd MM yyyy'),
                                      nga.field('eSlocation'),
                                      nga.field('edonor'),
                                      nga.field('estatus'),
                                      nga.field('qrCode')
                                      
                                      
                                       ]).listActions(['edit']);
              
              //This is for creating new assets
              asset.creationView().fields([
                                           nga.field('eDlocation'),
                                           nga.field('eid'),
                                           nga.field('etype'),
                                           nga.field('tstatus'),
                                           nga.field('eOlocation'),
                                           nga.field('eowner'),
                                           nga.field('eDDate','date').format('dd MM yyyy'),
                                           nga.field('eSlocation'),
                                           nga.field('edonor'),
                                           nga.field('estatus')
                                          ]);
              //This is for editing existing assets
              // use the same fields for the editionView as for the creationView
              asset.editionView().fields(asset.creationView().fields());
              
            
//                         .readOnly(); // a readOnly entity has disabled creation, edition, and deletion views
              history.listView().fields([
                                      nga.field('tid'),
                                      nga.field('eid'),// 'reference')
//                                         .targetEntity(asset)
//                                         .targetField(nga.field('eid'))
//                                         .label('Asset'),
                                      nga.field('eClocation'),
                                      nga.field('eUname'),
                                      nga.field('eDate')
                                         
              
                                      ]).sortField('tid');
              
              user.listView().fields([
                                      nga.field('uname'),
                                      nga.field('password')
    
                                      ]);
              
              //This is for creating new assets
              user.creationView().fields([
                                          nga.field('uname'),
                                          nga.field('password')
                                          ]);
                          // use the same fields for the editionView as for the creationView
              user.editionView().fields(user.creationView().fields());
              
              
              admin.menu(nga.menu()
                         .addChild(nga.menu(asset).icon('<span class="glyphicon glyphicon-briefcase"></span>').title('Asset Repository'))
                         .addChild(nga.menu(history).icon('<span class="glyphicon glyphicon-refresh"></span>').title('Asset Movement History'))
                          .addChild(nga.menu(user).icon('<span class="glyphicon glyphicon-user"></span>').title('User'))
                         );
             
              /*Dashboard Related code*/
              var customDashboardTemplate =
                            '<div class="row dashboard-starter"></div>' +
                            '<div class="row dashboard-content">' +
                            '<div class="col-lg-12">' +
                            '</div>' +
                            '</div>' +
                            '<div class="row dashboard-content">' +
                            '<div class="col-lg-4">' +
                            '<div class="panel panel-red">' +
                            '<ma-dashboard-panel collection="dashboardController.collections.asset" entries="dashboardController.entries.asset"></ma-dashboard-panel>' +
                            '</div>' +
                          '</div>' +
                            '<div class="col-lg-4">' +
                            '<div class="panel panel-yellow">' +
                            '<ma-dashboard-panel collection="dashboardController.collections.history" entries="dashboardController.entries.history""></ma-dashboard-panel>' +
                            '</div>' +
                            '</div>' +
                            '<div class="col-lg-4">' +
                            '<div class="panel panel-green">' +
                            '<ma-dashboard-panel collection="dashboardController.collections.user" entries="dashboardController.entries.user"></ma-dashboard-panel>' +
                            '</div>' +
                            '</div>' ;
                            
              
              admin.dashboard(nga.dashboard()
                              .addCollection(nga.collection(asset)
                                             .name('asset')
                                             .title('Assets')
                                             .sortDir('DESC')
                                             .order(1)
                                             )
                              .addCollection(nga.collection(history)
                                             .name('history')
                                             .title('History')
                                             .perPage(5) // limit the panel to the 5 latest posts
                                             .sortDir('DESC')
                                             .order(3)
                                             )
                              .addCollection(nga.collection(user)
                                             .name('user')
                                             .title('Users')
                                             .perPage(5) // limit the panel to the 5 latest posts
                                             .sortDir('DESC')
                                             .order(3)
                                             )
                              .template(customDashboardTemplate)
                              );


              // attach the admin application to the DOM and execute it
              nga.configure(admin);
              
              
              }]);

myApp.config(['$httpProvider', function ($httpProvider) {
         // Intercept POST requests, convert to standard form encoding
         $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
         $httpProvider.defaults.transformRequest.unshift(function (data, headersGetter) {
                                                         var key, result = [];
                                                         
                                                         if (typeof data === "string")
                                                         return data;
                                                         
                                                         for (key in data) {
                                                         if (data.hasOwnProperty(key))
                                                         result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
                                                         }
                                                         return result.join("&");
                                                         });
         }]);


//myApp.config(function ($http) {
//             $http({
//                   method: 'POST',
//                   url: url,
//                   headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//                   transformRequest: function(obj) {
//                   var str = [];
//                   for(var p in obj)
//                   str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
//                   return str.join("&");
//                   },
//                   data: {username: $scope.userName, password: $scope.password}
//                   }).success(function () {});           });
//
//myApp.config(['RestangularProvider', function(RestangularProvider) {
//              RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {
//                                                            if(operation == 'post' || operation == 'put') {
//                                                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//                                                            data: $.param({fkey: "key"}),
//                                                        }
//                                                            });
//              }]);
//
//
//
