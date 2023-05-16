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

    const definition = JSON.stringify(generateBoard(config));

    await pushFile(definition);
}

async function pushFile(definition: string) {
    const octokit = new Octokit({
        authStrategy: createTokenAuth,
        auth: import.meta.env.VITE_GITHUB_AUTH_TOKEN,
    });

    const owner = import.meta.env.VITE_GITHUB_OWNER;
    const repo = import.meta.env.VITE_GITHUB_REPO;
    const path = import.meta.env.VITE_GIT_DATA_PATH;
    await octokit.auth();
    
    const existingFile = await octokit.rest.repos.getContent({ owner, repo, path });
    const data = await existingFile.data;
    const sha = Array.isArray(data) ? undefined : data.sha;

    const content = Buffer.from(definition).toString('base64');
    const message = `Daily generation ${new Date().toISOString().split('T')[0]}`;

    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        message,
        branch: import.meta.env.VITE_GIT_BRANCH,
        committer: {
            name: import.meta.env.VITE_GIT_COMMITTER_NAME,
            email: import.meta.env.VITE_GIT_COMMITTER_EMAIL,
        },
        content,
        sha,
        headers: {
            'X-GitHub-Api-Version': '2023-15-15'
        }
    });
}
