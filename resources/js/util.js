define([], function () {

  const pwaCache = 'pwa-v1.1';

  return (function () {
    var topics = {};
    var hOP = topics.hasOwnProperty;

    return {
      subscribe: function (topic, listener) {
        // Create the topic's object if not yet created
        if (!hOP.call(topics, topic)) topics[topic] = [];

        // Add the listener to queue
        var index = topics[topic].push(listener) - 1;

        // Provide handle back for removal of topic
        return {
          remove: function () {
            delete topics[topic][index];
          }
        };
      },
      publish: function (topic, info) {
        // If the topic doesn't exist, or there's no listeners in queue, just leave
        if (!hOP.call(topics, topic)) return;

        // Cycle through topics queue, fire!
        topics[topic].forEach(function (item) {
          item(info != undefined ? info : {});
        });
      },
      loadData: function (jsonFile) {

        const request = '/data/' + jsonFile;
        return fetch(request).then(response => response.json())
          .then(json => JSON.parse(json));

      },
      loadTemplate: function (htmlPage) {

        const request = '/templates/' + htmlPage;
        return fetch(request).then(response => response.text());

        // const cacheReady = caches.open(pwaCache).then(cache => {
        //   return cache.match(request)
        //     .then(response => {
        //       if (response) {
        //         return response;
        //       }

        //       return fetch(request).then(fetchRes => {
        //         cache.put(request, fetchRes.clone());

        //         return fetchRes;
        //       });
        //     })
        // })

        // return cacheReady
        //   .then(response => response.text());
      },
      moveTo: function (page) {
        this.publish('moveTo', { page });
      },
      log: (message) => {
        console.log(`message : ${message}`);
      },

    };
  })();

});