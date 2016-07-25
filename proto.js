function onDragStart(event) {
    event.originalEvent.dataTransfer.setData("text", event.target.id);
    console.log('drag_start:' + event.target.id);
}

function onDragOver(event) {
    event.preventDefault();
}

function onStmDrop(event) {
    var id_name = event.originalEvent.dataTransfer.getData("text");
    console.log('on drop ' + id_name + " to " + event.target.id);

    console.log($('#'+id_name).attr("class") + " VS " + $(event.target).attr("class"));

    if ($(event.target).attr("class") != "stm_holl") {
        return false;
    }

    if ($('#'+id_name).attr("class") == "stm") {
        $('#'+id_name).appendTo($(event.target));
    }
    else if ($('#'+id_name).attr("class") == "variable") {
	var vname =$('#'+id_name).attr("varname");
        var sid  = 'stm-' + $(".stm").length;
        var ehid = 'eholl-' + $(".exp_holl").length;
	$(event.target).append($("<div class='stm' id="+sid+">"+ vname + "= <span class='exp_holl' id="+ehid+"></span></div>"));
        $("#"+sid).attr("draggable","true");
        $("#"+sid).bind("dragstart", onDragStart);
        $("#"+ehid).attr("dropzone","move"); 
        $("#"+ehid).bind("dragover", onDragOver);
        $("#"+ehid).bind("drop", onExpDrop);

        return false
    }
    else {
        return false;
    }
}

function onExpDrop(event) {
    var id_name = event.originalEvent.dataTransfer.getData("text");
    console.log('on drop ' + id_name + " to " + event.target.id);

    console.log($('#'+id_name).attr("class") + " VS " + $(event.target).attr("class"));
    if ($(event.target).children().length != 0) {
        return false;
    }

    if ( $('#'+id_name).attr("class") == "exp") {
	    $('#'+id_name).appendTo($(event.target));
    }
    else if ($('#'+id_name).attr("class") == "variable") {
	var vname =$('#'+id_name).attr("varname");
        var eid = "exp-"+ $(".exp").length;

	$(event.target).append($("<span class='exp' id=" + eid + ">"+ vname + "</span>"));
	$("#"+eid).attr("draggable","true");
        $("#"+eid).bind("dragstart", onDragStart);

	return false;
    }
    else {
        return false;
    }

    event.preventDefault();
}

function onMainCanvasClick(event) {
    console.log("maincanvas clicked " + $(".world_menu").css("visibility"));

    if ($(event.target).attr("class") != "main_canvas") {
        return false;
    }

    if ($(".world_menu").css("visibility") == "hidden") {
        $(".world_menu").css("visibility", "visible");
        $(".world_menu").css("top", event.offsetY);
        $(".world_menu").css("left", event.offsetX);
    }
    else {
        $(".world_menu").css("visibility", "hidden");
    }
}
function onMainCanvasDrop(event) {
    var id_name = event.originalEvent.dataTransfer.getData("text");
    console.log('on drop ' + id_name + " to " + event.target.id);

    var pos = $('#'+id_name).position();

    console.log("left: " + event.offsetX + ", top: " + event.offsetY);
    $('#'+id_name).css("top", event.offsetY);
    $('#'+id_name).css("left", event.offsetX);
    event.preventDefault();
}
function onOpenScenarioWindow(event){
    if ($(event.target).attr("id") != "open_scn_window") {
        return false;
    }

    if ($(".scenario_window").css("visibility") == "hidden") {
        $(".scenario_window").css("visibility", "visible");
        $(".scenario_window").css("display", "block");
	$("#open_scn_window").text("シナリオを閉じる");
        $(".world_menu").css("visibility", "hidden");
    }
    else {
        $(".scenario_window").css("visibility", "hidden");
        $(".scenario_window").css("display", "none");
	$("#open_scn_window").text("シナリオを開く");
        $(".world_menu").css("visibility", "hidden");
    }
}
function onMakeVariable(event) {
    console.log("onMakeVariable");
    if ($(event.target).attr("id") != "make_variable") {
        return false;
    }
    var vid = "var-" + $(".variable").length;
    console.log("id=" + vid);

    $(".main_canvas").append($("<div class='variable' id=" + vid + " varname='名無しさん'>変数:<span class='vname'>名無しさん</span><div class='vvalue'>42</div></div>"));
    $("#"+ vid).attr("draggable","true");
    $("#"+ vid).bind("dragstart", onDragStart);


    $(".world_menu").css("visibility", "hidden");
}

function onStmHollClick(event) {
    console.log("onStmClick0");

    if ($(event.target).attr("class") != "stm_holl") {
        return false;
    }
    console.log("onStmClick1 " + $(event.target).attr("id"));

	$(".stm_menu").attr("target_holl", $(event.target).attr("id"));

	var pos = $(event.target).position();

        $(".stm_menu").css("visibility", "visible");
        $(".stm_menu").css("top" , event.offsetY + pos.top );
        $(".stm_menu").css("left", event.offsetX + pos.left);
}
function onMakeIfElseStm(event) {
    console.log("onMake IF-ELSE");

    var targetId = $(".stm_menu").attr("target_holl");
    console.log("target=" +  targetId);
    var sid  = "stm-" + $(".stm").length;
    var shid_if   = "sholl-" + $(".stm_holl").length;
    var shid_else = "sholl-" + ($(".stm_holl").length + 1);
    var ehid      = "eholl-" + $(".exp_holl").length;

    $("#"+targetId).append( $(
    "<div class='stm' id=" + sid + "> もし <span class='exp_holl'id=" + ehid + "> </span> <br>"
    + " ならば <div class='stm_holl' id=" + shid_if + " /> "
    + "でないとき <div class='stm_holl' id=" + shid_else + " /></div>") );


    $("#"+sid).attr("draggable","true");
    $("#"+sid).bind("dragstart", onDragStart);

    $("#"+ehid).attr("dropzone","move"); 
    $("#"+ehid).bind("dragover", onDragOver);
    $("#"+ehid).bind("drop", onExpDrop);

    $("#"+shid_if).attr("dropzone","move");
    $("#"+shid_if).bind("dragover", onDragOver);
    $("#"+shid_if).bind("drop", onStmDrop);

    $("#"+shid_else).attr("dropzone","move");
    $("#"+shid_else).bind("dragover", onDragOver);
    $("#"+shid_else).bind("drop", onStmDrop);


    $(".stm_menu").css("visibility", "hidden");
}
function onStmMenuClose(event){
    $(".stm_menu").css("visibility", "hidden");
}

