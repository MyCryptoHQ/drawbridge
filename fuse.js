const { FuseBox, JSONPlugin } = require('fuse-box');
const fuse = FuseBox.init({
  homeDir: 'src',
  target: 'server@es6',
  sourceMaps: { inline: true },
  output: 'dist/$name.js',
  plugins: [JSONPlugin()]
});
fuse
  .bundle('app')
  .instructions(' > index.ts')
  .watch();
fuse.run();
