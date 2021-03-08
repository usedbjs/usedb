(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{112:function(e,t,r){"use strict";r.d(t,"a",(function(){return b})),r.d(t,"b",(function(){return d}));var n=r(0),a=r.n(n);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=a.a.createContext({}),u=function(e){var t=a.a.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},b=function(e){var t=u(e.components);return a.a.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},m=a.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,i=e.originalType,o=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),b=u(r),m=n,d=b["".concat(o,".").concat(m)]||b[m]||p[m]||i;return r?a.a.createElement(d,l(l({ref:t},c),{},{components:r})):a.a.createElement(d,l({ref:t},c))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=r.length,o=new Array(i);o[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:n,o[1]=l;for(var c=2;c<i;c++)o[c]=r[c];return a.a.createElement.apply(null,o)}return a.a.createElement.apply(null,r)}m.displayName="MDXCreateElement"},71:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return o})),r.d(t,"metadata",(function(){return l})),r.d(t,"toc",(function(){return s})),r.d(t,"default",(function(){return u}));var n=r(3),a=r(7),i=(r(0),r(112)),o={id:"faq",title:"FAQ's"},l={unversionedId:"faq",id:"faq",isDocsHomePage:!1,title:"FAQ's",description:"How is it different from GraphQL?",source:"@site/docs/faq.md",slug:"/faq",permalink:"/usedb/docs/faq",version:"current",sidebar:"someSidebar",previous:{title:"Relationships",permalink:"/usedb/docs/laravel/relationships"}},s=[],c={toc:s};function u(e){var t=e.components,r=Object(a.a)(e,["components"]);return Object(i.b)("wrapper",Object(n.a)({},c,r,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,Object(i.b)("strong",{parentName:"p"},"How is it different from GraphQL?")),Object(i.b)("p",null,"GraphQL is a specification, useDB is more like a utility built on existing tools to make data fetching simpler."),Object(i.b)("p",null,"Below points might be helpful to list the differences."),Object(i.b)("p",null,"useDB has two layers. Client and Server side."),Object(i.b)("p",null,Object(i.b)("strong",{parentName:"p"},"Client side")),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("p",{parentName:"li"},"useDB client provides a client-side data fetching and caching library for React."),Object(i.b)("p",{parentName:"li"},Object(i.b)("strong",{parentName:"p"},"Is it like Apollo Client?")),Object(i.b)("ul",{parentName:"li"},Object(i.b)("li",{parentName:"ul"},"Kind of, but supports REST or any backend."),Object(i.b)("li",{parentName:"ul"},"Normalized caching is optional, if you specify the incoming response structure, it will be saved in the normalized cache, or else falls back to a standard cache.")),Object(i.b)("p",{parentName:"li"},Object(i.b)("strong",{parentName:"p"},"So, Is it like React Query?")),Object(i.b)("ul",{parentName:"li"},Object(i.b)("li",{parentName:"ul"},"Kind of, but has a normalized cache to make updates easier."),Object(i.b)("li",{parentName:"ul"},"Has similar refetching APIs."),Object(i.b)("li",{parentName:"ul"},"Shares same notion of stale while revalidate.")),Object(i.b)("p",{parentName:"li"},Object(i.b)("strong",{parentName:"p"},"Ugh, so is it like Firestore or Datastore Amplify?")),Object(i.b)("ul",{parentName:"li"},Object(i.b)("li",{parentName:"ul"},"useDB can be hosted on a custom backend and can be used with any form of APIs (as long as it's not HotWire \ud83d\ude0f)"),Object(i.b)("li",{parentName:"ul"},"There is no support for real time subscriptions in useDB yet.")),Object(i.b)("p",{parentName:"li"},"In simple words, useDB client is a platform-agnostic data fetching library with an ",Object(i.b)("strong",{parentName:"p"},"optional")," normalized cache."))),Object(i.b)("p",null,Object(i.b)("strong",{parentName:"p"},"Server side")),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},"useDB is built on top of existing ORMs like eloquent for laravel or sequelize for NodeJS."),Object(i.b)("li",{parentName:"ul"},"No support for custom resolvers yet.")),Object(i.b)("p",null,Object(i.b)("strong",{parentName:"p"},"Is it like Hasura?")),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},"Similar to Hasura, it supports selective fetching/updation and role based access."),Object(i.b)("li",{parentName:"ul"},"Authorization can be specified via Gates/Middlewares."),Object(i.b)("li",{parentName:"ul"},"It simply allows ORMs to resolve by restricting their access.")),Object(i.b)("p",null,Object(i.b)("strong",{parentName:"p"},"Is it like Nexus?")),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},"Yes, just like nexus, useDB makes data fetching on Data model layer simpler."),Object(i.b)("li",{parentName:"ul"},"But there are additional features, as stated in above answers.")),Object(i.b)("p",null,Object(i.b)("strong",{parentName:"p"},"How do you ensure the security?")),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},"User can apply restrictions through authorization."),Object(i.b)("li",{parentName:"ul"},"Any resource only becomes accessible once whitelisted via middlewares or Policies.")),Object(i.b)("p",null,Object(i.b)("strong",{parentName:"p"},"Can I use laravel-usedb independently?")),Object(i.b)("p",null,"Yes, you can use it with any front-end. You only need to make sure that mandatory fields required by laravel-usedb should be present in your request."))}u.isMDXComponent=!0}}]);