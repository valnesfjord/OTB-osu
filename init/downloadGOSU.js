const downloadRelease = require('download-github-release');
const user = 'l3lackShark';
const repo = 'gosumemory';
const outputdir = process.cwd();
const leaveZipped = false;

async function start(version) {
    return new Promise((resolve, reject) => {
        function filterRelease(release) {
            return release.prerelease === false;
        }

        function filterAsset(asset) {
            return asset.name.indexOf('gosumemory_'+version) >= 0;
        }

        downloadRelease(user, repo, outputdir, filterRelease, filterAsset, leaveZipped)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                resolve();
            });
    });
}
module.exports = { start };