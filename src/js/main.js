var SM = new SubjectManager("[subj_info]", "[subj_list]", "[dialogue_window]", "[dialogue_history]", SUBJECTS, 20);

function update(t){
  SM.update();
  setTimeout(update, t);
}

update(250);
