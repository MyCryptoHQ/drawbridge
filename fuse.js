const { FuseBox, JSONPlugin } = require('fuse-box');
const fuse = FuseBox.init({
  homeDir: 'src',
  target: 'server@es6',
  sourceMaps: { inline: true },
  output: 'dist/$name.js',
  plugins: [JSONPlugin()]
});
const {npm_lifecycle_event} = process.env;


if (npm_lifecycle_event === 'dev') {
  fuse
    .bundle('app')
    .instructions(' > index.ts')
    .watch();
} else {
  fuse
    .bundle('app')
    .instructions(' > index.ts');
}

fuse.run();
