(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{113:function(e,t,r){"use strict";r.d(t,"a",(function(){return p})),r.d(t,"b",(function(){return m}));var n=r(0),o=r.n(n);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=o.a.createContext({}),u=function(e){var t=o.a.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},p=function(e){var t=u(e.components);return o.a.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},b=o.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,a=e.originalType,i=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),p=u(r),b=n,m=p["".concat(i,".").concat(b)]||p[b]||d[b]||a;return r?o.a.createElement(m,s(s({ref:t},l),{},{components:r})):o.a.createElement(m,s({ref:t},l))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var a=r.length,i=new Array(a);i[0]=b;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:n,i[1]=s;for(var l=2;l<a;l++)i[l]=r[l];return o.a.createElement.apply(null,i)}return o.a.createElement.apply(null,r)}b.displayName="MDXCreateElement"},72:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return i})),r.d(t,"metadata",(function(){return s})),r.d(t,"toc",(function(){return c})),r.d(t,"default",(function(){return u}));var n=r(3),o=r(7),a=(r(0),r(113)),i={id:"motivation",title:"Motivation",sidebar_label:"Motivation",slug:"/motivation"},s={unversionedId:"motivation",id:"motivation",isDocsHomePage:!1,title:"Motivation",description:"GraphQL separates database models from client APIs by using resolvers, so your APIs are not tightly coupled with your underlying data model. So, you just define queries, put resolvers and those resolvers can fetch from any backend.",source:"@site/docs/motivation.md",slug:"/motivation",permalink:"/usedb/docs/motivation",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/motivation.md",version:"current",sidebar_label:"Motivation",sidebar:"someSidebar",previous:{title:"Installation",permalink:"/usedb/docs/installation"},next:{title:"Model",permalink:"/usedb/docs/model"}},c=[],l={toc:c};function u(e){var t=e.components,r=Object(o.a)(e,["components"]);return Object(a.b)("wrapper",Object(n.a)({},l,r,{components:t,mdxType:"MDXLayout"}),Object(a.b)("p",null,"GraphQL separates database models from client APIs by using resolvers, so your APIs are not tightly coupled with your underlying data model. So, you just define queries, put resolvers and those resolvers can fetch from any backend."),Object(a.b)("p",null,Object(a.b)("strong",{parentName:"p"},"But here're the limitations:")),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"GraphQL increases complexity for general use-cases."),Object(a.b)("li",{parentName:"ul"},"Performance issues with nested resolvers, if not set up correctly) (n+1 issue, needs DataLoader to fix)")),Object(a.b)("p",null,Object(a.b)("strong",{parentName:"p"},"Why useDB ?")),Object(a.b)("ol",null,Object(a.b)("li",{parentName:"ol"},"Simplifies Access control."),Object(a.b)("li",{parentName:"ol"},"No need to setup resolvers. ORM already knows how to resolve. Just restrict the access of ORM."),Object(a.b)("li",{parentName:"ol"},"No n+1 issue as findMany will directly execute on ORM.")))}u.isMDXComponent=!0}}]);