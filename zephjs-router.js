/*

The following is a ZephJS Component Bundle and includes the ZephJS Library.
ZephJS is copyright 2018-PRESENT, by The Awesome Engineering Company, inc.
and is released publically under the MIT License. Any usage of the ZephJS
library must included this license heading, the copyright notice, and
a reference to the Zephjs website.

For more details about ZephJS, please visit https://zephjs.com

*/

(function () {
	'use strict';

	const $COMPONENTS=Symbol("components"),$SERVICES=Symbol("services"),$CONTEXT=Symbol("context"),$CODE=Symbol("code"),$ELEMENT=Symbol("element"),$SHADOW=Symbol("shadow"),$OBSERVER=Symbol("observer"),$LISTENERS=Symbol("listeners"),$PROXY=Symbol("proxy");let CODE_CONTEXT=null,PENDING={},FIREREADY=null,READY=!1;const IDENTITY_FUNCTION=t=>t,check={not:{undefined:(t,e)=>{if(void 0===t)throw new Error("Undefined "+e+".")},null:(t,e)=>{if(null===t)throw new Error("Null "+e+".")},uon:(t,e)=>{check.not.undefined(t,e),check.not.null(t,e);},empty:(t,e)=>{if("string"==typeof t&&""===t)throw new Error("Empty "+e+".")}},type:(t,e,n)=>{if(typeof t!==e)throw new Error("Invalid "+n+"; must be a "+e+".")},string:(t,e)=>{check.type(t,"string",e);},posstr:(t,e)=>{check.not.uon(t,e),check.string(t,e),check.not.empty(t,e);},number:(t,e)=>{check.type(t,"number",e);},boolean:(t,e)=>{check.type(t,"string",e);},function:(t,e,n)=>{if(!(t instanceof Function))throw new Error("Invalid "+n+"; must be a Function.")},array:(t,e,n)=>{if(!(t instanceof Array))throw new Error("Invalid "+n+"; must be an Array.")}},utils={ready:()=>READY,tryprom:t=>(check.not.uon(t,"argument"),check.function(t,"argument"),new Promise((e,n)=>{try{t(e,n);}catch(t){return n(t)}})),exists:t=>null==t||""===t?Promise.resolve(!1):utils.tryprom(async e=>{(await fetch(t,{method:"HEAD"})).ok?e(!0):e(!1);}),fetch:t=>(check.not.uon(t,"url"),check.not.empty(t,"url"),utils.tryprom(async e=>{let n=await fetch(t);if(n.ok)return e(n);e(void 0);})),fetchText:t=>(check.not.uon(t,"url"),check.not.empty(t,"url"),utils.tryprom(async e=>{let n=await utils.fetch(t);n||e(void 0),e(await n.text());})),resolve:(t,e=document.URL)=>{if(check.not.uon(t,"url"),check.not.empty(t,"url"),!(t instanceof URL)&&"string"!=typeof t)throw new Error("Invalid url; must be a string or URL.");try{return "string"==typeof t&&t.startsWith("data:")?new URL(t):new URL(t,e)}catch(t){return null}},resolveName:(t,e=document.URL,n=".js")=>(""+t).match(/^http:\/\/|^https:\/\/|^ftp:\/\/|^\.\/|^\.\.\//)?utils.tryprom(async i=>{let o=utils.resolve(t,e);if(await utils.exists(o))return i(o);if(await utils.exists(t))return i(t);if(n){let o=t+n,r=utils.resolve(o,e);if(await utils.exists(r))return i(r);if(await utils.exists(o))return i(o)}i(void 0);}):Promise.resolve(void 0)};class ZephComponent{constructor(t,e,n){check.posstr(t,"name"),check.posstr(t,"origin"),check.not.uon(n,"code"),check.function(n,"code");let i={};i.name=t,i.origin=e,this[$CODE]=n,this[$CONTEXT]=i,this[$ELEMENT]=null;}get context(){return this[$CONTEXT]}get name(){return this.context.name}get origin(){return this.context.origin}get code(){return this[$CODE]}get defined(){return !!this[$ELEMENT]}get customElementClass(){return this[$ELEMENT]}define(){return utils.tryprom(async t=>{let e=new ZephComponentExecution(this.context,this.code);if(await e.run(),await Promise.all(this.context.pending||[]),this.context.from){let t=ZephComponents.get(this.context.from);if(!t)throw new Error("Component '"+this.context.from+"' not found; inheritence by '"+this.context.name+"' is not possible.");await Promise.all(t.pending||[]),this[$CONTEXT]=extend({},t.context,this.context);}this[$ELEMENT]=ZephElementClass.generateClass(this.context),customElements.define(this.name,this[$ELEMENT]),fire(this.context&&this.context.lifecycle&&this.context.lifecycle.init||[],this.name,this),t();})}}class ZephComponentExecution{constructor(t,e){check.not.uon(t,"context"),check.not.uon(e,"code"),check.function(e,"code"),this[$CONTEXT]=t,this[$CODE]=e;}run(){return utils.tryprom(async t=>{CODE_CONTEXT=this,await this[$CODE].bind(this)(),CODE_CONTEXT=null,t();})}get context(){return this[$CONTEXT]}from(t){check.posstr(t,"fromTagName"),this.context.pending=this.context.pending||[],this.context.pending.push(ZephComponents.waitFor(t)),this.context.from=t;}html(t,e={}){e=Object.assign({overwrite:!1,noRemote:!1},e||{});let n=utils.tryprom(async n=>{if(!e.noRemote){let e=await utils.resolveName(t,this.context.origin||document.URL.toString(),".html");e&&(t=await utils.fetchText(e));}this.context.html=this.context.html||[],this.context.html.push({content:t,options:e}),n();});this.context.pending=this.context.pending||[],this.context.pending.push(n);}css(t,e={}){e=Object.assign({overwrite:!1,noRemote:!1},e||{});let n=utils.tryprom(async n=>{if(!e.noRemote){let e=await utils.resolveName(t,this.context.origin,".css");e&&(t=await utils.fetchText(e));}this.context.css=this.context.css||[],this.context.css.push({content:t,options:e}),n();});this.context.pending=this.context.pending||[],this.context.pending.push(n);}attribute(t,e){if(check.not.uon(t,"attributeName"),check.string(t),this.context.attributes=this.context.attributes||{},this.context.attributes[t])throw new Error("Attribute '"+t+"' already defined for custom element; cannot have multiple definitions.");this.context.attributes[t]={attributeName:t,initialValue:e};}property(t,e,n){if(check.not.uon(t,"propertyName"),check.string(t),this.context.properties=this.context.properties||{},this.context.properties[t])throw new Error("Property '"+t+"' already defined for custom element; cannot have multiple definitions.");this.context.properties[t]=Object.assign(this.context.properties[t]||{},{propertyName:t,initialValue:e,transformFunction:n,changes:[]});}binding(t,e,n,i){return this.bindingAt(".",t,e,n,i)}bindingAt(t,e,n,i,o){if(t&&e&&n&&void 0===i&&(i=e),check.not.uon(t,"sourceElement"),"string"!=typeof t&&!(t instanceof HTMLElement))throw new Error("Invalid sourceElement; must be a string or an instance of HTMLElement.");if(check.not.uon(e,"sourceName"),check.string(e,"sourceName"),!e.startsWith("$")&&!e.startsWith("@")&&!e.startsWith("."))throw new Error("Invalid sourceName; must start with a '$' or a '@' or a '.'.");if(check.not.uon(n,"targetElement"),"string"!=typeof n&&!(n instanceof HTMLElement))throw new Error("Invalid targetElement; must be a string or an instance of HTMLElement.");if(check.not.uon(i,"targetName"),check.string(i,"targetName"),!i.startsWith("$")&&!i.startsWith("@")&&!i.startsWith("."))throw new Error("Invalid targetName; must start with a '$' or a '@' or a '.'.");null==o&&(o=IDENTITY_FUNCTION),check.not.uon(o,"transformFunction"),check.function(o,"transformFunction");let r=t+":"+e+">"+n+":"+i;this.context.bindings=this.context.bindings||{},this.context.bindings[r]={source:{element:t,name:e},target:{element:n,name:i},transform:o};}onInit(t){check.not.uon(t,"listener"),check.function(t,"listener"),this.context.lifecycle=this.context.lifecycle||{},this.context.lifecycle.init=this.context.lifecycle.init||[],this.context.lifecycle.init.push(t);}onCreate(t){check.not.uon(t,"listener"),check.function(t,"listener"),this.context.lifecycle=this.context.lifecycle||{},this.context.lifecycle.create=this.context.lifecycle.create||[],this.context.lifecycle.create.push(t);}onAdd(t){check.not.uon(t,"listener"),check.function(t,"listener"),this.context.lifecycle=this.context.lifecycle||{},this.context.lifecycle.add=this.context.lifecycle.add||[],this.context.lifecycle.add.push(t);}onRemove(t){check.not.uon(t,"listener"),check.function(t,"listener"),this.context.lifecycle=this.context.lifecycle||{},this.context.lifecycle.remove=this.context.lifecycle.remove||[],this.context.lifecycle.remove.push(t);}onAdopt(t){check.not.uon(t,"listener"),check.function(t,"listener"),this.context.lifecycle=this.context.lifecycle||{},this.context.lifecycle.adopt=this.context.lifecycle.adopt||[],this.context.lifecycle.adopt.push(t);}onAttribute(t,e){check.not.uon(t,"attribute"),check.string(t,"attribute"),check.not.uon(e,"listener"),check.function(e,"listener"),this.context.observed=this.context.observed||[],this.context.observed.push(t),this.context.lifecycle=this.context.lifecycle||{},this.context.lifecycle.attributes=this.context.lifecycle.attributes||{},this.context.lifecycle.attributes[t]=this.context.lifecycle.attributes[t]||[],this.context.lifecycle.attributes[t].push(e);}onProperty(t,e){check.not.uon(t,"attribute"),check.string(t,"attribute"),check.not.uon(e,"listener"),check.function(e,"listener"),this.context.properties=this.context.properties||{},this.context.properties[t]||this.property(t,void 0),this.context.properties[t].changes.push(e);}onEvent(t,e){check.not.uon(t,"eventName"),check.string(t,"eventName"),check.not.uon(e,"listener"),check.function(e,"listener"),this.context.events=this.context.events||[],this.context.events.push({eventName:t,listener:e});}onEventAt(t,e,n){check.not.uon(e,"eventName"),check.string(e,"eventName"),check.not.uon(n,"listener"),check.function(n,"listener"),this.context.eventsAt=this.context.eventsAt||[],this.context.eventsAt.push({selector:t,eventName:e,listener:n});}}class ZephElementClass{static generateClass(t){return class extends HTMLElement{static get observedAttributes(){return t&&t.observed||[]}constructor(){super();let e=this;this[$ELEMENT]=e;let n=this.shadowRoot||this.attachShadow({mode:"open"});this[$SHADOW]=n;let i=n.querySelector("style");i=i?i.textContent:"";let o=n.innerHTML;if((t.html||[]).forEach(t=>{let e=t.content;t.options.overwrite?o=e:o+=e;}),n.innerHTML=o,(t.css||[]).forEach(t=>{let e=t.content;t.options.overwrite?i=e:i+=e+"\n";}),i){let t=document.createElement("style");t.textContent=i,n.appendChild(t);}setTimeout(()=>{t.attributes&&Object.values(t.attributes).forEach(t=>{let n=e.hasAttribute(t.attributeName)?e.getAttribute(t.attributeName):t.initialValue;null==n?e.removeAttribute(t.attributeName):e.setAttribute(t.attributeName,t.transformFunction?t.transformFunction(n):n);}),t.properties&&Object.values(t.properties).forEach(t=>{let i=void 0!==e[t.propertyName]?e[t.propertyName]:t.initialValue;propetize(e,t.propertyName,{get:t=>t?t():i,set:(o,r)=>{o=t.transformFunction?t.transformFunction(o):o,r&&(o=r(o)),i=o,(t.changes||[]).forEach(i=>{i(t.propertyName,o,e,n);});}}),e[t.propertyName]=void 0===e[t.propertyName]?t.initialValue:e[t.propertyName];}),fireImmediately(t&&t.lifecycle&&t.lifecycle.create||[],this,this.shadowRoot),t.bindings&&Object.keys(t.bindings).forEach(i=>{let o=t.bindings[i];if(!o)return;"."===o.target.element&&(o.target.element=e);let r=o.source.element;"."===r?r=[e]:"string"==typeof r?r=[...n.querySelectorAll(r)]:r instanceof HTMLElement&&(r=[r]),r.forEach(i=>{let r;if(o.target.name.startsWith("@"))r=(t=>{let e=o.target.name.slice(1);t=o.transform(t),(o.target.element instanceof HTMLElement&&[o.target.element]||[...n.querySelectorAll(o.target.element)]||[]).forEach(n=>{void 0===t?n.removeAttribute(e):n.getAttribute(e)!==t&&n.setAttribute(e,t);});});else if(o.target.name.startsWith("."))r=(t=>{let e=o.target.name.slice(1);t=o.transform(t),(o.target.element instanceof HTMLElement&&[o.target.element]||[...n.querySelectorAll(o.target.element)]||[]).forEach(n=>{void 0===t?delete n[e]:n[e]!==t&&(n[e]=t);});});else{if("$"!==o.target.name)return void console.warn("Unable to handle binding to '"+o.target.name+"'; Must start with '@' or '$' or '.'.");r=(t=>{void 0!==(t=o.transform(t))&&(o.target.element instanceof HTMLElement&&[o.target.element]||[...n.querySelectorAll(o.target.element)]||[]).forEach(e=>{e.textContent!==t&&(e.textContent=null==t?"":t);});});}i[$OBSERVER]||(i[$OBSERVER]=new ZephElementObserver(i),i[$OBSERVER].start());let s=i[$OBSERVER];if(o.source.name.startsWith("@")){let t=o.source.name.slice(1);if(i.hasAttribute(t)){let e=i.getAttribute(t);r(e,t,i);}s.addAttributeObserver(t,r);}else if(o.source.name.startsWith(".")){let i=o.source.name.slice(1);if(t.properties=t.properties||{},!t.properties[i]){t.properties[i]={propertyName:i,changes:[],value:e[i]};let o=t.properties[i];propetize(e,i,{get:t=>t?t():o.value,set:(t,i)=>{let r=o.transformFunction?o.transformFunction(t):t;i&&i(r),o.value=r,(o.changes||[]).forEach(t=>{t(o.propertyName,r,e,n);});}});}let s=t.properties[i];s.changes=s.changes||[],s.changes.push((t,e)=>{r(e);});}else{if("$"!==o.source.name)return void console.warn("Unable to handle binding to '"+o.target.name+"'; Must start with '@' or '$' or '.'.");{let t=i.textContent;r(t,null,i),s.addContentObserver(r);}}});}),t.events&&t.events.forEach(t=>{this.addEventListener(t.eventName,i=>{t.listener.call(e,i,e,n);});}),t.eventsAt&&t.eventsAt.forEach(t=>{[...n.querySelectorAll(t.selector)].forEach(i=>{i.addEventListener(t.eventName,o=>{t.listener.call(i,o,i,e,n);});});});},0);}get element(){return this[$ELEMENT]}get content(){return this[$SHADOW]}connectedCallback(){fire(t&&t.lifecycle&&t.lifecycle.add||[],this,this.shadowRoot);}disconnectedCallback(){fire(t&&t.lifecycle&&t.lifecycle.remove||[],this,this.shadowRoot);}adoptedCallback(){fire(t&&t.lifecycle&&t.lifecycle.adopt||[],this,this.shadowRoot);}attributeChangedCallback(e,n,i){fire(t&&t.lifecycle&&t.lifecycle.attributes&&t.lifecycle.attributes[e]||[],n,i,this,this.shadowRoot);}}}}class ZephElementObserver{constructor(t){if(!t)throw new Error("Missing element.");if(!(t instanceof HTMLElement))throw new Error("Invalid element; must be an instance of HTMLElement.");this.element=t,this.attributes={},this.content=[],this.observer=new MutationObserver(this.handleMutation.bind(this));}addAttributeObserver(t,e){check.not.uon(t,"attribute"),check.string(t,"attribute"),check.not.uon(e,"handler"),check.function(e,"handler"),this.attributes[t]=this.attributes[t]||[],this.attributes[t].push(e);}removeAttributeObserver(t,e){check.not.uon(t,"attribute"),check.string(t,"attribute"),check.not.uon(e,"handler"),check.function(e,"handler"),this.attributes[t]&&(this.attributes[t]=this.attributes[t].filter(t=>t!==e),this.attributes[t].length<1&&delete this.attributes[t]);}removeAllAttributeObservers(t){if(t&&"string"!=typeof t)throw new Error("Invalid attribute; must be a string.");t?delete this.attributes[t]:this.attributes={};}addContentObserver(t){check.not.uon(t,"handler"),check.function(t,"handler"),this.content.push(t);}removeContentObserver(t){check.not.uon(t,"handler"),check.function(t,"handler"),this.content=this.content.filter(e=>e!==t);}removeAllContentObservers(){this.content=[];}start(){this.observer.observe(this.element,{attributes:!0,characterData:!0,childList:!0});}stop(){this.observer.disconnect();}handleMutation(t){t.forEach(t=>{"attributes"===t.type?this.handleAttributeMutation(t):this.handleContentMutation(t);});}handleAttributeMutation(t){let e=t.attributeName;if(!this.attributes[e]||this.attributes[e].length<1)return;let n=this.element.getAttribute(e);this.attributes[e].forEach(t=>{t(n,e,this.element);});}handleContentMutation(){if(this.content.length<1)return;let t=this.element.textContent;this.content.forEach(e=>{e(t,this.element);});}}class ZephComponentsClass{constructor(){this[$COMPONENTS]={},this[$PROXY]=new Proxy(this[$COMPONENTS],{has:(t,e)=>!!t[e],get:(t,e)=>t[e]||void 0,ownKeys:t=>Object.keys(t)}),this[$OBSERVER]=[];}get components(){return this[$PROXY]}get names(){return Object.keys(this[$COMPONENTS])}has(t){return check.posstr(t,"name"),!!this[$COMPONENTS][t]}get(t){return check.posstr(t,"name"),this[$COMPONENTS][t]}waitFor(t){return check.posstr(t,"name"),this[$COMPONENTS][t]?Promise.resolve():new Promise((e,n)=>{this[$OBSERVER].push({name:t,resolve:e,reject:n});})}define(t,e){if(check.posstr(t,"name"),check.not.uon(e,"code"),check.function(e,"code"),this[$COMPONENTS][t])throw new Error("Component already defined.");let n=document.URL.toString(),i=new Error;if(i.fileName&&(n=i.filename),i.stack){for(i=(i=i.stack.split(/\r\n|\n/g)).reverse();i.length>0;){let t=i.shift();if(t&&t.match(/\w+:/g)){i=t=(t=t.trim().replace(/^.*?(?=\w+:)/,"")).replace(/:\d+$|:\d+\)$|:\d+:\d+$|:\d+:\d+\)$/,"");break}}n=i;}return PENDING["component:"+n]=!0,document.dispatchEvent(new CustomEvent("zeph:component:loading",{bubbles:!1,detail:t})),utils.tryprom(async i=>{let o=new ZephComponent(t,n,e);this[$COMPONENTS][t]=o,await o.define(),this[$OBSERVER]=this[$OBSERVER].filter(e=>(e.name===t&&e.resolve(),e.name!==t)),delete PENDING["component:"+n],document.dispatchEvent(new CustomEvent("zeph:component:defined",{bubbles:!1,detail:{name:t,component:o}})),fireZephReady(),i(o);})}undefine(t){check.posstr(t,"name");let e=this[$COMPONENTS][t];e&&(delete this[$COMPONENTS][t],document.dispatchEvent(new CustomEvent("zeph:component:undefined",{bubbles:!1,detail:{name:t,component:e}})));}}class ZephService{constructor(){this[$LISTENERS]=new Map,this.on=this.addEventListener,this.once=((t,e)=>{this.addEventListner(t,(t,...n)=>{this.removeEventListener(t,e),e.apply(e,n);});});}fire(t,...e){(this[$LISTENERS].get(t)||[]).forEach(n=>{setTimeout(()=>{n.apply(n,[t,...e]);},0);});}addEventListener(t,e){let n=this[$LISTENERS].get(t)||[];n.push(e),this[$LISTENERS].set(t,n);}removeEventListener(t,e){let n=this[$LISTENERS].get(t)||[];n=n.filter(t=>t!==e),this[$LISTENERS].set(t,n);}on(t,e){return this.addEventListener(t,e)}once(t,e){return this.addEventListner(t,(t,...n)=>{this.removeEventListener(t,e),e.apply(e,n);})}off(t,e){return this.removeEventListener(t,e)}}class ZephServicesClass{constructor(){this[$SERVICES]={},this[$PROXY]=new Proxy(this[$SERVICES],{has:(t,e)=>!!t[e],get:(t,e)=>t[e]||void 0,ownKeys:t=>Object.keys(t)});}get services(){return this[$PROXY]}get names(){return Object.keys(this[$SERVICES])}has(t){return check.posstr(t,"name"),!!this[$SERVICES][t]}get(t){return check.posstr(t,"name"),this[$SERVICES][t]}register(t,e){if(check.posstr(t,"name"),check.not.uon(e,"service"),!(e instanceof ZephService))throw new Error("Invalid service; must be an instance of ZephService.");if(this[$SERVICES][t])throw new Error("Service already registered.");this[$SERVICES][t]=e,document.dispatchEvent(new CustomEvent("zeph:service:registered",{bubbles:!1,detail:{name:t,service:e}}));}unregister(t){this.get(t)&&(delete this[$SERVICES][t],document.dispatchEvent(new CustomEvent("zeph:service:unregistered",{bubbles:!1,detail:{name:t}})));}}const extend=function t(e,...n){return null==e&&(e={}),n.forEach(n=>{Object.keys(n).forEach(i=>{let o=n[i],r=e[i];void 0!==o&&(null===o?e[i]=null:o instanceof Promise?e[i]=o:o instanceof Function?e[i]=o:o instanceof RegExp?e[i]=o:o instanceof Date?e[i]=new Date(o):o instanceof Array?e[i]=[].concat(r||[],o):e[i]="object"==typeof o?t(r,o):o);});}),e},fire=function(t,...e){(t=t&&!(t instanceof Array)&&[t]||t||[]).forEach(t=>{setTimeout(()=>t.apply(t,e),0);});},fireImmediately=function(t,...e){(t=t&&!(t instanceof Array)&&[t]||t||[]).forEach(t=>t.apply(t,e));},fireZephReady=function(){FIREREADY&&clearTimeout(FIREREADY),FIREREADY=setTimeout(()=>{Object.keys(PENDING).length<1&&(READY=!0,document.dispatchEvent(new CustomEvent("zeph:ready",{bubbles:!1})));},10);},getPropertyDescriptor=function(t,e){for(;;){if(null===t)return null;let n=Object.getOwnPropertyDescriptor(t,e);if(n)return n;t=Object.getPrototypeOf(t);}},propetize=function(t,e,n){check.not.uon(t,"object"),check.not.uon(e,"propertyName"),check.string(e,"propertyName"),check.not.uon(n,"descriptor");let i=getPropertyDescriptor(t,e),o=Object.assign({},i||{},n);return i&&n.get&&(delete o.value,delete o.writable,o.get=(()=>{let t=i.get||null;return n.get(t)})),i&&n.set&&(delete o.writable,o.set=(t=>{let e=i.set||null;return n.set(t,e)})),Object.defineProperty(t,e,o),o},contextCall=function(t){return check.posstr(t,"name"),{[t]:function(){if(!CODE_CONTEXT)throw new Error(t+"() may only be used within the ZephComponent.define() method.");return CODE_CONTEXT[t].apply(CODE_CONTEXT,arguments)}}[t]},from=contextCall("from"),html=contextCall("html"),css=contextCall("css"),attribute=contextCall("attribute"),property=contextCall("property"),bind=contextCall("binding"),bindAt=contextCall("bindingAt"),onInit=contextCall("onInit"),onCreate=contextCall("onCreate"),onAdd=contextCall("onAdd"),onRemove=contextCall("onRemove"),onAdopt=contextCall("onAdopt"),onAttribute=contextCall("onAttribute"),onProperty=contextCall("onProperty"),onEvent=contextCall("onEvent"),onEventAt=contextCall("onEventAt"),ZephComponents=new ZephComponentsClass,ZephServices=new ZephServicesClass;window.Zeph={ZephComponents:ZephComponents,ZephServices:ZephServices,ZephService:ZephService,ZephUtils:utils};

	// (c) 2019, The Awesome Engineering Company, https://awesomeneg.com

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
						let content = await utils.fetchText(lazy);
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
				let against = route.hasAttribute("against") ? route.getAttribute("against") : "path";

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

				let match = route.hasAttribute("match") ? route.getAttribute("match") : null;
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

}());
