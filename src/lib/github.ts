export interface GitHubRepo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    language: string | null;
    stargazers_count: number;
    updated_at: string;
    topics: string[];
}

export async function fetchGitHubProjects(username: string): Promise<GitHubRepo[]> {
    try {
        const response = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=100&type=owner`
        );

        if (!response.ok) {
            if (response.status === 404) {
                console.warn(`GitHub user '${username}' not found.`);
                return [];
            }
            throw new Error(`GitHub API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch GitHub projects:", error);
        return [];
    }
}
