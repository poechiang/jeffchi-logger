import shelljs from 'shelljs';
import standard from 'standard-version';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const {
  _: [v],
  ...args
} = yargs(hideBin(process.argv)).parse();
const version = v || 'patch';

let prerelease;
if (args.alpha) {
  prerelease = 'alpha';
} else if (args.beta) {
  prerelease = 'beta';
} else if (args.rc) {
  prerelease = 'rc';
}
console.log(11111, args, prerelease);
const options = {
  releaseAs: version,
  prerelease,
  commitAll: !!args.all,
  dryRun: args.dryRun,
};

const scripts = {};
if (args.otp) {
  scripts.posttag = `git push --follow-tags && npm publish ${prerelease ? '--tag ' + prerelease : ''} ${
    args.dryRun ? '--dry-run' : ''
  } --otp${args.otp}`;
} else {
  scripts.posttag = `git push --follow-tags`;
}
if (options.commitAll) {
  scripts.prerelease = 'npm run format && git add -A .';
}

options.scripts = scripts;

if (!version) {
  shelljs.error.echo('The version is missed,one of valid values is <newversion> | major | minor | patch');
  shelljs.exit(-1);
}

standard(options)
  .then(() => {
    shelljs.echo('release is completed!');
  })
  .catch((reason) => Promise.reject(reason));
