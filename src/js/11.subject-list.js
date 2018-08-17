var SUBJECTS = [
  new Subject('testaroni', 'Online', 'Component Testing', 'Too many false positives', new Dialogue(new DialogueNode("Engage?", {
    "Yes": new DialogueNode("Status: Online", {
      "Hello?": new DialogueNode("...", {
        "Ok...": function(node){return node.parent}
      }),
      "Run diagnostics": new DialogueNode("...", {
        "Something's wrong...": function(node){return node.parent},
        "diagnosics --all": new DialogueNode("Logic module: Healthy\nMessage service: Healthy\nLog Dump: 13kb\nNatural language processing: Offline", {
          "..": function(node){return node.parent},
          "module natlang start": new DialogueNode("Starting natlang module...\nERROR: Unknown issue.", {
            "..": function(node){return node.parent},
            "exit": function(node){return node.getRootNode()}
          }),
          "exit": function(node){return node.getRootNode()},
        })
      })
    }),
    "No": function(node){return node}
  })))
];
