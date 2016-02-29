define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'codemirror/lib/codemirror',
    'codemirror/addon/fold/foldgutter',
],   function(IPython, $, require, events, codemirror) {
    "use strict";
    
    /**
     * Called after extension was loaded
     *
     */
    var load_extension = function() {

        IPython.CodeCell.prototype.execute = function (stop_on_error) {
            if (!this.kernel || !this.kernel.is_connected()) {
                console.log("Can't execute, kernel is not connected.");
                return;
            }

            this.output_area.clear_output(false, true);

            if (stop_on_error === undefined) {
                stop_on_error = true;
            }

            var old_msg_id = this.last_msg_id;

            if (old_msg_id) {
                this.kernel.clear_callbacks_for_msg(old_msg_id);
                if (old_msg_id) {
                    delete IPython.CodeCell.msg_cells[old_msg_id];
                }
            }
            if (this.get_text().trim().length === 0) {
                // nothing to do
                this.set_input_prompt(null);
                return;
            }
            this.set_input_prompt('*');
            this.element.addClass("running");

            var outback = this.output_area.prompt_overlay;
            var inback = this.input[0].firstChild;

            $(outback).css({"background-color":"#e0ffff"});
            $(inback).css({"background-color":"#e0ffff"});

            var callbacks = this.get_callbacks();

            this.last_msg_id = this.kernel.execute(this.get_text(), callbacks, {silent: false, store_history: true,
                stop_on_error : stop_on_error});
            IPython.CodeCell.msg_cells[this.last_msg_id] = this;
            this.render();
            this.events.trigger('execute.CodeCell', {cell: this});
        };

        IPython.CodeCell.prototype._handle_execute_reply = function (msg) {
            this.set_input_prompt(msg.content.execution_count);
            var cells = IPython.notebook.get_cells();
            var outback_now = this.output_area.prompt_overlay; //現在実行中のセルの要素を取得
            var inback_now = this.input[0].firstChild;

            if (msg.content.status != "ok" && msg.content.status != "aborted") {
                $(outback_now).css({"background-color": "#ffc0cb"}); //現在のセルを警告色に変更
                $(inback_now).css({"background-color": "#ffc0cb"});
            } else if (msg.content.status != "aborted") {
                $(outback_now).css({"background-color": "#faf0e6"}); //現在のセルを完了色に変更
                $(inback_now).css({"background-color": "#faf0e6"});
            }

            this.element.removeClass("running");
            this.events.trigger('set_dirty.Notebook', {value: true});
        };
    };

    var visualize_tools = {
        load_ipython_extension : load_extension
    };

    return visualize_tools;
});
