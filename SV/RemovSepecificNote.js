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
    var phnGroup = SV.getPhonemesForGroup(scope);

    // 获取光标
    var playhead = SV.getPlayback().getPlayhead();
    var timeAxis = SV.getProject().getTimeAxis();
    var playheadBlicks = timeAxis.getBlickFromSeconds(playhead) - scope.getTimeOffset();

    var myForm = {
        "title": SV.T("Remove Sepecific Note"),
        "message": SV.T("匹配特定的歌词或者音素来删除音符"),
        "buttons": "OkCancel",
        "widgets": [
            {
                "name": "lrc1", "type": "TextBox",
                "label": SV.T("歌词全匹配删除"),
                "default": ""
            },
            {
                "name": "lrc2", "type": "TextBox",
                "label": SV.T("歌词部分匹配删除（支持正则表达式）"),
                "default": ""
            },
            {
                "name": "phn1", "type": "TextBox",
                "label": SV.T("音素全匹配删除"),
                "default": ""
            },
            {
                "name": "phn2", "type": "TextBox",
                "label": SV.T("音素部分匹配删除（支持正则表达式）"),
                "default": ""
            }
        ]
    };

    var res = SV.showCustomDialog(myForm);
    if (res.status) {
        var result = res.answers;
        var lrc1 = result.lrc1;
        var lrc2 = result.lrc2;
        var phn1 = result.phn1;
        var phn2 = result.phn2;

        if (lrc1 != "") {
            var groupNoteNum = group.getNumNotes();
            for (var i = 0; i < groupNoteNum; i++) {
                var thisNote = group.getNote(i);
                var thisLyric = thisNote.getLyrics();
                if (thisLyric == lrc1) {
                    group.removeNote(thisNote.getIndexInParent());
                }
            }
            return;
        }

        if (lrc2 != "") {
            var groupNoteNum = group.getNumNotes();
            for (var i = 0; i < groupNoteNum; i++) {
                var thisNote = group.getNote(i);
                var thisLyric = thisNote.getLyrics();
                var flags = "g";
                var regex = new RegExp(lrc2, flags);
                if (regex.test(thisLyric)) {
                    group.removeNote(thisNote.getIndexInParent());
                }
            }
            return;
        }

        if (phn1 != "") {
            var groupNoteNum = group.getNumNotes();
            for (var i = 0; i < groupNoteNum; i++) {
                var thisNote = group.getNote(i);
                var phn;
                if (thisNote.getPhonemes() == "") {
                    phn = phnGroup[thisNote.getIndexInParent()];
                } else {
                    phn = thisNote.getPhonemes();
                }
                if (phn == phn1) {
                    group.removeNote(thisNote.getIndexInParent());
                }
            }
            return;
        }

        if (phn2 != "") {
            var groupNoteNum = group.getNumNotes();
            for (var i = 0; i < groupNoteNum; i++) {
                var thisNote = group.getNote(i);
                var phn;
                if (thisNote.getPhonemes() == "") {
                    phn = phnGroup[thisNote.getIndexInParent()];
                } else {
                    phn = thisNote.getPhonemes();
                }
                var flags = "g";
                var regex = new RegExp(phn2, flags);
                if (regex.test(phn)) {
                    group.removeNote(thisNote.getIndexInParent());
                }
            }
            return;
        }
    }
    SV.finish();
}
