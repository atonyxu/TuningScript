var SVM = {
    "cate": "Note Manipulation"
}

var cell = SV.QUARTER / 32;

function getClientInfo() {
    return {
        "name": SV.T("Split Note And Merge Notes"),
        "category": SV.T(SVM.cate),
        "author": "白糖の正义铃 BiliBili HomePage: space.bilibili.com/180668218",
        "versionNumber": 2.1,
        "minEditorVersion": 65537
    };
}

function getTranslations(langCode) {
    if (langCode == "ja-jp") {
        return [
            ["Split Note And Merge Notes", "音符を分割する && 音符を合わせる"] // Using BaiduTranslation

        ];
    }
    if (langCode == "zh-cn") {
        return [
            ["Split Note And Merge Notes", "拆音 && 合音"],
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

    // 合音部分 只会在选择两个连续音符时候才会触发
    if (selectedNotes.length == 2 && (selectedNotes[0].getIndexInParent() + 1) == selectedNotes[1].getIndexInParent()) {
        var firstNote = selectedNotes[0];
        var secondNote = selectedNotes[1];
        var newOnset = firstNote.getOnset();
        var newDur = secondNote.getEnd() - firstNote.getOnset();
        var newPitch = firstNote.getDuration() >= secondNote.getDuration() ? firstNote.getPitch() : secondNote.getPitch();
        var newLrc = firstNote.getLyrics();
        var newPhn = firstNote.getPhonemes();

        group.removeNote(firstNote.getIndexInParent());
        secondNote.setLyrics(newLrc);
        secondNote.setPitch(newPitch);
        secondNote.setPhonemes(newPhn);
        secondNote.setTimeRange(newOnset, newDur);

    } else {
        // 拆音部分
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
                    "dF0Right": 0.0,
                    "dF0Vbr": 0.0,
                });
                newNote.setPitch(thisNote.getPitch());
                newNote.setTimeRange(thisNote.getEnd(), durRight);
                newNote.setLyrics("-");
                newNote.setAttributes({
                    "dF0Left": 0.0,
                });
                group.addNote(newNote);
            }
        }
    }
    SV.finish();
}