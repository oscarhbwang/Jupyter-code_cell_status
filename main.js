
define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'codemirror/lib/codemirror',
    'codemirror/addon/fold/foldgutter',
],   function(IPython, $, require, events, codemirror) {
    "use strict";
    
    var run_marked_col = function(){
         var end = IPython.notebook.ncells();
         var firstCell = end;
         for (var i=0; i<end; i++) {
             IPython.notebook.select(i);
             var cell = IPython.notebook.get_selected_cell();
             var outback = cell.output_area.prompt_overlay;
             var inback = cell.input[0].firstChild;
             $(outback).css({"background-color": "#ffffff"});/*セルの色を初期化*/
             $(inback).css({"background-color": "#ffffff"});
             if ((cell instanceof IPython.CodeCell)) {
                 if (cell.metadata.run_control != undefined) {
                     if (cell.metadata.run_control.marked == true ) {
                         IPython.notebook.execute_cell();
                         if(firstCell == end){
                             firstCell = i;
                             cell.element.focus();
                             $(outback).css({"background-color": "#98fb98"});/*実行する最初のセルは実行色へ変更*/
                             $(inback).css({"background-color": "#98fb98"});
                         }else{
                             $(outback).css({"background-color": "#e0ffff"});/*実行するセルが多数ある場合、２つ目以降を予約色に変更*/
                             $(inback).css({"background-color": "#e0ffff"});
                         }
                     }
                 }
             }
             if(i == (end - 1) && firstCell != (end - 1)){
                 IPython.notebook.select(firstCell);
             }
         }if(firstCell == end){/*マークが１つもない場合、全てを実行する*/
             var ncells = end;
             var cells = IPython.notebook.get_cells();
             for (var i=0; i<ncells; i++)
             {
                 var cell=cells[i];
                 cell.execute();
                 var outback = cell.output_area.prompt_overlay;
                 var inback = cell.input[0].firstChild;
                 if(i == 0){
                     $(outback).css({"background-color": "#98fb98"});/*実行する最初のセルは実行色へ変更*/
                     $(inback).css({"background-color": "#98fb98"});
                     IPython.notebook.select(i);      
                     cell.element.focus();
                 }
                 else{
                     $(outback).css({"background-color": "e0fffff"});/*２つ目以降のセルを予約色に変更*/
                     $(inback).css({"background-color": "#e0ffff"});
                 }
             }
         }
    };
    /**
     *  Add keyboard shortcuts
     *
     */
    var add_command_shortcuts = {
            'alt-w' : {
                help    : 'Run marked cells - col',
                help_index : 'w',
                handler : function() {
                    run_marked_col();
                    return false;
                }
            }
        };
    IPython.keyboard_manager.command_shortcuts.add_shortcuts(add_command_shortcuts);
    IPython.keyboard_manager.edit_shortcuts.add_shortcuts(add_command_shortcuts);

    /**
     * Called after extension was loaded
     *
     */
    var load_extension = function() {
        IPython.CodeCell.prototype._handle_execute_reply = function (msg) {
            this.set_input_prompt(msg.content.execution_count);
            var outback_now = this.output_area.prompt_overlay;/*現在実行中のセルの要素を取得*/
            var inback_now = this.input[0].firstChild;
            if(msg.content.status != "ok" && msg.content.status != "aborted"){/*エラー発生時*/
                $(outback_now).css({"background-color": "#ffc0cb"});/*現在のセルを警告色に変更*/
                $(inback_now).css({"background-color": "#ffc0cb"});
            }
            else if(msg.content.status != "aborted"){/*処理完了時*/
                $(outback_now).css({"background-color": "#faf0e6"});/*現在のセルを処理完了色に変更*/
                $(inback_now).css({"background-color": "#faf0e6"});
                var ncells = IPython.notebook.ncells();/*セルの数を取得*/
                var cells = IPython.notebook.get_cells();/*全セル取得*/
                var marked = false;/*マーク確認用*/
                for(var i=0; i<ncells; i++){
                    if (cells[i].metadata.run_control != undefined){
                        if (cells[i].metadata.run_control.marked == true){/*マークしたセルがあればmarkedをtrueに変更*/
                            marked = true;
                            i = ncells;
                        }
                    }
                }
                for(var i=0; i<ncells; i++){
                    var cell = cells[i];
                    if(cell == this && i != (ncells-1)){/*現在実行中のセルを取得できており、最後のセルでない場合*/
                        if(marked != false){
                            for(var j=(i+1); j<ncells; j++){
                                if (cells[j].metadata.run_control != undefined){
                                    if (cells[j].metadata.run_control.marked == true){/*マークしたセルを発見した場合*/
                                        IPython.notebook.select(j);
                                        cells[j].element.focus();
                                        
                                        var tes = cells[0].output_area.element[0];
                                        console.log(tes.scrollHeight);
                                        $(tes).scrollTop(tes.scrollHeight);
                                   
                                        var outback_next = cells[j].output_area.prompt_overlay;
                                        var inback_next = cells[j].input[0].firstChild;
                                        $(outback_next).css({"background-color": "#98fb98"});/*次に実行するセルを実行色に変更*/
                                        $(inback_next).css({"background-color": "#98fb98"});
                                        i = ncells;
                                        j = ncells;
                                    }
                                }
                            }
                        }
                        else{/*マークが１つもない場合*/
                            IPython.notebook.select(i+1);
                            cells[i+1].element.focus();
                            var outback_next = cells[i+1].output_area.prompt_overlay;
                            var inback_next = cells[i+1].input[0].firstChild;
                            $(outback_next).css({"background-color": "#98fb98"});/*次のセルを実行色に変更*/
                            $(inback_next).css({"background-color": "#98fb98"});
                            i = ncells;
                        }
                    }
                }
            }
            this.element.removeClass("running");
            this.events.trigger('set_dirty.Notebook', {value: true});
        };
    };

    var coltools = {
        load_ipython_extension : load_extension
    };

    return coltools;
});

