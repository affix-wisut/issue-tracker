import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-guard';
import { JwtStratrgy } from './guards/jwt-strategy';
import { UserModule } from 'src/user/user.module';

@Module({
    imports:[
        forwardRef(()=> UserModule),
        JwtModule.registerAsync({
            // imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                // secretOrPrivateKey: configService.get<string>('JWT_SECRET'),
                secretOrPrivateKey: 'affix_ingres_mx_18429',
                signOptions:{expiresIn:'10000s'},
            })
        })
    ],
    providers: [AuthService, RolesGuard, JwtAuthGuard, JwtStratrgy],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {
    
}
