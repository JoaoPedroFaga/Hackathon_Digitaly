import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    
    const { Pool } = pg;
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    
    // Injeta o adaptador na classe pai (PrismaClient)
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}