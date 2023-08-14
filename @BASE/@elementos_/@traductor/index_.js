let texto_a_html= function (str) {
	var dom = document.createElement('div');
	dom.innerHTML = str;
	return dom;
};

export default (function() {
  function q(v) {
    return '"' + v + '"';
  }

  function removeDOCTYPE(html) {
    return html
      .replace(/<\?xml.*\?>\n/, '')
      .replace(/<!doctype.*\>\n/, '')
      .replace(/<!DOCTYPE.*\>\n/, '');
  }

  let html2json = function html2json(html) {
    if (html instanceof Element) {
      html = html.outerHTML;
    }

    html = removeDOCTYPE(html);
    var bufArray = [];
    var results = {
      hijos: [],
    };
    HTMLParser(html, {
      start: function(tag, attrs, unary) {
        // node for this element
        var node = {
          node: 'html',
          tag: tag,
        };
        if (attrs.length !== 0) {
          node.attr = attrs.reduce(function(pre, attr) {
            var name = attr.name;
            var value = attr.value;

            // has multi attibutes
            // make it array of attribute
            if (value.match(/ /)) {
              value = value.split(' ');
            }

            // if attr already exists
            // merge it
            if (pre[name]) {
              if (Array.isArray(pre[name])) {
                // already array, push to last
                pre[name].push(value);
              } else {
                // single value, make it array
                pre[name] = [pre[name], value];
              }
            } else {
              // not exist, put it
              pre[name] = value;
            }

            return pre;
          }, {});
        }
        if (unary) {
          // if this tag dosen't have end tag
          // like <img src="hoge.png"/>
          // add to parents
          var parent = bufArray[0] || results;
          if (parent.hijos === undefined) {
            parent.hijos = [];
          }
          parent.hijos.push(node);
        } else {
          bufArray.unshift(node);
        }
      },
      end: function(tag) {
        // merge into parent tag
        var node = bufArray.shift();
        if (node.tag !== tag) console.error('invalid state: mismatch end tag');

        if (bufArray.length === 0) {
          results.hijos.push(node);
        } else {
          var parent = bufArray[0];
          if (parent.hijos === undefined) {
            parent.hijos = [];
          }
          parent.hijos.push(node);
        }
      },
      chars: function(text) {
        var node = {
          node: 'text',
          text: text,
        };
        if (bufArray.length === 0) {
          results.hijos.push(node);
        } else {
          var parent = bufArray[0];
          if (parent.hijos === undefined) {
            parent.hijos = [];
          }
          parent.hijos.push(node);
        }
      },
      comment: function(text) {
        var node = {
          node: 'comment',
          text: text,
        };
        var parent = bufArray[0];
        if (parent.hijos === undefined) {
          parent.hijos = [];
        }
        parent.hijos.push(node);
      },
    });
    return results;
  };

  let json2html = function(json) {
    // Empty Elements - HTML 4.01
    var empty = ['area', 'base', 'basefont', 'br', 'col', 'frame', 'hr', 'img', 'input', 'isindex', 'link', 'meta', 'param', 'embed'];

    var hijos = '';
    if (json.hijos) {
      hijos = json.hijos.map(function(c) {
        return json2html(c);
      }).join('');
    }

    var attr = '';
    if (json.attr) {
      attr = Object.keys(json.attr).map(function(key) {
        var value = json.attr[key];
        if (Array.isArray(value)) value = value.join(' ');
        return key + '=' + q(value);
      }).join(' ');
      if (attr !== '') attr = ' ' + attr;
    }

    if (json.node == 'html') {
      var tag = json.tag;
      if (empty.indexOf(tag) > -1) {
        return '<' + json.tag + attr + '/>';
      }

      var open = '<' + json.tag + attr + '>';
      var close = '</' + json.tag + '>';
      return open + hijos + close;
    }

    if (json.node === 'text') {
      return json.text;
    }

    if (json.node === 'comment') {
      return '<!--' + json.text + '-->';
    }

    if (!json.node) {
      return hijos;
    }
  };

  return {
    html2json,
    json2htmltext: (json)=> json2html(json),
    json2html: (json)=> texto_a_html(json2html(json))
  }
})();