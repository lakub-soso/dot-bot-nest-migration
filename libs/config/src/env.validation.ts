import { z } from 'zod';

const numericString = z
    .string()
    .regex(/^\d+$/, 'must be a positive integer')
    .transform((value) => Number.parseInt(value, 10));

export const envSchema = z.object({
    NODE_ENV: z
        .enum([ 'development', 'test', 'production' ])
        .default('development'),
    HTTP_PORT: numericString.default('3000'),

    DB_HOST: z.string().min(1),
    DB_PORT: numericString.default('5432'),
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_NAME: z.string().min(1),

    REDIS_HOST: z.string().min(1),
    REDIS_PORT: numericString.default('6379'),

    TWITCH_USERNAME: z.string().default(''),
    TWITCH_CHANNELS: z.string().default(''),
    TWITCH_OAUTH_CLIENT_ID: z.string().default(''),
    TWITCH_OAUTH_CLIENT_SECRET: z.string().default(''),
    TWITCH_OAUTH_REDIRECT_URI: z
        .union([ z.string().url(), z.literal('') ])
        .default(''),
    TWITCH_COMMAND_PREFIX: z.string().default('!'),
});

export type EnvVars = z.infer<typeof envSchema>;

export const validateEnv = (raw: Record<string, unknown>): EnvVars =>
{
    const result = envSchema.safeParse(raw);
    if (!result.success)
    {
        const issues = result.error.issues
            .map((issue) => `${ issue.path.join('.') || '(root)' }: ${ issue.message }`)
            .join('; ');
        throw new Error(`Invalid environment configuration: ${ issues }`);
    }
    return result.data;
};
