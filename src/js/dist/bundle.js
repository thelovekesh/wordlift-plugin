!(function(e) {
  var t = {};
  function n(o) {
    if (t[o]) return t[o].exports;
    var r = (t[o] = { i: o, l: !1, exports: {} });
    return e[o].call(r.exports, r, r.exports, n), (r.l = !0), r.exports;
  }
  (n.m = e),
    (n.c = t),
    (n.d = function(e, t, o) {
      n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: o });
    }),
    (n.r = function(e) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (n.t = function(e, t) {
      if ((1 & t && (e = n(e)), 8 & t)) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var o = Object.create(null);
      if (
        (n.r(o),
        Object.defineProperty(o, "default", { enumerable: !0, value: e }),
        2 & t && "string" != typeof e)
      )
        for (var r in e)
          n.d(
            o,
            r,
            function(t) {
              return e[t];
            }.bind(null, r)
          );
      return o;
    }),
    (n.n = function(e) {
      var t =
        e && e.__esModule
          ? function() {
              return e.default;
            }
          : function() {
              return e;
            };
      return n.d(t, "a", t), t;
    }),
    (n.o = function(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (n.p = ""),
    n((n.s = 115));
})({
  115: function(e, t, n) {
    "use strict";
    var o = window.wlSettings;
    !(function() {
      if (
        "undefined" != typeof fetch &&
        !(
          (void 0 !== o.jsonld_enabled && "1" !== o.jsonld_enabled) ||
          (void 0 === o.postId && void 0 === o.isHome)
        )
      ) {
        var e,
          t,
          n = ((t = 0 <= (e = o).apiUrl.indexOf("?") ? "&" : "?"),
          e.apiUrl +
            t +
            "action=wl_jsonld" +
            (void 0 !== e.postId ? "&id=" + e.postId : "") +
            (void 0 !== e.isHome ? "&homepage=true" : ""));
        fetch(n)
          .then(function(e) {
            return e.text();
          })
          .then(function(e) {
            var t = document.createElement("script");
            (t.type = "application/ld+json"),
              (t.innerText = e),
              document.head.appendChild(t);
          });
      }
    })();
  }
});
//# sourceMappingURL=bundle.js.map
