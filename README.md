jQuery tree table
=================

Originally forked from https://github.com/ludo/jquery-treetable,
I wanted a simpler way to do a tree table, with less options,
and more simplicity.
/!\ ONLY WORKS with "data-" attributes.


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

There are only two options:

`dataAttribute`: data attribute suffix for the row level (defaults to `"level"`)  
`collapsedByDefault`: initial collapsed state of the tree (defaults to `true`)  

    $("table.tree").treeTable({
      dataAttribute: "level",
      collapsedByDefault: true
    });
