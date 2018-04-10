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
## Example `.drawbridgerc` File

```
{
  "environments": {
    "develop": {
      "gitUrl": "git@github.com:skubakdj/MyCrypto.git",
      "distFolder": "dist/prod",
      "buildCommand": "yarn && npm run build"
    },
    "staging": {
      "gitUrl": "git@github.com:skubakdj/MyCrypto-Staging.git",
      "distFolder": "docs"            
    },
    "prod": {
      "gitUrl": "git@github.com:skubakdj/MyCrypto-Production.git",
      "distFolder": "docs"
    }
  }
}
```

## Command Examples

Push `develop` to `staging` from `develop` commit `bfeeab`:
```
drawbridge push develop to staging --fromCommit bfeeab --commitMessage "test-release-a" --newBranch "test-branch-a"
```
---

Verify `develop` to `staging` from `develop` commit `bfeeab` to `staging` branch `test-branch-a`:
```
drawbridge verify develop to staging --fromCommit bfeeab --toBranch "test-branch-a"
```

