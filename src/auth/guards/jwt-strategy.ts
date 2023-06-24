import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";


export class JwtStratrgy extends PassportStrategy(Strategy){
    constructor(private configService: ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreException: false,
            secretOrKey: 'affix_ingres_mx_18429'
            // secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(payload, any){
        return { 'user' : payload.user }
    }
}