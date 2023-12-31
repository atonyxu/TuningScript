var SVM = {
    "cate": "Note Manipulation"
}

function getClientInfo() {
    return {
        "name": SV.T("Find And Replace"),
        "category": SV.T(SVM.cate),
        "author": "白糖の正义铃 BiliBili HomePage: space.bilibili.com/180668218",
        "versionNumber": 1.1,
        "minEditorVersion": 65537
    };
}

function getTranslations(langCode) {
    if (langCode == "zh-cn") {
        return [
            ["Find And Replace", "查找与替换"],
            [SVM.cate, "音符操作"]
        ];
    }
    return [];
}

var phngroup = SV.getPhonemesForGroup(SV.getMainEditor().getCurrentGroup())
function getNotePhn(the_note) {
    if (the_note.getPhonemes() == "") {
        return phngroup[the_note.getIndexInParent()];
    } else {
        return the_note.getPhonemes();
    }
}

function main() {
    // 获取当前组和选中内容
    var selection = SV.getMainEditor().getSelection();
    var selectedNotes = selection.getSelectedNotes();
    var scope = SV.getMainEditor().getCurrentGroup();
    var group = scope.getTarget();
    var phnGroup = SV.getPhonemesForGroup(scope);
    var navMain = SV.getMainEditor().getNavigation();

    // 获取光标
    var playhead = SV.getPlayback().getPlayhead();
    var timeAxis = SV.getProject().getTimeAxis();
    var playheadBlicks = timeAxis.getBlickFromSeconds(playhead) - scope.getTimeOffset();

    var myForm = {
        "title": SV.T("Find And Replace"),
        "message": SV.T("对歌词&音素进行查找&替换(仅限在一个音符组内)"),
        "buttons": "OkCancel",
        "widgets": [
            {
                "name": "target", "type": "ComboBox",
                "label": "运作对象",
                "choices": ["歌词", "音素"],
                "default": 0
            },
            {
                "name": "mode", "type": "ComboBox",
                "label": "运作模式",
                "choices": ["光标处开始查找", "光标处开始查找并替换一个", "全部（选择部分）查找并替换"],
                "default": 0
            },
            {
                "name": "pipei", "type": "ComboBox",
                "label": "匹配方式",
                "choices": ["全匹配", "部分匹配"],
                "default": 0
            },
            {
                "name": "ftext", "type": "TextBox",
                "label": SV.T("查找"),
                "default": ""
            },
            {
                "name": "rtext", "type": "TextBox",
                "label": SV.T("替换"),
                "default": ""
            }
        ]
    };

    var res = SV.showCustomDialog(myForm);
    if (res.status) {
        var result = res.answers;
        var target = result.target;
        var mode = result.mode;
        var pipei = result.pipei;
        var ftext = result.ftext;
        var rtext = result.rtext;

        if (mode == 0) {
            var groupNoteNum = group.getNumNotes();
            for (var i = 0; i < groupNoteNum; i++) {
                var thisNote = group.getNote(i);
                var thisLyric = thisNote.getLyrics();
                var thisPhn = getNotePhn(thisNote);
                if (target == 0) {
                    if (pipei == 0) {
                        if (thisLyric == ftext && thisNote.getEnd() > playheadBlicks) {
                            selection.selectNote(thisNote);
                            navMain.setTimeLeft(thisNote.getOnset() - 200000000);
                            return;
                        }
                    } else {
                        if (thisLyric.indexOf(ftext) > -1 && thisNote.getEnd() > playheadBlicks) {
                            selection.selectNote(thisNote);
                            navMain.setTimeLeft(thisNote.getOnset() - 200000000);
                            return;
                        }
                    }
                } else {
                    if (pipei == 0) {
                        if (thisPhn == ftext && thisNote.getEnd() > playheadBlicks) {
                            selection.selectNote(thisNote);
                            navMain.setTimeLeft(thisNote.getOnset() - 200000000);
                            return;
                        }
                    } else {
                        if (thisPhn.indexOf(ftext) > -1 && thisNote.getEnd() > playheadBlicks) {
                            selection.selectNote(thisNote);
                            navMain.setTimeLeft(thisNote.getOnset() - 200000000);
                            return;
                        }
                    }
                }

            }
            return;
        }

        if (mode == 1) {
            var groupNoteNum = group.getNumNotes();
            for (var i = 0; i < groupNoteNum; i++) {
                var thisNote = group.getNote(i);
                var thisLyric = thisNote.getLyrics();
                var thisPhn = getNotePhn(thisNote);
                if (target == 0) {
                    if (pipei == 0) {
                        if (thisLyric == ftext && thisNote.getEnd() > playheadBlicks) {
                            selection.selectNote(thisNote);
                            thisNote.setLyrics(rtext);
                            navMain.setTimeLeft(thisNote.getOnset() - 200000000);
                            return;
                        }
                    } else {
                        if (thisLyric.indexOf(ftext) > -1 && thisNote.getEnd() > playheadBlicks) {
                            selection.selectNote(thisNote);
                            thisNote.setLyrics(thisLyric.replace(ftext, rtext));
                            navMain.setTimeLeft(thisNote.getOnset() - 200000000);
                            return;
                        }
                    }
                } else {
                    if (pipei == 0) {
                        if (thisPhn == ftext && thisNote.getEnd() > playheadBlicks) {
                            selection.selectNote(thisNote);
                            thisNote.setPhonemes(rtext);
                            navMain.setTimeLeft(thisNote.getOnset() - 200000000);
                            return;
                        }
                    } else {
                        if (thisPhn.indexOf(ftext) > -1 && thisNote.getEnd() > playheadBlicks) {
                            selection.selectNote(thisNote);
                            thisNote.setPhonemes(thisPhn.replace(ftext, rtext));
                            navMain.setTimeLeft(thisNote.getOnset() - 200000000);
                            return;
                        }
                    }
                }

            }
            return;
        }

        if (mode == 2) {
            if (selectedNotes.length > 0) {
                for (var index = 0; index < selectedNotes.length; index++) {
                    var thisNote = selectedNotes[index];
                    var thisLyric = thisNote.getLyrics();
                    var thisPhn = getNotePhn(thisNote);
                    if (target == 0) {
                        if (pipei == 0) {
                            if (thisLyric == ftext && thisNote.getEnd() > playheadBlicks) {
                                thisNote.setLyrics(rtext);
                                continue;
                            }
                        } else {
                            if (thisLyric.indexOf(ftext) > -1 && thisNote.getEnd() > playheadBlicks) {
                                thisNote.setLyrics(thisLyric.replace(ftext, rtext));
                                continue;
                            }
                        }
                    } else {
                        if (pipei == 0) {
                            if (thisPhn == ftext && thisNote.getEnd() > playheadBlicks) {
                                thisNote.setPhonemes(rtext);
                                continue;
                            }
                        } else {
                            if (thisPhn.indexOf(ftext) > -1 && thisNote.getEnd() > playheadBlicks) {
                                thisNote.setPhonemes(thisPhn.replace(ftext, rtext));
                                continue;
                            }
                        }
                    }
                }
            } else {
                var groupNoteNum = group.getNumNotes();
                for (var i = 0; i < groupNoteNum; i++) {
                    var thisNote = group.getNote(i);
                    var thisLyric = thisNote.getLyrics();
                    var thisPhn = getNotePhn(thisNote);
                    if (target == 0) {
                        if (pipei == 0) {
                            if (thisLyric == ftext && thisNote.getEnd() > playheadBlicks) {
                                thisNote.setLyrics(rtext);
                                continue;
                            }
                        } else {
                            if (thisLyric.indexOf(ftext) > -1 && thisNote.getEnd() > playheadBlicks) {
                                thisNote.setLyrics(thisLyric.replace(ftext, rtext));
                                continue;
                            }
                        }
                    } else {
                        if (pipei == 0) {
                            if (thisPhn == ftext && thisNote.getEnd() > playheadBlicks) {
                                thisNote.setPhonemes(rtext);
                                continue;
                            }
                        } else {
                            if (thisPhn.indexOf(ftext) > -1 && thisNote.getEnd() > playheadBlicks) {
                                thisNote.setPhonemes(thisPhn.replace(ftext, rtext));
                                continue;
                            }
                        }
                    }
                }
            }
        }
    }
    SV.finish();
}
