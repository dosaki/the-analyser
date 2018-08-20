var SM = new SubjectManager("[subject_info_window]", "[subject_list_window]", "[dialogue_window]", "[dialogue_history]", SUBJECTS, 20);

function update(t){
  SM.update();
  setTimeout(update, t);
}

update(250);
