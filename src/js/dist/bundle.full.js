!function(n){var I={};function B(Q){if(I[Q])return I[Q].exports;var g=I[Q]={i:Q,l:!1,exports:{}};return n[Q].call(g.exports,g,g.exports,B),g.l=!0,g.exports}B.m=n,B.c=I,B.d=function(n,I,Q){B.o(n,I)||Object.defineProperty(n,I,{enumerable:!0,get:Q})},B.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},B.t=function(n,I){if(1&I&&(n=B(n)),8&I)return n;if(4&I&&"object"==typeof n&&n&&n.__esModule)return n;var Q=Object.create(null);if(B.r(Q),Object.defineProperty(Q,"default",{enumerable:!0,value:n}),2&I&&"string"!=typeof n)for(var g in n)B.d(Q,g,function(I){return n[I]}.bind(null,g));return Q},B.n=function(n){var I=n&&n.__esModule?function(){return n.default}:function(){return n};return B.d(I,"a",I),I},B.o=function(n,I){return Object.prototype.hasOwnProperty.call(n,I)},B.p="",B(B.s=102)}({102:function(module,__webpack_exports__,__webpack_require__){"use strict";eval('__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _analytics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(103);\n/* harmony import */ var _analytics__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_analytics__WEBPACK_IMPORTED_MODULE_0__);\n/**\n * Internal dependencies.\n */\n // Set a reference to the WordLift settings.\n\nconst settings = window.wlSettings;\n/**\n * Build the request URL, inclusive of the query string parameters.\n *\n * @since 3.19.1\n *\n * @param params {{jsonld_url, postId, isHome}} The query parameters.\n * @returns {string} The request URl.\n */\n\nconst buildUrl = function (params) {\n  // Join with `?` or `&`.\n  // const joinChar = 0 <= params.apiUrl.indexOf("?") ? "&" : "?";\n  // Build the URL\n  const url = params[\'jsonld_url\'] + ("undefined" !== typeof params.isHome ? 0 : params.postId); // params[\'jsonld_url\'] +\n  // // joinChar +\n  // // "action=wl_jsonld" +\n  // // Append the post id parameter.\n  // ("undefined" !== typeof params.postId ? "&id=" + params.postId : "") +\n  // // Append the homepage parameter.\n  // ("undefined" !== typeof params.isHome ? "&homepage=true" : "");\n\n  return url;\n};\n/**\n * Load the JSON-LD.\n *\n * @since 3.0.0\n */\n\n\nconst loadJsonLd = function () {\n  // Bail out it the container doesn\'t now about fetch.\n  if ("undefined" === typeof fetch) return; // Check if the JSON-LD is disabled, i.e. if there\'s a `jsonld_enabled`\n  // setting explicitly defined with a value different from \'1\'.\n\n  if ("undefined" !== typeof settings["jsonld_enabled"] && "1" !== settings["jsonld_enabled"]) {\n    return;\n  } // Check that we have a post id or it\'s homepage, otherwise exit.\n\n\n  if ("undefined" === typeof settings.postId && "undefined" === typeof settings.isHome) {\n    return;\n  } // Get the request URL.\n\n\n  const url = buildUrl(settings); // Finally fetch the URL.\n  //\n  // DO NOT use here `new URL(...)` / `URL.searchParams`: Google SDTT doesn\'t understand them.\n\n  fetch(url).then(function (response) {\n    return response.text();\n  }).then(function (body) {\n    // Use `document.createElement`. See https://github.com/insideout10/wordlift-plugin/issues/810.\n    const script = document.createElement("script");\n    script.type = "application/ld+json";\n    script.innerText = body;\n    document.head.appendChild(script);\n  });\n};\n\nloadJsonLd(); //\n// window.addEventListener("load", loadJsonLd);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvUHVibGljL2luZGV4LmpzPzgxYmEiXSwibmFtZXMiOlsic2V0dGluZ3MiLCJ3aW5kb3ciLCJ3bFNldHRpbmdzIiwiYnVpbGRVcmwiLCJwYXJhbXMiLCJ1cmwiLCJpc0hvbWUiLCJwb3N0SWQiLCJsb2FkSnNvbkxkIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJ0ZXh0IiwiYm9keSIsInNjcmlwdCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInR5cGUiLCJpbm5lclRleHQiLCJoZWFkIiwiYXBwZW5kQ2hpbGQiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Q0FLQTs7QUFDQSxNQUFNQSxRQUFRLEdBQUdDLE1BQU0sQ0FBQ0MsVUFBeEI7QUFFQTs7Ozs7Ozs7O0FBUUEsTUFBTUMsUUFBUSxHQUFHLFVBQVVDLE1BQVYsRUFBa0I7QUFDL0I7QUFDQTtBQUVBO0FBQ0EsUUFBTUMsR0FBRyxHQUFHRCxNQUFNLENBQUMsWUFBRCxDQUFOLElBQXlCLGdCQUFnQixPQUFPQSxNQUFNLENBQUNFLE1BQTlCLEdBQXVDLENBQXZDLEdBQTJDRixNQUFNLENBQUNHLE1BQTNFLENBQVosQ0FMK0IsQ0FNM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUosU0FBT0YsR0FBUDtBQUNILENBZkQ7QUFpQkE7Ozs7Ozs7QUFLQSxNQUFNRyxVQUFVLEdBQUcsWUFBWTtBQUMzQjtBQUNBLE1BQUksZ0JBQWdCLE9BQU9DLEtBQTNCLEVBQWtDLE9BRlAsQ0FJM0I7QUFDQTs7QUFDQSxNQUNJLGdCQUFnQixPQUFPVCxRQUFRLENBQUMsZ0JBQUQsQ0FBL0IsSUFDQSxRQUFRQSxRQUFRLENBQUMsZ0JBQUQsQ0FGcEIsRUFHRTtBQUNFO0FBQ0gsR0FYMEIsQ0FhM0I7OztBQUNBLE1BQ0ksZ0JBQWdCLE9BQU9BLFFBQVEsQ0FBQ08sTUFBaEMsSUFDQSxnQkFBZ0IsT0FBT1AsUUFBUSxDQUFDTSxNQUZwQyxFQUdFO0FBQ0U7QUFDSCxHQW5CMEIsQ0FxQjNCOzs7QUFDQSxRQUFNRCxHQUFHLEdBQUdGLFFBQVEsQ0FBQ0gsUUFBRCxDQUFwQixDQXRCMkIsQ0F3QjNCO0FBQ0E7QUFDQTs7QUFDQVMsT0FBSyxDQUFDSixHQUFELENBQUwsQ0FDS0ssSUFETCxDQUNVLFVBQVVDLFFBQVYsRUFBb0I7QUFDdEIsV0FBT0EsUUFBUSxDQUFDQyxJQUFULEVBQVA7QUFDSCxHQUhMLEVBSUtGLElBSkwsQ0FJVSxVQUFVRyxJQUFWLEVBQWdCO0FBQ2xCO0FBQ0EsVUFBTUMsTUFBTSxHQUFHQyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBZjtBQUNBRixVQUFNLENBQUNHLElBQVAsR0FBYyxxQkFBZDtBQUNBSCxVQUFNLENBQUNJLFNBQVAsR0FBbUJMLElBQW5CO0FBQ0FFLFlBQVEsQ0FBQ0ksSUFBVCxDQUFjQyxXQUFkLENBQTBCTixNQUExQjtBQUNILEdBVkw7QUFXSCxDQXRDRDs7QUF3Q0FOLFVBQVUsRyxDQUVWO0FBQ0EiLCJmaWxlIjoiMTAyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBJbnRlcm5hbCBkZXBlbmRlbmNpZXMuXG4gKi9cbmltcG9ydCBcIi4vYW5hbHl0aWNzXCI7XG5cbi8vIFNldCBhIHJlZmVyZW5jZSB0byB0aGUgV29yZExpZnQgc2V0dGluZ3MuXG5jb25zdCBzZXR0aW5ncyA9IHdpbmRvdy53bFNldHRpbmdzO1xuXG4vKipcbiAqIEJ1aWxkIHRoZSByZXF1ZXN0IFVSTCwgaW5jbHVzaXZlIG9mIHRoZSBxdWVyeSBzdHJpbmcgcGFyYW1ldGVycy5cbiAqXG4gKiBAc2luY2UgMy4xOS4xXG4gKlxuICogQHBhcmFtIHBhcmFtcyB7e2pzb25sZF91cmwsIHBvc3RJZCwgaXNIb21lfX0gVGhlIHF1ZXJ5IHBhcmFtZXRlcnMuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgcmVxdWVzdCBVUmwuXG4gKi9cbmNvbnN0IGJ1aWxkVXJsID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgIC8vIEpvaW4gd2l0aCBgP2Agb3IgYCZgLlxuICAgIC8vIGNvbnN0IGpvaW5DaGFyID0gMCA8PSBwYXJhbXMuYXBpVXJsLmluZGV4T2YoXCI/XCIpID8gXCImXCIgOiBcIj9cIjtcblxuICAgIC8vIEJ1aWxkIHRoZSBVUkxcbiAgICBjb25zdCB1cmwgPSBwYXJhbXNbJ2pzb25sZF91cmwnXSArICggXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIHBhcmFtcy5pc0hvbWUgPyAwIDogcGFyYW1zLnBvc3RJZCApO1xuICAgICAgICAvLyBwYXJhbXNbJ2pzb25sZF91cmwnXSArXG4gICAgICAgIC8vIC8vIGpvaW5DaGFyICtcbiAgICAgICAgLy8gLy8gXCJhY3Rpb249d2xfanNvbmxkXCIgK1xuICAgICAgICAvLyAvLyBBcHBlbmQgdGhlIHBvc3QgaWQgcGFyYW1ldGVyLlxuICAgICAgICAvLyAoXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIHBhcmFtcy5wb3N0SWQgPyBcIiZpZD1cIiArIHBhcmFtcy5wb3N0SWQgOiBcIlwiKSArXG4gICAgICAgIC8vIC8vIEFwcGVuZCB0aGUgaG9tZXBhZ2UgcGFyYW1ldGVyLlxuICAgICAgICAvLyAoXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIHBhcmFtcy5pc0hvbWUgPyBcIiZob21lcGFnZT10cnVlXCIgOiBcIlwiKTtcblxuICAgIHJldHVybiB1cmw7XG59O1xuXG4vKipcbiAqIExvYWQgdGhlIEpTT04tTEQuXG4gKlxuICogQHNpbmNlIDMuMC4wXG4gKi9cbmNvbnN0IGxvYWRKc29uTGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gQmFpbCBvdXQgaXQgdGhlIGNvbnRhaW5lciBkb2Vzbid0IG5vdyBhYm91dCBmZXRjaC5cbiAgICBpZiAoXCJ1bmRlZmluZWRcIiA9PT0gdHlwZW9mIGZldGNoKSByZXR1cm47XG5cbiAgICAvLyBDaGVjayBpZiB0aGUgSlNPTi1MRCBpcyBkaXNhYmxlZCwgaS5lLiBpZiB0aGVyZSdzIGEgYGpzb25sZF9lbmFibGVkYFxuICAgIC8vIHNldHRpbmcgZXhwbGljaXRseSBkZWZpbmVkIHdpdGggYSB2YWx1ZSBkaWZmZXJlbnQgZnJvbSAnMScuXG4gICAgaWYgKFxuICAgICAgICBcInVuZGVmaW5lZFwiICE9PSB0eXBlb2Ygc2V0dGluZ3NbXCJqc29ubGRfZW5hYmxlZFwiXSAmJlxuICAgICAgICBcIjFcIiAhPT0gc2V0dGluZ3NbXCJqc29ubGRfZW5hYmxlZFwiXVxuICAgICkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgdGhhdCB3ZSBoYXZlIGEgcG9zdCBpZCBvciBpdCdzIGhvbWVwYWdlLCBvdGhlcndpc2UgZXhpdC5cbiAgICBpZiAoXG4gICAgICAgIFwidW5kZWZpbmVkXCIgPT09IHR5cGVvZiBzZXR0aW5ncy5wb3N0SWQgJiZcbiAgICAgICAgXCJ1bmRlZmluZWRcIiA9PT0gdHlwZW9mIHNldHRpbmdzLmlzSG9tZVxuICAgICkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gR2V0IHRoZSByZXF1ZXN0IFVSTC5cbiAgICBjb25zdCB1cmwgPSBidWlsZFVybChzZXR0aW5ncyk7XG5cbiAgICAvLyBGaW5hbGx5IGZldGNoIHRoZSBVUkwuXG4gICAgLy9cbiAgICAvLyBETyBOT1QgdXNlIGhlcmUgYG5ldyBVUkwoLi4uKWAgLyBgVVJMLnNlYXJjaFBhcmFtc2A6IEdvb2dsZSBTRFRUIGRvZXNuJ3QgdW5kZXJzdGFuZCB0aGVtLlxuICAgIGZldGNoKHVybClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbiAoYm9keSkge1xuICAgICAgICAgICAgLy8gVXNlIGBkb2N1bWVudC5jcmVhdGVFbGVtZW50YC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9pbnNpZGVvdXQxMC93b3JkbGlmdC1wbHVnaW4vaXNzdWVzLzgxMC5cbiAgICAgICAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQudHlwZSA9IFwiYXBwbGljYXRpb24vbGQranNvblwiO1xuICAgICAgICAgICAgc2NyaXB0LmlubmVyVGV4dCA9IGJvZHk7XG4gICAgICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgIH0pO1xufTtcblxubG9hZEpzb25MZCgpO1xuXG4vL1xuLy8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGxvYWRKc29uTGQpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///102\n')},103:function(module,exports){eval('/**\n * A collection of functions and logic to handle sending of entity data to an\n * external analytics tracker.\n *\n * Objects: `ga`, `__gaTracker` are supported as is `gtag`.\n *\n * NOTE: the `__gaTracker` object is a common remap name in WordPress.\n */\n(function () {\n  // Only run after page has loaded.\n  document.addEventListener("DOMContentLoaded", function (event) {\n    // We should have an entity object by here but if not short circuit.\n    if (typeof wordliftAnalyticsEntityData === "undefined") {\n      return;\n    }\n    /**\n     * Promise to handle detection and return of an analytics object.\n     *\n     * @type {Promise}\n     */\n\n\n    var detectAnalyticsObject = new Promise(function (resolve, reject) {\n      var analyticsObj = getAnalyticsObject();\n      return resolve(analyticsObj);\n    });\n    /**\n     * A function returning the promise that deals with creating items\n     * to send and passing them to the correct send function.\n     *\n     * @method\n     * @param  {object} analyticsObj an analytics tracking object that is the resolve of the detect function.\n     * @return {Promise}\n     */\n\n    var sendAnalyticsData = function (analyticsObj) {\n      return new Promise(function (resolve, reject) {\n        // if we dont have an object to push into and an object\n        // with config then this is a failure - reject.\n        if ("undefined" === typeof analyticsObj || "undefined" === typeof wordliftAnalyticsConfigData) {\n          return reject();\n        } // setup the custom dimention names.\n\n\n        var dimX = "dimension" + wordliftAnalyticsConfigData.entity_uri_dimension;\n        var dimY = "dimension" + wordliftAnalyticsConfigData.entity_type_dimension; // Create an array of all the individual entities.\n\n        var entities = [];\n\n        for (var key in wordliftAnalyticsEntityData) {\n          if (wordliftAnalyticsEntityData.hasOwnProperty(key)) {\n            entities.push(wordliftAnalyticsEntityData[key]);\n          }\n        } // Count the total entities we have to send.\n\n\n        var entitiesTotal = entities.length; // console.log( `Going to send analytics events using ${analyticsObj.__wl_type} object type.` );\n\n        /**\n         * Depending on the tracking object type send the data\n         * to the correspending service.\n         */\n\n        if ("ga" === analyticsObj.__wl_type) {\n          // This is `ga` style object.\n          for (var i = 0; i < entitiesTotal; i++) {\n            sendGaEvent(analyticsObj, dimX, dimY, entities[i].label, entities[i].uri, entities[i].type);\n          }\n        } else if ("gtag" === analyticsObj.__wl_type) {\n          // This is `gtag` style object.\n          for (var i = 0; i < entitiesTotal; i++) {\n            sendGtagEvent(analyticsObj, dimX, dimY, entities[i].label, entities[i].uri, entities[i].type);\n          }\n        } else if ("gtm" === analyticsObj.__wl_type) {\n          // This is `gtag` style object.\n          for (var i = 0; i < entitiesTotal; i++) {\n            sendGtmEvent(analyticsObj, dimX, dimY, entities[i].label, entities[i].uri, entities[i].type);\n          }\n        } // @TODO handle failure.\n        // resolve to finish.\n\n\n        return resolve(true);\n      });\n    }; // Fire off the promise chain to detect and send analytics data.\n\n\n    detectAnalyticsObject.then(analyticsObj => sendAnalyticsData(analyticsObj));\n  });\n  /**\n   * Detects and returns a supported analytics object if one exists.\n   *\n   * @method getAnalyticsObject\n   * @return {object|bool}\n   */\n\n  function getAnalyticsObject() {\n    var obj = false; // detect GTAG, GTM, GA in that order.\n\n    if (window.gtag) {\n      obj = window.gtag;\n      obj.__wl_type = "gtag";\n    } else if (window.dataLayer) {\n      obj = window.dataLayer;\n      obj.__wl_type = "gtm";\n    } else if (window.ga) {\n      obj = window.ga;\n      obj.__wl_type = "ga";\n    } else if (window.__gaTracker) {\n      obj = window.__gaTracker;\n      obj.__wl_type = "ga";\n    } // console.log( `Found a ${obj.__wl_type} analytics object.` );\n\n\n    return obj;\n  }\n  /**\n   * Wrapper function for pushing entity analytics data to ga style tracker.\n   *\n   * @method sendGaEvent\n   * @param  {ga} analyticsObject The anlytics object we push into.\n   * @param  {string} dimX the name of the first custom dimension.\n   * @param  {string} dimY the name of the second custom dimension.\n   * @param  {string} label a string to use as the label.\n   * @param  {string} uri the uri of this entity.\n   * @param  {string} type the entity type.\n   */\n\n\n  function sendGaEvent(analyticsObj, dimX, dimY, label, uri, type) {\n    // Double check we have the config object before continuing.\n    if ("undefined" === typeof wordliftAnalyticsConfigData) {\n      return false;\n    }\n\n    analyticsObj("send", "event", "WordLift", "Mentions", label, 1, {\n      [dimX]: uri,\n      [dimY]: type,\n      nonInteraction: true\n    });\n  }\n  /**\n   * Wrapper function for pushing entity analytics data to gtag.\n   *\n   * @method sendGtagEvent\n   * @param  {gtag} analyticsObject The anlytics object we push into.\n   * @param  {string} dimX the name of the first custom dimension.\n   * @param  {string} dimY the name of the second custom dimension.\n   * @param  {string} label a string to use as the label.\n   * @param  {string} uri the uri of this entity.\n   * @param  {string} type the entity type.\n   */\n\n\n  function sendGtagEvent(analyticsObj, dimX, dimY, label, uri, type) {\n    // Double check we have the config object before continuing.\n    if ("undefined" === typeof wordliftAnalyticsConfigData) {\n      return false;\n    } // console.log("Sending gtag event ...");\n\n\n    analyticsObj("event", "Mentions", {\n      event_category: "WordLift",\n      event_label: label,\n      value: 1,\n      [dimX]: uri,\n      [dimY]: type,\n      non_interaction: true\n    });\n  }\n  /**\n   * Wrapper function for pushing entity analytics data to gtag.\n   *\n   * @method sendGtagEvent\n   * @param  {gtag} analyticsObject The anlytics object we push into.\n   * @param  {string} dimX the name of the first custom dimension.\n   * @param  {string} dimY the name of the second custom dimension.\n   * @param  {string} label a string to use as the label.\n   * @param  {string} uri the uri of this entity.\n   * @param  {string} type the entity type.\n   */\n\n\n  function sendGtmEvent(analyticsObj, dimX, dimY, label, uri, type) {\n    // Double check we have the config object before continuing.\n    if ("undefined" === typeof wordliftAnalyticsConfigData) {\n      return false;\n    } // console.log("Sending gtm event...");\n\n\n    analyticsObj.push({\n      "event": "Mentions",\n      "wl_event_action": "Mentions",\n      "wl_event_category": "WordLift",\n      "wl_event_label": label,\n      "wl_event_value": 1,\n      "wl_event_uri": uri,\n      "wl_index_uri": dimX.replace(/^\\D+/g, \'\'),\n      "wl_event_type": type,\n      "wl_index_type": dimY.replace(/^\\D+/g, \'\'),\n      "non_interaction": true\n    });\n  }\n})();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvUHVibGljL2FuYWx5dGljcy5qcz85NWZiIl0sIm5hbWVzIjpbImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50Iiwid29yZGxpZnRBbmFseXRpY3NFbnRpdHlEYXRhIiwiZGV0ZWN0QW5hbHl0aWNzT2JqZWN0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJhbmFseXRpY3NPYmoiLCJnZXRBbmFseXRpY3NPYmplY3QiLCJzZW5kQW5hbHl0aWNzRGF0YSIsIndvcmRsaWZ0QW5hbHl0aWNzQ29uZmlnRGF0YSIsImRpbVgiLCJlbnRpdHlfdXJpX2RpbWVuc2lvbiIsImRpbVkiLCJlbnRpdHlfdHlwZV9kaW1lbnNpb24iLCJlbnRpdGllcyIsImtleSIsImhhc093blByb3BlcnR5IiwicHVzaCIsImVudGl0aWVzVG90YWwiLCJsZW5ndGgiLCJfX3dsX3R5cGUiLCJpIiwic2VuZEdhRXZlbnQiLCJsYWJlbCIsInVyaSIsInR5cGUiLCJzZW5kR3RhZ0V2ZW50Iiwic2VuZEd0bUV2ZW50IiwidGhlbiIsIm9iaiIsIndpbmRvdyIsImd0YWciLCJkYXRhTGF5ZXIiLCJnYSIsIl9fZ2FUcmFja2VyIiwibm9uSW50ZXJhY3Rpb24iLCJldmVudF9jYXRlZ29yeSIsImV2ZW50X2xhYmVsIiwidmFsdWUiLCJub25faW50ZXJhY3Rpb24iLCJyZXBsYWNlIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUFTQSxDQUFDLFlBQVc7QUFDVjtBQUNBQSxVQUFRLENBQUNDLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxVQUFTQyxLQUFULEVBQWdCO0FBQzVEO0FBQ0EsUUFBSSxPQUFPQywyQkFBUCxLQUF1QyxXQUEzQyxFQUF3RDtBQUN0RDtBQUNEO0FBRUQ7Ozs7Ozs7QUFLQSxRQUFJQyxxQkFBcUIsR0FBRyxJQUFJQyxPQUFKLENBQVksVUFBU0MsT0FBVCxFQUFrQkMsTUFBbEIsRUFBMEI7QUFDaEUsVUFBSUMsWUFBWSxHQUFH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LENBak1EIiwiZmlsZSI6IjEwMy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQSBjb2xsZWN0aW9uIG9mIGZ1bmN0aW9ucyBhbmQgbG9naWMgdG8gaGFuZGxlIHNlbmRpbmcgb2YgZW50aXR5IGRhdGEgdG8gYW5cbiAqIGV4dGVybmFsIGFuYWx5dGljcyB0cmFja2VyLlxuICpcbiAqIE9iamVjdHM6IGBnYWAsIGBfX2dhVHJhY2tlcmAgYXJlIHN1cHBvcnRlZCBhcyBpcyBgZ3RhZ2AuXG4gKlxuICogTk9URTogdGhlIGBfX2dhVHJhY2tlcmAgb2JqZWN0IGlzIGEgY29tbW9uIHJlbWFwIG5hbWUgaW4gV29yZFByZXNzLlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgLy8gT25seSBydW4gYWZ0ZXIgcGFnZSBoYXMgbG9hZGVkLlxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkge1xuICAgIC8vIFdlIHNob3VsZCBoYXZlIGFuIGVudGl0eSBvYmplY3QgYnkgaGVyZSBidXQgaWYgbm90IHNob3J0IGNpcmN1aXQuXG4gICAgaWYgKHR5cGVvZiB3b3JkbGlmdEFuYWx5dGljc0VudGl0eURhdGEgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcm9taXNlIHRvIGhhbmRsZSBkZXRlY3Rpb24gYW5kIHJldHVybiBvZiBhbiBhbmFseXRpY3Mgb2JqZWN0LlxuICAgICAqXG4gICAgICogQHR5cGUge1Byb21pc2V9XG4gICAgICovXG4gICAgdmFyIGRldGVjdEFuYWx5dGljc09iamVjdCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIGFuYWx5dGljc09iaiA9IGdldEFuYWx5dGljc09iamVjdCgpO1xuICAgICAgcmV0dXJuIHJlc29sdmUoYW5hbHl0aWNzT2JqKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEEgZnVuY3Rpb24gcmV0dXJuaW5nIHRoZSBwcm9taXNlIHRoYXQgZGVhbHMgd2l0aCBjcmVhdGluZyBpdGVtc1xuICAgICAqIHRvIHNlbmQgYW5kIHBhc3NpbmcgdGhlbSB0byB0aGUgY29ycmVjdCBzZW5kIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQG1ldGhvZFxuICAgICAqIEBwYXJhbSAge29iamVjdH0gYW5hbHl0aWNzT2JqIGFuIGFuYWx5dGljcyB0cmFja2luZyBvYmplY3QgdGhhdCBpcyB0aGUgcmVzb2x2ZSBvZiB0aGUgZGV0ZWN0IGZ1bmN0aW9uLlxuICAgICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAgICovXG4gICAgdmFyIHNlbmRBbmFseXRpY3NEYXRhID0gZnVuY3Rpb24oYW5hbHl0aWNzT2JqKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIC8vIGlmIHdlIGRvbnQgaGF2ZSBhbiBvYmplY3QgdG8gcHVzaCBpbnRvIGFuZCBhbiBvYmplY3RcbiAgICAgICAgLy8gd2l0aCBjb25maWcgdGhlbiB0aGlzIGlzIGEgZmFpbHVyZSAtIHJlamVjdC5cbiAgICAgICAgaWYgKFwidW5kZWZpbmVkXCIgPT09IHR5cGVvZiBhbmFseXRpY3NPYmogfHwgXCJ1bmRlZmluZWRcIiA9PT0gdHlwZW9mIHdvcmRsaWZ0QW5hbHl0aWNzQ29uZmlnRGF0YSkge1xuICAgICAgICAgIHJldHVybiByZWplY3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNldHVwIHRoZSBjdXN0b20gZGltZW50aW9uIG5hbWVzLlxuICAgICAgICB2YXIgZGltWCA9IFwiZGltZW5zaW9uXCIgKyB3b3JkbGlmdEFuYWx5dGljc0NvbmZpZ0RhdGEuZW50aXR5X3VyaV9kaW1lbnNpb247XG4gICAgICAgIHZhciBkaW1ZID0gXCJkaW1lbnNpb25cIiArIHdvcmRsaWZ0QW5hbHl0aWNzQ29uZmlnRGF0YS5lbnRpdHlfdHlwZV9kaW1lbnNpb247XG5cbiAgICAgICAgLy8gQ3JlYXRlIGFuIGFycmF5IG9mIGFsbCB0aGUgaW5kaXZpZHVhbCBlbnRpdGllcy5cbiAgICAgICAgdmFyIGVudGl0aWVzID0gW107XG4gICAgICAgIGZvciAodmFyIGtleSBpbiB3b3JkbGlmdEFuYWx5dGljc0VudGl0eURhdGEpIHtcbiAgICAgICAgICBpZiAod29yZGxpZnRBbmFseXRpY3NFbnRpdHlEYXRhLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIGVudGl0aWVzLnB1c2god29yZGxpZnRBbmFseXRpY3NFbnRpdHlEYXRhW2tleV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvdW50IHRoZSB0b3RhbCBlbnRpdGllcyB3ZSBoYXZlIHRvIHNlbmQuXG4gICAgICAgIHZhciBlbnRpdGllc1RvdGFsID0gZW50aXRpZXMubGVuZ3RoO1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCBgR29pbmcgdG8gc2VuZCBhbmFseXRpY3MgZXZlbnRzIHVzaW5nICR7YW5hbHl0aWNzT2JqLl9fd2xfdHlwZX0gb2JqZWN0IHR5cGUuYCApO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZXBlbmRpbmcgb24gdGhlIHRyYWNraW5nIG9iamVjdCB0eXBlIHNlbmQgdGhlIGRhdGFcbiAgICAgICAgICogdG8gdGhlIGNvcnJlc3BlbmRpbmcgc2VydmljZS5cbiAgICAgICAgICovXG4gICAgICAgIGlmIChcImdhXCIgPT09IGFuYWx5dGljc09iai5fX3dsX3R5cGUpIHtcbiAgICAgICAgICAvLyBUaGlzIGlzIGBnYWAgc3R5bGUgb2JqZWN0LlxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW50aXRpZXNUb3RhbDsgaSsrKSB7XG4gICAgICAgICAgICBzZW5kR2FFdmVudChhbmFseXRpY3NPYmosIGRpbVgsIGRpbVksIGVudGl0aWVzW2ldLmxhYmVsLCBlbnRpdGllc1tpXS51cmksIGVudGl0aWVzW2ldLnR5cGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChcImd0YWdcIiA9PT0gYW5hbHl0aWNzT2JqLl9fd2xfdHlwZSkge1xuICAgICAgICAgIC8vIFRoaXMgaXMgYGd0YWdgIHN0eWxlIG9iamVjdC5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVudGl0aWVzVG90YWw7IGkrKykge1xuICAgICAgICAgICAgc2VuZEd0YWdFdmVudChhbmFseXRpY3NPYmosIGRpbVgsIGRpbVksIGVudGl0aWVzW2ldLmxhYmVsLCBlbnRpdGllc1tpXS51cmksIGVudGl0aWVzW2ldLnR5cGUpO1xuICAgICAgICAgIH1cblx0ICAgIH0gZWxzZSBpZiAoXCJndG1cIiA9PT0gYW5hbHl0aWNzT2JqLl9fd2xfdHlwZSkge1xuICAgICAgICAgIC8vIFRoaXMgaXMgYGd0YWdgIHN0eWxlIG9iamVjdC5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVudGl0aWVzVG90YWw7IGkrKykge1xuICAgICAgICAgICAgc2VuZEd0bUV2ZW50KGFuYWx5dGljc09iaiwgZGltWCwgZGltWSwgZW50aXRpZXNbaV0ubGFiZWwsIGVudGl0aWVzW2ldLnVyaSwgZW50aXRpZXNbaV0udHlwZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEBUT0RPIGhhbmRsZSBmYWlsdXJlLlxuICAgICAgICAvLyByZXNvbHZlIHRvIGZpbmlzaC5cbiAgICAgICAgcmV0dXJuIHJlc29sdmUodHJ1ZSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gRmlyZSBvZmYgdGhlIHByb21pc2UgY2hhaW4gdG8gZGV0ZWN0IGFuZCBzZW5kIGFuYWx5dGljcyBkYXRhLlxuICAgIGRldGVjdEFuYWx5dGljc09iamVjdC50aGVuKGFuYWx5dGljc09iaiA9PiBzZW5kQW5hbHl0aWNzRGF0YShhbmFseXRpY3NPYmopKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIERldGVjdHMgYW5kIHJldHVybnMgYSBzdXBwb3J0ZWQgYW5hbHl0aWNzIG9iamVjdCBpZiBvbmUgZXhpc3RzLlxuICAgKlxuICAgKiBAbWV0aG9kIGdldEFuYWx5dGljc09iamVjdFxuICAgKiBAcmV0dXJuIHtvYmplY3R8Ym9vbH1cbiAgICovXG4gIGZ1bmN0aW9uIGdldEFuYWx5dGljc09iamVjdCgpIHtcbiAgICB2YXIgb2JqID0gZmFsc2U7XG4gICAgLy8gZGV0ZWN0IEdUQUcsIEdUTSwgR0EgaW4gdGhhdCBvcmRlci5cblx0aWYgKHdpbmRvdy5ndGFnKSB7XG4gICAgICBvYmogPSB3aW5kb3cuZ3RhZztcbiAgICAgIG9iai5fX3dsX3R5cGUgPSBcImd0YWdcIjtcbiAgICB9IGVsc2UgaWYgKHdpbmRvdy5kYXRhTGF5ZXIpIHtcbiAgICAgIG9iaiA9IHdpbmRvdy5kYXRhTGF5ZXI7XG4gICAgICBvYmouX193bF90eXBlID0gXCJndG1cIjtcbiAgICB9IGVsc2UgaWYgKHdpbmRvdy5nYSkge1xuICAgICAgb2JqID0gd2luZG93LmdhO1xuICAgICAgb2JqLl9fd2xfdHlwZSA9IFwiZ2FcIjtcbiAgICB9IGVsc2UgaWYgKHdpbmRvdy5fX2dhVHJhY2tlcikge1xuICAgICAgb2JqID0gd2luZG93Ll9fZ2FUcmFja2VyO1xuICAgICAgb2JqLl9fd2xfdHlwZSA9IFwiZ2FcIjtcbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZyggYEZvdW5kIGEgJHtvYmouX193bF90eXBlfSBhbmFseXRpY3Mgb2JqZWN0LmAgKTtcblxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICAvKipcbiAgICogV3JhcHBlciBmdW5jdGlvbiBmb3IgcHVzaGluZyBlbnRpdHkgYW5hbHl0aWNzIGRhdGEgdG8gZ2Egc3R5bGUgdHJhY2tlci5cbiAgICpcbiAgICogQG1ldGhvZCBzZW5kR2FFdmVudFxuICAgKiBAcGFyYW0gIHtnYX0gYW5hbHl0aWNzT2JqZWN0IFRoZSBhbmx5dGljcyBvYmplY3Qgd2UgcHVzaCBpbnRvLlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IGRpbVggdGhlIG5hbWUgb2YgdGhlIGZpcnN0IGN1c3RvbSBkaW1lbnNpb24uXG4gICAqIEBwYXJhbSAge3N0cmluZ30gZGltWSB0aGUgbmFtZSBvZiB0aGUgc2Vjb25kIGN1c3RvbSBkaW1lbnNpb24uXG4gICAqIEBwYXJhbSAge3N0cmluZ30gbGFiZWwgYSBzdHJpbmcgdG8gdXNlIGFzIHRoZSBsYWJlbC5cbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmkgdGhlIHVyaSBvZiB0aGlzIGVudGl0eS5cbiAgICogQHBhcmFtICB7c3RyaW5nfSB0eXBlIHRoZSBlbnRpdHkgdHlwZS5cbiAgICovXG4gIGZ1bmN0aW9uIHNlbmRHYUV2ZW50KGFuYWx5dGljc09iaiwgZGltWCwgZGltWSwgbGFiZWwsIHVyaSwgdHlwZSkge1xuICAgIC8vIERvdWJsZSBjaGVjayB3ZSBoYXZlIHRoZSBjb25maWcgb2JqZWN0IGJlZm9yZSBjb250aW51aW5nLlxuICAgIGlmIChcInVuZGVmaW5lZFwiID09PSB0eXBlb2Ygd29yZGxpZnRBbmFseXRpY3NDb25maWdEYXRhKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGFuYWx5dGljc09iaihcInNlbmRcIiwgXCJldmVudFwiLCBcIldvcmRMaWZ0XCIsIFwiTWVudGlvbnNcIiwgbGFiZWwsIDEsIHtcbiAgICAgIFtkaW1YXTogdXJpLFxuICAgICAgW2RpbVldOiB0eXBlLFxuICAgICAgbm9uSW50ZXJhY3Rpb246IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwcGVyIGZ1bmN0aW9uIGZvciBwdXNoaW5nIGVudGl0eSBhbmFseXRpY3MgZGF0YSB0byBndGFnLlxuICAgKlxuICAgKiBAbWV0aG9kIHNlbmRHdGFnRXZlbnRcbiAgICogQHBhcmFtICB7Z3RhZ30gYW5hbHl0aWNzT2JqZWN0IFRoZSBhbmx5dGljcyBvYmplY3Qgd2UgcHVzaCBpbnRvLlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IGRpbVggdGhlIG5hbWUgb2YgdGhlIGZpcnN0IGN1c3RvbSBkaW1lbnNpb24uXG4gICAqIEBwYXJhbSAge3N0cmluZ30gZGltWSB0aGUgbmFtZSBvZiB0aGUgc2Vjb25kIGN1c3RvbSBkaW1lbnNpb24uXG4gICAqIEBwYXJhbSAge3N0cmluZ30gbGFiZWwgYSBzdHJpbmcgdG8gdXNlIGFzIHRoZSBsYWJlbC5cbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmkgdGhlIHVyaSBvZiB0aGlzIGVudGl0eS5cbiAgICogQHBhcmFtICB7c3RyaW5nfSB0eXBlIHRoZSBlbnRpdHkgdHlwZS5cbiAgICovXG4gIGZ1bmN0aW9uIHNlbmRHdGFnRXZlbnQoYW5hbHl0aWNzT2JqLCBkaW1YLCBkaW1ZLCBsYWJlbCwgdXJpLCB0eXBlKSB7XG4gICAgLy8gRG91YmxlIGNoZWNrIHdlIGhhdmUgdGhlIGNvbmZpZyBvYmplY3QgYmVmb3JlIGNvbnRpbnVpbmcuXG4gICAgaWYgKFwidW5kZWZpbmVkXCIgPT09IHR5cGVvZiB3b3JkbGlmdEFuYWx5dGljc0NvbmZpZ0RhdGEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZyhcIlNlbmRpbmcgZ3RhZyBldmVudCAuLi5cIik7XG5cbiAgICBhbmFseXRpY3NPYmooXCJldmVudFwiLCBcIk1lbnRpb25zXCIsIHtcbiAgICAgIGV2ZW50X2NhdGVnb3J5OiBcIldvcmRMaWZ0XCIsXG4gICAgICBldmVudF9sYWJlbDogbGFiZWwsXG4gICAgICB2YWx1ZTogMSxcbiAgICAgIFtkaW1YXTogdXJpLFxuICAgICAgW2RpbVldOiB0eXBlLFxuICAgICAgbm9uX2ludGVyYWN0aW9uOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogV3JhcHBlciBmdW5jdGlvbiBmb3IgcHVzaGluZyBlbnRpdHkgYW5hbHl0aWNzIGRhdGEgdG8gZ3RhZy5cbiAgICpcbiAgICogQG1ldGhvZCBzZW5kR3RhZ0V2ZW50XG4gICAqIEBwYXJhbSAge2d0YWd9IGFuYWx5dGljc09iamVjdCBUaGUgYW5seXRpY3Mgb2JqZWN0IHdlIHB1c2ggaW50by5cbiAgICogQHBhcmFtICB7c3RyaW5nfSBkaW1YIHRoZSBuYW1lIG9mIHRoZSBmaXJzdCBjdXN0b20gZGltZW5zaW9uLlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IGRpbVkgdGhlIG5hbWUgb2YgdGhlIHNlY29uZCBjdXN0b20gZGltZW5zaW9uLlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IGxhYmVsIGEgc3RyaW5nIHRvIHVzZSBhcyB0aGUgbGFiZWwuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdXJpIHRoZSB1cmkgb2YgdGhpcyBlbnRpdHkuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdHlwZSB0aGUgZW50aXR5IHR5cGUuXG4gICAqL1xuICBmdW5jdGlvbiBzZW5kR3RtRXZlbnQoYW5hbHl0aWNzT2JqLCBkaW1YLCBkaW1ZLCBsYWJlbCwgdXJpLCB0eXBlKSB7XG4gICAgLy8gRG91YmxlIGNoZWNrIHdlIGhhdmUgdGhlIGNvbmZpZyBvYmplY3QgYmVmb3JlIGNvbnRpbnVpbmcuXG4gICAgaWYgKFwidW5kZWZpbmVkXCIgPT09IHR5cGVvZiB3b3JkbGlmdEFuYWx5dGljc0NvbmZpZ0RhdGEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZyhcIlNlbmRpbmcgZ3RtIGV2ZW50Li4uXCIpO1xuXG4gICAgYW5hbHl0aWNzT2JqLnB1c2goe1xuICAgICAgXCJldmVudFwiOiAgICAgICAgICAgICBcIk1lbnRpb25zXCIsXG4gICAgICBcIndsX2V2ZW50X2FjdGlvblwiOiAgIFwiTWVudGlvbnNcIixcbiAgICAgIFwid2xfZXZlbnRfY2F0ZWdvcnlcIjogXCJXb3JkTGlmdFwiLFxuICAgICAgXCJ3bF9ldmVudF9sYWJlbFwiOiAgICBsYWJlbCxcbiAgICAgIFwid2xfZXZlbnRfdmFsdWVcIjogICAgMSxcbiAgICAgIFwid2xfZXZlbnRfdXJpXCI6ICAgICAgdXJpLFxuXHQgIFwid2xfaW5kZXhfdXJpXCI6ICAgICAgZGltWC5yZXBsYWNlKCAvXlxcRCsvZywgJycgKSxcbiAgICAgIFwid2xfZXZlbnRfdHlwZVwiOiAgICAgdHlwZSxcblx0ICBcIndsX2luZGV4X3R5cGVcIjogICAgIGRpbVkucmVwbGFjZSggL15cXEQrL2csICcnICksXG5cdCAgXCJub25faW50ZXJhY3Rpb25cIjogICB0cnVlXG4gICAgfSk7XG4gIH1cbn0pKCk7XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///103\n')}});