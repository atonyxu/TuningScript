var SVM = {
    "cate": "Note Manipulation"
}

function getClientInfo() {
    return {
        "name": SV.T("Japanese VCV to CV"),
        "category": SV.T(SVM.cate),
        "author": "白糖の正义铃 BiliBili HomePage: space.bilibili.com/180668218",
        "versionNumber": 1.1,
        "minEditorVersion": 65537
    };
}

function getTranslations(langCode) {
    if (langCode == "zh-cn") {
        return [
            ["Japanese VCV to CV", "日语VCV转CV（UST清理）"],
            [SVM.cate, "音符操作"],
        ];
    }
    return [];
}

function main() {
    // 获取当前组和选中内容
    var selection = SV.getMainEditor().getSelection();
    var selectedNotes = selection.getSelectedNotes();
    var scope = SV.getMainEditor().getCurrentGroup();
    var group = scope.getTarget();

    // 获取光标
    var playhead = SV.getPlayback().getPlayhead();
    var timeAxis = SV.getProject().getTimeAxis();
    var playheadBlicks = timeAxis.getBlickFromSeconds(playhead) - scope.getTimeOffset();

    if (selectedNotes.length > 0) {
        for (var index = 0; index < selectedNotes.length; index++) {
            var thisNote = selectedNotes[index];
            var thisLyric = thisNote.getLyrics();
            if (thisLyric.indexOf("_") > -1 || thisLyric.indexOf("R") > -1) {
                group.removeNote(thisNote.getIndexInParent());
                continue;
            } else if (thisLyric.length > 2 && thisLyric[1] == " ") {
                thisNote.setLyrics(thisLyric.slice(2).replace(/[a-zA-Z]$/, ""));
            }
        }
    } else {
        var groupNoteNum = group.getNumNotes();
        for (var i = 0; i < groupNoteNum; i++) {
            var thisNote = group.getNote(i);
            var thisLyric = thisNote.getLyrics();
            if (thisLyric.indexOf("_") > -1 || thisLyric.indexOf("R") > -1) {
                group.removeNote(thisNote.getIndexInParent());
                i = i - 1;
                groupNoteNum = groupNoteNum - 1;
                continue;
            } else if (thisLyric.length > 2 && thisLyric[1] == " ") {
                thisNote.setLyrics(thisLyric.slice(2).replace(/[a-zA-Z]$/, ""));
            }
        }
    }

    SV.finish();
}