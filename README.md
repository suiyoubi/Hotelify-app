# Hotelify-app
Hotelify is a hotel booking platform that not only allows user to have the best booking experiences, but also provides hotel managers with a better way to manage their hotel.
Hotelify-app is the Front-end of the Hotelify, which uses the AngularJS as the framework.

### How to Run it
* Make sure you have installed [npm](https://github.com/npm/cli), you can use ```npm -v``` to check it
* Make sure you have the [Hotelify-php](https://github.com/suiyoubi/hotelify-php) hosted as well
* In your project directory, run ```npm install``` to install the dependencies
* Then run ```npm start``` to start the project
* You are good to go!
* By default, the website is hosted at ```localhost:8000```

### Note
If you are unable to run the application, you may need to change the url of the back-end in the code. By default, hotelify-app is trying to connect to ```http://localhost:8080/hotelify/public/index.php```, if this is not the back-end hosted url, please consider either changing the code (line31 of [app.js](app/app.js), likely be `http://localhost/hotelify-php/public/index.php`, also need to make sure the `/api` is here), or change your back-end url to be the same.



