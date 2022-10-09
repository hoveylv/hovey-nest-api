import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { User } from './entities/user.entity'
import { LocalStrategy } from './local.strategy'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.AUTH_SECRET,
        signOptions: {
          expiresIn: '60m',
        },
      }),
    }),
  ],
  providers: [LocalStrategy, JwtStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
