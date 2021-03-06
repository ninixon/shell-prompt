var exec = require('child_process').exec,
    execSync = require('exec-sync');

var defaultPrompt = '$ ';

module.exports = function (defPrompt, cb) {
  if (typeof cb === 'undefined') {
    cb = defPrompt;
    defPrompt = defaultPrompt;
  }

  var args = getShellArgs();
  if (args === null) return cb(null, defPrompt);
  exec(process.env['SHELL'] + args, function (err, stdout, stderr) {
    if (err) return cb(null, defPrompt);
    cb(null, stdout);
  });
};

module.exports.sync = function (defPrompt) {
  if (typeof defPrompt === 'undefined') {
    defPrompt = defaultPrompt;
  }
  var args = getShellArgs();
  if (args === null) return defPrompt;
  var ps1 = execSync(process.env['SHELL'] + args, true).stdout;
  if (typeof ps1 === 'undefined') ps1 = defPrompt;
  return ps1;
};

function getShellArgs() {
  var shell = process.env['SHELL'];
  var parts = shell.split('/');
  var args = null;
  if (parts && parts.length) {
    var shellExe = parts[parts.length - 1];

    switch (shellExe) {
      case 'bash':
      case 'zsh':
      case 'sh':
        args = ' -l -i -c \'echo "$PS1"\'';
        break;

      case 'tcsh':
      case 'csh':
        args = ' -c \'echo "$prompt"\'';
        break;

      default:
        args = null;
    }
  }
  return args;
}

