# drawbridge

A command line application that helps deploy and verify projects that build deterministically. While this tool is used and tested regularly by its maintainers, it's still under active development. Use at your own risk.

## Prerequisites

This app is developed for Mac and Linux environments. Windows is not supported at this time. 

The following programs need to be installed and available on your `PATH`:

* `node`

* `npm`

* `docker`

* `git`

## Installation

Clone repository, install modules, build project, install globally:
```
git clone git@github.com:MyCryptoHQ/drawbridge.git
cd drawbridge
npm install
npm run build
npm install -g .
```

## Updating
Run the following in the drawbridge source folder:
```
git pull origin
npm install
npm run build
```

## Uninstalling

Run the following in the drawbridge source folder:
```
npm remove -g .
```  