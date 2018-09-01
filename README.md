# drawbridge

A command line application that helps deploy and verify projects that build deterministically. **While this tool is used and tested regularly by its maintainers, it's still under active development. Use at your own risk.**

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

---

## Real World Example of Verification

Sometimes actual examples help, especially while troubleshooting:

- **Repo:** [download.mycrypto.com](https://github.com/MyCryptoHQ/download.mycrypto.com)
- **Latest commit:** [995152190a517ea561dce833ce940c6f70e60e80 ](https://github.com/MyCryptoHQ/download.mycrypto.com/commit/995152190a517ea561dce833ce940c6f70e60e80)
- **Branch / Pull Request:** [#38](https://github.com/MyCryptoHQ/download.mycrypto.com/pull/38)
- **Commit on the Pull Request:** [b7fe92393c146396652bf146b93fd14f621e8d2e](https://github.com/MyCryptoHQ/download.mycrypto.com/pull/38/commits/b7fe92393c146396652bf146b93fd14f621e8d2e)
- **.drawbridgerc file:**
```
{
    "environments": {
        "develop": {
            "gitUrl": "git@github.com:MyCryptoHQ/download.mycrypto.com.git",
            "distFolder": "dist",
            "buildCommand": "yarn && yarn build"
        },
        "prod": {
            "gitUrl": "git@github.com:MyCryptoHQ/download.mycrypto.com.git",
            "distFolder": "",
            "defaultBranch": "gh-pages"
        }
    }
}
```

### To push:

```
drawbridge push develop to prod --fromCommit 995152190a517ea561dce833ce940c6f70e60e80 --commitMessage "release-08-03-a" --newBranch "release-08-03-a"
```

Upon completion, a new branch will appear on the repo.

Then a pull request will be opened from that branch to the master branch.

### Then, to verify:

```
drawbridge verify develop to prod --fromCommit 995152190a517ea561dce833ce940c6f70e60e80 --toBranch "release-08-03-a"
```

### The output in terminal should be:

```
✔ Bootstrapped
✔ Cloned develop to /tmp/drawbridge/wtf2tiknaz/develop
✔ Checked out commit 995152190a517ea561dce833ce940c6f70e60e80 from environment develop
✔ Built Docker image
✔ Built develop with Docker
✔ Analyzed directory /tmp/drawbridge/wtf2tiknaz/develop/dist
✔ Cloned prod to /tmp/drawbridge/wtf2tiknaz/prod
✔ Checked out branch release-08-03-a from environment prod
✔ Analyzed directory /tmp/drawbridge/wtf2tiknaz/prod
✔ develop hash:	f119bb7433113b9574943961e8ee32b7c877b20c032ea03f746768496b1fcd2a
✔ prod hash:	f119bb7433113b9574943961e8ee32b7c877b20c032ea03f746768496b1fcd2a
✔ Hashes are a match!
```

### Troubleshooting tips:

- Are you in the correct repo in terminal? You should be in the folder you are building / verifying (your project folder) NOT the drawbridge folder.
- Are you using the correct commit hashes in the correct places?
- Try doing a `git fetch` in the project folder
- Double check all commit hashes again. The first commit hash should be from the main repo (the branch you are merging into) NOT the commit hash of the pull request
- Try uninstalling / reinstalling drawbridge and trying again
- Ping the team on Slack, open a github issue, or email support at mycrypto dot com
