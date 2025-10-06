import { redisClient } from '../config/redis';
import { v4 as uuidv4 } from 'uuid';

class RedisService {
    private postsStorage: {name: string, createdAt: number}[] = [];

    async login(username: string): Promise<string> {
        console.log('logging in user', username);
        const sessionToken = uuidv4();
        await redisClient.SET(`sess:${sessionToken}`, username, { EX: 60 * 30 });
        return sessionToken;
    }

    async fetchSessionInfo(sessionToken: string): Promise<string> {
        const username = await redisClient.GETEX(`sess:${sessionToken}`, { EX: 60 * 30 });
        if (!username) {
            throw new Error('Session not found');
        }
        return username;
    }

    async addToLeaderboard(name: string, score: number): Promise<void> {
        await redisClient.ZINCRBY(`leaderboard`, score, name);
    }

    async getLeaderboard(): Promise<{ name: string, score: number }[]> {
        const result = await redisClient.ZRANGE_WITHSCORES('leaderboard', 0, 9, { REV: true });
        return result.map(entry => ({
            name: entry.value,
            score: entry.score
        }));
    }

    async addPost(post: {name: string, createdAt: number}): Promise<void> {
        this.postsStorage.push(post);

        await redisClient.DEL('postsCache');
    }

    async getPost(): Promise<{name: string, createdAt: number}[]> {
        const posts = await redisClient.GET('postsCache');
        if(posts) {
            console.log('posts found in cache');
            return JSON.parse(posts);
        }

        console.log('posts not found in cache');
        const orderedPosts = this.postsStorage.sort((a, b) => a.createdAt - b.createdAt);
        await redisClient.SETEX('postsCache', 60, JSON.stringify(orderedPosts));
        return orderedPosts
    }
}

export const redisService = new RedisService();