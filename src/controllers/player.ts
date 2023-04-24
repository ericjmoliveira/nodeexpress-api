import { Request, Response } from 'express';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

import { prisma } from '../lib/prisma';

class PlayerController {
  async index(req: Request, res: Response) {
    try {
      const players = await prisma.player.findMany({ orderBy: { name: 'asc' } });

      return res.status(200).json({
        success: true,
        data: { players }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const schema = z.object({
        name: z
          .string({ required_error: 'Name is required' })
          .min(1, 'Name must contain at least 1 character'),
        age: z
          .number({ required_error: 'Age is required' })
          .min(17, 'Age must be equal or higher than 17')
      });

      const data = schema.parse(req.body);
      const player = await prisma.player.create({ data });

      return res.status(201).json({
        success: true,
        data: { player },
        message: 'Player successfully created'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);

        return res.status(400).json({
          success: false,
          error: validationError.details[0].message
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const player = await prisma.player.findFirst({ where: { id } });

      if (!player) {
        return res.status(201).json({
          success: true,
          message: 'Player not found'
        });
      }

      return res.status(201).json({
        success: true,
        data: { player }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const schema = z
        .object({
          name: z.string().min(1, 'Name must contain at least 1 character'),
          age: z.number().min(17, 'Age must be equal or higher than 17'),
          available: z.boolean()
        })
        .partial()
        .refine((data) => data.name || data.age || data.available, {
          message: 'At least one field must be provided'
        });

      const data = schema.parse(req.body);
      const player = await prisma.player.update({ where: { id }, data });

      return res.status(201).json({
        success: true,
        data: { player },
        message: 'Player successfully updated'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);

        return res.status(400).json({
          success: false,
          error: validationError.details[0].message
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;

      await prisma.player.delete({ where: { id } });

      return res.status(201).json({
        success: true,
        message: 'Player successfully deleted'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}

export const playerController = new PlayerController();
