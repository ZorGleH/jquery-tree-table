/*
 * jQuery treeTable Plugin VERSION
 * http://ludo.cubicphuse.nl/jquery-plugins/treeTable/doc/
 *
 * Copyright 2011, Ludo van den Boom
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function($) {
  // Helps to make options available to all functions
  // TODO: This gives problems when there are both expandable and non-expandable
  // trees on a page. The options shouldn't be global to all these instances!
  var options;
  var persistStore;

  $.fn.treeTable = function(opts) {
    options = $.extend({}, $.fn.treeTable.defaults, opts);

    if(options.persist) {
      persistStore = new Persist.Store(options.persistStoreName);
    }

    return this.each(function() {
      $(this).find("tbody tr").each(function() {
        var isRootNode = ($(this).data("level") == 0);


        // Set child nodes to initial state if we're in expandable mode.
        if(!isRootNode && options.expandable && options.initialState == "collapsed") {
          $(this).hide();
        }

        // If we're not in expandable mode, initialize all nodes.
        // If we're in expandable mode, only initialize root nodes.
        if(!options.expandable || isRootNode) {
          initialize($(this));
        }
      });
    });
  };

  $.fn.treeTable.defaults = {
    clickableNodeNames: false,
    expandable: true,
    indent: 19,
    initialState: "collapsed",
    onNodeShow: null,
    onNodeHide: null,
    treeColumn: 0,
    persist: false,
    persistStoreName: 'treeTable',
    stringExpand: "Expand",
    stringCollapse: "Collapse"
  };

  // Recursively hide all node's children in a tree
  $.fn.collapse = function() {
    if (childrenOf($(this)).length != 0)
      $(this).removeClass("expanded").addClass("collapsed");

    if (options.persist) {
      persistNodeState($(this));
    }

    childrenOf($(this)).each(function() {
      if(!$(this).hasClass("collapsed")) {
        $(this).collapse();
      }

      $(this).hide();

      if($.isFunction(options.onNodeHide)) {
        options.onNodeHide.call(this);
      }

    });

    return this;
  };

  // Recursively show all node's children in a tree
  $.fn.expand = function() {
    $(this).removeClass("collapsed").addClass("expanded");

    if (options.persist) {
      persistNodeState($(this));
    }

    childrenOf($(this)).each(function() {
      initialize($(this));

      if($(this).is(".expanded.parent")) {
        $(this).expand();
      }

      $(this).show();

      if($.isFunction(options.onNodeShow)) {
        options.onNodeShow.call(this);
      }
    });

    return this;
  };

  // Reveal a node by expanding all ancestors
  $.fn.reveal = function() {
    $(ancestorsOf($(this)).reverse()).each(function() {
      initialize($(this));
      $(this).expand().show();
    });

    return this;
  };

  // Add reverse() function from JS Arrays
  $.fn.reverse = function() {
    return this.pushStack(this.get().reverse(), arguments);
  };

  // Toggle an entire branch
  $.fn.toggleBranch = function() {
    if($(this).hasClass("collapsed")) {
      $(this).expand();
    } else {
      $(this).collapse();
    }

    return this;
  };

  // === Private functions

  function ancestorsOf(node) {
    var ancestors = [];
    while(node = parentOf(node)) {
      ancestors[ancestors.length] = node[0];
    }
    return ancestors;
  };

  function childrenOf(node) {
    nodeLevel = parseInt($(node).data("level"));
    childrenLevel = nodeLevel + 1;
    return $(node).nextUntil("tr[data-level="+ nodeLevel +"]", "tr[data-level="+ childrenLevel +"]");
  };

  function indent(node, value) {
    var cell = $(node.children("td")[options.treeColumn]);

    childrenOf(node).each(function() {
      indent($(this), value);
    });
  };

  function initialize(node) {
    var childNodes = childrenOf(node);

    if(!node.hasClass("parent") && childNodes.length > 0) {
      node.addClass("parent");
    }

    if(node.hasClass("parent")) {
      var cell = $(node.children("td")[options.treeColumn]);

      if(options.expandable) {
        cell.wrapInner('<a href="#" title="' + options.stringExpand + '" class="expander"></a>');
        $(cell[0].firstChild).click(function() { node.toggleBranch(); return false; });
        $(cell[0].firstChild).keydown(function(e) { if(e.keyCode == 13) {node.toggleBranch(); return false; }});

        if(options.clickableNodeNames) {
          cell[0].style.cursor = "pointer";
          $(cell).click(function(e) {
            // Don't double-toggle if the click is on the existing expander icon
            if (e.target.className != 'expander') {
              node.toggleBranch();
            }
          });
        }

        if (options.persist && getPersistedNodeState(node)) {
          node.addClass('expanded');
        }

        // Check for a class set explicitly by the user, otherwise set the default class
        if(!(node.hasClass("expanded") || node.hasClass("collapsed"))) {
          node.addClass(options.initialState);
        }

        if(node.hasClass("expanded")) {
          node.expand();
        }
      }
    }
  };

  function move(node, destination) {
    node.insertAfter(destination);
    childrenOf(node).reverse().each(function() { move($(this), node[0]); });
  };

  function parentOf(node) {
    nodeLevel = parseInt($(node).data("level"));
    parentLevel = nodeLevel - 1;
    return $(node).prev("tr[data-level="+ parentLevel +"]");
  };

  //saving state functions, not critical, so will not generate alerts on error
  function persistNodeState(node) {
    if(node.hasClass('expanded')) {
      try {
         persistStore.set(node.attr('id'), '1');
      } catch (err) {

      }
    } else {
      try {
        persistStore.remove(node.attr('id'));
      } catch (err) {

      }
    }
  }

  function getPersistedNodeState(node) {
    try {
      return persistStore.get(node.attr('id')) == '1';
    } catch (err) {
      return false;
    }
  }
})(jQuery);
