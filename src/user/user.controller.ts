import { Body, Controller, Get, Param, ParseIntPipe, Put, Post, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.interface';
import { Observable } from 'rxjs';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @Post()
    create(@Body() user: User): Observable<User> {
        return this.userService.create(user);
    }

    @Get(':id')
    findOne(@Param() params: any): Observable<User> {
        return this.userService.findOne(params.id)
    }

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
}
