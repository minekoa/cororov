var id_generator = {
    count: 1,
    generate: function(typestr) {
        var idval = typestr + '-' + this.count;
        this.count +=1;
        return idval;
    }
};

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

var showScenarioPanel = function() {
    $(".scenario_window").css("display", "block");
    $('.scn_win_flap').css('right', 
                         $('.scenario_window').css('width'));
    $('.scn_win_flap').off('click');
    $('.scn_win_flap').on('click', hideScenarioPanel);
};

var hideScenarioPanel = function() {
    $(".scenario_window").css("display", "none");
    $('.scn_win_flap').css('right', '0');
    $('.scn_win_flap').off('click');
    $('.scn_win_flap').on('click', showScenarioPanel);
};

var createVariableWidget = function(event, parent, vtype){
    var vid = id_generator.generate('var');

    var html = '';
    html += '<div class="variable" id="'+ vid +'">';
    html += '変数:<span class="vname">['+ vid +']</span></br>';
    html += '= <div class="vvalue" vtype="'+vtype+'"></div>';
    html += '</div>';
    $(parent).append(html);

    $("#"+vid).css("top",  event.offsetY + $(event.target).offset().top);
    $("#"+vid).css("left", event.offsetX + $(event.target).offset().left);

    $("#"+ vid).attr("draggable","true");
    $("#"+ vid).bind("dragstart", onDragStart);

    return true;
};

var onMainCanvasClick = function(event) {
    console.log("maincanvas clicked " + $(".world_menu").css("visibility"));

    if ($(event.target).attr("class") != "main_canvas") {
        return false;
    }

    var v_menu = {};
    v_menu['実数']                    = function(e){createVariableWidget(e, $('.main_canvas'), 'real');};
    v_menu['整数']                    = function(e){createVariableWidget(e, $('.main_canvas'), 'int');};
    v_menu['真偽値']                  = function(e){createVariableWidget(e, $('.main_canvas'), 'bool');};
    v_menu['ON/OFF']                  = function(e){createVariableWidget(e, $('.main_canvas'), 'onoff');};
    v_menu['文字列']                  = function(e){createVariableWidget(e, $('.main_canvas'), 'string');};
    v_menu['位置と姿勢(x,y,z,r,p,y)'] = function(e){createVariableWidget(e, $('.main_canvas'), 'pos');};

    var d_menu = {};
    d_menu['ロボット']      = function(e){console.log('create var');};
    d_menu['カウンター']    = function(e){console.log('apennd dev');};
    d_menu['ハンド']        = function(e){console.log('quit edt');};
    d_menu['端子台(入力)']  = function(e){console.log('quit edt');};
    d_menu['端子台(出力)']  = function(e){console.log('quit edt');};

    var model= {};
    model['変数の作成']     = v_menu;
    model['デバイスを追加'] = d_menu;
    model['編集を終了']     = function(e){console.log('quit edt');};

    contextMenu_show($('.main_canvas'), 'world',  model);

    $(".ctx_menu").css("top", event.offsetY + $(event.target).offset().top);
    $(".ctx_menu").css("left", event.offsetX + $(event.target).offset().left);
}

var onStmHollClick = function(event) {
    if ($(event.target).attr("class") != "stm_holl") {
        return false;
    }

    var model= {};
    model['if-else']     = function(e){createIfStatement(event.target);};
    model['after-do']    = function(e){createAfterDoStatement(event.target);};
    model['wait-until']  = function(e){createWaitUntilStatement(event.target);};
    model['wait']        = function(e){createWaitStatement(event.target);};
    model['grouping']    = function(e){createGroupingStatement(event.target);};
    model['exit']        = function(e){createExitStatement(event.target)};

    contextMenu_show($('.main_canvas'), 'statement',  model);

    $(".ctx_menu").css("top", event.offsetY+ $(event.target).offset().top);
    $(".ctx_menu").css("left", event.offsetX + $(event.target).offset().left);
    return false;
};

//------------------------------------------------------------
// 文ウィジェット生成
//------------------------------------------------------------

var createIfStatement = function (parent) {
    var html ='';  
    html += '<div class="stm" id="' + id_generator.generate('stm') + '">';
    html += '❔<span class="exp_holl" id="' + id_generator.generate('eholl') + '"></span>ですか？<br/>';
    html += '&nbsp;→(Yes)<div class="stm_holl" id="' + id_generator.generate('sholl') +'"></div>'; 
    html += '&nbsp;→(No)<div class="stm_holl" id="' + id_generator.generate('sholl') +'"></div>'; 
    html += '</div>';
    $(parent).append(html)

    $('.stm').attr("draggable","true");
    $('.stm').bind("dragstart", onDragStart);

    $('.exp_holl').attr("dropzone","move"); 
    $('.exp_holl').bind("dragover", onDragOver);
    $('.exp_holl').bind("drop", onExpDrop);

    $('.stm_holl').attr("dropzone","move");
    $('.stm_holl').bind("dragover", onDragOver);
    $('.stm_holl').bind("drop", onStmDrop);
};
var createAfterDoStatement = function (parent) {
    var html ='';
    html += '<div class="stm" id="' + id_generator.generate('stm') +'">';
    html += '⏰ <span class="exp_holl" id="' + id_generator.generate('eholl')+'"></span> 秒後に以下を Do!';
    html += '<div class="stm_holl" id="' + id_generator.generate('sholl') +'"></div>';
    html += '</div>';
    $(parent).append(html)

    $('.stm').attr("draggable","true");
    $('.stm').bind("dragstart", onDragStart);

    $('.exp_holl').attr("dropzone","move"); 
    $('.exp_holl').bind("dragover", onDragOver);
    $('.exp_holl').bind("drop", onExpDrop);

    $('.stm_holl').attr("dropzone","move");
    $('.stm_holl').bind("dragover", onDragOver);
    $('.stm_holl').bind("drop", onStmDrop);
};

var createWaitUntilStatement = function(parent) {
    var html ='';
    html += '<div class="stm" id="' + id_generator.generate('stm') +'">';
    html += '✅ <span class="exp_holl" id="' + id_generator.generate('eholl')+'"></span> になるまで';
    html += '⏳ <span class="exp_holl" id="' + id_generator.generate('eholl')+'"></span> 秒待つ';
    html += '</div>';
    $(parent).append(html)

    $('.stm').attr("draggable","true");
    $('.stm').bind("dragstart", onDragStart);

    $('.exp_holl').attr("dropzone","move"); 
    $('.exp_holl').bind("dragover", onDragOver);
    $('.exp_holl').bind("drop", onExpDrop);

    $('.stm_holl').attr("dropzone","move");
    $('.stm_holl').bind("dragover", onDragOver);
    $('.stm_holl').bind("drop", onStmDrop);
}
var createWaitStatement = function(parent) {
    var html ='';
    html += '<div class="stm" id="' + id_generator.generate('stm') +'">';
    html += '⏳ <span class="exp_holl" id="' + id_generator.generate('eholl')+'"></span> 秒待つ';
    html += '</div>';
    $(parent).append(html)

    $('.stm').attr("draggable","true");
    $('.stm').bind("dragstart", onDragStart);

    $('.exp_holl').attr("dropzone","move"); 
    $('.exp_holl').bind("dragover", onDragOver);
    $('.exp_holl').bind("drop", onExpDrop);

    $('.stm_holl').attr("dropzone","move");
    $('.stm_holl').bind("dragover", onDragOver);
    $('.stm_holl').bind("drop", onStmDrop);
}

var createExitStatement = function(parent) {
    var html ='';
    html += '<div class="stm" id="' + id_generator.generate('stm') +'">';
    html += '⛔シナリオをおしまいにする';
    html += '</div>'
    $(parent).append(html)

    $('.stm').attr("draggable","true");
    $('.stm').bind("dragstart", onDragStart);

    $('.exp_holl').attr("dropzone","move"); 
    $('.exp_holl').bind("dragover", onDragOver);
    $('.exp_holl').bind("drop", onExpDrop);

    $('.stm_holl').attr("dropzone","move");
    $('.stm_holl').bind("dragover", onDragOver);
    $('.stm_holl').bind("drop", onStmDrop);
}
var createGroupingStatement = function(parent){
    var html = '';
    html += '<div class="stm" id="' + id_generator.generate('stm') +'">';
    html += '<span class="stm_closer">▽</span> <span class="stm_title">「」</span>';
    html += '<div class="stm_holl" id="' + id_generator.generate('sholl') +'"></div>'; 
    html += '</div>'
    $(parent).append(html)

    $('.stm').attr("draggable","true");
    $('.stm').bind("dragstart", onDragStart);

    $('.exp_holl').attr("dropzone","move"); 
    $('.exp_holl').bind("dragover", onDragOver);
    $('.exp_holl').bind("drop", onExpDrop);

    $('.stm_holl').attr("dropzone","move");
    $('.stm_holl').bind("dragover", onDragOver);
    $('.stm_holl').bind("drop", onStmDrop);
}

var editStatementTitle = function(event){
    if ($(event.target).attr("class") != "stm_title") {
        return false;
    }
    if ($(event.target).attr("mode") == "edit") {
        var txt = $(event.target).find('input').val();
        $(event.target).text('「' + txt + '」');
        $(event.target).remove('input');
        $(event.target).attr("mode", 'view');
    }
    else {
        var txt = $(event.target).text();
        $(event.target).text('');
        $(event.target).append('「<input type="text" value="' + txt.slice(1,-1) + '"/>」');
        $(event.target).append('☑');
        $(event.target).attr("mode", 'edit');
    }
    return false;
}

var foldStatement = function(event) {
    if ($(event.target).attr("class") != "stm_closer") {
        return false;
    }

    if ($(event.target).text() == '▽') {
        console.log($(event.target).parent());
        $(event.target).parent().find('.stm_holl').css('display','none');
        $(event.target).text('▷');
    }
    else {
        $(event.target).parent().find('.stm_holl').css('display','block');
        $(event.target).text('▽');
    }

    return false;
}



function onMainCanvasDrop(event) {
    var id_name = event.originalEvent.dataTransfer.getData("text");
    console.log('on drop ' + id_name + " to " + event.target.id);

    var pos = $('#'+id_name).position();

    console.log("left: " + event.offsetX + ", top: " + event.offsetY);
    $('#'+id_name).css("top", event.offsetY +$(event.target).offset().top);
    $('#'+id_name).css("left", event.offsetX +$(event.target).offset().left);
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


//------------------------------------------------------------
// コンテキストメニュー
//------------------------------------------------------------

var contextMenu_show = function (parent, title, model) {
   
    if ($(parent).attr('context_menu') != null) {
        console.log('close');
        $(".ctx_menu").remove();
    }

    var ctx_menu = $('<div class="ctx_menu"></div>');
    var close_menu = function(){$(".ctx_menu").remove();};

    ctx_menu.append($('<div class="ctx_menu_title">'+title+'</div>').append(
        $('<span id="ctx_menu_close">❎</span></div>').click(close_menu) ));
    for (key in model) {
        $(ctx_menu).append( '<p menu_key="' + key + '">' + key + '</p>' );
    }
    $(parent).append(ctx_menu);
    $(parent).attr('context_menu', ctx_menu );


    $('#ctx_menu_close').click(close_menu); 
    $(".ctx_menu").on('click', 'p', function(event){ 
        var target = model[$(this).attr('menu_key')];
        if ($.type(target) == 'function') {
            target(event);
            close_menu();
        }
        else if ($.type(target) == 'object') {
            var top  = $(".ctx_menu").css("top");
            var left = $(".ctx_menu").css("left");
            contextMenu_show(parent, $(this).attr('menu_key'), target);
            $(".ctx_menu").css("top", top);
            $(".ctx_menu").css("left", left);
        }
    });
};

//------------------------------------------------------------
// スクリプトパネルの生成
//------------------------------------------------------------

var onScriptTrayClick = function() {
    if ($(this).attr('class') != 'script_tray') {
        return false;
    }

    createScriptPanel($(this), $(this).attr('category'), null);
    return false;
}

var createScriptPanel = function(parent, type,  model) {
    var script_id = id_generator.generate('script');
    var html_template= '<div class="scn_segment" id="' + script_id + '">';

    if (type == "initializer") {
        html_template += '<h2><span class="script_closer">▽</span><span class="script_title">「'+script_id+'」</span></h2>';

    } else if (type == "terminator") {
        html_template += '<h2><span class="script_closer">▽</span><span class="script_title">「'+script_id+'」</span></h2>';

    } else {
        html_template += '<h2><span class="script_closer">▽</span><span class="script_title">「'+script_id+'」</span></h2>';
        html_template += '<div class="run_option">';
        html_template += '<input type="checkbox" name="exec_options" value="progn">一度だけ実行';
        html_template += '<input type="checkbox" name="exec_options" value="repeat" checked>繰り返し実行';
        html_template += '</div>';
    }

    html_template += '<div class="stm_holl" style="margin:0;" id="' + id_generator.generate('sholl')+ '"></div></div>';
    $(parent).append(html_template);
};

var editScriptTitle = function(event){
    if ($(event.target).attr("class") != "script_title") {
        return false;
    }
    if ($(event.target).attr("mode") == "edit") {
        var txt = $(event.target).find('input').val();
        $(event.target).text('「' + txt + '」');
        $(event.target).remove('input');
        $(event.target).attr("mode", 'view');
    }
    else {
        var txt = $(event.target).text();
        $(event.target).text('');
        $(event.target).append('「<input type="text" value="' + txt.slice(1,-1) + '"/>」');
        $(event.target).append('☑');
        $(event.target).attr("mode", 'edit');
    }
    return false;
}

var foldScript = function(event) {
    if ($(event.target).attr("class") != "script_closer") {
        return false;
    }

    if ($(event.target).text() == '▽') {
        $(event.target).parents('.scn_segment').find('.run_option').css('display','none');
        $(event.target).parents('.scn_segment').find('.stm_holl').css('display','none');
        $(event.target).text('▷');
    }
    else {
        $(event.target).parents('.scn_segment').find('.run_option').css('display','block');
        $(event.target).parents('.scn_segment').find('.stm_holl').css('display','block');
        $(event.target).text('▽');
    }

    return false;
}


