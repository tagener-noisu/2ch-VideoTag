// ==UserScript==
// @name        2ch-VideoTag
// @namespace   org.noisu
// @include     https://2ch.hk/*/res/*
// @version     1
// @grant       none
// ==/UserScript==

// Copyright (C) 2016  tagener-noisu<op4.renegat@gmail.com>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

var createElement = function(tag, props) {
	if (!tag) throw TypeError("Tag name is undefined");
	var res = document.createElement(tag);
	if (props) {
		var keys = Object.keys(props);
		for (var i in keys)
			res[keys[i]] = props[keys[i]];
	}
	return res;
}

var Resources = {
	webm_icon: "http://i.imgur.com/cv5AuEu.png"
};

var VideoTags = {
	init: function() {
		this.replaceTags();
		var obs = new MutationObserver(function (unused) {
			VideoTags.replaceTags();
		});
		obs.observe(document.querySelector('.thread'), {
			childList: true
		});
	},

	replaceTags: function() {
		var links = document.querySelectorAll('a[href$=".webm"]');
		for (var i = 0, len = links.length; i < len; ++i) {
			var post = links[i].parentNode;
			post.removeChild(links[i]);

			var images = post.parentNode.querySelector('.images');
			if (images)
				images.classList.remove('images-single');
			else {
				images = createElement('div', {
					className: 'images images-single'
				});
				post.parentNode.insertBefore(images, post);
			}

			this._appendPreview(images, links[i].href);
		}
	},

	_appendPreview(node, url) {
		node.appendChild(this._genHtmlEl(url));
	},

	_genHtmlEl: function(url) {
		var uid = url.match(/[^\/]+\.webm$/);
		if (!uid)
			return;
		uid = uid[0].replace('.', '-');
		return this._genPreview(url, uid);
	},

	_genPreview: function(url, uid) {
		var res = document.createElement('figure');
		res.className = "image";
		res.append(this._genFileAttr(url, uid));

		var exlink = createElement('div', {
			id: "exlink-" + uid,
			className: "image-link"
		});

		var expand_a = createElement('a', {
			target: "_blank",
			name: "expandfunc",
			href: url,
		});

		expand_a.addEventListener('click', function(e) {
			expand(uid, url, Resources.webm_icon,
				      800, 600, 200, 200);
			e.preventDefault();
		}, false);
		var prev_img = createElement('img', {
			src: Resources.webm_icon,
			alt: "webm file",
			className: "img preview webm-file",
			width: "100",
			height: "100"
		});
		expand_a.appendChild(prev_img);
		exlink.appendChild(expand_a);
		res.appendChild(exlink);
		return res;
	},

	_genFileAttr: function(url, id) {
		var attr_wrap = document.createElement('figcaption');

		var plain_a = createElement('a', {
			className: "desktop",
			target: "_blank",
			href: url,
			innerHTML: id
		});

		var webm_logo = createElement('img', {
			src: "/makaba/templates/img/webm-logo.png",
			alt: "webm file",
			id: "webm-icon-" + id,
			width: "50px"
		});

		attr_wrap.appendChild(plain_a);
		attr_wrap.appendChild(webm_logo);
		return attr_wrap;
	}
};

document.addEventListener('DOMContentLoaded', VideoTags.init());
// vim:ts=4:sw=0:noet:
