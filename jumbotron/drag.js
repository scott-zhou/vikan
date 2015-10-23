$(function() {
    'use strict';

    // there's the gallery and the trash
    var $gallery = $("#gallery"),
        $trash = $("#trash");

    var $todo = $('#todo');
    var $doing = $('#doing');
    var $done = $('#done');

    var $setDroppable = function() {
            $("> div", $todo).draggable({
                cancel: "a.ui-icon", // clicking an icon won't initiate dragging
                revert: "invalid", // when not dropped, the item will revert back to its initial position
                containment: "document",
                helper: "clone",
                cursor: "move"
                    // drop: function(event, ui) {
                    //     var draggableId = ui.draggable.attr("id");
                    //     var droppableId = $(this).attr("id");
                    //     $(draggableId).prependTo($(droppableId));
                    // }
            });


        }
        // let the gallery items be draggable

    // Setting the items in each of the columns to be draggable and droppable.
    var $targets = [$todo, $doing, $done];
    for (var i = 0; i < $targets.length; i++) {
        $("> div", $targets[i]).draggable({
            cancel: "a.ui-icon", // clicking an icon won't initiate dragging
            revert: "invalid", // when not dropped, the item will revert back to its initial position
            containment: "document",
            helper: "clone",
            cursor: "move"
        })
    };

    // Setting the items in each of the columns to be droppable.

    $done.droppable({
        // accept: "#todo",
        activeClass: "ui-state-highlight",
        drop: function(event, ui) {
            // moveTask(ui);
            var draggableId = ui.draggable.attr("id");
            var droppableId = $(this).attr("id");
            $("#" + draggableId).appendTo($done);
	    $("#" + draggableId).attr("class", "wells sticky_done ui-draggable");
	    }

        }
    );
    $doing.droppable({
        // accept: "#todo",
        activeClass: "ui-state-highlight",
        drop: function(event, ui) {
            // moveTask(ui);
            var draggableId = ui.draggable.attr("id");
            var droppableId = $(this).attr("id");
            $("#" + draggableId).appendTo($doing);
	    if($("#" + draggableId).attr('urgent') == "true") { 
		$("#" + draggableId).attr("class", "wells sticky_urgent ui-draggable");
	    } else {
		$("#" + draggableId).attr("class", "wells sticky ui-draggable");
	    }
        }
    });
    $todo.droppable({
        // accept: "#todo",
        activeClass: "ui-state-highlight",
        drop: function(event, ui) {
            // moveTask(ui);
            var draggableId = ui.draggable.attr("id");
            var droppableId = $(this).attr("id");
            $("#" + draggableId).appendTo($todo);
	    if($("#" + draggableId).attr('urgent') == "true") { 
		$("#" + draggableId).attr("class", "wells sticky_urgent ui-draggable");
	    } else {
		$("#" + draggableId).attr("class", "wells sticky ui-draggable");
	    }
        }
    });

    function moveTask($item) {

        $item.draggable.fadeOut(function() {
            $item.draggable.appendTo(this);
        });
    }


    // let the gallery be droppable as well, accepting items from the trash
    $gallery.droppable({
        accept: "#trash li",
        activeClass: "custom-state-active",
        drop: function(event, ui) {
            recycleImage(ui.draggable);
        }
    });

    // image deletion function
    var recycle_icon = "<a href='link/to/recycle/script/when/we/have/js/off' title='Recycle this image' class='ui-icon ui-icon-refresh'>Recycle image</a>";

    function deleteImage($item) {
        $item.fadeOut(function() {
            var $list = $("ul", $trash).length ?
                $("ul", $trash) :
                $("<ul class='gallery ui-helper-reset'/>").appendTo($trash);

            $item.find("a.ui-icon-trash").remove();
            $item.append(recycle_icon).appendTo($list).fadeIn(function() {
                $item
                    .animate({
                        width: "48px"
                    })
                    .find("img")
                    .animate({
                        height: "36px"
                    });
            });
        });
    }

    // image recycle function
    var trash_icon = "<a href='link/to/trash/script/when/we/have/js/off' title='Delete this image' class='ui-icon ui-icon-trash'>Delete image</a>";

    function recycleImage($item) {
        $item.fadeOut(function() {
            $item
                .find("a.ui-icon-refresh")
                .remove()
                .end()
                .css("width", "96px")
                .append(trash_icon)
                .find("img")
                .css("height", "72px")
                .end()
                .appendTo($gallery)
                .fadeIn();
        });
    }

    // image preview function, demonstrating the ui.dialog used as a modal window
    function viewLargerImage($link) {
        var src = $link.attr("href"),
            title = $link.siblings("img").attr("alt"),
            $modal = $("img[src$='" + src + "']");

        if ($modal.length) {
            $modal.dialog("open");
        } else {
            var img = $("<img alt='" + title + "' width='384' height='288' style='display: none; padding: 8px;' />")
                .attr("src", src).appendTo("body");
            setTimeout(function() {
                img.dialog({
                    title: title,
                    width: 400,
                    modal: true
                });
            }, 1);
        }
    }

    // resolve the icons behavior with event delegation
    $("ul.gallery > li").click(function(event) {
        var $item = $(this),
            $target = $(event.target);

        if ($target.is("a.ui-icon-trash")) {
            deleteImage($item);
        } else if ($target.is("a.ui-icon-zoomin")) {
            viewLargerImage($target);
        } else if ($target.is("a.ui-icon-refresh")) {
            recycleImage($item);
        }

        return false;
    });

    var template = $('#hidden-template').html();
    
    $('#addTask').on('click', function(e) {
	    var new_task = template.replace('Create mock project',  'Create SOME mock project');
	    console.log(new_task);
	    $todo.append(new_task);
	    $setDroppable();
	    $('.editable').editable();
	});

    /*var template = $('#hidden-template').html();

    $('#addTask').on('click', function(e) {
        //add_new_task('title', 'type', 'status', 'owner', 'description');
        console.log(e);
        var new_task = template.replace('Create mock project',  'Create SOME mock project');
        console.log(new_task);
        $todo.append(new_task);
        $setDroppable();
        $('.editable').editable();
    });*/
});