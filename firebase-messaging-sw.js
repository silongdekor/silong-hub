// Silong Hub – receives notifications in the background
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");
firebase.initializeApp({apiKey:"AIzaSyDkKnO7CI2XvKrNy7JRUl-y0cZUzg-pamU",authDomain:"silong-hub.firebaseapp.com",projectId:"silong-hub",storageBucket:"silong-hub.firebasestorage.app",messagingSenderId:"1098154162906",appId:"1:1098154162906:web:1e4ab1d53aef74bd4543e3"});
firebase.messaging();
self.addEventListener("install",function(){self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(self.clients.claim())});
// red number on the app icon: +1 for every alert that arrives while the Hub is closed
self.addEventListener("push",function(e){
  if(!self.navigator||!("setAppBadge" in self.navigator))return;
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(function(list){
    // Hub open on screen: it keeps the number right itself
    if(list.some(function(c){return c.visibilityState==="visible"}))return;
    return caches.open("silong-badge").then(function(c){
    return c.match("/badge").then(function(r){return r?r.text():"0"}).then(function(t){
      var n=(parseInt(t,10)||0)+1;
      return c.put("/badge",new Response(String(n))).then(function(){return self.navigator.setAppBadge(n)});
    });
  })}).catch(function(){}));
});
self.addEventListener("notificationclick",function(e){
  e.notification.close();
  var url="https://silongdekor.github.io/silong-hub/";
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(function(list){
    for(var i=0;i<list.length;i++){if(list[i].url.indexOf(url)===0&&"focus" in list[i])return list[i].focus()}
    return self.clients.openWindow(url)}));
});
