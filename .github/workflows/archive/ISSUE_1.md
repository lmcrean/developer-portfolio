seems to be an issue with artifacts permissions. SEE em below:

# debugging steps

## 1. Double checked GCP_SA_KEY

added to github repo secrets

## 2. double checked IAM permisions

Artifact Registry Reader
Artifact Registry Writer
Cloud Run Admin
Editor
Service Account User
Storage Admin

## 3. checked github actions logs

issue seems to be

This tells us that the issue with GitHub Actions is likely one of:

- GitHub Secret format - the GCP_SA_KEY might not be formatted correctly
- Service account authentication - something with how the service account key is being used in the GitHub Actions environment
- Permission propagation - the new artifactregistry.admin role might not have propagated to the GitHub Actions environment yet

error line

```
denied: Permission "artifactregistry.repositories.uploadArtifacts" denied on resource "projects/***/locations/us-central1/repositories/api-images" (or it may not exist)
```

<details>
<summary>github actions logs</summary>

```bash
2025-07-06T15:47:22.7625827Z Current runner version: '2.325.0'
2025-07-06T15:47:22.7653693Z ##[group]Runner Image Provisioner
2025-07-06T15:47:22.7654901Z Hosted Compute Agent
2025-07-06T15:47:22.7655908Z Version: 20250620.352
2025-07-06T15:47:22.7657160Z Commit: f262f3aba23b10ea191b2a62bdee1ca4c3d344da
2025-07-06T15:47:22.7658328Z Build Date: 2025-06-20T19:27:17Z
2025-07-06T15:47:22.7659297Z ##[endgroup]
2025-07-06T15:47:22.7660222Z ##[group]Operating System
2025-07-06T15:47:22.7661146Z Ubuntu
2025-07-06T15:47:22.7662029Z 24.04.2
2025-07-06T15:47:22.7662842Z LTS
2025-07-06T15:47:22.7663801Z ##[endgroup]
2025-07-06T15:47:22.7665228Z ##[group]Runner Image
2025-07-06T15:47:22.7666815Z Image: ubuntu-24.04
2025-07-06T15:47:22.7668035Z Version: 20250622.1.0
2025-07-06T15:47:22.7670242Z Included Software: https://github.com/actions/runner-images/blob/ubuntu24/20250622.1/images/ubuntu/Ubuntu2404-Readme.md
2025-07-06T15:47:22.7673442Z Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu24%2F20250622.1
2025-07-06T15:47:22.7675494Z ##[endgroup]
2025-07-06T15:47:22.7678591Z ##[group]GITHUB_TOKEN Permissions
2025-07-06T15:47:22.7682110Z Contents: read
2025-07-06T15:47:22.7683438Z Deployments: write
2025-07-06T15:47:22.7684883Z Metadata: read
2025-07-06T15:47:22.7686456Z PullRequests: write
2025-07-06T15:47:22.7687914Z ##[endgroup]
2025-07-06T15:47:22.7691015Z Secret source: Actions
2025-07-06T15:47:22.7693111Z Prepare workflow directory
2025-07-06T15:47:22.8161896Z Prepare all required actions
2025-07-06T15:47:22.8217203Z Getting action download info
2025-07-06T15:47:23.1636504Z ##[group]Download immutable action package 'actions/checkout@v4'
2025-07-06T15:47:23.1637948Z Version: 4.2.2
2025-07-06T15:47:23.1639250Z Digest: sha256:ccb2698953eaebd21c7bf6268a94f9c26518a7e38e27e0b83c1fe1ad049819b1
2025-07-06T15:47:23.1640773Z Source commit SHA: 11bd71901bbe5b1630ceea73d27597364c9af683
2025-07-06T15:47:23.1641853Z ##[endgroup]
2025-07-06T15:47:23.2518399Z ##[group]Download immutable action package 'actions/setup-node@v4'
2025-07-06T15:47:23.2519384Z Version: 4.4.0
2025-07-06T15:47:23.2520296Z Digest: sha256:9427cefe82346e992fb5b949e3569b39d537ae41aa3086483b14eceebfc16bc1
2025-07-06T15:47:23.2521461Z Source commit SHA: 49933ea5288caeca8642d1e84afbd3f7d6820020
2025-07-06T15:47:23.2522327Z ##[endgroup]
2025-07-06T15:47:23.3412393Z ##[group]Download immutable action package 'google-github-actions/auth@v2'
2025-07-06T15:47:23.3413412Z Version: 2.1.10
2025-07-06T15:47:23.3414293Z Digest: sha256:b93ace6ed195e6261bd53d67ebdb3482b6d8175506667fb99ef8b161f9ebcf10
2025-07-06T15:47:23.3415413Z Source commit SHA: ba79af03959ebeac9769e648f473a284504d9193
2025-07-06T15:47:23.3416514Z ##[endgroup]
2025-07-06T15:47:23.5253956Z ##[group]Download immutable action package 'google-github-actions/setup-gcloud@v2'
2025-07-06T15:47:23.5255034Z Version: 2.1.4
2025-07-06T15:47:23.5255913Z Digest: sha256:212b6c2d21b05c51134986e891b36db26ed3162d1f230f0846cd924f96728f2d
2025-07-06T15:47:23.5257396Z Source commit SHA: 77e7a554d41e2ee56fc945c52dfd3f33d12def9a
2025-07-06T15:47:23.5258245Z ##[endgroup]
2025-07-06T15:47:23.8088989Z Uses: lmcrean/developer-portfolio/.github/workflows/deploy-api-branch.yml@refs/pull/29/merge (42d74f0c46f674af2e061d8d40f81ee5ead9f680)
2025-07-06T15:47:23.8095597Z ##[group] Inputs
2025-07-06T15:47:23.8097050Z   branch_name: feat-google-cloud
2025-07-06T15:47:23.8098389Z   pr_number: 29
2025-07-06T15:47:23.8099514Z ##[endgroup]
2025-07-06T15:47:23.8100685Z Complete job name: deploy-api / deploy
2025-07-06T15:47:23.9028712Z ##[group]Run actions/checkout@v4
2025-07-06T15:47:23.9030243Z with:
2025-07-06T15:47:23.9031311Z   repository: lmcrean/developer-portfolio
2025-07-06T15:47:23.9032892Z   token: ***
2025-07-06T15:47:23.9033909Z   ssh-strict: true
2025-07-06T15:47:23.9034942Z   ssh-user: git
2025-07-06T15:47:23.9035999Z   persist-credentials: true
2025-07-06T15:47:23.9037311Z   clean: true
2025-07-06T15:47:23.9038368Z   sparse-checkout-cone-mode: true
2025-07-06T15:47:23.9039587Z   fetch-depth: 1
2025-07-06T15:47:23.9040613Z   fetch-tags: false
2025-07-06T15:47:23.9041912Z   show-progress: true
2025-07-06T15:47:23.9042966Z   lfs: false
2025-07-06T15:47:23.9043953Z   submodules: false
2025-07-06T15:47:23.9045028Z   set-safe-directory: true
2025-07-06T15:47:23.9046710Z ##[endgroup]
2025-07-06T15:47:24.0128675Z Syncing repository: lmcrean/developer-portfolio
2025-07-06T15:47:24.0132654Z ##[group]Getting Git version info
2025-07-06T15:47:24.0134625Z Working directory is '/home/runner/work/developer-portfolio/developer-portfolio'
2025-07-06T15:47:24.0137491Z [command]/usr/bin/git version
2025-07-06T15:47:24.0146663Z git version 2.49.0
2025-07-06T15:47:24.0173302Z ##[endgroup]
2025-07-06T15:47:24.0186963Z Temporarily overriding HOME='/home/runner/work/_temp/94e057dd-9719-4fa6-b462-bd91e26111f4' before making global git config changes
2025-07-06T15:47:24.0190815Z Adding repository directory to the temporary git global config as a safe directory
2025-07-06T15:47:24.0194444Z [command]/usr/bin/git config --global --add safe.directory /home/runner/work/developer-portfolio/developer-portfolio
2025-07-06T15:47:24.0224869Z Deleting the contents of '/home/runner/work/developer-portfolio/developer-portfolio'
2025-07-06T15:47:24.0228157Z ##[group]Initializing the repository
2025-07-06T15:47:24.0232165Z [command]/usr/bin/git init /home/runner/work/developer-portfolio/developer-portfolio
2025-07-06T15:47:24.0282732Z hint: Using 'master' as the name for the initial branch. This default branch name
2025-07-06T15:47:24.0286390Z hint: is subject to change. To configure the initial branch name to use in all
2025-07-06T15:47:24.0288527Z hint: of your new repositories, which will suppress this warning, call:
2025-07-06T15:47:24.0290408Z hint:
2025-07-06T15:47:24.0291653Z hint: 	git config --global init.defaultBranch <name>
2025-07-06T15:47:24.0293105Z hint:
2025-07-06T15:47:24.0294456Z hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and
2025-07-06T15:47:24.0297474Z hint: 'development'. The just-created branch can be renamed via this command:
2025-07-06T15:47:24.0299174Z hint:
2025-07-06T15:47:24.0300192Z hint: 	git branch -m <name>
2025-07-06T15:47:24.0302132Z Initialized empty Git repository in /home/runner/work/developer-portfolio/developer-portfolio/.git/
2025-07-06T15:47:24.0306342Z [command]/usr/bin/git remote add origin https://github.com/lmcrean/developer-portfolio
2025-07-06T15:47:24.0329619Z ##[endgroup]
2025-07-06T15:47:24.0331422Z ##[group]Disabling automatic garbage collection
2025-07-06T15:47:24.0333627Z [command]/usr/bin/git config --local gc.auto 0
2025-07-06T15:47:24.0361484Z ##[endgroup]
2025-07-06T15:47:24.0363163Z ##[group]Setting up auth
2025-07-06T15:47:24.0368430Z [command]/usr/bin/git config --local --name-only --get-regexp core\.sshCommand
2025-07-06T15:47:24.0401696Z [command]/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'core\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :"
2025-07-06T15:47:24.0647868Z [command]/usr/bin/git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader
2025-07-06T15:47:24.0681988Z [command]/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'http\.https\:\/\/github\.com\/\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :"
2025-07-06T15:47:24.0894945Z [command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***
2025-07-06T15:47:24.0930515Z ##[endgroup]
2025-07-06T15:47:24.0932811Z ##[group]Fetching the repository
2025-07-06T15:47:24.0938597Z [command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +42d74f0c46f674af2e061d8d40f81ee5ead9f680:refs/remotes/pull/29/merge
2025-07-06T15:47:25.0068369Z From https://github.com/lmcrean/developer-portfolio
2025-07-06T15:47:25.0070502Z  * [new ref]         42d74f0c46f674af2e061d8d40f81ee5ead9f680 -> pull/29/merge
2025-07-06T15:47:25.0093233Z ##[endgroup]
2025-07-06T15:47:25.0095122Z ##[group]Determining the checkout info
2025-07-06T15:47:25.0097997Z ##[endgroup]
2025-07-06T15:47:25.0099488Z [command]/usr/bin/git sparse-checkout disable
2025-07-06T15:47:25.0135269Z [command]/usr/bin/git config --local --unset-all extensions.worktreeConfig
2025-07-06T15:47:25.0162723Z ##[group]Checking out the ref
2025-07-06T15:47:25.0165032Z [command]/usr/bin/git checkout --progress --force refs/remotes/pull/29/merge
2025-07-06T15:47:25.1609424Z Note: switching to 'refs/remotes/pull/29/merge'.
2025-07-06T15:47:25.1611571Z 
2025-07-06T15:47:25.1613194Z You are in 'detached HEAD' state. You can look around, make experimental
2025-07-06T15:47:25.1619033Z changes and commit them, and you can discard any commits you make in this
2025-07-06T15:47:25.1622806Z state without impacting any branches by switching back to a branch.
2025-07-06T15:47:25.1625107Z 
2025-07-06T15:47:25.1627060Z If you want to create a new branch to retain commits you create, you may
2025-07-06T15:47:25.1630339Z do so (now or later) by using -c with the switch command. Example:
2025-07-06T15:47:25.1632270Z 
2025-07-06T15:47:25.1633153Z   git switch -c <new-branch-name>
2025-07-06T15:47:25.1635281Z 
2025-07-06T15:47:25.1636357Z Or undo this operation with:
2025-07-06T15:47:25.1637660Z 
2025-07-06T15:47:25.1638490Z   git switch -
2025-07-06T15:47:25.1639533Z 
2025-07-06T15:47:25.1641057Z Turn off this advice by setting config variable advice.detachedHead to false
2025-07-06T15:47:25.1643223Z 
2025-07-06T15:47:25.1645651Z HEAD is now at 42d74f0 Merge e4f6c2791f01e644a44858106296e287c328e563 into 6dd7df9f4fc9e4d96802e9a3b6f1e405ed49359d
2025-07-06T15:47:25.1653270Z ##[endgroup]
2025-07-06T15:47:25.1667441Z [command]/usr/bin/git log -1 --format=%H
2025-07-06T15:47:25.1691087Z 42d74f0c46f674af2e061d8d40f81ee5ead9f680
2025-07-06T15:47:25.1997763Z ##[group]Run actions/setup-node@v4
2025-07-06T15:47:25.1999014Z with:
2025-07-06T15:47:25.1999962Z   node-version: 20
2025-07-06T15:47:25.2000974Z   cache: npm
2025-07-06T15:47:25.2002220Z   cache-dependency-path: apps/api/github/package-lock.json
2025-07-06T15:47:25.2003709Z   always-auth: false
2025-07-06T15:47:25.2004766Z   check-latest: false
2025-07-06T15:47:25.2006046Z   token: ***
2025-07-06T15:47:25.2007172Z ##[endgroup]
2025-07-06T15:47:25.3761157Z Found in cache @ /opt/hostedtoolcache/node/20.19.2/x64
2025-07-06T15:47:25.3766519Z ##[group]Environment details
2025-07-06T15:47:25.6686777Z node: v20.19.2
2025-07-06T15:47:25.6687592Z npm: 10.8.2
2025-07-06T15:47:25.6688192Z yarn: 1.22.22
2025-07-06T15:47:25.6689469Z ##[endgroup]
2025-07-06T15:47:25.6711480Z [command]/opt/hostedtoolcache/node/20.19.2/x64/bin/npm config get cache
2025-07-06T15:47:25.7800738Z /home/runner/.npm
2025-07-06T15:47:25.9367485Z npm cache is not found
2025-07-06T15:47:25.9510565Z ##[group]Run cd apps/api/github
2025-07-06T15:47:25.9511155Z [36;1mcd apps/api/github[0m
2025-07-06T15:47:25.9511464Z [36;1mnpm ci[0m
2025-07-06T15:47:25.9602951Z shell: /usr/bin/bash -e ***0***
2025-07-06T15:47:25.9603309Z ##[endgroup]
2025-07-06T15:47:26.4461920Z npm warn EBADENGINE Unsupported engine ***
2025-07-06T15:47:26.4463022Z npm warn EBADENGINE   package: 'api-github@1.0.0',
2025-07-06T15:47:26.4464014Z npm warn EBADENGINE   required: *** node: '18.x' ***,
2025-07-06T15:47:26.4465112Z npm warn EBADENGINE   current: *** node: 'v20.19.2', npm: '10.8.2' ***
2025-07-06T15:47:26.4465988Z npm warn EBADENGINE ***
2025-07-06T15:47:27.6226332Z npm warn deprecated path-match@1.2.4: This package is archived and no longer maintained. For support, visit https://github.com/expressjs/express/discussions
2025-07-06T15:47:27.6757840Z npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
2025-07-06T15:47:27.7231947Z npm warn deprecated npmlog@5.0.1: This package is no longer supported.
2025-07-06T15:47:27.8036361Z npm warn deprecated uuid@3.3.2: Please upgrade  to version 7 or higher.  Older versions may use Math.random() in certain circumstances, which is known to be problematic.  See https://v8.dev/blog/math-random for details.
2025-07-06T15:47:27.9048635Z npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
2025-07-06T15:47:27.9228564Z npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
2025-07-06T15:47:28.0175541Z npm warn deprecated gauge@3.0.2: This package is no longer supported.
2025-07-06T15:47:28.0463238Z npm warn deprecated are-we-there-yet@2.0.0: This package is no longer supported.
2025-07-06T15:47:28.6506773Z npm warn deprecated debug@4.1.1: Debug versions >=3.2.0 <3.2.7 || >=4 <4.3.1 have a low-severity ReDos regression when used in a Node.js environment. It is recommended you upgrade to 3.2.7 or 4.3.1. (https://github.com/visionmedia/debug/issues/797)
2025-07-06T15:47:30.6645169Z 
2025-07-06T15:47:30.6645975Z added 348 packages, and audited 349 packages in 5s
2025-07-06T15:47:30.6646765Z 
2025-07-06T15:47:30.6647262Z 31 packages are looking for funding
2025-07-06T15:47:30.6647903Z   run `npm fund` for details
2025-07-06T15:47:30.6973311Z 
2025-07-06T15:47:30.6974275Z 13 vulnerabilities (1 low, 4 moderate, 8 high)
2025-07-06T15:47:30.6976412Z 
2025-07-06T15:47:30.6985773Z To address all issues (including breaking changes), run:
2025-07-06T15:47:30.6986746Z   npm audit fix --force
2025-07-06T15:47:30.6987056Z 
2025-07-06T15:47:30.6987326Z Run `npm audit` for details.
2025-07-06T15:47:30.7261345Z ##[group]Run cd apps/api/github
2025-07-06T15:47:30.7262090Z [36;1mcd apps/api/github[0m
2025-07-06T15:47:30.7262623Z [36;1mnpm run build[0m
2025-07-06T15:47:30.7323336Z shell: /usr/bin/bash -e ***0***
2025-07-06T15:47:30.7323663Z ##[endgroup]
2025-07-06T15:47:30.8394652Z 
2025-07-06T15:47:30.8395201Z > api-github@1.0.0 build
2025-07-06T15:47:30.8395620Z > tsc
2025-07-06T15:47:30.8395762Z 
2025-07-06T15:47:32.4891688Z ##[group]Run cd apps/api/github
2025-07-06T15:47:32.4892069Z [36;1mcd apps/api/github[0m
2025-07-06T15:47:32.4892468Z [36;1mnpm test 2>/dev/null || echo "⚠️ Tests not configured or failed"[0m
2025-07-06T15:47:32.4949444Z shell: /usr/bin/bash -e ***0***
2025-07-06T15:47:32.4949769Z ##[endgroup]
2025-07-06T15:47:32.6190789Z 
2025-07-06T15:47:32.6191832Z > api-github@1.0.0 test
2025-07-06T15:47:32.6192461Z > echo "No tests yet" && exit 0
2025-07-06T15:47:32.6192784Z 
2025-07-06T15:47:32.6229562Z No tests yet
2025-07-06T15:47:32.6448688Z ##[group]Run google-github-actions/auth@v2
2025-07-06T15:47:32.6449237Z with:
2025-07-06T15:47:32.6466700Z   credentials_json: ***

2025-07-06T15:47:32.6467019Z   create_credentials_file: true
2025-07-06T15:47:32.6467337Z   export_environment_variables: true
2025-07-06T15:47:32.6467653Z   universe: googleapis.com
2025-07-06T15:47:32.6467932Z   cleanup_credentials: true
2025-07-06T15:47:32.6468214Z   access_token_lifetime: 3600s
2025-07-06T15:47:32.6468607Z   access_token_scopes: https://www.googleapis.com/auth/cloud-platform
2025-07-06T15:47:32.6469018Z   id_token_include_email: false
2025-07-06T15:47:32.6469312Z ##[endgroup]
2025-07-06T15:47:32.7439393Z Created credentials file at "/home/runner/work/developer-portfolio/developer-portfolio/gha-creds-4a314653c6076d06.json"
2025-07-06T15:47:32.7604843Z ##[group]Run google-github-actions/setup-gcloud@v2
2025-07-06T15:47:32.7605234Z with:
2025-07-06T15:47:32.7605509Z   project_id: ***
2025-07-06T15:47:32.7605766Z   version: latest
2025-07-06T15:47:32.7606024Z   skip_install: false
2025-07-06T15:47:32.7606442Z env:
2025-07-06T15:47:32.7607010Z   CLOUDSDK_AUTH_CREDENTIAL_FILE_OVERRIDE: /home/runner/work/developer-portfolio/developer-portfolio/gha-creds-4a314653c6076d06.json
2025-07-06T15:47:32.7607907Z   GOOGLE_APPLICATION_CREDENTIALS: /home/runner/work/developer-portfolio/developer-portfolio/gha-creds-4a314653c6076d06.json
2025-07-06T15:47:32.7608728Z   GOOGLE_GHA_CREDS_PATH: /home/runner/work/developer-portfolio/developer-portfolio/gha-creds-4a314653c6076d06.json
2025-07-06T15:47:32.7609307Z   CLOUDSDK_CORE_PROJECT: lauriecrean-free-38256
2025-07-06T15:47:32.7609866Z   CLOUDSDK_PROJECT: lauriecrean-free-38256
2025-07-06T15:47:32.7610243Z   GCLOUD_PROJECT: lauriecrean-free-38256
2025-07-06T15:47:32.7610594Z   GCP_PROJECT: lauriecrean-free-38256
2025-07-06T15:47:32.7610949Z   GOOGLE_CLOUD_PROJECT: lauriecrean-free-38256
2025-07-06T15:47:32.7611273Z ##[endgroup]
2025-07-06T15:47:34.0595900Z [command]/usr/bin/tar xz --warning=no-unknown-keyword --overwrite -C /home/runner/work/_temp/0d192af2-6246-4fd0-8189-1f20ed6e119a -f /home/runner/work/_temp/29013dbe-19b3-4c57-85b2-66cb63e5307d
2025-07-06T15:47:50.5529161Z Successfully authenticated
2025-07-06T15:47:51.5968825Z Successfully set default project
2025-07-06T15:47:51.6131789Z ##[group]Run gcloud auth configure-docker us-central1-docker.pkg.dev
2025-07-06T15:47:51.6132343Z [36;1mgcloud auth configure-docker us-central1-docker.pkg.dev[0m
2025-07-06T15:47:51.6191963Z shell: /usr/bin/bash -e ***0***
2025-07-06T15:47:51.6192269Z env:
2025-07-06T15:47:51.6192853Z   CLOUDSDK_AUTH_CREDENTIAL_FILE_OVERRIDE: /home/runner/work/developer-portfolio/developer-portfolio/gha-creds-4a314653c6076d06.json
2025-07-06T15:47:51.6193791Z   GOOGLE_APPLICATION_CREDENTIALS: /home/runner/work/developer-portfolio/developer-portfolio/gha-creds-4a314653c6076d06.json
2025-07-06T15:47:51.6194644Z   GOOGLE_GHA_CREDS_PATH: /home/runner/work/developer-portfolio/developer-portfolio/gha-creds-4a314653c6076d06.json
2025-07-06T15:47:51.6195228Z   CLOUDSDK_CORE_PROJECT: lauriecrean-free-38256
2025-07-06T15:47:51.6195591Z   CLOUDSDK_PROJECT: lauriecrean-free-38256
2025-07-06T15:47:51.6195930Z   GCLOUD_PROJECT: lauriecrean-free-38256
2025-07-06T15:47:51.6196420Z   GCP_PROJECT: lauriecrean-free-38256
2025-07-06T15:47:51.6196776Z   GOOGLE_CLOUD_PROJECT: lauriecrean-free-38256
2025-07-06T15:47:51.6197184Z   CLOUDSDK_METRICS_ENVIRONMENT: github-actions-setup-gcloud
2025-07-06T15:47:51.6197587Z   CLOUDSDK_METRICS_ENVIRONMENT_VERSION: 2.1.4
2025-07-06T15:47:51.6197905Z ##[endgroup]
2025-07-06T15:47:52.0995340Z Adding credentials for: us-central1-docker.pkg.dev
2025-07-06T15:47:52.0997679Z After update, the following will be written to your Docker config file located 
2025-07-06T15:47:52.0998607Z at [/home/runner/.docker/config.json]:
2025-07-06T15:47:52.0999160Z  ***
2025-07-06T15:47:52.0999662Z   "credHelpers": ***
2025-07-06T15:47:52.1000260Z     "us-central1-docker.pkg.dev": "gcloud"
2025-07-06T15:47:52.1000851Z   ***
2025-07-06T15:47:52.1001244Z ***
2025-07-06T15:47:52.1001456Z 
2025-07-06T15:47:52.1001756Z Do you want to continue (Y/n)?  
2025-07-06T15:47:52.1184924Z Docker configuration file updated.
2025-07-06T15:47:52.1927359Z ##[group]Run # Create repository if it doesn't exist (ignore error if already exists)
2025-07-06T15:47:52.1928053Z [36;1m# Create repository if it doesn't exist (ignore error if already exists)[0m
2025-07-06T15:47:52.1928573Z [36;1mgcloud artifacts repositories create api-images \[0m
2025-07-06T15:47:52.1929003Z [36;1m  --repository-format=docker \[0m
2025-07-06T15:47:52.1929354Z [36;1m  --location=us-central1 \[0m
2025-07-06T15:47:52.1929882Z [36;1m  --description="API Docker images for branch deployments" || echo "Repository already exists"[0m
2025-07-06T15:47:52.1988080Z shell: /usr/bin/bash -e ***0***
2025-07-06T15:47:52.1988405Z env:
2025-07-06T15:47:52.1989028Z   CLOUDSDK_AUTH_CREDENTIAL_FILE_OVERRIDE: /home/runner/work/developer-portfolio/developer-portfolio/gha-creds-4a314653c6076d06.json
2025-07-06T15:47:52.1990033Z   GOOGLE_APPLICATION_CREDENTIALS: /home/runner/work/developer-portfolio/developer-portfolio/gha-creds-4a314653c6076d06.json
2025-07-06T15:47:52.1990986Z   GOOGLE_GHA_CREDS_PATH: /home/runner/work/developer-portfolio/developer-portfolio/gha-creds-4a314653c6076d06.json
2025-07-06T15:47:52.1991623Z   CLOUDSDK_CORE_PROJECT: lauriecrean-free-38256
2025-07-06T15:47:52.1992008Z   CLOUDSDK_PROJECT: lauriecrean-free-38256
2025-07-06T15:47:52.1992365Z   GCLOUD_PROJECT: lauriecrean-free-38256
2025-07-06T15:47:52.1992720Z   GCP_PROJECT: lauriecrean-free-38256
2025-07-06T15:47:52.1993081Z   GOOGLE_CLOUD_PROJECT: lauriecrean-free-38256
2025-07-06T15:47:52.1993700Z   CLOUDSDK_METRICS_ENVIRONMENT: github-actions-setup-gcloud
2025-07-06T15:47:52.1994128Z   CLOUDSDK_METRICS_ENVIRONMENT_VERSION: 2.1.4
2025-07-06T15:47:52.1994466Z ##[endgroup]
2025-07-06T15:47:53.3841680Z ERROR: (gcloud.artifacts.repositories.create) ALREADY_EXISTS: the repository already exists
2025-07-06T15:47:53.4613705Z Repository already exists
2025-07-06T15:47:53.4661004Z ##[group]Run cd apps/api/github
2025-07-06T15:47:53.4661376Z [36;1mcd apps/api/github[0m
2025-07-06T15:47:53.4661653Z [36;1m[0m
2025-07-06T15:47:53.4662020Z [36;1m# Clean branch name for use in service names (remove special characters)[0m
2025-07-06T15:47:53.4662686Z [36;1mCLEAN_BRANCH=$(echo "feat-google-cloud" | sed 's/[^a-zA-Z0-9-]/-/g' | tr '[:upper:]' '[:lower:]' | sed 's/--*/-/g' | sed 's/^-\|-$//g')[0m
2025-07-06T15:47:53.4663309Z [36;1mSERVICE_NAME="api-github-$***CLEAN_BRANCH***"[0m
2025-07-06T15:47:53.4664001Z [36;1mIMAGE_NAME="us-central1-docker.pkg.dev/***/api-images/$***SERVICE_NAME***:42d74f0c46f674af2e061d8d40f81ee5ead9f680"[0m
2025-07-06T15:47:53.4664573Z [36;1m[0m
2025-07-06T15:47:53.4664848Z [36;1mecho "🏷️ Building image: $IMAGE_NAME"[0m
2025-07-06T15:47:53.4665214Z [36;1mecho "🔖 Service name: $SERVICE_NAME"[0m
2025-07-06T15:47:53.4665533Z [36;1m[0m
2025-07-06T15:47:53.4665786Z [36;1m# Build and push the image[0m
2025-07-06T15:47:53.4666278Z [36;1mdocker build -t $IMAGE_NAME .[0m
2025-07-06T15:47:53.4666754Z [36;1mdocker push $IMAGE_NAME[0m
2025-07-06T15:47:53.4667039Z [36;1m[0m
2025-07-06T15:47:53.4667285Z [36;1m# Store values for next step[0m
2025-07-06T15:47:53.4667633Z [36;1mecho "IMAGE_NAME=$IMAGE_NAME" >> $GITHUB_ENV[0m
2025-07-06T15:47:53.4668029Z [36;1mecho "SERVICE_NAME=$SERVICE_NAME" >> $GITHUB_ENV[0m
2025-07-06T15:47:53.4724842Z shell: /usr/bin/bash -e ***0***
2025-07-06T15:47:53.4725157Z env:
2025-07-06T15:47:53.4725737Z   CLOUDSDK_AUTH_CREDENTIAL_FILE_OVERRIDE: /home/runner/work/developer-portfolio/developer-portfolio/gha-creds-4a314653c6076d06.json
2025-07-06T15:47:53.4726791Z   GOOGLE_APPLICATION_CREDENTIALS: /home/runner/work/developer-portfolio/developer-portfolio/gha-creds-4a314653c6076d06.json
2025-07-06T15:47:53.4727638Z   GOOGLE_GHA_CREDS_PATH: /home/runner/work/developer-portfolio/developer-portfolio/gha-creds-4a314653c6076d06.json
2025-07-06T15:47:53.4728227Z   CLOUDSDK_CORE_PROJECT: lauriecrean-free-38256
2025-07-06T15:47:53.4728606Z   CLOUDSDK_PROJECT: lauriecrean-free-38256
2025-07-06T15:47:53.4728944Z   GCLOUD_PROJECT: lauriecrean-free-38256
2025-07-06T15:47:53.4729275Z   GCP_PROJECT: lauriecrean-free-38256
2025-07-06T15:47:53.4729608Z   GOOGLE_CLOUD_PROJECT: lauriecrean-free-38256
2025-07-06T15:47:53.4730010Z   CLOUDSDK_METRICS_ENVIRONMENT: github-actions-setup-gcloud
2025-07-06T15:47:53.4730407Z   CLOUDSDK_METRICS_ENVIRONMENT_VERSION: 2.1.4
2025-07-06T15:47:53.4730725Z ##[endgroup]
2025-07-06T15:47:53.4832218Z 🏷️ Building image: us-central1-docker.pkg.dev/***/api-images/api-github-feat-google-cloud:42d74f0c46f674af2e061d8d40f81ee5ead9f680
2025-07-06T15:47:53.4833605Z 🔖 Service name: api-github-feat-google-cloud
2025-07-06T15:47:53.8385191Z #0 building with "default" instance using docker driver
2025-07-06T15:47:53.8385764Z 
2025-07-06T15:47:53.8386290Z #1 [internal] load build definition from Dockerfile
2025-07-06T15:47:53.8387204Z #1 transferring dockerfile: 769B done
2025-07-06T15:47:53.8387956Z #1 DONE 0.0s
2025-07-06T15:47:53.8388295Z 
2025-07-06T15:47:53.8388893Z #2 [auth] library/node:pull token for registry-1.docker.io
2025-07-06T15:47:53.8389673Z #2 DONE 0.0s
2025-07-06T15:47:53.8389955Z 
2025-07-06T15:47:53.8390326Z #3 [internal] load metadata for docker.io/library/node:18-alpine
2025-07-06T15:47:54.1029852Z #3 DONE 0.5s
2025-07-06T15:47:54.2042032Z 
2025-07-06T15:47:54.2042724Z #4 [internal] load .dockerignore
2025-07-06T15:47:54.2043540Z #4 transferring context: 2B done
2025-07-06T15:47:54.2044098Z #4 DONE 0.0s
2025-07-06T15:47:54.2044359Z 
2025-07-06T15:47:54.2046676Z #5 [ 1/10] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
2025-07-06T15:47:54.2048858Z #5 resolve docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e done
2025-07-06T15:47:54.2050194Z #5 extracting sha256:f18232174bc91741fdf3da96d85011092101a032a93a388b79e99e69c2d5c870
2025-07-06T15:47:54.3072607Z #5 sha256:1e5a4c89cee5c0826c540ab06d4b6b491c96eda01837f430bd47f0d26702d6e3 0B / 1.26MB 0.1s
2025-07-06T15:47:54.3074076Z #5 sha256:25ff2da83641908f65c3a74d80409d6b1b62ccfaab220b9ea70b80df5a2e0549 0B / 446B 0.1s
2025-07-06T15:47:54.3075477Z #5 sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e 7.67kB / 7.67kB done
2025-07-06T15:47:54.3079094Z #5 sha256:929b04d7c782f04f615cf785488fed452b6569f87c73ff666ad553a7554f0006 1.72kB / 1.72kB done
2025-07-06T15:47:54.3080807Z #5 sha256:ee77c6cd7c1886ecc802ad6cedef3a8ec1ea27d1fb96162bf03dd3710839b8da 6.18kB / 6.18kB done
2025-07-06T15:47:54.3082737Z #5 sha256:f18232174bc91741fdf3da96d85011092101a032a93a388b79e99e69c2d5c870 3.64MB / 3.64MB 0.1s done
2025-07-06T15:47:54.3083628Z #5 sha256:dd71dde834b5c203d162902e6b8994cb2309ae049a0eabc4efea161b2b5a3d0e 2.10MB / 40.01MB 0.1s
2025-07-06T15:47:54.4069819Z #5 sha256:1e5a4c89cee5c0826c540ab06d4b6b491c96eda01837f430bd47f0d26702d6e3 1.26MB / 1.26MB 0.1s done
2025-07-06T15:47:54.4076433Z #5 sha256:25ff2da83641908f65c3a74d80409d6b1b62ccfaab220b9ea70b80df5a2e0549 446B / 446B 0.1s done
2025-07-06T15:47:54.4078070Z #5 sha256:dd71dde834b5c203d162902e6b8994cb2309ae049a0eabc4efea161b2b5a3d0e 25.17MB / 40.01MB 0.2s
2025-07-06T15:47:54.5222248Z #5 extracting sha256:f18232174bc91741fdf3da96d85011092101a032a93a388b79e99e69c2d5c870 0.2s done
2025-07-06T15:47:54.5224122Z #5 sha256:dd71dde834b5c203d162902e6b8994cb2309ae049a0eabc4efea161b2b5a3d0e 40.01MB / 40.01MB 0.3s done
2025-07-06T15:47:54.5225390Z #5 extracting sha256:dd71dde834b5c203d162902e6b8994cb2309ae049a0eabc4efea161b2b5a3d0e
2025-07-06T15:47:55.2373488Z #5 ...
2025-07-06T15:47:55.2374623Z 
2025-07-06T15:47:55.2375283Z #6 [internal] load build context
2025-07-06T15:47:55.2376014Z #6 transferring context: 158.00MB 1.0s done
2025-07-06T15:47:55.2376772Z #6 DONE 1.1s
2025-07-06T15:47:55.2377026Z 
2025-07-06T15:47:55.2377928Z #5 [ 1/10] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
2025-07-06T15:47:55.8507001Z #5 extracting sha256:dd71dde834b5c203d162902e6b8994cb2309ae049a0eabc4efea161b2b5a3d0e 1.4s done
2025-07-06T15:47:59.2341454Z #5 extracting sha256:1e5a4c89cee5c0826c540ab06d4b6b491c96eda01837f430bd47f0d26702d6e3
2025-07-06T15:47:59.3384128Z #5 extracting sha256:1e5a4c89cee5c0826c540ab06d4b6b491c96eda01837f430bd47f0d26702d6e3 0.0s done
2025-07-06T15:47:59.3385152Z #5 extracting sha256:25ff2da83641908f65c3a74d80409d6b1b62ccfaab220b9ea70b80df5a2e0549 done
2025-07-06T15:47:59.3385863Z #5 DONE 5.2s
2025-07-06T15:47:59.3386041Z 
2025-07-06T15:47:59.3386426Z #7 [ 2/10] WORKDIR /app
2025-07-06T15:47:59.3386749Z #7 DONE 0.0s
2025-07-06T15:47:59.3386899Z 
2025-07-06T15:47:59.3387096Z #8 [ 3/10] COPY package*.json ./
2025-07-06T15:47:59.3387497Z #8 DONE 0.0s
2025-07-06T15:47:59.4897395Z 
2025-07-06T15:47:59.4898069Z #9 [ 4/10] RUN npm ci && npm cache clean --force
2025-07-06T15:48:01.3378608Z #9 1.999 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
2025-07-06T15:48:01.5315363Z #9 2.041 npm warn deprecated path-match@1.2.4: This package is archived and no longer maintained. For support, visit https://github.com/expressjs/express/discussions
2025-07-06T15:48:01.5523212Z #9 2.213 npm warn deprecated uuid@3.3.2: Please upgrade  to version 7 or higher.  Older versions may use Math.random() in certain circumstances, which is known to be problematic.  See https://v8.dev/blog/math-random for details.
2025-07-06T15:48:01.6704398Z #9 2.215 npm warn deprecated npmlog@5.0.1: This package is no longer supported.
2025-07-06T15:48:01.6706399Z #9 2.304 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
2025-07-06T15:48:01.6708416Z #9 2.331 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
2025-07-06T15:48:01.8697830Z #9 2.530 npm warn deprecated are-we-there-yet@2.0.0: This package is no longer supported.
2025-07-06T15:48:02.0473367Z #9 2.558 npm warn deprecated gauge@3.0.2: This package is no longer supported.
2025-07-06T15:48:02.3376375Z #9 2.998 npm warn deprecated debug@4.1.1: Debug versions >=3.2.0 <3.2.7 || >=4 <4.3.1 have a low-severity ReDos regression when used in a Node.js environment. It is recommended you upgrade to 3.2.7 or 4.3.1. (https://github.com/visionmedia/debug/issues/797)
2025-07-06T15:48:03.9262647Z #9 4.587 
2025-07-06T15:48:03.9263732Z #9 4.587 added 348 packages, and audited 349 packages in 4s
2025-07-06T15:48:03.9265005Z #9 4.587 
2025-07-06T15:48:03.9267935Z #9 4.587 31 packages are looking for funding
2025-07-06T15:48:04.1124097Z #9 4.587   run `npm fund` for details
2025-07-06T15:48:04.1124511Z #9 4.622 
2025-07-06T15:48:04.1124908Z #9 4.622 13 vulnerabilities (1 low, 4 moderate, 8 high)
2025-07-06T15:48:04.1125262Z #9 4.622 
2025-07-06T15:48:04.1125661Z #9 4.622 To address all issues (including breaking changes), run:
2025-07-06T15:48:04.1126340Z #9 4.622   npm audit fix --force
2025-07-06T15:48:04.1126651Z #9 4.622 
2025-07-06T15:48:04.1126952Z #9 4.622 Run `npm audit` for details.
2025-07-06T15:48:04.1127272Z #9 4.623 npm notice
2025-07-06T15:48:04.1127698Z #9 4.623 npm notice New major version of npm available! 10.8.2 -> 11.4.2
2025-07-06T15:48:04.1128329Z #9 4.623 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.4.2
2025-07-06T15:48:04.1128892Z #9 4.623 npm notice To update run: npm install -g npm@11.4.2
2025-07-06T15:48:04.1129275Z #9 4.623 npm notice
2025-07-06T15:48:04.1200355Z #9 4.781 npm warn using --force Recommended protections disabled.
2025-07-06T15:48:04.6014709Z #9 DONE 5.3s
2025-07-06T15:48:04.7524307Z 
2025-07-06T15:48:04.7524937Z #10 [ 5/10] COPY . .
2025-07-06T15:48:05.9320106Z #10 DONE 1.3s
2025-07-06T15:48:06.0828275Z 
2025-07-06T15:48:06.1924604Z #11 [ 6/10] RUN npm run build
2025-07-06T15:48:06.1925225Z #11 0.260 
2025-07-06T15:48:06.1926358Z #11 0.260 > api-github@1.0.0 build
2025-07-06T15:48:06.1928034Z #11 0.260 > tsc
2025-07-06T15:48:06.1928510Z #11 0.260 
2025-07-06T15:48:08.1061933Z #11 DONE 2.2s
2025-07-06T15:48:08.2586295Z 
2025-07-06T15:48:08.2587023Z #12 [ 7/10] RUN npm prune --production
2025-07-06T15:48:08.3619915Z #12 0.254 npm warn config production Use `--omit=dev` instead.
2025-07-06T15:48:09.5978082Z #12 1.490 
2025-07-06T15:48:09.5979559Z #12 1.490 up to date, audited 90 packages in 1s
2025-07-06T15:48:09.7452865Z #12 1.490 
2025-07-06T15:48:09.7453529Z #12 1.490 15 packages are looking for funding
2025-07-06T15:48:09.7454235Z #12 1.490   run `npm fund` for details
2025-07-06T15:48:09.7454731Z #12 1.491 
2025-07-06T15:48:09.7455233Z #12 1.491 found 0 vulnerabilities
2025-07-06T15:48:09.7455793Z #12 DONE 1.5s
2025-07-06T15:48:09.7456038Z 
2025-07-06T15:48:09.7456531Z #13 [ 8/10] RUN addgroup -g 1001 -S nodejs
2025-07-06T15:48:09.7457072Z #13 DONE 0.1s
2025-07-06T15:48:09.8647737Z 
2025-07-06T15:48:09.8648404Z #14 [ 9/10] RUN adduser -S nodejs -u 1001
2025-07-06T15:48:09.8649043Z #14 DONE 0.1s
2025-07-06T15:48:10.0159607Z 
2025-07-06T15:48:10.0161875Z #15 [10/10] RUN chown -R nodejs:nodejs /app
2025-07-06T15:48:10.4336391Z #15 DONE 0.6s
2025-07-06T15:48:10.5878052Z 
2025-07-06T15:48:10.5880151Z #16 exporting to image
2025-07-06T15:48:10.5881922Z #16 exporting layers
2025-07-06T15:48:11.9525184Z #16 exporting layers 1.5s done
2025-07-06T15:48:11.9722184Z #16 writing image sha256:5371307141ac2845f6d9b731fa187842af8d725c380de1b82add36e80aec7fa1 done
2025-07-06T15:48:11.9724086Z #16 naming to us-central1-docker.pkg.dev/***/api-images/api-github-feat-google-cloud:42d74f0c46f674af2e061d8d40f81ee5ead9f680 done
2025-07-06T15:48:11.9725337Z #16 DONE 1.5s
2025-07-06T15:48:12.5631905Z The push refers to repository [us-central1-docker.pkg.dev/***/api-images/api-github-feat-google-cloud]
2025-07-06T15:48:12.7433694Z 5738e34fe534: Preparing
2025-07-06T15:48:12.7434292Z b886b6e0fc40: Preparing
2025-07-06T15:48:12.7434789Z eb51c237c047: Preparing
2025-07-06T15:48:12.7435312Z dc0901aa16f3: Preparing
2025-07-06T15:48:12.7436072Z 892d7afc805f: Preparing
2025-07-06T15:48:12.7436855Z d45394b9f21b: Preparing
2025-07-06T15:48:12.7437400Z bf00dcc02dd7: Preparing
2025-07-06T15:48:12.7437907Z 638a8f85665a: Preparing
2025-07-06T15:48:12.7438200Z 1a15cb5c89a4: Preparing
2025-07-06T15:48:12.7438479Z 82140d9a70a7: Preparing
2025-07-06T15:48:12.7438751Z f3b40b0cdb1c: Preparing
2025-07-06T15:48:12.7439021Z 0b1f26057bd0: Preparing
2025-07-06T15:48:12.7439377Z 08000c18d16d: Preparing
2025-07-06T15:48:12.7439656Z 82140d9a70a7: Waiting
2025-07-06T15:48:12.7439930Z d45394b9f21b: Waiting
2025-07-06T15:48:12.7440197Z bf00dcc02dd7: Waiting
2025-07-06T15:48:12.7440460Z 638a8f85665a: Waiting
2025-07-06T15:48:12.7440747Z 1a15cb5c89a4: Waiting
2025-07-06T15:48:12.7441022Z f3b40b0cdb1c: Waiting
2025-07-06T15:48:12.7441290Z 0b1f26057bd0: Waiting
2025-07-06T15:48:12.7441547Z 08000c18d16d: Waiting
2025-07-06T15:48:13.2378086Z denied: Permission "artifactregistry.repositories.uploadArtifacts" denied on resource "projects/***/locations/us-central1/repositories/api-images" (or it may not exist)
2025-07-06T15:48:13.2406338Z ##[error]Process completed with exit code 1.
2025-07-06T15:48:13.2499342Z Post job cleanup.
2025-07-06T15:48:13.3328177Z Removed exported credentials at "/home/runner/work/developer-portfolio/developer-portfolio/gha-creds-4a314653c6076d06.json".
2025-07-06T15:48:13.3450290Z Post job cleanup.
2025-07-06T15:48:13.4382388Z [command]/usr/bin/git version
2025-07-06T15:48:13.4417888Z git version 2.49.0
2025-07-06T15:48:13.4468102Z Temporarily overriding HOME='/home/runner/work/_temp/89323a55-c84c-4a7b-8e17-f3e5a250ec2f' before making global git config changes
2025-07-06T15:48:13.4469772Z Adding repository directory to the temporary git global config as a safe directory
2025-07-06T15:48:13.4474664Z [command]/usr/bin/git config --global --add safe.directory /home/runner/work/developer-portfolio/developer-portfolio
2025-07-06T15:48:13.4513302Z [command]/usr/bin/git config --local --name-only --get-regexp core\.sshCommand
2025-07-06T15:48:13.4546446Z [command]/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'core\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :"
2025-07-06T15:48:13.4771651Z [command]/usr/bin/git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader
2025-07-06T15:48:13.4791386Z http.https://github.com/.extraheader
2025-07-06T15:48:13.4803565Z [command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader
2025-07-06T15:48:13.4834385Z [command]/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'http\.https\:\/\/github\.com\/\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :"
2025-07-06T15:48:13.5160873Z Evaluate and set job outputs
2025-07-06T15:48:13.5167075Z Cleaning up orphan processes
```

</details>

## Double checked Google Cloud Setup and Firebase Setup

logged in gcp-setep/.gcp-setup-details.txt