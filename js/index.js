"use strict";var debounce=function e(t,r){var n;return function(){var e=this,a=arguments,c=function r(){return t.apply(e,a)};clearTimeout(n),n=setTimeout(c,r)}},mq={small:window.matchMedia("(min-width: 400px)"),medium:window.matchMedia("(min-width: 700px)"),large:window.matchMedia("(min-width: 1000px)")},childIndex=function e(t){return Array.from(t.parentNode.children).indexOf(t)};function getUrlParameter(e){e=e.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var t,r=new RegExp("[\\?&]"+e+"=([^&#]*)").exec(location.search);return null===r?"":decodeURIComponent(r[1].replace(/\+/g," "))}var siteTitle=document.querySelector(".site-title"),cards=document.querySelectorAll(".card"),cardWrapper=document.getElementById("card-wrapper"),closeButton=document.getElementById("close-project"),cardDelay=250,projectCards=[],getProjectByUrl=function e(){return projectCards.filter(function(e){return e.project===getUrlParameter("content")})[0]},getProjectByElement=function e(t){return projectCards.filter(function(e){return e.el===t})[0]},cardHeight,cardScale,gutter;function calculateScale(){cardHeight=mq.medium.matches?480:mq.small.matches?360:300,cardScale=mq.small.matches?.95:.925,gutter=cardWrapper.clientWidth*(1-cardScale)/2}function setWrapperHeight(){var e=cards.length*(cardHeight+gutter);cardWrapper.style.height="".concat(e,"px")}function positionCard(e){var t=childIndex(e),r=document.getElementById("header"),n,a=(r?r.clientHeight:0)+t*cardHeight;e.style.transform="scaleX(".concat(cardScale,") translateY(").concat(a+gutter*t,"px)")}function nextBtnHandler(){console.log("something")}function renderNextLink(e){var t=cards[childIndex(e.el)+1];if(void 0!==t){var r=getProjectByElement(t),n=document.createElement("div");n.classList.add("btn-container"),e.body.appendChild(n);var a=document.createElement("a");a.classList.add("btn-next-project"),a.innerHTML="Next Project",a.href=r.link,a.addEventListener("click",function(e){e.preventDefault(),closeCurrentCard(),openCard(r,!0)}),n.appendChild(a)}}function fetchProjectInfo(e){fetch("./pages/".concat(e.project,".html")).then(function(e){return e.text()}).then(function(t){e.body.innerHTML+=t,renderNextLink(e),setTimeout(function(){e.el.classList.add("content-loaded")},125)}).catch(function(e){console.log("Fetch Error",e)})}function openCard(e,t){if(t){var r={content:e.project};history.pushState(r,"project page",e.link)}e.el.classList.add("expanded","anim-in"),e.el.style.transform="scaleX(1) translateY(".concat(window.pageYOffset,"px)"),e.el.style.top="-".concat(window.pageYOffset,"px"),bodyScrollLock.disableBodyScroll(e.el),setTimeout(function(){e.el.classList.remove("anim-in"),closeButton&&closeButton.classList.add("visible")},cardDelay),e.el.classList.contains("content-loaded")||fetchProjectInfo(e)}function closeCard(e){closeButton&&closeButton.classList.remove("visible"),e.scrollTop=0,e.classList.add("anim-out"),bodyScrollLock.enableBodyScroll(e),positionCard(e),setTimeout(function(){e.classList.remove("expanded","anim-out"),e.style.top="0"},cardDelay)}function closeCurrentCard(){var e;closeCard(document.querySelector(".card.expanded"))}function defaultHistoryState(e){var t={content:"project index"};e?history.pushState(t,document.title,"index.html"):history.replaceState(t,document.title,"index.html")}function ProjectCard(e){var t=this;this.el=e,this.header=e.querySelector(".card-header"),this.body=e.querySelector(".card-body--inner"),this.project=e.getAttribute("id"),this.link=this.header.getAttribute("href"),this.header.addEventListener("click",function(e){e.preventDefault(),t.el.classList.contains("expanded")||openCard(t,!0)})}function setUpCards(){calculateScale(),setWrapperHeight(),getUrlParameter("content")||defaultHistoryState();var e=!0,t=!1,r=void 0;try{for(var n=cards[Symbol.iterator](),a;!(e=(a=n.next()).done);e=!0){var c=a.value,o=new ProjectCard(c);projectCards.push(o),positionCard(c)}}catch(e){t=!0,r=e}finally{try{e||null==n.return||n.return()}finally{if(t)throw r}}}function resetCards(){calculateScale(),setWrapperHeight();var e=!0,t=!1,r=void 0;try{for(var n=cards[Symbol.iterator](),a;!(e=(a=n.next()).done);e=!0){var c=a.value;c.classList.contains("expanded")||positionCard(c)}}catch(e){t=!0,r=e}finally{try{e||null==n.return||n.return()}finally{if(t)throw r}}}var popStateHandler=function e(t){if("project index"===t.state.content)closeCurrentCard();else if(getUrlParameter("content")){var r;closeCurrentCard(),openCard(getProjectByUrl(),!1)}};function pageLoad(){var e;window.location.search&&openCard(getProjectByUrl(),!1)}function homeBtnHandler(e){e.preventDefault(),""!==getUrlParameter("content")?(closeCurrentCard(),defaultHistoryState(!0)):window.location="index.html"}siteTitle.addEventListener("click",homeBtnHandler),window.addEventListener("popstate",popStateHandler),window.addEventListener("load",pageLoad),window.addEventListener("resize",debounce(function(){resetCards()},100)),setUpCards(),setTimeout(function(){cardWrapper.classList.add("visible"),cardWrapper.classList.remove("no-trans")},cardDelay);
//# sourceMappingURL=index.js.map