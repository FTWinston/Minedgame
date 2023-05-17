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
    let definition: string;

    try {
        definition = JSON.stringify(generateBoard(config));
    }
    catch (error) {
        console.log(error);
        throw error;
    }
    finally {
        console.timeEnd('generating definition');
    }

    await pushFile(definition);
}

async function pushFile(definition: string) {
    console.time('authenticating with github');
    let octokit: Octokit;

    try {
        const authenticate = createTokenAuth(import.meta.env.VITE_GITHUB_AUTH_TOKEN);
        const { token } = await authenticate();
    
        octokit = new Octokit({ auth: token });
    }
    catch (error) {
        console.log(error);
        throw error;
    }
    finally {
        console.timeEnd('authenticating with github');
    }

    const owner: string = import.meta.env.VITE_GITHUB_OWNER;
    const repo: string = import.meta.env.VITE_GITHUB_REPO;
    const path: string = import.meta.env.VITE_GIT_DATA_PATH;
    const branch: string = import.meta.env.VITE_GIT_DATA_BRANCH;

    const headers = {
        'accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
    };

    console.time('reading existing file');
    let sha: string | undefined;

    try {
        console.log('call getContext');
        const existingFile = await octokit.rest.repos.getContent({
            owner,
            repo,
            path,
            ref: branch,
            headers,
        });
        console.log('call data');
        const data = await existingFile.data;
        console.log('reading sha');
        sha = Array.isArray(data) ? undefined : data.sha;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
    finally {
        console.timeEnd('reading existing file');
    }
    
    console.log('buffer thing');
    const content = Buffer.from(definition).toString('base64');
    
    console.log('message');
    const message = `Daily generation ${new Date().toISOString().split('T')[0]}`;

    console.log('gonna push');
    console.time('pushing new definition');
    try
    {
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
    }
    catch (error) {
        console.log(error);
        throw error;
    }
    finally {
        console.timeEnd('pushing new definition');
    }
}
