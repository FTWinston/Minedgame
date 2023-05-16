import { GenerationConfig, generateBoard } from 'src/features/hexcells/utils/generateBoard';
import { Octokit } from 'octokit';
import { createTokenAuth } from '@octokit/auth-token';

export async function generate() {
    const config: GenerationConfig = {
        orientation: 'landscape',
        numCells: 50,
        gapFraction: 0.3,
        bombFraction: 0.45,
        unknownFraction: 0.05,
        rowClueChance: 5,
        radiusClueChance: 0.025,
        revealChance: 0.1,
        contiguousClueChance: 0.5,
        splitClueChance: 0.4,
        remainingBombCountFraction: 0.33,
    };

    console.time('generating definition');
    const definition = JSON.stringify(generateBoard(config));
    console.timeEnd('generating definition');

    await pushFile(definition);
}

async function pushFile(definition: string) {
    console.time('authenticating with github');

    const authenticate = createTokenAuth(import.meta.env.VITE_GITHUB_AUTH_TOKEN);
    const { token } = await authenticate();
    
    const octokit = new Octokit({ auth: token });

    console.timeEnd('authenticating with github');

    const owner: string = import.meta.env.VITE_GITHUB_OWNER;
    const repo: string = import.meta.env.VITE_GITHUB_REPO;
    const path: string = import.meta.env.VITE_GIT_DATA_PATH;
    const branch: string = import.meta.env.VITE_GIT_DATA_BRANCH;

    const headers = {
        'accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
    };

    console.time('reading existing file');
    const existingFile = await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref: branch,
        headers,
    });
    const data = await existingFile.data;
    const sha = Array.isArray(data) ? undefined : data.sha;
    console.timeEnd('reading existing file');

    const content = Buffer.from(definition).toString('base64');
    const message = `Daily generation ${new Date().toISOString().split('T')[0]}`;

    console.time('pushing new definition');

    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        message,
        branch,
        committer: {
            name: import.meta.env.VITE_GIT_COMMITTER_NAME,
            email: import.meta.env.VITE_GIT_COMMITTER_EMAIL,
        },
        content,
        sha,
        headers,
    });

    console.timeEnd('pushing new definition');
}
