// Scripts for firebase
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// ===================================================================
// Your Firebase configuration has been placed here.
// ===================================================================
const firebaseConfig = {
    apiKey: "AIzaSyA6uY8wI3EUk-MbUDKjPw1cW27n-HldWc4",
    authDomain: "notif-4ec92.firebaseapp.com",
    projectId: "notif-4ec92",
    storageBucket: "notif-4ec92.firebasestorage.app",
    messagingSenderId: "1099297218680",
    appId: "1:1099297218680:web:76e57fb47d9a9394a3cd8d",
    measurementId: "G-DB3TJDCERT"
};

// Initialize the Firebase app in the service worker
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Optional: Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico' 
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
