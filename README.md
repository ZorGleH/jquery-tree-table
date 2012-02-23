jQuery tree table
=================

Originally forked from ludo's [jquery-treetable](https://github.com/ludo/jquery-treetable)  
I wanted a simpler way to do a tree table, with less options, and more simplicity.

/!\ REQUIRES "`data-`" html attributes.


Usage
-----

Your table structure only requires a "data-level" attribute for the branch level.

    <table class="tree">
      <tr data-level="0">
        <td>Level 0</td>
      </tr>
      <tr data-level="1">
        <td>Level 1</td>
      </tr>
      <tr data-level="2">
        <td>Level 2</td>
      </tr>
      <tr data-level="2">
        <td>Level 2</td>
      </tr>
      ...
      and so on
      ...
    </table>

Then initialize it with something like that:

    $(document).ready(function() {
      $("table.tree").treeTable();
    });

Options
-------

There are 3 options:

`ignoreClickOn`: list of selectors you want to be ignored by click (defaults to `"input, a"`)  
`dataAttribute`: data attribute suffix for the row level (defaults to `"level"`)  
`collapsedByDefault`: initial collapsed state of the tree (defaults to `true`)  

    $("table.tree").treeTable({
      ignoreClickOn: "img"
      dataAttribute: "level",
      collapsedByDefault: true
    });

Styling
-------

Expanded `TR`s get an "`expanded`" class.  
Collapsed `TR`s get a "`collapsed`" class.  
Style them as you want. Here is an example:

    .expanded td:first-child:before, .collapsed td:first-child:before {
      display: inline-block;
      border: 1px solid #999;
      width: 14px;
      text-align: center;
      margin-right: 5px;
    }
    .expanded td:first-child:before {
      content: "-";
    }
    .collapsed td:first-child:before {
      content: "+";
    }
    tr[data-level="1"] td:first-child {
      padding-left: 20px;
    }
    tr[data-level="2"] td:first-child {
      padding-left: 40px;
    }
