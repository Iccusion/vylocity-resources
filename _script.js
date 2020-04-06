
var topOffset = 51;
var pageName = '';
var sideSelect = '';
var isLocal = 0;

var parentColon = ['notes', 'general', 'global', 'functions', 'operations'];
var parentSlash = ['Object', 'Diob', 'Movable', 'Particle', 'Tile', 'Region', 'Mob', 'Overlay', 'Sound', 'Interface', 'Client'];
var parentDot = ['World', 'JS', 'Math', 'Date', 'Resource', 'Util', 'Event', 'File', 'Icon', 'Map', 'Macro', 'Type'];

window.onload = function() {
	if (location.search) {
		var params = location.search.substring(1).split('&');
		if (params.includes('ide=1')) {
			document.getElementById('top_bar_iframe').contentWindow.document.getElementById('logo_link').setAttribute('target', '_blank');
			document.getElementById('top_bar_iframe').contentWindow.document.getElementById('doc_link').href += '?ide=1';
			document.getElementById('top_bar_iframe').contentWindow.document.getElementById('tut_link').href += '?ide=1';
			if (window.location.pathname.includes('tutorials')) {
				var el = document.getElementById('side_bar_iframe').contentWindow.document.getElementById('side_bar');
				for (var i = 0, len = el.children.length; i < len; i ++) {
					el.children[i].href += '?ide=1';
				}
			}
			if (window.location.protocol === 'file:') {
				isLocal = window.location.href.substring(0, window.location.href.length - 31);
			}
		}
	}
	setWindowSize();
	findCodeStyle(document.getElementById('example_code'));
	findCodeStyle(document.getElementById('tutorial_content'));
	setSideBar(1);
};

window.onresize = function() {
	setWindowSize();
};
window.onmessage = function(pEvent) {
	var data = pEvent.data.split('=');
	if (data[0] === 'doc') doc(data[1], 1);
	else if (data[0] === 'side_load') {
		if (window.location.pathname.includes('tutorials')) return;
		var child = document.getElementById('side_bar_iframe').contentWindow;
		child.searchNodes = [];
		var elements = child.document.querySelector('#side_bar').querySelectorAll('a');
		for (var i = 0, len = elements.length; i < len; i ++) {
			var el = elements[i];
			var o = {'name': el.innerText.trim(), 'click': el.getAttribute('onclick'), 'tags': el.getAttribute('data-tags').split(',')};
			var parentName = el.id.split('_')[1];
			if (parentName !== o.name) {
				if (parentColon.includes(parentName)) o.name = parentName + ':' + o.name;
				else if (parentSlash.includes(parentName)) o.name = parentName + '/' + o.name;
				else if (parentDot.includes(parentName)) o.name = parentName + '.' + o.name;
			}
			child.searchNodes.push(o);
		}
	}
};

function setSideBar(pSkip, pLink) {
	var s = (pLink || window.location.pathname).split('/');
	pageName = s.pop();
	pageName = pageName.substring(0, pageName.indexOf('.'));
	if (s[s.length - 2] === 'docs' || s[s.length - 2] === 'tutorials') pageName = s[s.length - 1] + '_' + pageName;
	var side = document.getElementById('side_bar_iframe').contentWindow.document.getElementById('side_' + pageName);
	if (side) {
		if (side.className) side.className = side.className + ' selected';
		side.style.pointerEvents = 'none';
		sideSelect = side;
	}
	document.getElementById('side_bar_iframe').contentWindow.sideBarLoad(pageName.split('_')[0]);
	if (!pSkip) sideSelect.scrollIntoViewIfNeeded(true);
};

function setWindowSize() {
	var d = document.getElementById('side_bar_iframe');
	d.style.height = (window.innerHeight - topOffset) + 'px';
	d = document.getElementById('content_body');
	d.style.height = (window.innerHeight - topOffset) + 'px';
};

function doc(pPage, pSkip) {
	var side = document.getElementById('side_bar_iframe');
	if (side && side.contentWindow.searchResults) {
		side.contentWindow.endSearchResults();
	}
	var req = new XMLHttpRequest();
	var link = ((isLocal)? isLocal : '') + '/resources/docs/' + pPage + '.html';
	document.getElementById('content_body').innerHTML = '<div id="content_loader">Loading...</div>';
	req.onreadystatechange = function (pErr) { 
		if (req.readyState === 4 && (req.status === 200 || req.status === 0)) {
			if (sideSelect) {
				sideSelect.style.pointerEvents = 'auto';
				sideSelect.className = sideSelect.className.substring(0, sideSelect.className.length - 9);
			}
			document.title = req.responseText.substring(req.responseText.indexOf('<title>') + 7, req.responseText.indexOf('</title>'));
			if (!isLocal) {
				history.pushState({}, '', link);
				setSideBar(pSkip);
			} else setSideBar(pSkip, link);
			document.getElementById('content_body').innerHTML = req.responseText.substring(req.responseText.indexOf('<div id="content_body">') + 23, req.responseText.length - 38);
			findCodeStyle(document.getElementById('example_code'))
		}
	}
	req.open('GET', link, true);
	req.send();
};

var webCodeM;
new WebCodeManager();

function WebCodeManager() {
	webCodeM = this;
	webCodeM.textWidth = 8;
	if (navigator.userAgent.match(/Firefox/i)) webCodeM.textWidth2 = 8;
	else webCodeM.textWidth2 = 7.14063;
	webCodeM.lineHeight = 17;
	webCodeM.tabSize = 4;
	webCodeM.tabSymbol = '&ensp;';
	webCodeM.symbolCodes = {' ': '<span class="line_code_space" style="width: 7px;">&nbsp;</span>', '(': '(', '{': '{', '}': '}', '<': '&lt;', '>': '&gt;', '.': '.', '/': '/', ';': ';', ')': ')', ',': ',', '"': '&#34;', '!': '!', '[': '[', ']': ']', ':': ':'};
	webCodeM.keywords = {'default': ['World', 'JS', 'Math', 'Date', 'Util', 'Map', 'File', 'Icon', 'Macro', 'Type', 'Resource', 'Event', 'Diob', 'Movable', 'Mob', 'Obj', 'Particle', 'Overlay', 'Tile', 'Region', 'Client', 'Sound', 'Interface', 'undefined', 'null', 'NaN', 'none', 'true', 'false', 'function', 'command', 'override', 'return', 'this', 'if', 'spawn', 'thread', 'else', 'for', 'foreach', 'while', 'do', 'break', 'continue', 'in', 'var', 'new', 'del', 'arguments', 'retVal', 'switch', 'case', 'default'], ' ': ['undefined', 'arguments', 'retVal', 'null', 'NaN', 'none', 'true', 'false', 'function', 'command', 'override', 'return', 'this', 'if', 'spawn', 'thread', 'else', 'for', 'foreach', 'while', 'in', 'var', 'new', 'del', 'World', 'Diob', 'Movable', 'Mob', 'Obj', 'Particle', 'Overlay', 'Tile', 'Region', 'Client', 'Sound', 'Interface', 'inherit', 'switch', 'case', 'default'], '(': ['if', 'spawn', 'thread', 'for', 'foreach', 'while', 'return', 'function', 'switch'], '{': [], '.': ['World', 'JS', 'this', 'Math', 'Date', 'Util', 'Map', 'File', 'Icon', 'Macro', 'Type', 'Resource', 'Event', 'retVal'], '/': ['Diob', 'Movable', 'Mob', 'Obj', 'Particle', 'Overlay', 'Overlay', 'Client', 'Sound', 'Tile', 'Region', 'Interface', 'function', 'command', 'override'], ';': ['World', 'JS', 'undefined', 'arguments', 'retVal', 'null', 'NaN', 'none', 'true', 'false', 'this', 'Math', 'Date', 'Util', 'Map', 'File', 'Icon', 'Macro', 'Type', 'Resource', 'Event'], ')': ['World', 'JS', 'Math', 'Date', 'Util', 'Map', 'File', 'Icon', 'Macro', 'Type', 'Resource', 'Event', 'undefined', 'arguments', 'retVal', 'null', 'NaN', 'none', 'true', 'false', 'this', 'default'], ',': ['World', 'JS', 'Diob', 'Movable', 'Mob', 'Obj', 'Particle', 'Overlay', 'Tile', 'Region', 'Client', 'Sound', 'Interface', 'Math', 'Date', 'Util', 'Map', 'File', 'Icon', 'Macro', 'Type', 'Resource', 'Event', 'undefined', 'arguments', 'retVal', 'null', 'NaN', 'none', 'true', 'false', 'this'], '!': [], '[': ['World', 'JS', 'Math', 'Date', 'Util', 'Map', 'File', 'Icon', 'Macro', 'Resource', 'Type', 'Event', 'undefined', 'arguments', 'retVal', 'null', 'NaN', 'none', 'true', 'false', 'this', 'inherit'], ']': ['this', 'true', 'false', 'undefined', 'null', 'NaN', 'none', 'Diob', 'Movable', 'Mob', 'Obj', 'Particle', 'Overlay', 'Tile', 'Region', 'Sound', 'Interface'], '}': ['this', 'true', 'false', 'undefined', 'arguments', 'retVal', 'null', 'NaN', 'none'], ':': ['default']}
	webCodeM.numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
	webCodeM.numbersMid = ['.', 'e', 'x', 'a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F'];
	webCodeM.numbersStart = [' ', '=', ';', '{', '}', ',', '*', '+', '-', '%', '!', '(', ')', '[', ']', '#', '^', ':', '?', '<', '>', '/', '&', '\t', '\t\s'];
	webCodeM.numbersEnd = [' ', '=', ';', '{', '}', ',', '*', '+', '-', '%', '!', '(', ')', '[', ']', '#', '^', ':', '?', '<', '>', '/', '&'];
	webCodeM.symbols = {'=': '=', ';': ';', '{': '{', '}': '}', ',': ',', '*': '*', '+': '+', '-': '-', '%': '%', '!': '!', '(': '(', ')': ')', '[': '[', ']': ']', '#': '#', '^': '^', ':': ':', '?': '?', '<': '<', '>': '>', '"': '"', '\'': '\'', '.': '.', '/': '/'};
}

function WebCodeBox() {
	this.lineCount = 0;
	this.lineText = [];
}
WebCodeBox.prototype.addLine = function(pFrom, pText) {
	var n = (pFrom) ? pFrom : this.lineCount;
	var line = document.createElement('div');
	//line.className = 'line_code' + ((n % 2) ? ' even_line' : ' odd_line');
	line.className = 'line_code';
	if (this.hlLine === this.lineCount + 1) line.style.backgroundColor = 'rgba(74, 88, 118, 0.4)';
	line.style.height = webCodeM.lineHeight + 'px';
	if (n != this.lineCount) {
		this.lineCodeCol.insertBefore(line, this.lineCodeCol.childNodes[n - 1].nextSibling);
		this.lineText.splice(n, 0, '');
		/*for (var i = n, len = this.lineText.length; i < len; i ++) {
			this.lineCodeCol.childNodes[i].className = 'line_code' + ((i % 2) ? ' even_line' : ' odd_line');
		}*/
	} else {
		this.lineCodeCol.appendChild(line);
		this.lineText.push('');
	}
	
	this.lineCount ++;
	var num = document.createElement('div');
	num.className = 'line_num';
	num.style.height = webCodeM.lineHeight + 'px;';
	num.textContent = this.lineCount;
	this.lineNumCol.appendChild(num);
	if (pText) this.setLineText(line, n + 1, pText);
	return line;
};
WebCodeBox.prototype.setLineText = function(pLine, pNum, pText) {
	if (!pText) pText = '';
	var h = '';
	var word = ''
	var last = '';
	var inNum = 0;
	var inComment = false;
	var multiComment = false;
	var commentNext = false;
	var inString = 0;
	var multiString = false;
	var inTag = false;
	var tSize = 0;
	var pastTabs = false;
	if (pNum > 1) {
		var above = pLine.parentNode.childNodes[Array.prototype.indexOf.call(pLine.parentNode.childNodes, pLine) - 1];
		if (above.inString) {
			inString = above.inString;
			multiString = true;
		}
		if (above.inComment) {
			inComment = above.inComment;
			commentNext = true;
			multiComment = true;
		}
	}
	for (var i = 0, len = pText.length; i < len; i ++) {
		var c = pText[i];
		tSize += webCodeM.textWidth;
		if (inTag && c !== "\n" && c !== "\r") {
			last = c;
			if (c === "\t") {
				tSize -= webCodeM.textWidth;
				var s = (webCodeM.textWidth * (webCodeM.tabSize - ((tSize / webCodeM.textWidth) % webCodeM.tabSize)));
				tSize += s;
				c = '<span class="line_code_tab" style="width: ' + s + 'px;">' + c + '</span>';
			} else if (c === ' ') c = webCodeM.symbolCodes[c];
			word += c;
			continue;
		}
		if (inNum && !webCodeM.numbers[c] && webCodeM.numbersMid.indexOf(c) === -1) {
			if (c !== '+' || i >= pText.length - 2 || pText[i + 1] !== 'e' || !webCodeM.numbers[pText[i + 2]]) {
				inNum = 0;
				word += '</span>';
			}
		}
		if (multiString && c !== "\t") {
			word += '<span class="line_code_string">';
			multiString = false;
		}
		if (multiComment && c !== "\t") {
			word += '<span class="line_code_comment">';
			multiComment = false;
		}
		if (!i && c === '#') {
			if (inComment) h += '</span>';
			if (inString) h += '</span>';
			inTag = true;
			word = '<span class="line_code_tag">' + c;
			last = c;
			continue;
		}
		if (c === "\n" || c === "\r") {
			var ch = (inString || inComment) ? false : this.checkKeyword(word, 'default');
			if (ch) h += ch;
			else h += word;
			this.lineText[pNum - 1] = pText.substring(0, i);
			if (inNum || inString || inComment || inTag) h += '</span>';
			pLine.innerHTML = h;
			if (inComment && !commentNext) inComment = false;
			this.checkRefreshLineBelow(pLine, pNum, inComment, inString);
			this.addLine(pNum, pText.substring(i + 1, pText.length));
			return;
		} else if (inComment) {
			if (c === '<') c = '&lt;';
			else if (c === '>') c = '&gt;';
			else if (c === "\t") {
				tSize -= webCodeM.textWidth;
				var s = (webCodeM.textWidth * (webCodeM.tabSize - ((tSize / webCodeM.textWidth) % webCodeM.tabSize)));
				tSize += s;
				c = '<span class="line_code_tab" style="width: ' + s + 'px; opacity: 1;">' + webCodeM.tabSymbol + '</span>';
			}
			word += c;
			if (c === "/" && commentNext && pText[i - 1] === "*" && pText[i - 2] !== "/") {
				inComment = false;
				commentNext = false;
				word += '</span>';
			}
			last = c;
			continue;
		} else if (c === "\t") {
			tSize -= webCodeM.textWidth;
			var tS = webCodeM.tabSize * webCodeM.textWidth;
			var ch = this.checkKeyword(word, 'default');
			if (ch) word = ch;
			if (pastTabs) {
				c = '\t\s';
				var s = (webCodeM.textWidth * (webCodeM.tabSize - ((tSize / webCodeM.textWidth) % webCodeM.tabSize)));
				tSize += s;
				h += word + '<span class="line_code_tab" style="width: ' + s + 'px; opacity: 1;">' + webCodeM.tabSymbol + '</span>';
			} else {
				tSize += tS;
				h += word + '<span class="line_code_tab_s" style="width: ' + tS + 'px; opacity: 1;">' + webCodeM.tabSymbol + '</span>';
			}
			word = '';
		} else if (c === "/" && !inString && (pText[i + 1] === "/" || pText[i + 1] === "*")) {
			inComment = true;
			if (pText[i + 1] === "*") commentNext = true;
			word = word.substring(0, word.length) + ('<span class="line_code_comment">/');
		} else if (c === "<" || c === ">") {
			h += (word + webCodeM.symbolCodes[c]);
			word = '';
		} else if (webCodeM.keywords[c]) {
			var ch = (inString) ? false : this.checkKeyword(word, c);
			if (ch) {
				h += (ch + webCodeM.symbolCodes[c]);
			} else {
				h += (word + webCodeM.symbolCodes[c]);
			}
			word = '';
		} else if (webCodeM.numbers[c] && !inString) {
			if (!inNum && (!last || webCodeM.numbersStart.indexOf(last) != -1)) { 
				inNum = 1;
				word += '<span class="line_code_num">';
			}
			word += c;
		} else if (c === "'" || c === "\"" || c === "`") {
			if (inString) {
				word += c;
				if (inString == c) {
					var strCont = true
					if (pText[i - 1] === '\\') {
						var strContC = 2;
						while (i - strContC >= 0 && pText[i - strContC] === '\\') strContC ++;
						if ((strContC - 1) % 2) strCont = false;
					}
					if (strCont) {
						word += '</span>';
						inString = 0;
					}
				}
			} else {
				word += ('<span class="line_code_string">' + c);
				inString = c;
			}
		} else if (i === pText.length - 1) {
			var ch = (inString || inComment) ? false : this.checkKeyword(word + c, 'default');
			if (ch) {
				h += ch;
				word = '';
			} else {
				word += c;
			}
		} else if (webCodeM.symbols[c]) {
			h += word + c;
			word = '';
		} else {
			word += c;
		}
		last = c;
		if (!pastTabs && c !== '\t') pastTabs = true;
	}
	if (word) h += word;
	if (inNum || inString || inComment || inTag) h += '</span>';
	if (inComment && !commentNext) inComment = false;
	pLine.innerHTML = h;
	this.lineText[pNum - 1] = pText;
	this.checkRefreshLineBelow(pLine, pNum, inComment, inString);
};
WebCodeBox.prototype.checkRefreshLineBelow = function(pLine, pNum, pComment, pString, pBelow) {
	if (pString || pComment) {
		pLine.inString = pString;
		pLine.inComment = pComment;
	} else {
		delete pLine.inString;
		delete pLine.inComment;
	}
};
WebCodeBox.prototype.checkKeyword = function(pWord, pC) {
	var h = ''
	if (webCodeM.keywords[pC].indexOf(pWord) != -1) {
		h += '<span class="line_code_keyword">' + pWord + '</span>';
	}
	return h;
}

function findCodeStyle(pEl) {
	if (!pEl) return;
	var arr = Array.prototype.slice.call(pEl.childNodes);
	arr.forEach(function(pEl) {
		if (pEl.tagName === 'CODE') {
			var text = pEl.innerHTML;
			pEl.innerHTML = '';
			var b = new WebCodeBox();
			b.hlLine = parseInt(pEl.getAttribute('hl'));
			if (isNaN(b.hlLine)) b.hlLine = 0;
			b.lineNumCol = document.createElement('div');
			b.lineNumCol.className = 'line_num_column';
			pEl.appendChild(b.lineNumCol);
			b.lineCodeCol = document.createElement('div');
			b.lineCodeCol.className = 'line_code_column';
			pEl.appendChild(b.lineCodeCol);
			b.addLine(0, text.replace(/<br\s*[\/]?>/gi, '\n'));
		}
	});
}