var app = angular.module("HobbyHubApp");

app.service('apiService', ['$http', function($http) {
  const API_URL = 'http://localhost:5000/api';

  this.register = function(userData) {
    return $http.post(API_URL + '/register', userData);
  };

  this.login = function(credentials) {
    return $http.post(API_URL + '/login', credentials);
  };

  this.getMessages = function(hobby) {
    return $http.get(API_URL + '/messages/' + hobby);
  };

  this.getCountryCodes = function() {
    return $http.get('https://restcountries.com/v3.1/all');
  };
}]);
