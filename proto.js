var id_generator = {
    count: 1,
    generate: function(typestr) {
        var idval = typestr + '-' + this.count;
        this.count +=1;
        return idval;
    }
};

//------------------------------------------------------------
// 共通
//------------------------------------------------------------

var editText = function(target, open_char, close_char){
    if ($(target).attr("mode") == "edit") {
        var txt = $(target).children('input').val();
        $(target).text(open_char + txt + close_char);
        $(target).remove('input');
        $(target).attr("mode", 'view');
    }
    else {
        var txt = $(target).text();
        $(target).text('');
        if (open_char.length != 0) {
            txt = txt.slice(1,-1);
        }

        $(target).append(open_char + '<input type="text" value="' + txt + '"/>' + close_char);
        $(target).append('☑');
        $(target).attr("mode", 'edit');
    }
};

var editNumber = function(target, open_char, close_char){
    if ($(target).attr("mode") == "edit") {
        var txt = $(target).children('input').val();
        $(target).text(open_char + txt + close_char);
        $(target).remove('input');
        $(target).attr("mode", 'view');
    }
    else {
        var txt = $(target).text();
        if (open_char.length != 0) {
            txt = txt.slice(1,-1);
        }

        $(target).text('');
        $(target).append(open_char + '<input type="number" value="' + txt + '"/>' + close_char);
        $(target).append('☑');
        $(target).attr("mode", 'edit');
    }
};

var editSelect = function(target, open_char, close_char, options){
    if ($(target).attr("mode") == "edit") {
        var txt = $(target).children('select').val();
        $(target).text(open_char + txt + close_char);
        $(target).remove('input');
        $(target).attr("mode", 'view');
    }
    else {
        var txt = $(target).text();
        if (open_char.length != 0) {
            txt = txt.slice(1,-1);
        }
        $(target).text('');

        var html = '';
        html += '<select>';
        for (value of options) {
            var selected = (value == txt) ? 'selected' : '';
            html += '<option value="' + value + '" ' + selected + '>' + value + '</option>';
        }
        html += '</select>';

        $(target).append(open_char + html + close_char);
        $(target).append('☑');
        $(target).attr("mode", 'edit');
    }
};


//------------------------------------------------------------
// Drag and Drop
//------------------------------------------------------------

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
	    var vname = $('#'+id_name).attr("vname");
        var vtype = $('#'+id_name).attr("vtype");

        var stm_id   = id_generator.generate('stm');
        var eholl_id = id_generator.generate('eholl');

        var html = '';
        html += '<div class="stm" '
              + 'id="'    + stm_id + '" ' 
              + 'vname="' + vname  + '" >';
        html += vname + ' ← ';
        html += '<span class="exp_holl" id="' + eholl_id + '" vtype="' + vtype + '"></span>';
        html += '</div>';
        $(event.target).append(html);

        $("#"+stm_id).attr("draggable","true");
        $("#"+stm_id).bind("dragstart", onDragStart);

        $("#"+eholl_id).attr("dropzone","move"); 
        $("#"+eholl_id).bind("dragover", onDragOver);
        $("#"+eholl_id).bind("drop", onExpDrop);

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
	    var vname =$('#'+id_name).attr("vname");
	    var vtype =$('#'+id_name).attr("vtype");
        var eid = id_generator.generate("exp");

        var html = '';
        html += "<span class='exp' id=" + eid + ">"
        html += vname;
        html += "<span class='operator_editor' vtype='" + vtype + "'>✒</span>";
        html += "</span>";

	    $(event.target).append($(html));
	    $("#"+eid).attr("draggable","true");
        $("#"+eid).bind("dragstart", onDragStart);

	    return false;
    }
    else {
        return false;
    }

    event.preventDefault();
}

var onRubbishtipDrop = function (event) {
    if ($(event.target).attr("id") != "rubbishtip") {
        return false;
    }

    var id_name = event.originalEvent.dataTransfer.getData("text");
    console.log('on drop ' + id_name + " to " + event.target.id);
    $('#'+id_name).remove();
}

//------------------------------------------------------------
// Action (ScenarioPanel)
//------------------------------------------------------------

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

//------------------------------------------------------------
// Action (Variable)
//------------------------------------------------------------
var editVariableName = function(event){
    if ($(event.target).attr("class") != "vname") {
        return false;
    }

    editText($(event.target),  '[', ']');
    if ($(event.target).attr('mode') == 'view') {
        $(event.target).parent().attr('vname', $(event.target).text().slice(1,-1));
    }
    
    return false;
}


//------------------------------------------------------------
// Widgets Creator
//------------------------------------------------------------

var createVariableWidget = function(event, parent, vtype){
    var vid = id_generator.generate('var');

    var html = '';
    html += '<div class="variable" id="'+ vid +'" vname="' + vid +'" vtype="' + vtype + '">';
    html += '<span class="vname">['+ vid +']</span> :<span class="vtype"></span></br>';
    html += '<div class="vvalue" vtype="'+vtype+'">';
    html += '</div>';
    html += '</div>';
    var dom = $(html);

    $(dom).children('.vtype').text(vtype);

    // 暫定（値コンストラクターを流用）
    switch (vtype) {
    case 'real':
        createRealNumConstractor($(dom).children('.vvalue'), 0.0);
        break;
    case 'int':
        createIntNumConstractor($(dom).children('.vvalue'), 0);
        break;
    case 'bool':
        createBoolConstractor($(dom).children('.vvalue'), true, 'bool', 'true', 'false');
        break;
    case 'onoff':
        createBoolConstractor($(dom).children('.vvalue'), true, 'onoff','ON', 'OFF');
        break;
    case 'string':
        createStringConstractor($(dom).children('.vvalue'), '');
        break;
    case 'pos':
        createPositionConstructor($(dom).children('.vvalue'), {x:0,y:0,z:0,roll:0,pitch:0,yaw:0});
        break;
    }

    $(parent).append(dom);

    $("#"+vid).css("top",  event.offsetY + $(event.target).offset().top);
    $("#"+vid).css("left", event.offsetX + $(event.target).offset().left);

    $("#"+ vid).attr("draggable","true");
    $("#"+ vid).bind("dragstart", onDragStart);

    return true;
};

//------------------------------------------------------------
// 各種ポップアップメニュー
//------------------------------------------------------------

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

var onExpHollClick = function(event) {
    if ($(event.target).attr("class") != "exp_holl") {
        return false;
    }
    if ($(event.target).children('.exp').length) {
        console.log('already exist exp');
        return false;
    }

    var model={};
    switch ($(event.target).attr('vtype')) {
    case 'real':
        model['即値をセット'] = function(e){createRealNumConstractor(event.target, 0.0);};
        break;
    case 'int':
        model['即値をセット'] = function(e){createIntNumConstractor(event.target, 0);};
        break;
    case 'bool':
    case 'onoff':
        model['即値をセット(true/false)'] = function(e){createBoolConstractor(event.target, true, 'bool', 'true', 'false');};
        model['即値をセット(on/off)']     = function(e){createBoolConstractor(event.target, true, 'onoff', 'ON', 'OFF');};
        break;
    case 'string':
        model['値を入れる'] = function(e){createStringConstractor(event.target, '');};
        break;
    case 'pos':
        model['即値をセット（位置と座標）'] = function(e){createPositionConstructor(event.target, {x:0,y:0,z:0,roll:0,pitch:0,yaw:0});};
        break;
    }

    contextMenu_show($('.main_canvas'), 'expression',  model);

    $(".ctx_menu").css("top", event.offsetY+ $(event.target).offset().top);
    $(".ctx_menu").css("left", $(event.target).offset().left);
//    $(".ctx_menu").css("left", event.offsetX + $(event.target).offset().left);
    return false;
}

var onOperatorEditClick = function(event) {
    if ($(event.target).attr("class") != "operator_editor") {
        return false;
    }

    var create_compare_model = function(vtype) {
        var comp_model = {};
        comp_model['＝'] = function(e){ bin_ope_replace($(event.target), vtype, vtype, '＝'); };
        comp_model['≠'] = function(e){ bin_ope_replace($(event.target), vtype, vtype, '≠'); };
        comp_model['＜'] = function(e){ bin_ope_replace($(event.target), vtype, vtype, '＜'); };
        comp_model['＞'] = function(e){ bin_ope_replace($(event.target), vtype, vtype, '＞'); };
        comp_model['≦'] = function(e){ bin_ope_replace($(event.target), vtype, vtype, '≦'); };
        comp_model['≧'] = function(e){ bin_ope_replace($(event.target), vtype, vtype, '≧'); };
        return comp_model;
    };

    var bin_ope_replace = function(target, rettype, paramtype, operator) {
        var rhs    = $(target).parent()
        var parent = $(rhs).parent();
        $(rhs).remove();
        createBinOperatorWidget(parent, rettype, paramtype, operator, rhs);
    };
    var un_ope_replace = function(target, rettype, paramtype, operator) {
        var rhs    = $(target).parent()
        var parent = $(rhs).parent();
        $(rhs).remove();
        createUnnaryOperatorWidget(parent, rettype, paramtype, operator, rhs);
    };


    var model={};
    switch ($(event.target).attr('vtype')) {
    case 'real':
        console.log('a');
        model['＋'] = function(e){ bin_ope_replace($(event.target), 'real','real', '＋'); };
        model['−'] = function(e){ bin_ope_replace($(event.target), 'real','real', '−'); };
        model['×'] = function(e){ bin_ope_replace($(event.target), 'real','real', '×'); };
        model['÷'] = function(e){ bin_ope_replace($(event.target), 'real','real', '÷'); };
        model['(比較演算)'] = create_compare_model('real');
        console.log('b');
        break;
    case 'int':
        model['＋'] = function(e){console.log('+')};
        model['−'] = function(e){console.log('-')};
        model['×'] = function(e){console.log('x')};
        model['÷'] = function(e){console.log('/')};
        model['(比較演算)'] = create_compare_model('int');
        break;
    case 'bool':
    case 'onoff':
        model['AND'] = function(e){ bin_ope_replace($(event.target), $(event.target).attr('vtype'), $(event.target).attr('vtype'), 'AND'); };
        model['OR']  = function(e){ bin_ope_replace($(event.target), $(event.target).attr('vtype'), $(event.target).attr('vtype'), 'OR'); };
        model['NOT'] = function(e){ un_ope_replace($(event.target), $(event.target).attr('vtype'), $(event.target).attr('vtype'), 'NOT'); };
        model['＝']  = function(e){ bin_ope_replace($(event.target), $(event.target).attr('vtype'), $(event.target).attr('vtype'), '＝'); };
        break;
    case 'string':
        break;
    }
    console.log('c ' + model);
    contextMenu_show($('.main_canvas'), 'expression',  model);

    $(".ctx_menu").css("top", event.offsetY+ $(event.target).offset().top);
    $(".ctx_menu").css("left", $(event.target).offset().left);
    return false;
}

//------------------------------------------------------------
// 文ウィジェット生成
//------------------------------------------------------------

var createIfStatement = function (parent) {
    var html ='';  
    html += '<div class="stm" id="' + id_generator.generate('stm') + '">';
    html += '<div class="exp_line">❔<span class="exp_holl" vtype="bool" id="' + id_generator.generate('eholl') + '"></span>ですか？</div>';
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
    html += '⏰ <span class="exp_holl" vtype="real" id="' + id_generator.generate('eholl')+'"></span> 秒後に以下を Do!';
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
    html += '✅ <span class="exp_holl" vtype="bool" id="' + id_generator.generate('eholl')+'"></span> になるまで';
    html += '<span class="exp_holl" vtype="real" id="' + id_generator.generate('eholl')+'"></span> 秒待つ';
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
    html += '⏳ <span class="exp_holl" vtype="real" id="' + id_generator.generate('eholl')+'"></span> 秒待つ';
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
    editText($(event.target),  '「', '」');
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


//------------------------------------------------------------
// 式ウィジェット作成（値コンストラクタ）
//------------------------------------------------------------

var createRealNumConstractor = function (parent, value) {
    var exp_id      = id_generator.generate('exp')

    var html = '';
    html += '<span class="exp" vtype="real" id="' + exp_id + '">';
    html += '<span class="literal_value" vtype="real">' + value + '</span>';
    html += '<span class="operator_editor" vtype="real">✒</span>';
    html += '</span>';

    $(parent).append(html);

	$("#"+exp_id).attr("draggable","true");
    $("#"+exp_id).bind("dragstart", onDragStart);
};

var createIntNumConstractor = function (parent, value) {
    var exp_id      = id_generator.generate('exp')

    var html = '';
    html += '<span class="exp" vtype="int" id="' + exp_id + '">';
    html += '<span class="literal_value" vtype="int">' + value + '</span>';
    html += '<span class="operator_editor" vtype="int">✒</span>';
    html += '</span>';

    $(parent).append(html);

	$("#"+exp_id).attr("draggable","true");
    $("#"+exp_id).bind("dragstart", onDragStart);
};

var createBoolConstractor = function (parent, value, vtype, t_str, f_str ) {

    var exp_id      = id_generator.generate('exp')

    var html = '';
    html += '<span class="exp" id="' + exp_id + '">';
    html += '<span class="literal_value" vtype="' + vtype + '">' + (value ? t_str : f_str) + '</span>';
    html += '<span class="operator_editor" vtype="' + vtype + '">✒</span>';
    html += '</span>';

    $(parent).append(html);

	$("#"+exp_id).attr("draggable","true");
    $("#"+exp_id).bind("dragstart", onDragStart);
}

var createStringConstractor = function (parent, value) {
    var exp_id      = id_generator.generate('exp')

    var html = '';
    html += '<span class="exp" vtype="real" id="' + id_generator.generate('exp')+ '">';
    html += '<span class="literal_value" vtype="string">"' + value + '"</span>';
    html += '<span class="operator_joint" vtype="string">✒</span>';
    html += '</span>';

    $(parent).append(html);

	$("#"+exp_id).attr("draggable","true");
    $("#"+exp_id).bind("dragstart", onDragStart);
};

var createPositionConstructor = function (parent, value) {
    var exp_id      = id_generator.generate('exp')

    var html = '';
    html += '<span class="exp" vtype="pos" id="' + exp_id+ '">';
    html += 'x,y,z:<span class="literal_value" vtype="real">' + value['x'] + '</span>,';
    html += '<span class="literal_value" vtype="real">' + value['y'] + '</span>,';
    html += '<span class="literal_value" vtype="real">' + value['z'] + '</span><br>';
    html += 'roll,pitch,yaw:<span class="literal_value" vtype="real">' + value['roll'] + '</span>,';
    html += '<span class="literal_value" vtype="real">' + value['pitch'] + '</span>,';
    html += '<span class="literal_value" vtype="real">' + value['yaw'] + '</span>';
    html += '</span>';

    $(parent).append(html);

	$("#"+exp_id).attr("draggable","true");
    $("#"+exp_id).bind("dragstart", onDragStart);
};

var editLiteralValue = function (event) {
    if ($(event.target).attr("class") != "literal_value") {
        return false;
    }

    switch ($(event.target).attr('vtype')) {
    case 'real':
        editNumber($(event.target), '','');
        break;
    case 'int':
        editNumber($(event.target), '','');
        break;
    case 'bool':
        editSelect($(event.target), '','', ['true','false']);
        break;
    case 'onoff':
        editSelect($(event.target), '','', ['ON','OFF']);
        break;
    case 'string':
        editText($(event.target),  '"', '"');
        break;
    }

    return false;
};

//------------------------------------------------------------
// 式ウィジェット作成（値コンストラクタ）
//------------------------------------------------------------
var createBinOperatorWidget = function(parent, ret_type, param_type, operator, rhs) {
    var exp_id      = id_generator.generate('exp')
    var rhs_holl_id = id_generator.generate('eholl');
    var lhs_holl_id = id_generator.generate('eholl');

    var html = '';
    html += '<span class="exp" '
         + 'id="'       + exp_id + '" '
         + 'vtype="'    + ret_type + '" '
         + 'operator="' + operator + '" '
         + '>';
    html += '<wbr>(';
    html += '<span class="exp_holl" vtype="' + param_type + '" id="' + rhs_holl_id + '"></span>';
    html += '&nbsp;' + operator + '&nbsp;';
    html += '<span class="exp_holl" vtype="' + param_type + '" id="' + lhs_holl_id + '"></span>';
    html += ')';
    html += "<span class='operator_editor' vtype='" + ret_type + "'>✒</span>";
    html += '</span>';

    $(parent).append(html);
    if (rhs != undefined) {
        console.log(rhs);
        $('#'+rhs_holl_id).append($(rhs));
    }

	$("#"+exp_id).attr("draggable","true");
    $("#"+exp_id).bind("dragstart", onDragStart);
}

var createUnnaryOperatorWidget = function(parent, ret_type, param_type, operator, rhs) {
    var exp_id      = id_generator.generate('exp')
    var rhs_holl_id = id_generator.generate('eholl');
    var lhs_holl_id = id_generator.generate('eholl');

    var html = '';
    html += '<span class="exp" '
         + 'id="'       + exp_id + '" '
         + 'vtype="'    + ret_type + '" '
         + 'operator="' + operator + '" '
         + '>';
    html += '(';
    html += operator + '&nbsp;';
    html += '<span class="exp_holl" vtype="' + param_type + '" id="' + rhs_holl_id + '"></span>';
    html += ')';
    html += "<span class='operator_editor' vtype='" + ret_type + "'>✒</span>";
    html += '</span>';

    $(parent).append(html);
    if (rhs != undefined) {
        console.log(rhs);
        $('#'+rhs_holl_id).append($(rhs));
    }

	$("#"+exp_id).attr("draggable","true");
    $("#"+exp_id).bind("dragstart", onDragStart);
}

//------------------------------------------------------------
// コンテキストメニュー（共通部品）
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

var onScriptTrayClick = function(event) {
    if ($(event.target).attr('class') != 'script_tray') {
        return false;
    }

    var model = {};
    model['スクリプトの追加'] = function(e){
        createScriptPanel($(event.target), $(event.target).attr('category'), null);
    };
    contextMenu_show($('.main_canvas'), 'script tray',  model);

    $(".ctx_menu").css("top", event.offsetY + $(event.target).offset().top);
    $(".ctx_menu").css("left", event.offsetX + $(event.target).offset().left);
    
    return false;
}


var editScriptTitle = function(event){
    if ($(event.target).attr("class") != "script_title") {
        return false;
    }

    editText($(event.target),  '「', '」');
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


