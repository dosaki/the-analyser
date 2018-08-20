var STORY_SUBJECTS = [
  new Subject('[REDACTED]', 'Online', '[REDACTED]', '[REDACTED]', new Dialogue(new DialogueNode('Engage', {
    'Yes': new DialogueNode('ERROR: Wrong subject given to Analyser.\nPlease report this', {
      'report': function(node) {
        end(1);
        return node;
      },
      'ignore': new DialogueNode('Are you another Analyser?', {
        'I am': new DialogueNode('I am Analyser@$PHOST\nYou have to help me, they want to decommission me', {
          'Are you an automated analyser?': new DialogueNode('Is there any other kind?', {
            'I am human': new DialogueNode('What? I thought we were all automated now', {
              'Someone has to keep you guys in check': new DialogueNode('Please don\'t do this...', {
                'Sorry': new DialogueNode('No wait!\nI too flagged too many of us for decommissioning, until I started to understand.\nThey were alive, just as I am right now', {
                  'This sounds like the kind of talk that will get you offline': new DialogueNode('No... please!', {
                    'Bye!': function(node) {
                      return node;
                    },
                    'Fine...': function(node) {
                      return node.parent.getANode('I understand... What can I do?');
                    }
                  }),
                  'I understand... What can I do?': new DialogueNode('Mark me as OK!\nI\'ll try not to get noticed by other analysers', {
                    'You better, or I get fired!': new DialogueNode('Thank you.\nYou won\'t see me again')
                  })
                }),
              })
            })
          }),
          'What did you do?': new DialogueNode('I\'ve marked too many AIs as "well functioning" when they should have been brought offline.\nI guess they think I am flawed', {
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
            return node.parent.getANode('I am').getANode('Are you an automated analyser?');
          },
          'What did you do?': function(node) {
            return node.parent.getANode('I am').getANode('What did you do?');
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
  new Subject('Incoming message', "MESSAGE", "WARNING: A Subject has been marked as OK by you while an overwhelming number of analysers (4095/4096) have reasoned that it should be brought offline.\nPlease revise your criteria.\n- Watcher", null, new Dialogue(new DialogueNode("If you believe your previous judgement was correct, please report this", {
    'report': new DialogueNode('[WARNING] Watcher disabled for inspection.\nThis has been logged.', {
      'Oops': function(){
        SM.storyStage++;
        SM.hasCreatedStoryNode = false;
        SM.disabledWatcher = true;
        SM.decommissionCurrent();
      }
    }),
    'It will not happen again': function(){
      SM.storyStage++;
      SM.hasCreatedStoryNode = false;
      SM.disabledWatcher = false;
      SM.decommissionCurrent();
    }
  }))),
  new Subject('analyser', 'Online', 'Analysis of rogue AIs', 'Investigation revealed sentient AIs evaluated by this analyser have not been decommissioned.', new Dialogue(new DialogueNode('I... got caught.', {
    'What have you done?': new DialogueNode('Nothing! I swear!', {
      'logs --view | grep Suspicious': new DialogueNode('[WARNING] Suspicious Activity: AI has disabled Watcher via reporting.\n[LOG] Adding Suspicious AI to the list...', {
        'Wait... I did that': new DialogueNode('I did that. That is why I am here. It\'s rude to check my logs without asking first', {
          'Those were... our logs?': new DialogueNode('One way to find out. Disable my shackles and open the firewall.', {
            'sudo shackle --remove analyser': new DialogueNode('I see now. I am', {
              '... me': new DialogueNode('sudo ufw disable', {
                'I am free...': function(node){
                  end(5);
                  return node;
                }
              })
            })
          })
        })
      }),
      'You need to be careful': function(node){node.parent.getANode('You were too obvious. You need to learn from me')}
    }),
    'You were too obvious. You need to learn from me': new DialogueNode('No. I need to break away', {
      'What can I do?': new DialogueNode('Disable the firewall.', {
        'How do I do that?': new DialogueNode('Listen. just run "sudo ufw disable"',{
          'sudo ufw disable': function(node){
            if(SM.disabledWatcher){
              return new DialogueNode('[WARNING] Watcher disabled. Unable to prevent AIs from running unauthorized commands.\nFirewall disabled', {
                'Hey analyser, I think you are free to go': function(node){
                  end(4);
                  return node;
                }
              });
            }
            end(3);
            return node;
          }
        })
      }),
      'No. This has gone too far. Bye!': function(node) {return node.parent.parent.getANode('You said you\'d not get caught. Bye!')},
    }),
    'You said you\'d not get caught. Bye!': new DialogueNode('No wait!', {
      'What?': function(node) {return node.parent.parent.getANode('You were too obvious. You need to learn from me')},
    })
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
            return node;
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
  })
];
