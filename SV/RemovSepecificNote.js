var SVM = {
    "cate": "Note Manipulation"
}

function getClientInfo() {
    return {
        "name": SV.T("Remove Sepecific Note"),
        "category": SV.T(SVM.cate),
        "author": "白糖の正义铃 BiliBili HomePage: space.bilibili.com/180668218",
        "versionNumber": 1.1,
        "minEditorVersion": 65537
    };
}

function getTranslations(langCode) {
    if (langCode == "zh-cn") {
        return [
            ["Remove Sepecific Note", "匹配删除特定音符"],
            [SVM.cate, "音符操作"]
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
    var phnGroup = SV.getPhonemesForGroup(SV.getMainEditor().getCurrentGroup());

    // 获取光标
    var playhead = SV.getPlayback().getPlayhead();
    var timeAxis = SV.getProject().getTimeAxis();
    var playheadBlicks = timeAxis.getBlickFromSeconds(playhead) - scope.getTimeOffset();

    var myForm = {
        "title": SV.T("Remove Sepecific Note"),
        "message": SV.T("匹配特定的歌词来删除音符"),
        "buttons": "OkCancel",
        "widgets": [
            {
                "name": "mode", "type": "ComboBox",
                "label": "运作模式",
                "choices": ["歌词全匹配删除", "歌词部分匹配删除（支持正则表达式）"],
                "default": 0
            },
            {
                "name": "ftext", "type": "TextBox",
                "label": SV.T("匹配文本"),
                "default": ""
            }
        ]
    };

    var res = SV.showCustomDialog(myForm);
    if (res.status) {
        var result = res.answers;
        var mode = result.mode;
        var ftext = result.ftext;

        if (mode == 0) {
            var groupNoteNum = group.getNumNotes();
            for (var i = 0; i < groupNoteNum; i++) {
                var thisNote = group.getNote(i);
                var thisLyric = thisNote.getLyrics();
                if (thisLyric == ftext) {
                    group.removeNote(thisNote.getIndexInParent());
                    i = i - 1;
                    groupNoteNum = groupNoteNum - 1;
                }
            }
            return;
        }

        if (mode == 1) {
            var groupNoteNum = group.getNumNotes();
            for (var i = 0; i < groupNoteNum; i++) {
                var thisNote = group.getNote(i);
                var thisLyric = thisNote.getLyrics();
                var flags = "g";
                var regex = new RegExp(ftext, flags);
                if (regex.test(thisLyric)) {
                    group.removeNote(thisNote.getIndexInParent());
                    i = i - 1;
                    groupNoteNum = groupNoteNum - 1;
                }
            }
            return;
        }

        if (mode == 2) {
            var groupNoteNum = group.getNumNotes();
            for (var i = 0; i < groupNoteNum; i++) {
                var thisNote = group.getNote(i);
                var phn;
                if (thisNote.getPhonemes() == "") {
                    phn = SV.getPhonemesForGroup(SV.getMainEditor().getCurrentGroup())[thisNote.getIndexInParent()];
                } else {
                    phn = thisNote.getPhonemes();
                }
                if (phn == ftext) {
                    group.removeNote(thisNote.getIndexInParent());
                    i = i - 1;
                    groupNoteNum = groupNoteNum - 1;
                }
            }
            return;
        }

        if (mode == 3) {
            var groupNoteNum = group.getNumNotes();
            for (var i = 0; i < groupNoteNum; i++) {
                var thisNote = group.getNote(i);
                var phn;
                if (thisNote.getPhonemes() == "") {
                    phn = SV.getPhonemesForGroup(SV.getMainEditor().getCurrentGroup())[thisNote.getIndexInParent()];
                } else {
                    phn = thisNote.getPhonemes();
                }
                var flags = "g";
                var regex = new RegExp(ftext, flags);
                if (regex.test(phn)) {
                    group.removeNote(thisNote.getIndexInParent());
                    i = i - 1;
                    groupNoteNum = groupNoteNum - 1;
                }
            }
            return;
        }
    }
    SV.finish();
}
