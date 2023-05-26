import { Handler, HandlerContext, HandlerEvent } from '@netlify/functions';
import { Octokit } from 'octokit';
import { createTokenAuth } from '@octokit/auth-token';
import { getConfiguration, generateBoard, GenerationConfig, CellBoardDefinition } from 'src/features/hexcells';

export const handler: Handler = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: HandlerEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context: HandlerContext
) => {
    await generateAndPush();

    return { statusCode: 200 };
};

function generateStage(): CellBoardDefinition {
    console.time('getting configuration');
    let config: GenerationConfig;
    
    try {
        config = getConfiguration();
    }
    finally {
        console.timeEnd('getting configuration');
    }

    console.time('generating definition');
    let definition: CellBoardDefinition;

    try {
        definition = generateBoard(config);
    }
    finally {
        console.timeEnd('generating definition');
    }

    return definition;
}

async function generateAndPush() {
    const definitions: CellBoardDefinition[] = [];

    definitions.push(generateStage());

    await pushFile(JSON.stringify(definitions));
}

async function pushFile(definition: string) {
    console.time('authenticating with github');
    let octokit: Octokit;

    try {
        const authenticate = createTokenAuth(import.meta.env.VITE_GITHUB_AUTH_TOKEN);
        const { token } = await authenticate();
    
        octokit = new Octokit({ auth: token });
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
        const existingFile = await octokit.rest.repos.getContent({
            owner,
            repo,
            path,
            ref: branch,
            headers,
        });

        const data = await existingFile.data;
        
        sha = Array.isArray(data) ? undefined : data.sha;
    }
    finally {
        console.timeEnd('reading existing file');
    }
    
    const content = Buffer.from(definition).toString('base64');
    const message = `Daily generation ${new Date().toISOString().split('T')[0]}`;

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
    finally {
        console.timeEnd('pushing new definition');
    }
}
