import { Body, Controller, Get, Param, ParseIntPipe, Put, Post, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.interface';
import { Observable, catchError, map, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @Post()
    create(@Body() user: User): Observable<User | Object> {
        console.log('create controller');
        return this.userService.create(user).pipe(
            map((user: User) => user),
                catchError(err => of({ error: err.message}))
        );
    }

    @Post('login')
    login(@Body() user: User): Observable<Object> {
        return this.userService.login(user).pipe(
            map((jwt: string) =>{
                return {access_token: jwt}
            })
        )
    }


    @Get(':id')
    findOne(@Param() params: any): Observable<User> {
        return this.userService.findOne(params.id)
    }

    @hasRoles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()    
    findAll(): Observable<User[]> {
        return this.userService.findAll();
    }

    @Delete(':id')
    deleteOne(@Param('id',ParseIntPipe)id: number): Observable<User> {
        return this.userService.deleteOne(id);
    }

    @Put(':id')
    updateOne(@Param('id',ParseIntPipe)id: number, @Body() user: User): Observable<User>{
        return this.userService.updateOne(id, user);
    }

    @hasRoles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id/role')
    updateRoleOfUser(@Param('id',ParseIntPipe)id: number, @Body() user: User): Observable<User>{
        return this.userService.updateRoleOfUser(id, user);
    }

}
