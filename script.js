let xhr = new XMLHttpRequest(), data, base, sabakoHome = location.toString();

window.onpopstate = function(event) {
	console.debug("Location: " + document.location + ", state: " + JSON.stringify(event.state));
};

var pvm = document.getElementById('productsViewModel'),
	ovm = document.getElementById('optionsViewModel'),
	ivm = document.getElementById('inventoryViewModel'),
	ptr = document.getElementById('productsTransform'),
	mtr = document.getElementById('managementTransform'),
	itr = document.getElementById('inventoryTransform'),
	otr = document.getElementById('optionsTransform'),
	ftr = document.getElementById('footer'),
	rcp = document.getElementsByClassName('receipt')[0];

ovm.style.display = 'none';
ivm.style.display = 'none';
ftr.style.display = 'none';

ptr.addEventListener('click', function(ev){
	history.pushState(null, null, 'new-receipt');
	pvm.style.display = '';
	rcp.style.display = '';
	ftr.style.display = 'none';
	ivm.style.display = 'none';
	ovm.style.display = 'none';
});

itr.addEventListener('click', function(ev){
	history.pushState(null, null, 'new-inventory');
	ivm.style.display = '';
	ftr.style.display = '';
	rcp.style.display = 'none';
	pvm.style.display = 'none';
	ovm.style.display = 'none';
});

otr.addEventListener('click', function(ev){
	history.pushState(null, null, 'configuration');
	ovm.style.display = '';
	ftr.style.display = '';
	rcp.style.display = 'none';
	pvm.style.display = 'none';
	ivm.style.display = 'none';
});


Element.prototype.appendAfter = function (element) {
	element.parentNode.insertBefore(this, element.nextSibling);
}, false;

if (!localStorage.getItem('sabakoPref')) localStorage.setItem('sabakoPref', JSON.stringify({'theme': 'dark', 'density': 0}));

if (document.getElementById('products') != null) {
	xhr.onreadystatechange = function(){
		if (xhr.readyState === xhr.DONE && xhr.status === 200) {
			base = JSON.parse(localStorage.getItem('sabakoPref'));
			data = JSON.parse(xhr.responseText);

			for (let i = 0; i < data.length; i++) {
				let c = document.createElement('div'),
					p = document.createElement('img'),
					t =	document.createElement('span'),
					d =	document.createElement('span');

				c.setAttribute('onclick', `order(${i}, this)`);
				c.setAttribute('id', `p${i}`);

				p.setAttribute('class', 'image');
				p.setAttribute('src', 'assets/images/products/' + data[i].img);

				t.setAttribute('class', 'title');
				t.append(data[i].name);

				d.setAttribute('class', 'description');
				d.append(data[i].price);

				c.appendChild(p);
				c.appendChild(t);

				if (base.density == 1) {
					c.setAttribute('class', 'cozy');
					c.appendChild(d);
				} else {
					c.setAttribute('class', 'compact');
				}

				document.getElementById('products').appendChild(c);
			}

			var lp = JSON.parse(localStorage.getItem("sabakoProduct"));

			if (lp) {
				for (var key in lp) {
					if (!lp.hasOwnProperty(key)) continue;

					var t = document.getElementById(`p${key}`);

					if (typeof lp[key] === 'object' && lp[key] !== null) {
						for (var prop in lp[key]) {
							if (!lp[key].hasOwnProperty(prop)) continue;

							order(key, t);

							if (lp[key][prop] > 1) {
								for (var i = 0; i < lp[key][prop]; i++) {
									order(key, t, prop);
								}
							} else {
								order(key, t, prop);
							}
						}
					} else {
						if (lp[key] > 1) {
							for (var i = 0; i < lp[key]; i++) {
								order(key, t);
							}
						} else {
							order(key, t);
						}
					}
				}
			}
		}
	};

	xhr.open('GET', 'assets/data.json');
	xhr.send();
}

if (document.getElementById('preferences') != null) {
	let base = JSON.parse(localStorage.getItem('sabakoPref')),
		pane = document.getElementById('preferences');

	pane.elements['density'].querySelector('[value="' + base.density + '"]').selected = true;
	pane.elements['theme'].querySelector('[value="' + base.theme + '"]').selected = true;


	pane.elements['density'].onchange = function (e) {
		base.density = e.target.value;
		localStorage.setItem('sabakoPref', JSON.stringify(base));
		location.href = sabakoHome;
	}

	pane.elements['theme'].onchange = function (e) {
		base.theme = e.target.value;
		localStorage.setItem('sabakoPref', JSON.stringify(base));
		location.href = sabakoHome;
	}
}

if (document.getElementById('year')) document.getElementById('year').innerHTML = new Date().getFullYear();

document.getElementById('checkout').addEventListener('click', function() {
	var b = document.getElementById("productsViewModel"),
		v = document.getElementById("cashier");

	v.style.display = "";
	b.style.display = "none";
	this.style.display = "none";
});

function order(item, p, v) {
	var l = document.getElementById("receipt"),
		c = document.createElement("div"),
		r = document.createElement("span"),
		n = document.createElement("span"),
		q = document.createElement("span"),
		m = document.createElement("img"),
		d = document.getElementsByClassName('order');

	c.setAttribute('class', 'order');
	r.setAttribute('class', 'delete');
	n.setAttribute('class', 'product');
	q.setAttribute('class', 'quantity');

	c.setAttribute('product', item);

	var ve = false;

	for (let x = 0; x < d.length; x++) {
		if (d[x].getAttribute('variant') == null || d[x].getAttribute('owner') == null) continue;

		if (d[x].getAttribute('variant') == v && d[x].getAttribute('owner') == item) {
			var ve = true, vi = d[x];
			break;
		}
	}

	for (let s = 0; s < d.length; s++) {
		if (d[s].getAttribute('product') == item) {
			var i = d[s], e = true;

			if (data[item].variant != null) break;

			break;
		}

		if (s + 1 == d.length--) var i = d[s], e = false;
	}

	n.append(data[item].name);

	m.setAttribute("src", "assets/images/icons/close.svg");
	r.appendChild(m);

	r.setAttribute('onclick', `remove(${item})`);
	q.setAttribute('onclick', `decrease(${item})`);

	var g = {},
		lp = JSON.parse(localStorage.getItem('sabakoProduct'));

	q.innerHTML = 1;

	c.append(r, n, q);

	if (data[item].variant && v == null) {
		g[item] = [];

		if (p.childNodes.length > 3 || base.density == 0) return;

		for (let x = 0; x < 3; x++) p.childNodes[x].style.display = 'none';

		for (let x = 0; x < data[item].variant.length; x++) {
			let t = document.createElement('span');
			t.setAttribute('class', 'option');
			t.append(data[item].variant[x]);

			t.setAttribute('onclick', `order(${item}, this, ${x})`);

			p.appendChild(t);
		}
	} else {
		g[item] = 1;
	}

	if (!e) {
		l.append(c);
	} else {

		if (v === undefined) {
			g[item] = ++i.childNodes[2].innerHTML;

			localStorage.setItem('sabakoProduct', JSON.stringify(Object.assign(lp, g)));
			return;
		}

		g[item] = {};

		var wrapped = document.createElement('div'),
			t = document.createElement('span'),
			x = document.createElement('span'),
			q = document.createElement('span');

		t.innerHTML = data[item].variant;
		q.innerHTML = 1;

		t.setAttribute('class', 'product');
		x.setAttribute('class', 'delete');
		q.setAttribute('class', 'quantity');

		m.setAttribute("src", "assets/images/icons/variant.svg");

		x.appendChild(m);

		wrapped.setAttribute('class', 'order variant');
		wrapped.setAttribute('owner', item);
		wrapped.setAttribute('variant', v);

		if (data[item].variant[v] !== null) t.innerHTML = data[item].variant[v];

		wrapped.append(x, t, q);

		Object.assign(g, lp);

		if (ve == false) {
			i.childNodes[2].innerHTML = "";

			if (Array.isArray(g[item])) g[item] = {};

			g[item][v] = 1;

			wrapped.appendAfter(i);
		} else {
			g[item][v] = ++vi.childNodes[2].innerHTML;
		}
	}

	if (localStorage.getItem('sabakoProduct') !== null) {
		localStorage.setItem('sabakoProduct', JSON.stringify(Object.assign(lp, g)));
	} else {
		localStorage.setItem('sabakoProduct', JSON.stringify(g));
	}
}

function decrease(item) {
	var d = document.getElementsByClassName('order');

	for (let s = 0; s < d.length; s++) {
		if (d[s].getAttribute('product') == item) {
			d[s].childNodes[2].innerHTML--;

			if (d[s].childNodes[2].innerHTML < 1) remove(item);
			break;
		}
	}
}

function remove(item) {
	var	d = document.getElementsByClassName('order');

	for (let s = 0; s < d.length; s++) {
		if (d[s].getAttribute('product') == item) {
			d[s].remove();
			break;
		}
	}
}

function cashier(item) {
	var el = document.getElementById("cashier");
	var ch = document.getElementById("change");

	if (el.innerHTML != 0) {
		if (item == 'del') {
			if (el.innerHTML.length == 1) {
				el.innerHTML = 0;
			} else {
				el.innerHTML = el.innerHTML.substr(0, el.innerHTML.length - 1);
			}
		} else {
			el.innerHTML = el.innerHTML + item;
		}
	} else {
		if (item == 'del') {
			el.innerHTML = 0;
		} else {
			el.innerHTML = item;
		}
	}

	ch.innerHTML = el.innerHTML - document.getElementById("prices").innerHTML;
}
