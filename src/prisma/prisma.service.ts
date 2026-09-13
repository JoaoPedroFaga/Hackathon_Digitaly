import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { defineConfig } from '@prisma/config';
import pg from 'pg';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
  
    const { Pool } = pg;
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}