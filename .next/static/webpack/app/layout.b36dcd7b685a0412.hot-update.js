"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/layout",{

/***/ "(app-pages-browser)/./app/globals.css":
/*!*************************!*\
  !*** ./app/globals.css ***!
  \*************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"8881dd58e283\");\nif (true) { module.hot.accept() }\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2FwcC9nbG9iYWxzLmNzcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUEsaUVBQWUsY0FBYztBQUM3QixJQUFJLElBQVUsSUFBSSxpQkFBaUIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFubi9Eb2N1bWVudHMvR2l0SHViL1NTTE9KX0dhbWUvYXBwL2dsb2JhbHMuY3NzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IFwiODg4MWRkNThlMjgzXCJcbmlmIChtb2R1bGUuaG90KSB7IG1vZHVsZS5ob3QuYWNjZXB0KCkgfVxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./app/globals.css\n"));

/***/ }),

/***/ "(app-pages-browser)/./components/LayoutWrapper.tsx":
/*!**************************************!*\
  !*** ./components/LayoutWrapper.tsx ***!
  \**************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ LayoutWrapper)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\nfunction LayoutWrapper(param) {\n    let { children } = param;\n    _s();\n    const headerRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);\n    const [offsetTop, setOffsetTop] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);\n    const [activeLink, setActiveLink] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"\");\n    const [language, setLanguage] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"FR\");\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"LayoutWrapper.useEffect\": ()=>{\n            const handleUrlChange = {\n                \"LayoutWrapper.useEffect.handleUrlChange\": ()=>{\n                    setActiveLink(window.location.pathname);\n                }\n            }[\"LayoutWrapper.useEffect.handleUrlChange\"];\n            handleUrlChange();\n            window.addEventListener(\"popstate\", handleUrlChange);\n            return ({\n                \"LayoutWrapper.useEffect\": ()=>{\n                    window.removeEventListener(\"popstate\", handleUrlChange);\n                }\n            })[\"LayoutWrapper.useEffect\"];\n        }\n    }[\"LayoutWrapper.useEffect\"], []);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"LayoutWrapper.useEffect\": ()=>{\n            if (headerRef.current) {\n                setOffsetTop(headerRef.current.offsetHeight);\n            }\n        }\n    }[\"LayoutWrapper.useEffect\"], []);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"LayoutWrapper.useEffect\": ()=>{\n            // Stocker la langue sélectionnée dans localStorage\n            localStorage.setItem(\"lang\", language);\n        }\n    }[\"LayoutWrapper.useEffect\"], [\n        language\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"header\", {\n                ref: headerRef,\n                className: \"fixed top-0 left-0 w-full bg-[#0a091c] shadow-md z-50 px-4 text-white\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"md:hidden\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"relative flex items-center justify-center pt-2 pb-2\",\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"img\", {\n                                        src: \"/images/logo.png\",\n                                        alt: \"Logo\",\n                                        className: \"h-14\"\n                                    }, void 0, false, {\n                                        fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                                        lineNumber: 43,\n                                        columnNumber: 7\n                                    }, this),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"absolute right-4\",\n                                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"select\", {\n                                            className: \"bg-transparent border border-white/30 text-white text-sm px-2 py-1 rounded\",\n                                            value: language,\n                                            onChange: (e)=>setLanguage(e.target.value),\n                                            children: [\n                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"option\", {\n                                                    value: \"FR\",\n                                                    children: \"FR\"\n                                                }, void 0, false, {\n                                                    fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                                                    lineNumber: 50,\n                                                    columnNumber: 11\n                                                }, this),\n                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"option\", {\n                                                    value: \"EN\",\n                                                    children: \"EN\"\n                                                }, void 0, false, {\n                                                    fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                                                    lineNumber: 51,\n                                                    columnNumber: 11\n                                                }, this),\n                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"option\", {\n                                                    value: \"CN\",\n                                                    children: \"CN\"\n                                                }, void 0, false, {\n                                                    fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                                                    lineNumber: 52,\n                                                    columnNumber: 11\n                                                }, this),\n                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"option\", {\n                                                    value: \"JP\",\n                                                    children: \"JP\"\n                                                }, void 0, false, {\n                                                    fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                                                    lineNumber: 53,\n                                                    columnNumber: 11\n                                                }, this)\n                                            ]\n                                        }, void 0, true, {\n                                            fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                                            lineNumber: 45,\n                                            columnNumber: 9\n                                        }, this)\n                                    }, void 0, false, {\n                                        fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                                        lineNumber: 44,\n                                        columnNumber: 7\n                                    }, this)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                                lineNumber: 42,\n                                columnNumber: 5\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"nav\", {\n                                className: \"flex overflow-x-auto space-x-4 scrollbar-hide w-full justify-start px-2 py-3\",\n                                children: [\n                                    {\n                                        href: \"/characters\",\n                                        label: \"Personnages\"\n                                    },\n                                    {\n                                        href: \"/arayashikis\",\n                                        label: \"Arayashikis\"\n                                    },\n                                    {\n                                        href: \"/artefacts\",\n                                        label: \"Artefacts\"\n                                    },\n                                    {\n                                        href: \"/vestiges\",\n                                        label: \"Vestiges\"\n                                    }\n                                ].map((param)=>{\n                                    let { href, label } = param;\n                                    const isActive = activeLink.startsWith(href);\n                                    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"a\", {\n                                        href: href,\n                                        className: \"flex-shrink-0 relative group text-sm px-3 py-1 rounded transition-all whitespace-nowrap \".concat(isActive ? \"text-yellow-400\" : \"text-white hover:text-yellow-400\"),\n                                        children: [\n                                            label,\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                                className: \"absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-[1px] rounded-full transition-all duration-500 bg-gradient-to-r from-[#0a091c] via-yellow-400 to-[#0a091c] \".concat(isActive ? \"w-14 opacity-100\" : \"w-0 group-hover:w-14 group-hover:opacity-100 opacity-0\")\n                                            }, void 0, false, {\n                                                fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                                                lineNumber: 76,\n                                                columnNumber: 13\n                                            }, this)\n                                        ]\n                                    }, href, true, {\n                                        fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                                        lineNumber: 68,\n                                        columnNumber: 11\n                                    }, this);\n                                })\n                            }, void 0, false, {\n                                fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                                lineNumber: 59,\n                                columnNumber: 5\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                        lineNumber: 40,\n                        columnNumber: 3\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"hidden md:flex items-center justify-between h-[80px] px-6\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"nav\", {\n                                className: \"flex space-x-2\",\n                                children: [\n                                    {\n                                        href: \"/characters\",\n                                        label: \"Personnages\"\n                                    },\n                                    {\n                                        href: \"/arayashikis\",\n                                        label: \"Arayashikis\"\n                                    },\n                                    {\n                                        href: \"/artefacts\",\n                                        label: \"Artefacts\"\n                                    },\n                                    {\n                                        href: \"/vestiges\",\n                                        label: \"Vestiges\"\n                                    }\n                                ].map((param)=>{\n                                    let { href, label } = param;\n                                    const isActive = activeLink.startsWith(href);\n                                    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"a\", {\n                                        href: href,\n                                        className: \"relative group text-m px-3 py-1 rounded transition-all \".concat(isActive ? \"text-yellow-400\" : \"text-white hover:text-yellow-400\"),\n                                        children: [\n                                            label,\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                                className: \"absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-[1px] rounded-full transition-all duration-500 bg-gradient-to-r from-[#0a091c] via-yellow-400 to-[#0a091c] \".concat(isActive ? \"w-14 opacity-100\" : \"w-0 group-hover:w-14 group-hover:opacity-100 opacity-0\")\n                                            }, void 0, false, {\n                                                fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                                                lineNumber: 109,\n                                                columnNumber: 13\n                                            }, this)\n                                        ]\n                                    }, href, true, {\n                                        fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                                        lineNumber: 101,\n                                        columnNumber: 11\n                                    }, this);\n                                })\n                            }, void 0, false, {\n                                fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                                lineNumber: 92,\n                                columnNumber: 5\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"absolute left-1/2 transform -translate-x-1/2\",\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"img\", {\n                                    src: \"/images/logo.png\",\n                                    alt: \"Logo\",\n                                    className: \"h-15\"\n                                }, void 0, false, {\n                                    fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                                    lineNumber: 123,\n                                    columnNumber: 7\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                                lineNumber: 122,\n                                columnNumber: 5\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"select\", {\n                                    className: \"bg-transparent border border-white/30 text-white text-sm px-2 py-1 rounded\",\n                                    value: language,\n                                    onChange: (e)=>setLanguage(e.target.value),\n                                    children: [\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"option\", {\n                                            value: \"FR\",\n                                            children: \"FR\"\n                                        }, void 0, false, {\n                                            fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                                            lineNumber: 133,\n                                            columnNumber: 9\n                                        }, this),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"option\", {\n                                            value: \"EN\",\n                                            children: \"EN\"\n                                        }, void 0, false, {\n                                            fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                                            lineNumber: 134,\n                                            columnNumber: 9\n                                        }, this),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"option\", {\n                                            value: \"CN\",\n                                            children: \"CN\"\n                                        }, void 0, false, {\n                                            fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                                            lineNumber: 135,\n                                            columnNumber: 9\n                                        }, this),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"option\", {\n                                            value: \"JP\",\n                                            children: \"JP\"\n                                        }, void 0, false, {\n                                            fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                                            lineNumber: 136,\n                                            columnNumber: 9\n                                        }, this)\n                                    ]\n                                }, void 0, true, {\n                                    fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                                    lineNumber: 128,\n                                    columnNumber: 7\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                                lineNumber: 127,\n                                columnNumber: 5\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                        lineNumber: 90,\n                        columnNumber: 3\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                lineNumber: 35,\n                columnNumber: 1\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"main\", {\n                style: {\n                    paddingTop: offsetTop\n                },\n                children: children\n            }, void 0, false, {\n                fileName: \"/Users/evann/Documents/GitHub/SSLOJ_Game/components/LayoutWrapper.tsx\",\n                lineNumber: 143,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n_s(LayoutWrapper, \"KF6360NRX8Q/cQwmSGcYS7XyLiw=\");\n_c = LayoutWrapper;\nvar _c;\n$RefreshReg$(_c, \"LayoutWrapper\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2NvbXBvbmVudHMvTGF5b3V0V3JhcHBlci50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBRTJEO0FBRTVDLFNBQVNJLGNBQWMsS0FBMkM7UUFBM0MsRUFBRUMsUUFBUSxFQUFpQyxHQUEzQzs7SUFDcEMsTUFBTUMsWUFBWUwsNkNBQU1BLENBQWM7SUFDdEMsTUFBTSxDQUFDTSxXQUFXQyxhQUFhLEdBQUdMLCtDQUFRQSxDQUFDO0lBQzNDLE1BQU0sQ0FBQ00sWUFBWUMsY0FBYyxHQUFHUCwrQ0FBUUEsQ0FBUztJQUNyRCxNQUFNLENBQUNRLFVBQVVDLFlBQVksR0FBR1QsK0NBQVFBLENBQVM7SUFFakRELGdEQUFTQTttQ0FBQztZQUNSLE1BQU1XOzJEQUFrQjtvQkFDdEJILGNBQWNJLE9BQU9DLFFBQVEsQ0FBQ0MsUUFBUTtnQkFDeEM7O1lBQ0FIO1lBQ0FDLE9BQU9HLGdCQUFnQixDQUFDLFlBQVlKO1lBQ3BDOzJDQUFPO29CQUNMQyxPQUFPSSxtQkFBbUIsQ0FBQyxZQUFZTDtnQkFDekM7O1FBQ0Y7a0NBQUcsRUFBRTtJQUVMWCxnREFBU0E7bUNBQUM7WUFDUixJQUFJSSxVQUFVYSxPQUFPLEVBQUU7Z0JBQ3JCWCxhQUFhRixVQUFVYSxPQUFPLENBQUNDLFlBQVk7WUFDN0M7UUFDRjtrQ0FBRyxFQUFFO0lBRUxsQixnREFBU0E7bUNBQUM7WUFDUixtREFBbUQ7WUFDbkRtQixhQUFhQyxPQUFPLENBQUMsUUFBUVg7UUFDL0I7a0NBQUc7UUFBQ0E7S0FBUztJQUViLHFCQUNFOzswQkFDSiw4REFBQ1k7Z0JBQ0NDLEtBQUtsQjtnQkFDTG1CLFdBQVU7O2tDQUdWLDhEQUFDQzt3QkFBSUQsV0FBVTs7MENBRWIsOERBQUNDO2dDQUFJRCxXQUFVOztrREFDYiw4REFBQ0U7d0NBQUlDLEtBQUk7d0NBQW1CQyxLQUFJO3dDQUFPSixXQUFVOzs7Ozs7a0RBQ2pELDhEQUFDQzt3Q0FBSUQsV0FBVTtrREFDYiw0RUFBQ0s7NENBQ0NMLFdBQVU7NENBQ1ZNLE9BQU9wQjs0Q0FDUHFCLFVBQVUsQ0FBQ0MsSUFBTXJCLFlBQVlxQixFQUFFQyxNQUFNLENBQUNILEtBQUs7OzhEQUUzQyw4REFBQ0k7b0RBQU9KLE9BQU07OERBQUs7Ozs7Ozs4REFDbkIsOERBQUNJO29EQUFPSixPQUFNOzhEQUFLOzs7Ozs7OERBQ25CLDhEQUFDSTtvREFBT0osT0FBTTs4REFBSzs7Ozs7OzhEQUNuQiw4REFBQ0k7b0RBQU9KLE9BQU07OERBQUs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzBDQU16Qiw4REFBQ0s7Z0NBQUlYLFdBQVU7MENBQ1o7b0NBQ0M7d0NBQUVZLE1BQU07d0NBQWVDLE9BQU87b0NBQWM7b0NBQzVDO3dDQUFFRCxNQUFNO3dDQUFnQkMsT0FBTztvQ0FBYztvQ0FDN0M7d0NBQUVELE1BQU07d0NBQWNDLE9BQU87b0NBQVk7b0NBQ3pDO3dDQUFFRCxNQUFNO3dDQUFhQyxPQUFPO29DQUFXO2lDQUN4QyxDQUFDQyxHQUFHLENBQUM7d0NBQUMsRUFBRUYsSUFBSSxFQUFFQyxLQUFLLEVBQUU7b0NBQ3BCLE1BQU1FLFdBQVcvQixXQUFXZ0MsVUFBVSxDQUFDSjtvQ0FDdkMscUJBQ0UsOERBQUNLO3dDQUVDTCxNQUFNQTt3Q0FDTlosV0FBVywyRkFFVixPQURDZSxXQUFXLG9CQUFvQjs7NENBR2hDRjswREFDRCw4REFBQ0s7Z0RBQ0NsQixXQUFXLCtKQUlWLE9BSENlLFdBQ0kscUJBQ0E7Ozs7Ozs7dUNBWEhIOzs7OztnQ0FnQlg7Ozs7Ozs7Ozs7OztrQ0FLSiw4REFBQ1g7d0JBQUlELFdBQVU7OzBDQUViLDhEQUFDVztnQ0FBSVgsV0FBVTswQ0FDWjtvQ0FDQzt3Q0FBRVksTUFBTTt3Q0FBZUMsT0FBTztvQ0FBYztvQ0FDNUM7d0NBQUVELE1BQU07d0NBQWdCQyxPQUFPO29DQUFjO29DQUM3Qzt3Q0FBRUQsTUFBTTt3Q0FBY0MsT0FBTztvQ0FBWTtvQ0FDekM7d0NBQUVELE1BQU07d0NBQWFDLE9BQU87b0NBQVc7aUNBQ3hDLENBQUNDLEdBQUcsQ0FBQzt3Q0FBQyxFQUFFRixJQUFJLEVBQUVDLEtBQUssRUFBRTtvQ0FDcEIsTUFBTUUsV0FBVy9CLFdBQVdnQyxVQUFVLENBQUNKO29DQUN2QyxxQkFDRSw4REFBQ0s7d0NBRUNMLE1BQU1BO3dDQUNOWixXQUFXLDBEQUVWLE9BRENlLFdBQVcsb0JBQW9COzs0Q0FHaENGOzBEQUNELDhEQUFDSztnREFDQ2xCLFdBQVcsK0pBSVYsT0FIQ2UsV0FDSSxxQkFDQTs7Ozs7Ozt1Q0FYSEg7Ozs7O2dDQWdCWDs7Ozs7OzBDQUlGLDhEQUFDWDtnQ0FBSUQsV0FBVTswQ0FDYiw0RUFBQ0U7b0NBQUlDLEtBQUk7b0NBQW1CQyxLQUFJO29DQUFPSixXQUFVOzs7Ozs7Ozs7OzswQ0FJbkQsOERBQUNDOzBDQUNDLDRFQUFDSTtvQ0FDQ0wsV0FBVTtvQ0FDVk0sT0FBT3BCO29DQUNQcUIsVUFBVSxDQUFDQyxJQUFNckIsWUFBWXFCLEVBQUVDLE1BQU0sQ0FBQ0gsS0FBSzs7c0RBRTNDLDhEQUFDSTs0Q0FBT0osT0FBTTtzREFBSzs7Ozs7O3NEQUNuQiw4REFBQ0k7NENBQU9KLE9BQU07c0RBQUs7Ozs7OztzREFDbkIsOERBQUNJOzRDQUFPSixPQUFNO3NEQUFLOzs7Ozs7c0RBQ25CLDhEQUFDSTs0Q0FBT0osT0FBTTtzREFBSzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBT3JCLDhEQUFDYTtnQkFBS0MsT0FBTztvQkFBRUMsWUFBWXZDO2dCQUFVOzBCQUFJRjs7Ozs7Ozs7QUFHL0M7R0E3SXdCRDtLQUFBQSIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5uL0RvY3VtZW50cy9HaXRIdWIvU1NMT0pfR2FtZS9jb21wb25lbnRzL0xheW91dFdyYXBwZXIudHN4Il0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGNsaWVudFwiOyAvLyBEaXJlY3RpdmUgcG91ciBpbmRpcXVlciBxdWUgY2UgY29tcG9zYW50IGVzdCB1biBjb21wb3NhbnQgY2xpZW50LXNpZGVcblxuaW1wb3J0IFJlYWN0LCB7IHVzZVJlZiwgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBMYXlvdXRXcmFwcGVyKHsgY2hpbGRyZW4gfTogeyBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlIH0pIHtcbiAgY29uc3QgaGVhZGVyUmVmID0gdXNlUmVmPEhUTUxFbGVtZW50PihudWxsKTtcbiAgY29uc3QgW29mZnNldFRvcCwgc2V0T2Zmc2V0VG9wXSA9IHVzZVN0YXRlKDApO1xuICBjb25zdCBbYWN0aXZlTGluaywgc2V0QWN0aXZlTGlua10gPSB1c2VTdGF0ZTxzdHJpbmc+KFwiXCIpO1xuICBjb25zdCBbbGFuZ3VhZ2UsIHNldExhbmd1YWdlXSA9IHVzZVN0YXRlPHN0cmluZz4oXCJGUlwiKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGhhbmRsZVVybENoYW5nZSA9ICgpID0+IHtcbiAgICAgIHNldEFjdGl2ZUxpbmsod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKTtcbiAgICB9O1xuICAgIGhhbmRsZVVybENoYW5nZSgpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9wc3RhdGVcIiwgaGFuZGxlVXJsQ2hhbmdlKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb3BzdGF0ZVwiLCBoYW5kbGVVcmxDaGFuZ2UpO1xuICAgIH07XG4gIH0sIFtdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChoZWFkZXJSZWYuY3VycmVudCkge1xuICAgICAgc2V0T2Zmc2V0VG9wKGhlYWRlclJlZi5jdXJyZW50Lm9mZnNldEhlaWdodCk7XG4gICAgfVxuICB9LCBbXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyBTdG9ja2VyIGxhIGxhbmd1ZSBzw6lsZWN0aW9ubsOpZSBkYW5zIGxvY2FsU3RvcmFnZVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibGFuZ1wiLCBsYW5ndWFnZSk7XG4gIH0sIFtsYW5ndWFnZV0pO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbjxoZWFkZXJcbiAgcmVmPXtoZWFkZXJSZWZ9XG4gIGNsYXNzTmFtZT1cImZpeGVkIHRvcC0wIGxlZnQtMCB3LWZ1bGwgYmctWyMwYTA5MWNdIHNoYWRvdy1tZCB6LTUwIHB4LTQgdGV4dC13aGl0ZVwiXG4+XG4gIHsvKiAtLS0gTW9iaWxlIGxheW91dCAtLS0gKi99XG4gIDxkaXYgY2xhc3NOYW1lPVwibWQ6aGlkZGVuXCI+XG4gICAgey8qIFJhbmfDqWUgc3Vww6lyaWV1cmUgOiBsb2dvIGNlbnRyw6kgYXZlYyBzw6lsZWN0ZXVyIGRlIGxhbmd1ZSDDoCBkcm9pdGUgKi99XG4gICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBwdC0yIHBiLTJcIj5cbiAgICAgIDxpbWcgc3JjPVwiL2ltYWdlcy9sb2dvLnBuZ1wiIGFsdD1cIkxvZ29cIiBjbGFzc05hbWU9XCJoLTE0XCIgLz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgcmlnaHQtNFwiPlxuICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgY2xhc3NOYW1lPVwiYmctdHJhbnNwYXJlbnQgYm9yZGVyIGJvcmRlci13aGl0ZS8zMCB0ZXh0LXdoaXRlIHRleHQtc20gcHgtMiBweS0xIHJvdW5kZWRcIlxuICAgICAgICAgIHZhbHVlPXtsYW5ndWFnZX1cbiAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldExhbmd1YWdlKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJGUlwiPkZSPC9vcHRpb24+XG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkVOXCI+RU48L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiQ05cIj5DTjwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJKUFwiPkpQPC9vcHRpb24+XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICB7LyogTmF2aWdhdGlvbiBzY3JvbGxhYmxlIGhvcml6b250YWxlbWVudCBlbiBkZXNzb3VzICovfVxuICAgIDxuYXYgY2xhc3NOYW1lPVwiZmxleCBvdmVyZmxvdy14LWF1dG8gc3BhY2UteC00IHNjcm9sbGJhci1oaWRlIHctZnVsbCBqdXN0aWZ5LXN0YXJ0IHB4LTIgcHktM1wiPlxuICAgICAge1tcbiAgICAgICAgeyBocmVmOiBcIi9jaGFyYWN0ZXJzXCIsIGxhYmVsOiBcIlBlcnNvbm5hZ2VzXCIgfSxcbiAgICAgICAgeyBocmVmOiBcIi9hcmF5YXNoaWtpc1wiLCBsYWJlbDogXCJBcmF5YXNoaWtpc1wiIH0sXG4gICAgICAgIHsgaHJlZjogXCIvYXJ0ZWZhY3RzXCIsIGxhYmVsOiBcIkFydGVmYWN0c1wiIH0sXG4gICAgICAgIHsgaHJlZjogXCIvdmVzdGlnZXNcIiwgbGFiZWw6IFwiVmVzdGlnZXNcIiB9LFxuICAgICAgXS5tYXAoKHsgaHJlZiwgbGFiZWwgfSkgPT4ge1xuICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IGFjdGl2ZUxpbmsuc3RhcnRzV2l0aChocmVmKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8YVxuICAgICAgICAgICAga2V5PXtocmVmfVxuICAgICAgICAgICAgaHJlZj17aHJlZn1cbiAgICAgICAgICAgIGNsYXNzTmFtZT17YGZsZXgtc2hyaW5rLTAgcmVsYXRpdmUgZ3JvdXAgdGV4dC1zbSBweC0zIHB5LTEgcm91bmRlZCB0cmFuc2l0aW9uLWFsbCB3aGl0ZXNwYWNlLW5vd3JhcCAke1xuICAgICAgICAgICAgICBpc0FjdGl2ZSA/IFwidGV4dC15ZWxsb3ctNDAwXCIgOiBcInRleHQtd2hpdGUgaG92ZXI6dGV4dC15ZWxsb3ctNDAwXCJcbiAgICAgICAgICAgIH1gfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtsYWJlbH1cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17YGFic29sdXRlIGxlZnQtMS8yIC10cmFuc2xhdGUteC0xLzIgLWJvdHRvbS0wLjUgaC1bMXB4XSByb3VuZGVkLWZ1bGwgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tNTAwIGJnLWdyYWRpZW50LXRvLXIgZnJvbS1bIzBhMDkxY10gdmlhLXllbGxvdy00MDAgdG8tWyMwYTA5MWNdICR7XG4gICAgICAgICAgICAgICAgaXNBY3RpdmVcbiAgICAgICAgICAgICAgICAgID8gXCJ3LTE0IG9wYWNpdHktMTAwXCJcbiAgICAgICAgICAgICAgICAgIDogXCJ3LTAgZ3JvdXAtaG92ZXI6dy0xNCBncm91cC1ob3ZlcjpvcGFjaXR5LTEwMCBvcGFjaXR5LTBcIlxuICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9hPlxuICAgICAgICApO1xuICAgICAgfSl9XG4gICAgPC9uYXY+XG4gIDwvZGl2PlxuXG4gIHsvKiAtLS0gRGVza3RvcCBsYXlvdXQgLS0tICovfVxuICA8ZGl2IGNsYXNzTmFtZT1cImhpZGRlbiBtZDpmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gaC1bODBweF0gcHgtNlwiPlxuICAgIHsvKiBOYXZpZ2F0aW9uIMOgIGdhdWNoZSAqL31cbiAgICA8bmF2IGNsYXNzTmFtZT1cImZsZXggc3BhY2UteC0yXCI+XG4gICAgICB7W1xuICAgICAgICB7IGhyZWY6IFwiL2NoYXJhY3RlcnNcIiwgbGFiZWw6IFwiUGVyc29ubmFnZXNcIiB9LFxuICAgICAgICB7IGhyZWY6IFwiL2FyYXlhc2hpa2lzXCIsIGxhYmVsOiBcIkFyYXlhc2hpa2lzXCIgfSxcbiAgICAgICAgeyBocmVmOiBcIi9hcnRlZmFjdHNcIiwgbGFiZWw6IFwiQXJ0ZWZhY3RzXCIgfSxcbiAgICAgICAgeyBocmVmOiBcIi92ZXN0aWdlc1wiLCBsYWJlbDogXCJWZXN0aWdlc1wiIH0sXG4gICAgICBdLm1hcCgoeyBocmVmLCBsYWJlbCB9KSA9PiB7XG4gICAgICAgIGNvbnN0IGlzQWN0aXZlID0gYWN0aXZlTGluay5zdGFydHNXaXRoKGhyZWYpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxhXG4gICAgICAgICAgICBrZXk9e2hyZWZ9XG4gICAgICAgICAgICBocmVmPXtocmVmfVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgcmVsYXRpdmUgZ3JvdXAgdGV4dC1tIHB4LTMgcHktMSByb3VuZGVkIHRyYW5zaXRpb24tYWxsICR7XG4gICAgICAgICAgICAgIGlzQWN0aXZlID8gXCJ0ZXh0LXllbGxvdy00MDBcIiA6IFwidGV4dC13aGl0ZSBob3Zlcjp0ZXh0LXllbGxvdy00MDBcIlxuICAgICAgICAgICAgfWB9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2xhYmVsfVxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgYWJzb2x1dGUgbGVmdC0xLzIgLXRyYW5zbGF0ZS14LTEvMiAtYm90dG9tLTAuNSBoLVsxcHhdIHJvdW5kZWQtZnVsbCB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi01MDAgYmctZ3JhZGllbnQtdG8tciBmcm9tLVsjMGEwOTFjXSB2aWEteWVsbG93LTQwMCB0by1bIzBhMDkxY10gJHtcbiAgICAgICAgICAgICAgICBpc0FjdGl2ZVxuICAgICAgICAgICAgICAgICAgPyBcInctMTQgb3BhY2l0eS0xMDBcIlxuICAgICAgICAgICAgICAgICAgOiBcInctMCBncm91cC1ob3Zlcjp3LTE0IGdyb3VwLWhvdmVyOm9wYWNpdHktMTAwIG9wYWNpdHktMFwiXG4gICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2E+XG4gICAgICAgICk7XG4gICAgICB9KX1cbiAgICA8L25hdj5cblxuICAgIHsvKiBMb2dvIGNlbnRyw6kgKi99XG4gICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBsZWZ0LTEvMiB0cmFuc2Zvcm0gLXRyYW5zbGF0ZS14LTEvMlwiPlxuICAgICAgPGltZyBzcmM9XCIvaW1hZ2VzL2xvZ28ucG5nXCIgYWx0PVwiTG9nb1wiIGNsYXNzTmFtZT1cImgtMTVcIiAvPlxuICAgIDwvZGl2PlxuXG4gICAgey8qIFPDqWxlY3RldXIgZGUgbGFuZ3VlIMOgIGRyb2l0ZSAqL31cbiAgICA8ZGl2PlxuICAgICAgPHNlbGVjdFxuICAgICAgICBjbGFzc05hbWU9XCJiZy10cmFuc3BhcmVudCBib3JkZXIgYm9yZGVyLXdoaXRlLzMwIHRleHQtd2hpdGUgdGV4dC1zbSBweC0yIHB5LTEgcm91bmRlZFwiXG4gICAgICAgIHZhbHVlPXtsYW5ndWFnZX1cbiAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRMYW5ndWFnZShlLnRhcmdldC52YWx1ZSl9XG4gICAgICA+XG4gICAgICAgIDxvcHRpb24gdmFsdWU9XCJGUlwiPkZSPC9vcHRpb24+XG4gICAgICAgIDxvcHRpb24gdmFsdWU9XCJFTlwiPkVOPC9vcHRpb24+XG4gICAgICAgIDxvcHRpb24gdmFsdWU9XCJDTlwiPkNOPC9vcHRpb24+XG4gICAgICAgIDxvcHRpb24gdmFsdWU9XCJKUFwiPkpQPC9vcHRpb24+XG4gICAgICA8L3NlbGVjdD5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L2hlYWRlcj5cblxuICAgICAgey8qIENvbnRlbnUgcHJpbmNpcGFsIGF2ZWMgdW4gcGFkZGluZyBlbiBmb25jdGlvbiBkZSBsYSBoYXV0ZXVyIGR1IGhlYWRlciAqL31cbiAgICAgIDxtYWluIHN0eWxlPXt7IHBhZGRpbmdUb3A6IG9mZnNldFRvcCB9fT57Y2hpbGRyZW59PC9tYWluPlxuICAgIDwvPlxuICApO1xufSJdLCJuYW1lcyI6WyJSZWFjdCIsInVzZVJlZiIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwiTGF5b3V0V3JhcHBlciIsImNoaWxkcmVuIiwiaGVhZGVyUmVmIiwib2Zmc2V0VG9wIiwic2V0T2Zmc2V0VG9wIiwiYWN0aXZlTGluayIsInNldEFjdGl2ZUxpbmsiLCJsYW5ndWFnZSIsInNldExhbmd1YWdlIiwiaGFuZGxlVXJsQ2hhbmdlIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiY3VycmVudCIsIm9mZnNldEhlaWdodCIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJoZWFkZXIiLCJyZWYiLCJjbGFzc05hbWUiLCJkaXYiLCJpbWciLCJzcmMiLCJhbHQiLCJzZWxlY3QiLCJ2YWx1ZSIsIm9uQ2hhbmdlIiwiZSIsInRhcmdldCIsIm9wdGlvbiIsIm5hdiIsImhyZWYiLCJsYWJlbCIsIm1hcCIsImlzQWN0aXZlIiwic3RhcnRzV2l0aCIsImEiLCJzcGFuIiwibWFpbiIsInN0eWxlIiwicGFkZGluZ1RvcCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./components/LayoutWrapper.tsx\n"));

/***/ })

});