import {
  __commonJS
} from "./chunk-TXDUYLVM.js";

// node_modules/dom-to-image-more/dist/dom-to-image-more.min.js
var require_dom_to_image_more_min = __commonJS({
  "node_modules/dom-to-image-more/dist/dom-to-image-more.min.js"(exports, module) {
    !function(l) {
      let d = /* @__PURE__ */ function() {
        let e2 = 0;
        return {
          escape: function(e3) {
            return e3.replace(/([.*+?^${}()|[]\/\\])/g, "\\$1");
          },
          isDataUrl: function(e3) {
            return -1 !== e3.search(/^(data:)/);
          },
          canvasToBlob: function(t3) {
            if (t3.toBlob) return new Promise(function(e3) {
              t3.toBlob(e3);
            });
            return function(r3) {
              return new Promise(function(e3) {
                var t4 = s(r3.toDataURL().split(",")[1]), n3 = t4.length, o3 = new Uint8Array(n3);
                for (let e4 = 0; e4 < n3; e4++) o3[e4] = t4.charCodeAt(e4);
                e3(new Blob([o3], {
                  type: "image/png"
                }));
              });
            }(t3);
          },
          resolveUrl: function(e3, t3) {
            var n3 = document.implementation.createHTMLDocument(), o3 = n3.createElement("base"), r3 = (n3.head.appendChild(o3), n3.createElement("a"));
            return n3.body.appendChild(r3), o3.href = t3, r3.href = e3, r3.href;
          },
          getAndEncode: function(u2) {
            let e3 = a.impl.urlCache.find(function(e4) {
              return e4.url === u2;
            });
            e3 || (e3 = {
              url: u2,
              promise: null
            }, a.impl.urlCache.push(e3));
            null === e3.promise && (a.impl.options.cacheBust && (u2 += (/\?/.test(u2) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime()), e3.promise = new Promise(function(t3) {
              let e4 = a.impl.options.httpTimeout, r3 = new XMLHttpRequest();
              if (r3.onreadystatechange = function() {
                if (4 === r3.readyState) if (300 <= r3.status) n3 ? t3(n3) : l2(`cannot fetch resource: ${u2}, status: ` + r3.status);
                else {
                  let e5 = new FileReader();
                  e5.onloadend = function() {
                    t3(e5.result);
                  }, e5.readAsDataURL(r3.response);
                }
              }, r3.ontimeout = function() {
                n3 ? t3(n3) : l2(`timeout of ${e4}ms occured while fetching resource: ` + u2);
              }, r3.responseType = "blob", r3.timeout = e4, 0 < a.impl.options.useCredentialsFilters.length && (a.impl.options.useCredentials = 0 < a.impl.options.useCredentialsFilters.filter((e5) => 0 <= u2.search(e5)).length), a.impl.options.useCredentials && (r3.withCredentials = true), a.impl.options.corsImg && 0 === u2.indexOf("http") && -1 === u2.indexOf(window.location.origin)) {
                var i3 = "POST" === (a.impl.options.corsImg.method || "GET").toUpperCase() ? "POST" : "GET";
                r3.open(i3, (a.impl.options.corsImg.url || "").replace("#{cors}", u2), true);
                let t4 = false, n4 = a.impl.options.corsImg.headers || {}, o3 = (Object.keys(n4).forEach(function(e5) {
                  -1 !== n4[e5].indexOf("application/json") && (t4 = true), r3.setRequestHeader(e5, n4[e5]);
                }), function(e5) {
                  try {
                    return JSON.parse(JSON.stringify(e5));
                  } catch (e6) {
                    l2("corsImg.data is missing or invalid");
                  }
                }(a.impl.options.corsImg.data || ""));
                Object.keys(o3).forEach(function(e5) {
                  "string" == typeof o3[e5] && (o3[e5] = o3[e5].replace("#{cors}", u2));
                }), r3.send(t4 ? JSON.stringify(o3) : o3);
              } else r3.open("GET", u2, true), r3.send();
              let n3;
              function l2(e5) {
                console.error(e5), t3("");
              }
              a.impl.options.imagePlaceholder && (i3 = a.impl.options.imagePlaceholder.split(/,/)) && i3[1] && (n3 = i3[1]);
            }));
            return e3.promise;
          },
          uid: function() {
            return "u" + ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4) + e2++;
          },
          delay: function(n3) {
            return function(t3) {
              return new Promise(function(e3) {
                setTimeout(function() {
                  e3(t3);
                }, n3);
              });
            };
          },
          asArray: function(t3) {
            var n3 = [], o3 = t3.length;
            for (let e3 = 0; e3 < o3; e3++) n3.push(t3[e3]);
            return n3;
          },
          escapeXhtml: function(e3) {
            return e3.replace(/%/g, "%25").replace(/#/g, "%23").replace(/\n/g, "%0A");
          },
          makeImage: function(o3) {
            return "data:," !== o3 ? new Promise(function(e3, t3) {
              let n3 = new Image();
              a.impl.options.useCredentials && (n3.crossOrigin = "use-credentials"), n3.onload = function() {
                window && window.requestAnimationFrame ? window.requestAnimationFrame(function() {
                  e3(n3);
                }) : e3(n3);
              }, n3.onerror = t3, n3.src = o3;
            }) : Promise.resolve();
          },
          width: function(e3) {
            var t3 = i2(e3, "width");
            if (!isNaN(t3)) return t3;
            var t3 = i2(e3, "border-left-width"), n3 = i2(e3, "border-right-width");
            return e3.scrollWidth + t3 + n3;
          },
          height: function(e3) {
            var t3 = i2(e3, "height");
            if (!isNaN(t3)) return t3;
            var t3 = i2(e3, "border-top-width"), n3 = i2(e3, "border-bottom-width");
            return e3.scrollHeight + t3 + n3;
          },
          getWindow: t2,
          isElement: r2,
          isElementHostForOpenShadowRoot: function(e3) {
            return r2(e3) && null !== e3.shadowRoot;
          },
          isShadowRoot: n2,
          isInShadowRoot: o2,
          isHTMLElement: function(e3) {
            return e3 instanceof t2(e3).HTMLElement;
          },
          isHTMLCanvasElement: function(e3) {
            return e3 instanceof t2(e3).HTMLCanvasElement;
          },
          isHTMLInputElement: function(e3) {
            return e3 instanceof t2(e3).HTMLInputElement;
          },
          isHTMLImageElement: function(e3) {
            return e3 instanceof t2(e3).HTMLImageElement;
          },
          isHTMLLinkElement: function(e3) {
            return e3 instanceof t2(e3).HTMLLinkElement;
          },
          isHTMLScriptElement: function(e3) {
            return e3 instanceof t2(e3).HTMLScriptElement;
          },
          isHTMLStyleElement: function(e3) {
            return e3 instanceof t2(e3).HTMLStyleElement;
          },
          isHTMLTextAreaElement: function(e3) {
            return e3 instanceof t2(e3).HTMLTextAreaElement;
          },
          isShadowSlotElement: function(e3) {
            return o2(e3) && e3 instanceof t2(e3).HTMLSlotElement;
          },
          isSVGElement: function(e3) {
            return e3 instanceof t2(e3).SVGElement;
          },
          isSVGRectElement: function(e3) {
            return e3 instanceof t2(e3).SVGRectElement;
          },
          isDimensionMissing: function(e3) {
            return isNaN(e3) || e3 <= 0;
          }
        };
        function t2(e3) {
          e3 = e3 ? e3.ownerDocument : void 0;
          return (e3 ? e3.defaultView : void 0) || l || window;
        }
        function n2(e3) {
          return e3 instanceof t2(e3).ShadowRoot;
        }
        function o2(e3) {
          return null !== e3 && Object.prototype.hasOwnProperty.call(e3, "getRootNode") && n2(e3.getRootNode());
        }
        function r2(e3) {
          return e3 instanceof t2(e3).Element;
        }
        function i2(t3, n3) {
          if (t3.nodeType === c) {
            let e3 = m(t3).getPropertyValue(n3);
            if ("px" === e3.slice(-2)) return e3 = e3.slice(0, -2), parseFloat(e3);
          }
          return NaN;
        }
      }(), r = /* @__PURE__ */ function() {
        let o2 = /url\(['"]?([^'"]+?)['"]?\)/g;
        return {
          inlineAll: function(t2, o3, r2) {
            if (!e2(t2)) return Promise.resolve(t2);
            return Promise.resolve(t2).then(n2).then(function(e3) {
              let n3 = Promise.resolve(t2);
              return e3.forEach(function(t3) {
                n3 = n3.then(function(e4) {
                  return i2(e4, t3, o3, r2);
                });
              }), n3;
            });
          },
          shouldProcess: e2,
          impl: {
            readUrls: n2,
            inline: i2
          }
        };
        function e2(e3) {
          return -1 !== e3.search(o2);
        }
        function n2(e3) {
          for (var t2, n3 = []; null !== (t2 = o2.exec(e3)); ) n3.push(t2[1]);
          return n3.filter(function(e4) {
            return !d.isDataUrl(e4);
          });
        }
        function i2(n3, o3, t2, e3) {
          return Promise.resolve(o3).then(function(e4) {
            return t2 ? d.resolveUrl(e4, t2) : e4;
          }).then(e3 || d.getAndEncode).then(function(e4) {
            return n3.replace((t3 = o3, new RegExp(`(url\\(['"]?)(${d.escape(t3)})(['"]?\\))`, "g")), `$1${e4}$3`);
            var t3;
          });
        }
      }(), e = {
        resolveAll: function() {
          return t().then(function(e2) {
            return Promise.all(e2.map(function(e3) {
              return e3.resolve();
            }));
          }).then(function(e2) {
            return e2.join("\n");
          });
        },
        impl: {
          readAll: t
        }
      };
      function t() {
        return Promise.resolve(d.asArray(document.styleSheets)).then(function(e2) {
          let n2 = [];
          return e2.forEach(function(t3) {
            if (Object.prototype.hasOwnProperty.call(Object.getPrototypeOf(t3), "cssRules")) try {
              d.asArray(t3.cssRules || []).forEach(n2.push.bind(n2));
            } catch (e3) {
              console.error("domtoimage: Error while reading CSS rules from " + t3.href, e3.toString());
            }
          }), n2;
        }).then(function(e2) {
          return e2.filter(function(e3) {
            return e3.type === CSSRule.FONT_FACE_RULE;
          }).filter(function(e3) {
            return r.shouldProcess(e3.style.getPropertyValue("src"));
          });
        }).then(function(e2) {
          return e2.map(t2);
        });
        function t2(t3) {
          return {
            resolve: function() {
              var e2 = (t3.parentStyleSheet || {}).href;
              return r.inlineAll(t3.cssText, e2);
            },
            src: function() {
              return t3.style.getPropertyValue("src");
            }
          };
        }
      }
      let n = {
        inlineAll: function t2(e2) {
          if (!d.isElement(e2)) return Promise.resolve(e2);
          return n2(e2).then(function() {
            return d.isHTMLImageElement(e2) ? o(e2).inline() : Promise.all(d.asArray(e2.childNodes).map(function(e3) {
              return t2(e3);
            }));
          });
          function n2(o2) {
            let e3 = ["background", "background-image"], t3 = e3.map(function(t4) {
              let e4 = o2.style.getPropertyValue(t4), n3 = o2.style.getPropertyPriority(t4);
              return e4 ? r.inlineAll(e4).then(function(e5) {
                o2.style.setProperty(t4, e5, n3);
              }) : Promise.resolve();
            });
            return Promise.all(t3).then(function() {
              return o2;
            });
          }
        },
        impl: {
          newImage: o
        }
      };
      function o(n2) {
        return {
          inline: function(e2) {
            if (d.isDataUrl(n2.src)) return Promise.resolve();
            return Promise.resolve(n2.src).then(e2 || d.getAndEncode).then(function(t2) {
              return new Promise(function(e3) {
                n2.onload = e3, n2.onerror = e3, n2.src = t2;
              });
            });
          }
        };
      }
      let u = {
        copyDefaultStyles: true,
        imagePlaceholder: void 0,
        cacheBust: false,
        useCredentials: false,
        useCredentialsFilters: [],
        httpTimeout: 3e4,
        styleCaching: "strict",
        corsImg: void 0,
        adjustClonedNode: void 0
      }, a = {
        toSvg: f,
        toPng: function(e2, t2) {
          return i(e2, t2).then(function(e3) {
            return e3.toDataURL();
          });
        },
        toJpeg: function(e2, t2) {
          return i(e2, t2).then(function(e3) {
            return e3.toDataURL("image/jpeg", (t2 ? t2.quality : void 0) || 1);
          });
        },
        toBlob: function(e2, t2) {
          return i(e2, t2).then(d.canvasToBlob);
        },
        toPixelData: function(t2, e2) {
          return i(t2, e2).then(function(e3) {
            return e3.getContext("2d").getImageData(0, 0, d.width(t2), d.height(t2)).data;
          });
        },
        toCanvas: i,
        impl: {
          fontFaces: e,
          images: n,
          util: d,
          inliner: r,
          urlCache: [],
          options: {}
        }
      }, c = ("object" == typeof exports && "object" == typeof module ? module.exports = a : l.domtoimage = a, ("undefined" != typeof Node ? Node.ELEMENT_NODE : void 0) || 1), m = (void 0 !== l ? l.getComputedStyle : void 0) || ("undefined" != typeof window ? window.getComputedStyle : void 0) || globalThis.getComputedStyle, s = (void 0 !== l ? l.atob : void 0) || ("undefined" != typeof window ? window.atob : void 0) || globalThis.atob;
      function f(e2, r2) {
        let t2 = a.impl.util.getWindow(e2);
        var n2 = r2 = r2 || {};
        void 0 === n2.copyDefaultStyles ? a.impl.options.copyDefaultStyles = u.copyDefaultStyles : a.impl.options.copyDefaultStyles = n2.copyDefaultStyles, a.impl.options.imagePlaceholder = (void 0 === n2.imagePlaceholder ? u : n2).imagePlaceholder, a.impl.options.cacheBust = (void 0 === n2.cacheBust ? u : n2).cacheBust, a.impl.options.corsImg = (void 0 === n2.corsImg ? u : n2).corsImg, a.impl.options.useCredentials = (void 0 === n2.useCredentials ? u : n2).useCredentials, a.impl.options.useCredentialsFilters = (void 0 === n2.useCredentialsFilters ? u : n2).useCredentialsFilters, a.impl.options.httpTimeout = (void 0 === n2.httpTimeout ? u : n2).httpTimeout, a.impl.options.styleCaching = (void 0 === n2.styleCaching ? u : n2).styleCaching;
        let i2 = [];
        return Promise.resolve(e2).then(function(e3) {
          if (e3.nodeType === c) return e3;
          var t3 = e3, n3 = e3.parentNode, o2 = document.createElement("span");
          return n3.replaceChild(o2, t3), o2.append(e3), i2.push({
            parent: n3,
            child: t3,
            wrapper: o2
          }), o2;
        }).then(function(e3) {
          return function l2(t3, u2, r3, s2) {
            let e4 = u2.filter;
            if (t3 === h || d.isHTMLScriptElement(t3) || d.isHTMLStyleElement(t3) || d.isHTMLLinkElement(t3) || null !== r3 && e4 && !e4(t3)) return Promise.resolve();
            return Promise.resolve(t3).then(n3).then(o2).then(function(e5) {
              return c2(e5, a2(t3));
            }).then(i3).then(function(e5) {
              return f2(e5, t3);
            });
            function n3(e5) {
              return d.isHTMLCanvasElement(e5) ? d.makeImage(e5.toDataURL()) : e5.cloneNode(false);
            }
            function o2(e5) {
              return u2.adjustClonedNode && u2.adjustClonedNode(t3, e5, false), Promise.resolve(e5);
            }
            function i3(e5) {
              return u2.adjustClonedNode && u2.adjustClonedNode(t3, e5, true), Promise.resolve(e5);
            }
            function a2(e5) {
              return d.isElementHostForOpenShadowRoot(e5) ? e5.shadowRoot : e5;
            }
            function c2(n4, e5) {
              let o3 = t4(e5), r4 = Promise.resolve();
              if (0 !== o3.length) {
                let t5 = m(i4(e5));
                d.asArray(o3).forEach(function(e6) {
                  r4 = r4.then(function() {
                    return l2(e6, u2, t5, s2).then(function(e7) {
                      e7 && n4.appendChild(e7);
                    });
                  });
                });
              }
              return r4.then(function() {
                return n4;
              });
              function i4(e6) {
                return d.isShadowRoot(e6) ? e6.host : e6;
              }
              function t4(e6) {
                return d.isShadowSlotElement(e6) ? e6.assignedNodes() : e6.childNodes;
              }
            }
            function f2(s3, a3) {
              return !d.isElement(s3) || d.isShadowSlotElement(a3) ? Promise.resolve(s3) : Promise.resolve().then(e5).then(t4).then(n4).then(o3).then(function() {
                return s3;
              });
              function e5() {
                function o4(e7, t5) {
                  t5.font = e7.font, t5.fontFamily = e7.fontFamily, t5.fontFeatureSettings = e7.fontFeatureSettings, t5.fontKerning = e7.fontKerning, t5.fontSize = e7.fontSize, t5.fontStretch = e7.fontStretch, t5.fontStyle = e7.fontStyle, t5.fontVariant = e7.fontVariant, t5.fontVariantCaps = e7.fontVariantCaps, t5.fontVariantEastAsian = e7.fontVariantEastAsian, t5.fontVariantLigatures = e7.fontVariantLigatures, t5.fontVariantNumeric = e7.fontVariantNumeric, t5.fontVariationSettings = e7.fontVariationSettings, t5.fontWeight = e7.fontWeight;
                }
                function e6(e7, t5) {
                  let n5 = m(e7);
                  n5.cssText ? (t5.style.cssText = n5.cssText, o4(n5, t5.style)) : (y(u2, e7, n5, r3, t5), null === r3 && (["inset-block", "inset-block-start", "inset-block-end"].forEach((e8) => t5.style.removeProperty(e8)), ["left", "right", "top", "bottom"].forEach((e8) => {
                    t5.style.getPropertyValue(e8) && t5.style.setProperty(e8, "0px");
                  })));
                }
                e6(a3, s3);
              }
              function t4() {
                let u3 = d.uid();
                function t5(r4) {
                  let i4 = m(a3, r4), l3 = i4.getPropertyValue("content");
                  if ("" !== l3 && "none" !== l3) {
                    let n6 = function() {
                      let e7 = `.${u3}:` + r4, t7 = (i4.cssText ? n7 : o4)();
                      return document.createTextNode(e7 + `{${t7}}`);
                      function n7() {
                        return `${i4.cssText} content: ${l3};`;
                      }
                      function o4() {
                        let e8 = d.asArray(i4).map(t8).join("; ");
                        return e8 + ";";
                        function t8(e9) {
                          let t9 = i4.getPropertyValue(e9), n8 = i4.getPropertyPriority(e9) ? " !important" : "";
                          return e9 + ": " + t9 + n8;
                        }
                      }
                    };
                    var n5 = n6;
                    let e6 = s3.getAttribute("class") || "", t6 = (s3.setAttribute("class", e6 + " " + u3), document.createElement("style"));
                    t6.appendChild(n6()), s3.appendChild(t6);
                  }
                }
                [":before", ":after"].forEach(function(e6) {
                  t5(e6);
                });
              }
              function n4() {
                d.isHTMLTextAreaElement(a3) && (s3.innerHTML = a3.value), d.isHTMLInputElement(a3) && s3.setAttribute("value", a3.value);
              }
              function o3() {
                d.isSVGElement(s3) && (s3.setAttribute("xmlns", "http://www.w3.org/2000/svg"), d.isSVGRectElement(s3)) && ["width", "height"].forEach(function(e6) {
                  let t5 = s3.getAttribute(e6);
                  t5 && s3.style.setProperty(e6, t5);
                });
              }
            }
          }(e3, r2, null, t2);
        }).then(p).then(g).then(function(t3) {
          r2.bgcolor && (t3.style.backgroundColor = r2.bgcolor);
          r2.width && (t3.style.width = r2.width + "px");
          r2.height && (t3.style.height = r2.height + "px");
          r2.style && Object.keys(r2.style).forEach(function(e4) {
            t3.style[e4] = r2.style[e4];
          });
          let e3 = null;
          "function" == typeof r2.onclone && (e3 = r2.onclone(t3));
          return Promise.resolve(e3).then(function() {
            return t3;
          });
        }).then(function(e3) {
          let n3 = r2.width || d.width(e3), o2 = r2.height || d.height(e3);
          return Promise.resolve(e3).then(function(e4) {
            return e4.setAttribute("xmlns", "http://www.w3.org/1999/xhtml"), new XMLSerializer().serializeToString(e4);
          }).then(d.escapeXhtml).then(function(e4) {
            var t3 = (d.isDimensionMissing(n3) ? ' width="100%"' : ` width="${n3}"`) + (d.isDimensionMissing(o2) ? ' height="100%"' : ` height="${o2}"`);
            return `<svg xmlns="http://www.w3.org/2000/svg"${(d.isDimensionMissing(n3) ? "" : ` width="${n3}"`) + (d.isDimensionMissing(o2) ? "" : ` height="${o2}"`)}><foreignObject${t3}>${e4}</foreignObject></svg>`;
          }).then(function(e4) {
            return "data:image/svg+xml;charset=utf-8," + e4;
          });
        }).then(function(e3) {
          for (; 0 < i2.length; ) {
            var t3 = i2.pop();
            t3.parent.replaceChild(t3.child, t3.wrapper);
          }
          return e3;
        }).then(function(e3) {
          return a.impl.urlCache = [], function() {
            h && (document.body.removeChild(h), h = null);
            w && clearTimeout(w);
            w = setTimeout(() => {
              w = null, v = {};
            }, 2e4);
          }(), e3;
        });
      }
      function i(r2, i2) {
        return f(r2, i2 = i2 || {}).then(d.makeImage).then(function(e2) {
          var t2 = "number" != typeof i2.scale ? 1 : i2.scale, n2 = function(e3, t3) {
            let n3 = i2.width || d.width(e3), o3 = i2.height || d.height(e3);
            d.isDimensionMissing(n3) && (n3 = d.isDimensionMissing(o3) ? 300 : 2 * o3);
            d.isDimensionMissing(o3) && (o3 = n3 / 2);
            e3 = document.createElement("canvas");
            e3.width = n3 * t3, e3.height = o3 * t3, i2.bgcolor && ((t3 = e3.getContext("2d")).fillStyle = i2.bgcolor, t3.fillRect(0, 0, e3.width, e3.height));
            return e3;
          }(r2, t2), o2 = n2.getContext("2d");
          return o2.msImageSmoothingEnabled = false, o2.imageSmoothingEnabled = false, e2 && (o2.scale(t2, t2), o2.drawImage(e2, 0, 0)), n2;
        });
      }
      let h = null;
      function p(n2) {
        return e.resolveAll().then(function(e2) {
          var t2;
          return "" !== e2 && (t2 = document.createElement("style"), n2.appendChild(t2), t2.appendChild(document.createTextNode(e2))), n2;
        });
      }
      function g(e2) {
        return n.inlineAll(e2).then(function() {
          return e2;
        });
      }
      function y(e2, t2, i2, l2, n2) {
        let u2 = a.impl.options.copyDefaultStyles ? function(t3, e3) {
          var e3 = function(e4) {
            var t4 = [];
            do {
              if (e4.nodeType === c) {
                var n4 = e4.tagName;
                if (t4.push(n4), E.includes(n4)) break;
              }
            } while (e4 = e4.parentNode, e4);
            return t4;
          }(e3), n3 = function(e4) {
            return ("relaxed" !== t3.styleCaching ? e4 : e4.filter((e5, t4, n4) => 0 === t4 || t4 === n4.length - 1)).join(">");
          }(e3);
          if (v[n3]) return v[n3];
          var o2 = function() {
            if (h) return h.contentWindow;
            var e4 = document.characterSet || "UTF-8", t4 = document.doctype, t4 = t4 ? (`<!DOCTYPE ${n4(t4.name)} ${n4(t4.publicId)} ` + n4(t4.systemId)).trim() + ">" : "";
            return (h = document.createElement("iframe")).id = "domtoimage-sandbox-" + d.uid(), h.style.visibility = "hidden", h.style.position = "fixed", document.body.appendChild(h), function(e5, t5, n5, o3) {
              try {
                return e5.contentWindow.document.write(t5 + `<html><head><meta charset='${n5}'><title>${o3}</title></head><body></body></html>`), e5.contentWindow;
              } catch (e6) {
              }
              var r2 = document.createElement("meta");
              r2.setAttribute("charset", n5);
              try {
                var i3 = document.implementation.createHTMLDocument(o3), l3 = (i3.head.appendChild(r2), t5 + i3.documentElement.outerHTML);
                return e5.setAttribute("srcdoc", l3), e5.contentWindow;
              } catch (e6) {
              }
              return e5.contentDocument.head.appendChild(r2), e5.contentDocument.title = o3, e5.contentWindow;
            }(h, t4, e4, "domtoimage-sandbox");
            function n4(e5) {
              var t5;
              return e5 ? ((t5 = document.createElement("div")).innerText = e5, t5.innerHTML) : "";
            }
          }(), e3 = function(e4, t4) {
            let n4 = e4.body;
            do {
              var o3 = t4.pop(), o3 = e4.createElement(o3);
              n4.appendChild(o3), n4 = o3;
            } while (0 < t4.length);
            return n4.textContent = "​", n4;
          }(o2.document, e3), o2 = function(e4, t4) {
            let n4 = {}, o3 = e4.getComputedStyle(t4);
            return d.asArray(o3).forEach(function(e5) {
              n4[e5] = "width" === e5 || "height" === e5 ? "auto" : o3.getPropertyValue(e5);
            }), n4;
          }(o2, e3);
          return function(e4) {
            do {
              var t4 = e4.parentElement;
              null !== t4 && t4.removeChild(e4), e4 = t4;
            } while (e4 && "BODY" !== e4.tagName);
          }(e3), v[n3] = o2;
        }(e2, t2) : {}, s2 = n2.style;
        d.asArray(i2).forEach(function(e3) {
          var t3, n3 = i2.getPropertyValue(e3), o2 = u2[e3], r2 = l2 ? l2.getPropertyValue(e3) : void 0;
          s2.getPropertyValue(e3) || (n3 !== o2 || l2 && n3 !== r2) && (o2 = i2.getPropertyPriority(e3), r2 = s2, n3 = n3, o2 = o2, t3 = 0 <= ["background-clip"].indexOf(e3 = e3), o2 ? (r2.setProperty(e3, n3, o2), t3 && r2.setProperty("-webkit-" + e3, n3, o2)) : (r2.setProperty(e3, n3), t3 && r2.setProperty("-webkit-" + e3, n3)));
        });
      }
      let w = null, v = {}, E = ["ADDRESS", "ARTICLE", "ASIDE", "BLOCKQUOTE", "DETAILS", "DIALOG", "DD", "DIV", "DL", "DT", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "H1", "H2", "H3", "H4", "H5", "H6", "HEADER", "HGROUP", "HR", "LI", "MAIN", "NAV", "OL", "P", "PRE", "SECTION", "SVG", "TABLE", "UL", "math", "svg", "BODY", "HEAD", "HTML"];
    }(exports);
  }
});
export default require_dom_to_image_more_min();
/*! Bundled license information:

dom-to-image-more/dist/dom-to-image-more.min.js:
  (*! dom-to-image-more 29-07-2024 *)
*/
//# sourceMappingURL=dom-to-image-more.js.map
