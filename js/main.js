var SUBJECT_MANAGER = new SubjectManager("[subject_info_window]", "[subject_list_window]", "[dialogue_window]", SUBJECTS);

function update(tick){
  SUBJECT_MANAGER.update();
  setTimeout(update, tick);
}


update(250);
