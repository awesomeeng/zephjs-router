// (c) 2019, The Awesome Engineering Company, https://awesomeneg.com

import {ZephComponents,html,css,attribute,onAdd,onCreate} from "./Zeph.js";


ZephComponents.define("zephjs-router-route",()=>{
	html("<slot></slot>");

	attribute("match","");
	attribute("against","url");
	attribute("selected",undefined);
	attribute("default",undefined);
});

ZephComponents.define("zephjs-router",()=>{
	html("./zephjs-router.html");
	css("./zephjs-router.css");

	onCreate((element,content)=>{
		window.addEventListener("hashchange",()=>{
			stateChange(element,content);
		});
	});

	onAdd((element,content)=>{
		stateChange(element,content);
	});

	const stateChange = function stateChange(element) {
		let routes = element.querySelectorAll("zephjs-router-route");

		let found = [...routes].reduce((found,route)=>{
			if (found) return found;
			let against = route.hasAttribute("against") ? route.getAttribute("against") : "path" || "path";

			let actual = null;
			if (against==="hash") actual = document.location.hash && document.location.hash.slice(1) || "";
			else if (against==="search") actual = document.location.hash && document.location.hash.slice(1) || "";
			else if (against==="url") actual = document.location.pathname;
			else if (against==="href") actual = document.location.pathname;
			else if (against==="path") actual = document.location.pathname;
			else if (against==="pathname") actual = document.location.pathname;
			else if (against==="port") actual = document.location.pathname;
			else if (against==="protocol") actual = document.location.pathname;
			else if (against==="origin") actual = document.location.pathname;
			else if (against==="host") actual = document.location.pathname;
			else if (against==="hostname") actual = document.location.pathname;
			else if (against==="search") actual = document.location.pathname;
			else return null;

			let match = route.hasAttribute("match") ? route.getAttribute("match") : "*" || "*";
			let ew = match.endsWith("*");
			let sw = match.startsWith("*");

			if (match==="*") return route;
			else if (ew && !sw && actual.startsWith(match.slice(0,-1))) return route;
			else if (!ew && sw && actual.endsWith(match.slice(1))) return route;
			else if (ew && sw && actual.indexOf(match.slice(1,-1))) return route;
			else if (actual===match) return route;

			return null;
		},false);

		if (!found) found = element.querySelector("zephjs-router-route[default]") || routes[0];
		if (found) {
			routes.forEach((route)=>{
				if (route===found) route.setAttribute("selected","");
				else route.removeAttribute("selected");
			});
		}
	};

});
