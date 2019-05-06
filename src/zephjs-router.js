// (c) 2019, The Awesome Engineering Company, https://awesomeneg.com

import {ZephComponents,ZephUtils,html,css,attribute,onAdd,onCreate,onAttribute} from "./Zeph.js";

ZephComponents.define("zephjs-route",()=>{
	html("<slot></slot>");

	attribute("match","");
	attribute("against","url");
	// attribute("selected",undefined);
	attribute("default",undefined);
	attribute("lazy",undefined);

	onAttribute("selected",(oldValue,newValue,element)=>{
		let lazy = element.getAttribute("lazy") || null;
		if (lazy) {
			element.removeAttribute("lazy");

			new Promise(async (resolve,reject)=>{
				try {
					let content = await ZephUtils.fetchText(lazy);
					if (content) element.innerHTML = content;

					resolve();
				}
				catch (ex) {
					return reject(ex);
				}
			});
		}
	});
});

ZephComponents.define("zephjs-router",()=>{
	html(`
		<slot></slot>
	`);
	css(`
		:host {
			display: block;
		}

		:host ::slotted(*) {
			display: none;
		}

		:host ::slotted(zephjs-route) {
			display: none;
		}

		:host ::slotted(zephjs-route[selected]) {
			display: block;
		}
	`);

	onCreate((element,content)=>{
		window.addEventListener("hashchange",()=>{
			stateChange(element,content);
		});
	});

	onAdd((element,content)=>{
		stateChange(element,content);
	});

	const stateChange = function stateChange(element) {
		let routes = element.querySelectorAll("zephjs-route");

		let found = [...routes].reduce((found,route)=>{
			if (found) return found;
			let against = route.hasAttribute("against") ? route.getAttribute("against") : "path" || "path";

			let actual = null;
			if (against==="hash") actual = document.location.hash && document.location.hash.slice(1) || "";
			else if (against==="search") actual = document.location.hash && document.location.hash.slice(1) || "";
			else if (against==="url") actual = document.location.href;
			else if (against==="href") actual = document.location.href;
			else if (against==="path") actual = document.location.pathname;
			else if (against==="pathname") actual = document.location.pathname;
			else if (against==="port") actual = document.location.port;
			else if (against==="protocol") actual = document.location.protocol;
			else if (against==="origin") actual = document.location.origin;
			else if (against==="host") actual = document.location.host;
			else if (against==="hostname") actual = document.location.hostname;
			else return null;

			let match = route.hasAttribute("match") ? route.getAttribute("match") : null || null;
			let ew = match.endsWith("*");
			let sw = match.startsWith("*");

			if (match===null || match===undefined || match==="") return null;
			if (match==="*") return route;
			else if (ew && !sw && actual.startsWith(match.slice(0,-1))) return route;
			else if (!ew && sw && actual.endsWith(match.slice(1))) return route;
			else if (ew && sw && actual.indexOf(match.slice(1,-1))) return route;
			else if (actual===match) return route;

			return null;
		},false);

		if (!found) found = element.querySelector("zephjs-route[default]") || routes[0];
		if (found) {
			routes.forEach((route)=>{
				route.removeAttribute("selected");
				if (route===found) route.setAttribute("selected","");
			});
		}
	};

});
