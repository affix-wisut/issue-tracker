import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { Observable, map } from "rxjs";
import { User } from "src/user/models/user.interface";
import { UserService } from "src/user/user.service"


@Injectable()
export class RolesGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        private userService: UserService    
        ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        console.log(roles);
        if(!roles) return true;

        const request = context.switchToHttp().getRequest();
        const user: User = request.user;

        return this.userService.findOne(user.id).pipe(
            map((user: User) =>{
                const hasRole = () => roles.indexOf(user.role) > -1;
                
                return true;
            })
        );
    }
}