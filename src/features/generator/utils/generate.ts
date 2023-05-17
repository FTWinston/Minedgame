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

async function pushFile(_definition: string) {
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

    try {
        console.log('call getContext');
        octokit.rest.repos.getContent({
            owner,
            repo,
            path,
            ref: branch,
            headers,
        })
        .then(_existingFile => {
            console.log('got existingFile');
        })
        .catch(error => {
            console.log('caught', error);
        })
        .finally(() => {
            console.log('getContext call completed');
        })
    }
    catch (error) {
        console.log(error);
        throw error;
    }
    finally {
        console.timeEnd('reading existing file');
    }
}
