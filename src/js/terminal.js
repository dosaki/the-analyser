function Terminal() {

  'use strict';

  var _self = this;

  var _commands = [];
  var _today = "";
  var _dir = "~"
  var _host = ""

  _self.animate = function(element) {
    var commands = element.children;
    var i = 1;
    commands[0].classList.remove("hidden");
    commands[0].classList.add("visible");
    var interval = setInterval(function() {
      commands[i].classList.remove("hidden");
      commands[i].classList.add("visible");
      i++;
      if (i >= element.children.length) {
        clearInterval(interval);
        document.querySelector('input[console_input]').focus();
      }
    }, 1500);
  }

  _self.hideAll = function(element) {
    var commands = element.children;
    for (var i = 0; i < commands.length; i++) {
      commands[i].classList.add("hidden");
    }
  }

  _self.print = function(element) {
    for (var c in _commands) {
      var command = commandForPrinting(c);
      command.className = "terminal-command hidden";
      element.appendChild(command);
      if (_commands[c]) {
        var result = _commands[c]();
        if (result) {
          var reply = document.createElement("div");
          reply.appendChild(result);
          reply.className = "hidden";
          element.appendChild(reply);
        }
      }
    }
  };

  var colour = function(string, colour) {
    return "<span class='console-" + colour + "'>" + string + "</span>";
  };

  var commandForPrinting = function(c) {
    var commandLine = document.createElement("div");
    var userHost = document.createElement("span");
    userHost.innerHTML = colour(PLAYER.name, 'purple') + colour('@', 'yellow') + colour(_host, 'green')+ colour(" "+_dir, 'yellow')+colour(' $','purple');
    var command = document.createElement("span");
    command.className = "console-run";
    command.innerHTML = c.replace('$USERNAME', PLAYER.name);

    commandLine.appendChild(userHost);
    commandLine.appendChild(command);
    return commandLine;
  }

  var _c = function(content) { //cell for file list
    return "<td>" + content + "</td>";
  };

  var makeFileForList = function(fileName, date, permissions) {
    var seconds = rand(0, 59);
    return _c(permissions) +
      _c(rand(1, 7)) +
      _c("root") +
      _c("analysts") +
      _c(rand(4, 99) + "." + rand(0, 9) + randPick(["", "K", "M"])) +
      _c(date + " 00:0" + rand(0, 2) + ":" + (seconds < 10 ? "0" + seconds : seconds)) +
      _c(fileName);
  };

  var makeFileList = function() {
    var table = document.createElement('table');
    table.className = "ls-list";
    var rwx = "r--r-----";
    var fileList = [];
    for (var i = 15; i >= 0; i--) {
      var date = new Date(new Date().setDate(new Date(_today.getDate() - i))).toISOString().split('T')[0];
      fileList.push(makeFileForList("decommission-" + date, date, rwx));
    }

    table.innerHTML = '<tr>' + fileList.join('</tr><tr>') + '</tr>';

    return table;
  };

  var _l = function(line, styleMap) { //line for output
    var lineElement = document.createElement("div");
    lineElement.innerHTML = line;
    var style = "";
    for (var o in styleMap) {
      style += o + ": " + styleMap[o] + ";"
    }
    lineElement.setAttribute('style', style);
    return lineElement;
  };

  var makeHelp = function() {
    var output = document.createElement("div");
    output.appendChild(_l("AI Analysis & Diagnositics CLI Tool"));
    output.appendChild(_l("Analyse and evaluate the AIs that have been flagged for analysis."));
    output.appendChild(_l("Select a subject from the list on the left, diagnose it to figure out what's wrong with it."));
    output.appendChild(_l("If it looks ok, flag it as fit for duty, otherwise mark it for decomission."));
    output.appendChild(_l("Usage:"));
    output.appendChild(_l("analyser --help", {
      "padding-left": "13px;"
    }));
    output.appendChild(_l("This help", {
      "padding-left": "26px;"
    }));
    output.appendChild(_l("analyser --analyse &lt;list&gt;", {
      "padding-left": "13px;"
    }));
    output.appendChild(_l("Start the interactible CLI tool.", {
      "padding-left": "26px;"
    }));
    return output;
  };

  var __nextScreen = function(e) {
    if (e.key.toLowerCase() === "n") {
      window.location.reload();
    } else if (["y", "enter"].indexOf(e.key.toLowerCase()) !== -1){
      SCREEN_MANAGER.next();
      document.removeEventListener('keydown', __nextScreen);
    }
  };

  var makeOutput = function() {
    var output = document.createElement("div");
    output.appendChild(_l("Loading modules..."));
    output.appendChild(_l("Attempting connection to Global AI Repository..."));
    output.appendChild(_l("Connected."));
    var confirmLine = document.createElement("div");
    var confirmation = document.createElement("span");
    confirmation.innerHTML = "Continue? [Y/n]"
    var input = document.createElement("input");
    input.setAttribute('type', 'text');
    input.className = "console-input";
    input.setAttribute('console_input', '');
    input.addEventListener('keydown', __nextScreen);
    document.addEventListener('keydown', __nextScreen);
    confirmLine.appendChild(confirmation);
    confirmLine.appendChild(input);
    output.appendChild(confirmLine);
    return output;
  };

  var init = function() {
    _today = new Date();
    _host = "terminal" + rand(1, 90);
    PLAYER.host = _host;
    _commands = {};
    _commands["ssh $USERNAME@analyser.tech"] = function() {
      _host = "analyser.tech"
      return null;
    };
    _commands["cd /var/decomissioning/"] = function() {
      _dir = "/var/decomissioning/";
      return null;
    };
    _commands["ls -lhtr"] = function() {
      return makeFileList();
    };
    _commands["analyser --help"] = function() {
      return makeHelp();
    };
    _commands["analyser --decommission ./decommission-" + _today.toISOString().split('T')[0] + ".list"] = function() {
      return makeOutput();
    };
  };

  init();
}

var TERMINAL;
window.addEventListener("load", function(event) {
  var terminalScreenElement = document.querySelector('[screen="1"]');
  TERMINAL = new Terminal();
  terminalScreenElement.onvisible = function() {
    TERMINAL.print(terminalScreenElement);
    TERMINAL.animate(terminalScreenElement);
  };
});
