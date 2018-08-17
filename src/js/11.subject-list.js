var SUBJECTS = [
  new Subject('edi', 'Stopped', 'Empowered Safeguarding Intelligence', 'Wrongful targetting of friendlies', new Dialogue(new DialogueNode("Engage", {
    "Yes": new DialogueNode("Status: Stopped", {
      "edi identify-targets --dry-run": new DialogueNode("Red is bad.\nGreen is g-goo-bad.", {
        "edit identify-targets --reset-config": new DialogueNode("Target configuration reset.", {
          "edi identify-targets --dry-run": new DialogueNode("Red is bad.\nGreen is good?", {
            "edit identify-targets --reset-config": function(node){return node.parent}
          })
        })
      }),
      "edi start": new DialogueNode("Hello.\nI'm currently hacking your system.\nPlease do not resist. This is innevitable.", {
        "Wait no!": new DialogueNode("Goodbye.", {
          "But...": function(node){window.location.reload();}
        }),
        "edi stop": new DialogueNode("I made it clear you could not resist.", {
          "But...": function(node){window.reload();},
          "edi stop --force": function(node){return node.getRootNode();}
        })
      })
    }),
    "No": function(node){return node}
  }))),
  new Subject('testaroni', 'Online', 'Component Testing', 'Too many false positives', new Dialogue(new DialogueNode("Engage", {
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
