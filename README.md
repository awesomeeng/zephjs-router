# zephjs-router

A simple router element for targeting portions of your webpage at specific content based on the URL.  Includes support for...

 - Route based on url or url sections such as
	 - host/hostname
	 - path/pathname
	 - hash
	 - search query
	 - and more...
 - Lazy loading of inner content.

Built on top of the [ZephJS Framework](https://github.com/awesomeeng/zephjs).

## Contents
 - [Setup](#setup)
 - [Usage](#usage)
 - [Default Route](#default-route)
 - [Lazy Loading](#lazy-loading)
 - [Examples](#examples)
 - [Awesome Engineering](#the-awesome-engineering-company)
 - [Support and Help](#support-and-help)
 - [License](#license)

## Setup

zephjs-router is available as an npm package:

```shell
npm install zephjs-router
```

Once installed find the `zephjs-router.js` file and copy it into your local project as needed. `zephjs-router.js` is a self contained element and includes a copy of ZephJS within it.  If you are interested in the unbundled version without ZephJS, see the `src/zephjs-router.js` file.

## Usage

Within your HTML file, include the following:

```html
<script src="zephjs-router.js" type="module"></script>
```

Once the script is loaded you can use `<zephjs-rotuer>` anywhere within your HTML content.

```html
<zephjs-router>
	<zephjs-route match="abc" against="hash">
		This matched the ABC hash.
	</zephjs-route>
	<zephjs-route match="def" against="hash">
		This matched the DEF hash.
	</zephjs-route>
</zephjs-router>
```

When loaded on your page, the `zephjs-router.js` script creates two custom elements: `<zephjs-router>` and `<zephjs-route>`.

### `<zephjs-router>`

The `<zephjs-router>` element identifies a section of your webpage as being driven by a router. Within the router, you include zero or more `<zephjs-route>` elements to describe a given route and its content. Each of these routes will only be displayed if the route `match` attribute is met.

> Any content other than `<zephjs-route>` within a `<zephjs-router>` element is not displayed.

> You may use `<zephjs-router>` as many times as you like within you code. Each is an isolated router and works independant of any other router.

### `<zephjs-route>`

The `<zephjs-route>` element is used to identify some content and the rules under which that content is displayed. It has the following structure:

```html
<zephjs-route match="xyz" against="hash">
	... content ...
</zephjs-route>
```

The `match` attribute describes the text test we want to match. There are several different types of matching rules:

 - **`*`**: All match. The match will always be true regardless of the item being matched against (See below).
 - **`text`**: Exact match. The match will be true only if the item being matched against (see below) is exactly the same as the text provided.
 - **`text*`** Starts with match. The match will be true only if the item being matched against (see below) starts with the text provided.
 - **`*text`** Ends with match. The match will be true only if the item being matched against (see below) ends with the text provided.
 - **`*text*`** Contains match. The match will be true only if the item being matched against (see below) contains the text provided.

> If no match attribute is provided, the match will never be true.

The `against` attribute describes what the `match` argument is matching against; that is, what property of the page (usually the url or a part of the url) the `match` expression is compared against.  There are several different options:

 - **`url`**: Matches are compared against the entire url `http://awesomeeng.com:4000/test/blah.html?abc=123#xyz`.
 - **`href`**: Same as `url`.
 - **`hash`**: Matches are compared against the hash portion of the url: `xyz`. Note that the preceeding number sign (#) character is removed prior to comparison.
 - **`path`**: Matches are compared against the path portion of the url: `/test/blah.html`.
 - **`pathname`**: Same as `path`.
 - **`protocol`**: Matches are compared against the protocol portion of the url: `http:`.
 - **`port`**: Matches are compared against the port portion of the url: `4000`. Note that for matching purposes port is treated as a string.
 - **`host`**: Matches are compared against the host portion of the url: `awesomeeng.com:4000`. The host portion is a concatenation of the hostname and port portions.
 - **`hostname`**: Matches are compared against the hostname portion of the url: `awesomeeng.com`.
 - **`origin`**: Matches are compared against the origin portion of the url: `http://awesomeeng.com:4000`. The origion portion is a concatenation of the protocol, hostname, and port portions.
 - **`search`**: Matches are compared against the search/query string of the url: `abc=1223`. Note that the query string is treated as a whole string, not separtated into a query object.

> You may define as many `<zephjs-route>` elements within a `<zephjs-router>` element as you wish.

> If more than one route element matches, only the first match is shown.

The content you provide within `<zephjs-route>` is the HTML that is displayed when the route matches.  If the route does not match, the content is not displayed.

## Default Route

You may specify a `default` route by adding the `default` attribute (with no value) to one of your `<zephjs-route>` elements.  If no route matches, the default is selected.

In the event that no default is provided and no route matches, the first route will be treated as the default.

## Lazy Loading

In all of our above examples our `<zephjs-route>` has contained its content within it. However, especially with large sites, there is a case where you would prefer to load the content within a route only if that route is matched.  This is possible with lazy loading.

To use lazy loading instead of providing content with your `<zephjs-route>` element, you add a `lazy` attribute with the value being the path to the content to load. For example:

```html
<zephjs-route match="abc" against="hash" lazy="./abc.html">
</zephjs-route>
```

When the route is match, ZephJS will go out and load the content specified by the `lazy` attribute, and insert it into the `<zephjs-route>` element.  There after, it will just use that content anytime the route is matched.  (In fact, once the content is loaded, the `lazy` attribute is removed to prevent it from being loaded again.)

## Examples

zephjs-router ships with a set of examples for your reference.

 - [Basic Hash Router Example](./examples/BasicHash/index.html): An example of routing against the url hash.

 - [Lazy Loading Router Example](./examples/LazyLoading/index.html): An example of using Lazy Loading.

## The Awesome Engineering Company

zephjs-router is written and maintained by The Awesome Engineering Company. We believe in building clean, configurable, creative software for engineers and architects and customers.

To learn more about The Awesome Engineering Company and our suite of products, visit us on the web at https://awesomeeng.com.

## Support and Help

## License

zephjs-router is released under the MIT License. Please read the  [LICENSE](./LICENSE) file for details.
