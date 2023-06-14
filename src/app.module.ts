import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '3j18429',
      database: 'MOF_issue_tracker',
      synchronize: true,
      logging: true,
      entities: [],
      subscribers: [],
      migrations: [],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

