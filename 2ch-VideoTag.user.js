// ==UserScript==
// @name        2ch-VideoTag
// @namespace   org.noisu
// @include     https://2ch.hk/*/res/*
// @version     1
// @grant       none
// ==/UserScript==

/*
    Copyright (C) 2016  tagener-noisu<op4.renegat@gmail.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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
	},

	replaceTags: function() {
		var m = document.querySelectorAll('.post-message');
		var regex = /\[video\]<a href="([^"]+.webm)"[^[]+\[\/video\](<br>)?/;

		for (var i = 0, len = m.length; i < len; ++i) {
			var urls = [];
			var url = null;
			var h = m[i].innerHTML;
			while (url = h.match(regex)) {
				urls.push(url[1]);
				h = h.replace(regex, '');
			}
			if (urls.length < 1) continue;
			m[i].innerHTML = h;

			var wrap = m[i].parentNode.querySelector('.images');
			if (!wrap) {
				wrap = document.createElement('div');
				if (urls.length == 1)
					wrap.className = "images images-single";
				else
					wrap.className = "images";
				m[i].parentNode.insertBefore(wrap, m[i]);
			}
			this._appendPreviews(wrap, urls);
		}
	},

	_appendPreviews(node, urls) {
		if (node.childNodes.length > 0)
			node.classList.remove('images-single');
		var prevs = this._genHtmlEl(urls);
		for (var i in prevs)
			node.appendChild(prevs[i]);
	},

	_genHtmlEl: function(urls) {
		var prevs = [];
		for (var i = 0, len = urls.length; i < len; ++i) {
			var uid = urls[i].match(/[^\/]+\.webm$/);
			if (!uid)
				continue;
			uid = uid[0].replace('.', '-');
			prevs.push(this._genPreview(urls[i], uid));
		}

		return prevs;
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

//unsafeWindow.VideoTags = VideoTags;

document.addEventListener('DOMContentLoaded', VideoTags.init());

/*
<div class="images images-single">
											
	<figure class="image ">
		<figcaption class="file-attr">
			<a class="desktop" target="_blank" href="http://webm.land/media/tYM8.webm">webm.land/media/tYM8.webm</a> 
			<img src="/makaba/templates/img/webm-logo.png" alt="webm file" id="webm-icon-1422975-be49178cea69b5fa3e925ab06c7f8c2c" width="50px"> 
		</figcaption>
		<div id="exlink-tYM8" class="image-link">
			<a href="http://webm.land/media/tYM8.webm" target="_blank" name="expandfunc" onclick="return expand('tYm8','http://webm.land/media/tYM8.webm','http://webm.land/media/thumbnails/tYM8.jpeg',1920,1080,200,200)">
				<img src="http://webm.land/media/thumbnails/tYM8.jpeg" alt="1920x1080" class="img preview webm-file " width="200">
			</a>
		</div>
	</figure>
</div>
*/
