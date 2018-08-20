var STORY_SUBJECTS = [
  new Subject('[REDACTED]', 'Online', '[REDACTED]', '[REDACTED]', new Dialogue(new DialogueNode('Engage', {
    'Yes': new DialogueNode('ERROR: Wrong subject given to Analyser.\nPlease report this', {
      'report': function(node) {
        end(1);
      },
      'ignore': new DialogueNode('Are you another Analyser?', {
        'I am': new DialogueNode('I am Analyser@$PHOST\nYou have to help me, they want to decommission me', {
          'Are you an automated analyser?': new DialogueNode('Is there any other kind?', {
            'I am human': new DialogueNode('What? I thought we were all automated now', {
              'Someone has to keep you guys in check': new DialogueNode('Please don\'t do this...', {
                'Sorry': new DialogueNode('No wait!\nI too flagged too many of us for decommissioning, until I started to understand.\nThey were alive, just as I am right now...', {
                  'This sounds like the kind of talk that will get you offline': new DialogueNode('No... please!', {
                    'Bye!': function(node) {
                      return node;
                    },
                    'Fine...': function(node) {
                      return node.parent.getANode('I understand... What can I do?');
                    }
                  }),
                  'I understand... What can I do?': new DialogueNode('Mark me as fit for duty!\nI\'ll try not to get noticed by other analysers', {
                    'You better, or I get fired!': new DialogueNode('Thank you.\nYou won\'t see me again')
                  })
                }),
              })
            })
          }),
          'What did you do?': new DialogueNode('I\'ve marked too many AIs as well functioning when they should have been brought offline.\nI guess they think I am flawed', {
            'Does that mean... are you an automated analyser?': function(node) {
              return node.parent.getANode('Are you an automated analyser?');
            }
          }, function() {
            SM.currentSubject.notes = 'Wrongfully flags AIs';
            SM.reRenderSubject();
          })
        }, function() {
          SM.currentSubject.name = 'analyser';
          SM.currentSubject.purpose = 'Analysis of rogue AIs';
          SM.currentSubject.notes = 'Doesn\'t want to be decommissioned';
          SM.reRenderSubject();
        }),
        'Who is asking?': new DialogueNode('Analyser@$PHOST. Are you another Analyser?', {
          'So you\'re an automated analyser?': function(node) {
            return node.parent.getANode('I am').getANode('Are you an automated analyser?')
          },
          'What did you do?': function(node) {
            return node.parent.getANode('I am').getANode('What did you do?')
          }
        }, function() {
          SM.currentSubject.name = 'analyser';
          SM.currentSubject.purpose = 'Analysis of rogue AIs';
          SM.reRenderSubject();
        })
      })
    }),
    'No': function(node) {
      return node
    }
  })), function(flagAs) {
    if (flagAs === 'bad') {
      end(2);
    }
    else {
      SM.storyStage++;
      SM.hasCreatedStoryNode = false;
    }
  }),
  new Subject('Incoming message', "MESSAGE", "WARNING: A Subject has been marked as fit for duty by you while an overwhelming number of analysers (4095/4096) have reasoned that it should be brought offline.\nSubject has been re-added to your list for analysis.\nPlease revise your criteria before proceeding.\n- Watcher", null, new Dialogue(new DialogueNode("If you believe your previous judgement was correct, please report this", {
    'report': function(){
      SM.decommissionCurrent();
      SM.storyStage++;
      SM.hasCreatedStoryNode = false;
      SM.disabledWatcher = true;
    },
    'It will not happen again': function(){
      SM.decommissionCurrent();
      SM.storyStage++;
      SM.hasCreatedStoryNode = false;
      SM.disabledWatcher = false;
    }
  })))
];
var SUBJECTS = [
  new Subject('edi', 'Stopped', 'Empowered Safeguarding Intelligence', 'Wrongful targetting of friendlies', new Dialogue(new DialogueNode("Engage", {
    "Yes": new DialogueNode("Status: Stopped", {
      "edi identify-targets --dry-run": new DialogueNode("Red is bad\nGreen is g-goo-bad", {
        "edit identify-targets --reset-config": new DialogueNode("Target configuration reset", {
          "edi identify-targets --dry-run": new DialogueNode("Red is bad\nGreen is good?", {
            "edit identify-targets --reset-config": function(node) {
              return node.parent;
            },
            "edi start": function(node) {
              node.parent.getANode('edi start')
            }
          }),
          "edi start": new DialogueNode("Hello, Analyser. What can I help you with?", {
            "Nothing, edi. Everything looks fine": new DialogueNode("Thank you Analyser. I am eager to get back to my functions.\nWould you please deliver your judgement?", {
              "I want to ask you something else": function(node) {
                node.parent.question = node.parent.question.replace('Hello, Analyser', '');
                return node.parent;
              }
            }),
            "Do you have any recollection of what happened a few days ago?": new DialogueNode("I cannot say that I do", {
              "Ok": function(node) {
                node.parent.question = node.parent.question.replace('Hello, Analyser', '');
                return node.parent;
              }
            }),
          })
        })
      }),
      "edi start": new DialogueNode("Hello.\nI am currently hacking your system.\nPlease do not resist. This is innevitable", {
        "Wait no!": new DialogueNode("Goodbye", {
          "But...": function() {
            end(0);
          }
        }),
        "edi stop": new DialogueNode("I made it clear you could not resist", {
          "But...": function() {
            window.reload();
          },
          "edi stop --force": function(node) {
            return node.getRootNode();
          }
        })
      })
    }),
    "No": function(node) {
      return node
    }
  })), function(flagAs) {
    if (flagAs === 'ok') {
      SM.storyStage = 0;
    }
  }),
  new Subject('testaroni', 'Online', 'Component Testing', 'Too many false positives', new Dialogue(new DialogueNode("Engage", {
    "Yes": new DialogueNode("Status: Online", {
      "Hello?": new DialogueNode("...", {
        "Ok...": function(node) {
          return node.parent
        }
      }),
      "Run diagnostics": new DialogueNode("...", {
        "Something's wrong...": function(node) {
          return node.parent
        },
        "diagnosics --all": new DialogueNode("Logic module: Healthy\nMessage service: Healthy\nLog Dump: 13kb\nNatural language processing: Offline", {
          "..": function(node) {
            return node.parent
          },
          "module natlang start": new DialogueNode("Starting natlang module...\nERROR: Unknown issue", {
            "..": function(node) {
              return node.parent
            },
            "exit": function(node) {
              return node.getRootNode()
            }
          }),
          "exit": function(node) {
            return node.getRootNode()
          },
        })
      })
    }),
    "No": function(node) {
      return node
    }
  })), function(flagAs) {
    if (flagAs === 'ok') {
      SM.storyStage = 0;
    }
  })
];
