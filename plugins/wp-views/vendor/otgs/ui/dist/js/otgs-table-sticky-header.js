var otgsSwitcher=otgsSwitcher||{};otgsSwitcher.otgsPopoverTooltip=otgsSwitcher.otgsPopoverTooltip||{},otgsSwitcher.otgsPopoverTooltip.otgsTableStickyHeader=function(e){var t={};function i(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,i),n.l=!0,n.exports}return i.m=e,i.c=t,i.d=function(e,t,o){i.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},i.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=2)}([function(e,t){!function(e,t,i){"use strict";var o="stickyTableHeaders",n=0,r={fixedOffset:0,leftOffset:0,marginTop:0,objDocument:document,objHead:"head",objWindow:t,scrollableArea:t,cacheHeaderHeight:!1,zIndex:3};e.fn[o]=function(i){return this.each(function(){var a=e.data(this,"plugin_"+o);a?"string"==typeof i?a[i].apply(a):a.updateOptions(i):"destroy"!==i&&e.data(this,"plugin_"+o,new function(i,a){var l=this;l.$el=e(i),l.el=i,l.id=n++,l.$el.bind("destroyed",e.proxy(l.teardown,l)),l.$clonedHeader=null,l.$originalHeader=null,l.cachedHeaderHeight=null,l.isSticky=!1,l.hasBeenSticky=!1,l.leftOffset=null,l.topOffset=null,l.init=function(){l.setOptions(a),l.$el.each(function(){var t=e(this);t.css("padding",0),l.$originalHeader=e("thead:first",this),l.$clonedHeader=l.$originalHeader.clone(),t.trigger("clonedHeader."+o,[l.$clonedHeader]),l.$clonedHeader.addClass("tableFloatingHeader"),l.$clonedHeader.css({display:"none",opacity:0}),l.$originalHeader.addClass("tableFloatingHeaderOriginal"),l.$originalHeader.after(l.$clonedHeader),l.$printStyle=e('<style type="text/css" media="print">.tableFloatingHeader{display:none !important;}.tableFloatingHeaderOriginal{position:static !important;}</style>'),l.$head.append(l.$printStyle)}),l.$clonedHeader.find("input, select").attr("disabled",!0),l.updateWidth(),l.toggleHeaders(),l.bind()},l.destroy=function(){l.$el.unbind("destroyed",l.teardown),l.teardown()},l.teardown=function(){l.isSticky&&l.$originalHeader.css("position","static"),e.removeData(l.el,"plugin_"+o),l.unbind(),l.$clonedHeader.remove(),l.$originalHeader.removeClass("tableFloatingHeaderOriginal"),l.$originalHeader.css("visibility","visible"),l.$printStyle.remove(),l.el=null,l.$el=null},l.bind=function(){l.$scrollableArea.on("scroll."+o,l.toggleHeaders),l.isWindowScrolling||(l.$window.on("scroll."+o+l.id,l.setPositionValues),l.$window.on("resize."+o+l.id,l.toggleHeaders)),l.$scrollableArea.on("resize."+o,l.toggleHeaders),l.$scrollableArea.on("resize."+o,l.updateWidth)},l.unbind=function(){l.$scrollableArea.off("."+o,l.toggleHeaders),l.isWindowScrolling||(l.$window.off("."+o+l.id,l.setPositionValues),l.$window.off("."+o+l.id,l.toggleHeaders)),l.$scrollableArea.off("."+o,l.updateWidth)},l.debounce=function(e,t){var i=null;return function(){var o=this,n=arguments;clearTimeout(i),i=setTimeout(function(){e.apply(o,n)},t)}},l.toggleHeaders=l.debounce(function(){l.$el&&l.$el.each(function(){var t,i,n,r=e(this),a=l.isWindowScrolling?isNaN(l.options.fixedOffset)?l.options.fixedOffset.outerHeight():l.options.fixedOffset:l.$scrollableArea.offset().top+(isNaN(l.options.fixedOffset)?0:l.options.fixedOffset),s=r.offset(),d=l.$scrollableArea.scrollTop()+a,c=l.$scrollableArea.scrollLeft(),f=l.isWindowScrolling?d>s.top:a>s.top;f&&(i=l.options.cacheHeaderHeight?l.cachedHeaderHeight:l.$clonedHeader.height(),n=(l.isWindowScrolling?d:0)<s.top+r.height()-i-(l.isWindowScrolling?0:a)),f&&n?(t=s.left-c+l.options.leftOffset,l.$originalHeader.css({position:"fixed","margin-top":l.options.marginTop,top:0,left:t,"z-index":l.options.zIndex}),l.leftOffset=t,l.topOffset=a,l.$clonedHeader.css("display",""),l.isSticky||(l.isSticky=!0,l.updateWidth(),r.trigger("enabledStickiness."+o)),l.setPositionValues()):l.isSticky&&(l.$originalHeader.css("position","static"),l.$clonedHeader.css("display","none"),l.isSticky=!1,l.resetWidth(e("td,th",l.$clonedHeader),e("td,th",l.$originalHeader)),r.trigger("disabledStickiness."+o))})},0),l.setPositionValues=l.debounce(function(){var e=l.$window.scrollTop(),t=l.$window.scrollLeft();!l.isSticky||e<0||e+l.$window.height()>l.$document.height()||t<0||t+l.$window.width()>l.$document.width()||l.$originalHeader.css({top:l.topOffset-(l.isWindowScrolling?0:e),left:l.leftOffset-(l.isWindowScrolling?0:t)})},0),l.updateWidth=l.debounce(function(){if(l.isSticky){l.$originalHeaderCells||(l.$originalHeaderCells=e("th,td",l.$originalHeader)),l.$clonedHeaderCells||(l.$clonedHeaderCells=e("th,td",l.$clonedHeader));var t=l.getWidth(l.$clonedHeaderCells);l.setWidth(t,l.$clonedHeaderCells,l.$originalHeaderCells),l.$originalHeader.css("width",l.$clonedHeader.width()),l.options.cacheHeaderHeight&&(l.cachedHeaderHeight=l.$clonedHeader.height())}},0),l.getWidth=function(i){var o=[];return i.each(function(i){var n,r=e(this);if("border-box"===r.css("box-sizing")){var a=r[0].getBoundingClientRect();n=a.width?a.width:a.right-a.left}else if("collapse"===e("th",l.$originalHeader).css("border-collapse"))if(t.getComputedStyle)n=parseFloat(t.getComputedStyle(this,null).width);else{var s=parseFloat(r.css("padding-left")),d=parseFloat(r.css("padding-right")),c=parseFloat(r.css("border-width"));n=r.outerWidth()-s-d-c}else n=r.width();o[i]=n}),o},l.setWidth=function(e,t,i){t.each(function(t){var o=e[t];i.eq(t).css({"min-width":o,"max-width":o})})},l.resetWidth=function(t,i){t.each(function(t){var o=e(this);i.eq(t).css({"min-width":o.css("min-width"),"max-width":o.css("max-width")})})},l.setOptions=function(t){l.options=e.extend({},r,t),l.$window=e(l.options.objWindow),l.$head=e(l.options.objHead),l.$document=e(l.options.objDocument),l.$scrollableArea=e(l.options.scrollableArea),l.isWindowScrolling=l.$scrollableArea[0]===l.$window[0]},l.updateOptions=function(e){l.setOptions(e),l.unbind(),l.bind(),l.updateWidth(),l.toggleHeaders()},l.init()}(this,i))})}}(jQuery,window)},function(e,t,i){"use strict";!function(e){e&&e.__esModule}(i(0));window.addEventListener("DOMContentLoaded",function(){var e=document.querySelectorAll(".js-otgs-table-sticky-header"),t={fixedOffset:jQuery("#wpadminbar")};e.forEach(function(e){jQuery(e).stickyTableHeaders(t).on("enabledStickiness.stickyTableHeaders",function(){e.getElementsByClassName("tableFloatingHeaderOriginal")[0].style.background="rgba(255,255,255,.8)"})})})},function(e,t,i){e.exports=i(1)}]);