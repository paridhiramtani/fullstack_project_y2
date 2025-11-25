var app = angular.module("HobbyHubApp", []);

app.controller('registerController', ['$scope', 'apiService', function ($scope, apiService) {
  const banned = [
    'religious studies','islam','christianity','christ','god',
    'hinduism','sanatan','muslims','politics','religion'
  ];

  $scope.user = {};
  $scope.loadingCountries = true;
  $scope.countryLoadError = false;
  $scope.countries = [];
  $scope.selectedCountry = null;

  // Fetch country codes from service
  apiService.getCountryCodes()
    .then(function(response) {
      $scope.loadingCountries = false;

      $scope.countries = response.data.map(function(c) {
        return {
          name: c.name.common,
          code: c.idd?.root
            ? c.idd.root + (c.idd.suffixes ? c.idd.suffixes[0] : "")
            : "",
          flag: c.flags?.png,
          iso: c.cca2
        };
      }).filter(function(c) { return c.code; })
        .sort(function(a, b) { return a.name.localeCompare(b.name); });
    })
    .catch(function() {
      $scope.loadingCountries = false;
      $scope.countryLoadError = true;
    });

  // Register function
  $scope.registerUser = function () {
    // Validate required fields
    if (!$scope.user.name || !$scope.user.email || !$scope.user.password || !$scope.user.hobby) {
      alert('Please fill all required fields.');
      return;
    }

    // Hobby validation
    let finalHobby = $scope.user.hobby;
    
    if ($scope.user.hobby === 'Others') {
      if (!$scope.user.otherHobby) {
        alert('Please specify your hobby.');
        return;
      }
      const otherLower = $scope.user.otherHobby.toLowerCase();
      for (let b of banned) {
        if (otherLower.includes(b)) {
          alert('This hobby is not allowed in Others.');
          return;
        }
      }
      finalHobby = $scope.user.otherHobby;
    } else {
      const hobbyLower = $scope.user.hobby.toLowerCase();
      for (let b of banned) {
        if (hobbyLower.includes(b)) {
          alert('This hobby is not allowed.');
          return;
        }
      }
    }

    // Phone validation
    if (!$scope.user.countryCode || !$scope.user.phone) {
      alert('Please select country code and enter phone number.');
      return;
    }

    // Combine country code + phone
    $scope.user.fullPhone = $scope.user.countryCode + " " + $scope.user.phone;

    // Prepare data to send
    const dataToSend = {
      name: $scope.user.name,
      email: $scope.user.email,
      password: $scope.user.password,
      hobby: finalHobby,
      countryCode: $scope.user.countryCode,
      phone: $scope.user.phone,
      fullPhone: $scope.user.fullPhone
    };

    // Call API
    apiService.register(dataToSend)
      .then(function (res) {
        alert('Registration successful!');
        const stored = {
          name: $scope.user.name,
          email: $scope.user.email,
          hobby: finalHobby,
          countryCode: $scope.user.countryCode,
          phone: $scope.user.phone
        };
        localStorage.setItem('hh_user', JSON.stringify(stored));
        localStorage.setItem('hh_token', res.data.token);
        window.location.href = 'chat.html';
      })
      .catch(function (err) {
        console.error('Register failed:', err);
        alert(err.data?.message || 'Registration failed. See console for details.');
      });
  };
}]);

app.controller("loginController", ['$scope', 'apiService', function($scope, apiService) {
  $scope.user = {};
  
  $scope.loginUser = function() {
    if (!$scope.user.email || !$scope.user.password) {
      alert('Please enter email and password');
      return;
    }

    apiService.login($scope.user)
      .then(function(res) {
        localStorage.setItem("hh_token", res.data.token);
        localStorage.setItem("hh_user", JSON.stringify(res.data.user));
        window.location.href = "chat.html";
      })
      .catch(function(err) {
        console.error('Login failed:', err);
        alert(err.data?.message || 'Login failed. Please check your credentials.');
      });
  };
}]);

app.controller("chatController", ['$scope', function($scope) {
  const socket = io("http://localhost:5000");
  const user = JSON.parse(localStorage.getItem("hh_user"));
  
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  $scope.user = user;
  $scope.messages = [];
  $scope.messageText = "";

  // Join room
  socket.emit("joinRoom", user.hobby);

  // Listen for previous messages
  socket.on("previousMessages", function(messages) {
    $scope.$apply(function() {
      $scope.messages = messages;
    });
  });

  // Listen for new messages
  socket.on("message", function(data) {
    $scope.$apply(function() {
      $scope.messages.push(data);
    });
  });

  // Send message
  $scope.sendMessage = function () {
    if (!$scope.messageText || $scope.messageText.trim() === '') {
      return;
    }

    socket.emit("chatMessage", {
      hobby: user.hobby,
      sender: user.name,
      text: $scope.messageText
    });
    
    $scope.messageText = "";
  };

  // Handle Enter key
  $scope.handleKeyPress = function(event) {
    if (event.keyCode === 13) {
      $scope.sendMessage();
    }
  };

  // Logout function
  $scope.logout = function() {
    localStorage.removeItem("hh_user");
    localStorage.removeItem("hh_token");
    window.location.href = "index.html";
  };
}]);
