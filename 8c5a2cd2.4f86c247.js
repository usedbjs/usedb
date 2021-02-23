(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{112:function(e,t,n){"use strict";n.d(t,"a",(function(){return s})),n.d(t,"b",(function(){return f}));var r=n(0),a=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=a.a.createContext({}),u=function(e){var t=a.a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},s=function(e){var t=u(e.components);return a.a.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},b=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),s=u(n),b=r,f=s["".concat(i,".").concat(b)]||s[b]||d[b]||o;return n?a.a.createElement(f,l(l({ref:t},p),{},{components:n})):a.a.createElement(f,l({ref:t},p))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=b;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var p=2;p<o;p++)i[p]=n[p];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"},88:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return l})),n.d(t,"toc",(function(){return c})),n.d(t,"default",(function(){return u}));var r=n(3),a=n(7),o=(n(0),n(112)),i={id:"getting-started",title:"Getting Started Laravel",sidebar_label:"Getting Started"},l={unversionedId:"laravel/getting-started",id:"laravel/getting-started",isDocsHomePage:!1,title:"Getting Started Laravel",description:"Introduction",source:"@site/docs/laravel/getting-started.md",slug:"/laravel/getting-started",permalink:"/usedb/docs/laravel/getting-started",version:"current",sidebar_label:"Getting Started",sidebar:"someSidebar",previous:{title:"Todo App",permalink:"/usedb/docs/todo-example"},next:{title:"Usage",permalink:"/usedb/docs/laravel/usage"}},c=[{value:"Introduction",id:"introduction",children:[]},{value:"<strong>Installation</strong>",id:"installation",children:[{value:"Publish the configuration",id:"publish-the-configuration",children:[]},{value:"Set the Model path",id:"set-the-model-path",children:[]}]}],p={toc:c};function u(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("h2",{id:"introduction"},"Introduction"),Object(o.b)("p",null,"Laravel-usedb is a Generic-CRUD composer package for Laravel apps which eliminates the need to write Apis for each and every model in a Laravel app."),Object(o.b)("h2",{id:"installation"},Object(o.b)("strong",{parentName:"h2"},"Installation")),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-bash"}),"#COMPOSER\ncomposer require geekyants/laravel-usedb\n")),Object(o.b)("h3",{id:"publish-the-configuration"},"Publish the configuration"),Object(o.b)("p",null,"After installation, run the command below to move the package's config files to your project config directory."),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-jsx"}),"php artisan vendor:publish --tag=config\n")),Object(o.b)("p",null,"You will find the ",Object(o.b)("inlineCode",{parentName:"p"},"usedb.php")," file in your project config folder. All the configuration to be applied to the package is defined here."),Object(o.b)("h3",{id:"set-the-model-path"},"Set the Model path"),Object(o.b)("p",null,"To make the package track your models, you need to define the path of the folder in the config file where all the models are stored."),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-jsx"}),"'modelPath' => 'App\\Models\\\\'\n")))}u.isMDXComponent=!0}}]);