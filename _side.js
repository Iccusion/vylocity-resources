
var searchResults = '';

window.onload = function() {
	var tags = document.getElementsByClassName('plus');
	for (var i = tags.length; i --;) {
		var t = tags[i];
		t.onclick = clickPlusMinus;
	}
	var search = document.getElementById('side_bar_search_input');
	if (search) search.focus();
	parent.postMessage('side_load');
};

function sideBarLoad(pCat) {
	var b = document.getElementById('plus_' + pCat);
	if (b) b.className = 'minus';
	refreshSideBar(1, pCat);
};
function refreshSideBar(pT, pCat) {
	var e = document.getElementById('side_bar');
	for (var i = 0, len = e.childNodes.length; i < len; i ++) {
		var n = e.childNodes[i];
		if (n.tagName === 'A') {
			if (n.id.indexOf('side_' + pCat + '_') === 0) {
				n.style.display = (pT)? 'block' : 'none';
			} else if ((n.childNodes.length > 2 && n.className && n.className.indexOf('indent') === -1) || n.style.display === 'block') {
				n.style.display = 'block';
			}
		} else if (n.className && n.className.indexOf('side_bar_row_divider') === 0 && pCat && n.id.indexOf('side_' + pCat) === 0) {
			n.style.display = (pT)? 'block' : 'none';
		}
	}
};
function doc(pPage) {
	parent.postMessage('doc=' + pPage);
};

function checkSearchKey(pEvent) {
	if (pEvent.key === 'Enter' || pEvent.key === 'Escape') document.getElementById('side_bar_search_input').blur();
	if (!document.getElementById('side_bar_search_input').value.length) {
		endSearchResults();
		return;
	} else {
		document.getElementById('side_bar_search_label').style.display = 'none';
		document.getElementById('side_bar_search_icon').style.display = 'none';
		document.getElementById('side_bar_search_clear').style.display = 'block';
	}
	if (pEvent.key === 'Enter') {
		search();
	} else if (pEvent.key === 'Escape') {
		endSearchResults();
		document.getElementById('side_bar_search_input').blur();
	} else {
		search();
	}
};
function search() {
	var query = document.getElementById('side_bar_search_input').value;
	query = query.toLowerCase().replace(/[^a-z0-9]+/gi, '');
	searchResults = [];
	var html = '';
	for (var i = 0, len = searchNodes.length; i < len; i ++) {
		var node = searchNodes[i];
		if (node.tags[0].startsWith(query)) {
			searchResults.push(node);
			html += '<a onclick="' + node.click + '" class="side_bar_row">' + node.name + '</a>';
		}
	}
	for (var i = 0, len = searchNodes.length; i < len; i ++) {
		var node = searchNodes[i];
		if (node.tags[0].includes(query) && !searchResults.includes(node)) {
			searchResults.push(node);
			html += '<a onclick="' + node.click + '" class="side_bar_row">' + node.name + '</a>';
		}
	}
	
	var add = '';
	for (var i = 0, len = searchNodes.length; i < len; i ++) {
		var node = searchNodes[i];
		for (var i2 = 1, len2 = node.tags.length; i2 < len2; i2 ++) {
			if (node.tags[i2].startsWith(query) && !searchResults.includes(node)) {
				searchResults.push(node);
				add += '<a onclick="' + node.click + '" class="side_bar_row">' + node.name + '</a>';
			}
		}
	}
	for (var i = 0, len = searchNodes.length; i < len; i ++) {
		var node = searchNodes[i];
		for (var i2 = 1, len2 = node.tags.length; i2 < len2; i2 ++) {
			if (node.tags[i2].includes(query) && !searchResults.includes(node)) {
				searchResults.push(node);
				add += '<a onclick="' + node.click + '" class="side_bar_row">' + node.name + '</a>';
			}
		}
	}
	
	if (add) html += '<div class="side_bar_row_divider"></div>' + add;
	
	var el = document.getElementById('side_bar_search_results');
	el.style.display = 'block';
	el.innerHTML = html;
	var el = document.getElementById('side_bar_search_title');
	el.style.display = 'block';
};
function endSearchResults(pEvent) {
	searchResults = '';
	document.getElementById('side_bar_search_input').value = '';
	document.getElementById('side_bar_search_title').style.display = 'none';
	document.getElementById('side_bar_search_results').style.display = 'none';
	document.getElementById('side_bar_search_label').style.display = 'block';
	document.getElementById('side_bar_search_icon').style.display = 'block';
	document.getElementById('side_bar_search_clear').style.display = 'none';
	if (pEvent) {
		document.getElementById('side_bar_search_input').focus();
		pEvent.preventDefault();
	}
};

function clickPlusMinus(pEvent) {
	var cat = pEvent.target.id.split('_').pop();
	var e = document.getElementById('side_bar');
	if (pEvent.target.className === 'plus') {
		pEvent.target.className = 'minus';
		refreshSideBar(1, cat);
	} else {
		pEvent.target.className = 'plus';
		refreshSideBar(0, cat);
	}
	pEvent.preventDefault();
	pEvent.stopPropagation();
};