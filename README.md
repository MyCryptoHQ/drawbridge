# drawbridge

A command line application that accomplishes (1) verifying the contents of the `develop`, `staging`, and `prod` MyCrypto repositories and (2) building, committing, and pushing the `dist` files to these repos. 

This should provide a relatively easy method for developers to PR code across different environments, and for other devs to independently confirm the compiled code hasn't been tampered with. 

Docker is used under-the-hood to ensure deterministic builds across platforms. 

**Note: for testing purposes, `drawbridge` is currently configured to run against dummy repositories.** 

## Prerequisites 
This app has been developed and tested in a Linux environment and should also work on macOS. It currently will not run on Windows, though it's likely possible with a few tweaks.

The following programs need to be installed and available in the environment:
 - `node`
 - `npm`
 - `docker`
 - `git`
 
## Installation
```
git clone git@github.com:MyCryptoHQ/drawbridge.git
cd drawbridge
npm install
```
## Quick Usage Example
If someone wanted to deploy `develop` to `staging` and then push the code to GitHub, they could run:
```
npm start -- push develop to staging --newBranch aBranchName --commitMessage "A commit message"
```
Another dev could then pull down the new branch and verify the contents against the source branch:
```
npm start -- verify develop to staging --developBranch aBranchName
```

## Detailed Usage Guide
`drawbridge` uses the standard `npm start` to boot the app and arguments are passed in to specify functionality. There are four main modes of operation (`hash`, `verify`, `package`, `push`) and three environments (`develop`, `staging`, `prod`) that correspond to different repositories. Additional flags can target a particular branch or commit to be used with the supplied environment.



### Modes
Here's a rundown of the four modes where `[repo*]` is either `develop`, `staging`, or `prod`. **Modes `push` and `verify` are the most feature-packed and will likely be used more often than `package` and `hash`.**

 - `hash [repo]`
	 - Pull down the target repository, build the project, calculate a hash of the built files. 
	 - e.g. `npm start -- hash develop`
 - `verify [repoA] to [repoB]`
	 - Pull down `repoA` and `repoB`, build the projects, calculate hashes of the built files, and compare the hashes.
	 - e.g. `npm start -- verify develop to staging`
 - `package [repoA] to [repoB]`
	 - Pull down `repoA`, build the project, and copy the output to the `dist` folder of `repoB`.
	 - e.g. `npm start -- package develop to staging`
 - `push [repoA] to [repoB]`
	 - The same as mode `package`, but the changes to `repoB` are committed and pushed to origin. 
	 - **Requires two additional arguments `--newBranch [branchName]` and `--commitMessage [message]`.**
	 - e.g. `npm start -- push develop to staging --newBranch release-0.0.1 --commitMessage "Release 0.0.1"`

### Repo Modifiers
In conjunction with the standard `develop`, `staging`, and `prod` repo names, a particular branch or commit hash can be specified. These flags follow the format `--[repo]Branch [branchName]` and `--[repo]Commit [commitHash]`. If none is supplied, the default branch and latest commit will be used. 

For the sake of completeness, here's the full list of modifiers provided by the above convention:
 - `--developBranch [branchName]`
 - `--developCommit [commitHash]`
 - `--stagingBranch [branchName]`
 - `--stagingCommit [commitHash]`
 - `--prodBranch [branchName]`
 - `--prodCommit [commitHash]`


## More Usage Examples

Some additional usage examples to (hopefully) solidify the above.

----------
Build the `master` branch of `develop` and push the built files to new branch `release-0.0.1` on repo `staging` with a commit message of `Version 0.0.1`:
```
npm start -- push develop to staging --developBranch master --newBranch release-0.0.1 --commitMessage "Version 0.0.1"
```
----------
Verify the `master` branch on `develop` has been deployed correctly to  branch `release-0.0.1` on repo `staging`:
```
npm start -- verify develop to staging --developBranch master --stagingBranch release-0.0.1`
```
----------

Push commit `7590c220` on repo `staging` to new branch `release-0.0.2` on repo `prod` with a commit message of `Version 0.0.2`:
```
npm start -- push staging to prod --stagingCommit 7590c220 --newBranch release-0.0.2 --commitMessage "Version 0.0.2" 
```

----------
Verify commit `7590c220` on repo `staging` has been deployed correctly to branch `release-0.0.2` on repo `prod`:
```
npm start -- verify staging to prod --stagingCommit 7590c220 --prodBranch release-0.0.2
```


