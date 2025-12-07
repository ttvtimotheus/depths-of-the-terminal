import { z } from 'zod';

export const GameConfigSchema = z.object({
  map: z.object({
    width: z.number().int().min(20).max(200).default(60),
    height: z.number().int().min(10).max(100).default(20),
  }),
  fov: z.object({
    radius: z.number().int().min(1).max(30).default(10),
  }),
  player: z.object({
    startHp: z.number().int().min(1).default(20),
    startAttack: z.number().int().min(0).default(4),
    startDefense: z.number().int().min(0).default(1),
  })
});

export type GameConfigType = z.infer<typeof GameConfigSchema>;

export const GameConfig: GameConfigType = GameConfigSchema.parse({
  map: {},
  fov: {},
  player: {}
});
