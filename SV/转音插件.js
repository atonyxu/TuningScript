var SVM = {
    "cate": "Note Manipulation"
}

var cell = SV.QUARTER / 32;
var doudong = 0.0

function getClientInfo() {
    return {
        "name": SV.T("Shift Pitch"),
        "category": SV.T(SVM.cate),
        "author": "白糖の正义铃 BiliBili HomePage: space.bilibili.com/180668218",
        "versionNumber": 1.1,
        "minEditorVersion": 65537
    };
}

function getTranslations(langCode) {
    if (langCode == "zh-cn") {
        return [
            ["Shift Pitch", "转音插件"],
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

    // 获取光标
    var playhead = SV.getPlayback().getPlayhead();
    var timeAxis = SV.getProject().getTimeAxis();
    var playheadBlicks = timeAxis.getBlickFromSeconds(playhead)
        - scope.getTimeOffset();

    var position = playheadBlicks
    var a = playheadBlicks % cell
    if (a >= (cell / 2)) {
        var position = playheadBlicks - playheadBlicks % cell + cell
    } else {
        var position = playheadBlicks - playheadBlicks % cell
    }

    var groupNoteNum = group.getNumNotes();
    for (var i = 0; i < groupNoteNum; i++) {
        var thisNote = group.getNote(i);
        var orgOnset = thisNote.getOnset();
        var orgEnd = thisNote.getEnd();
        var orgDur = thisNote.getDuration();
        if (orgOnset < position && orgEnd > position) {
            var durLeft = position - orgOnset;
            var durRight = orgEnd - position;
            thisNote.setDuration(durLeft);
            var newNote = thisNote.clone();
            thisNote.setAttributes({
                "dF0Vbr": 0.0,
                "dF0Right": doudong,
            });
            newNote.setPitch(thisNote.getPitch());
            newNote.setTimeRange(thisNote.getEnd(), durRight);
            newNote.setLyrics("-");
            newNote.setAttributes({
                "dF0Left": doudong,
            });

            if (durLeft <= durRight) {
                thisNote.setPitch(thisNote.getPitch() - 2);
            } else {
                var nextNoteNum = thisNote.getIndexInParent() + 1
                if (nextNoteNum < groupNoteNum) {
                    newNote.setPitch(group.getNote(nextNoteNum).getPitch());
                }
            }
            group.addNote(newNote);
        }
    }
    SV.finish();
}
