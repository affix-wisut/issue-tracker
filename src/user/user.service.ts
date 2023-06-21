import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { Repository } from 'typeorm';
import { User } from './models/user.interface';
import { Observable, catchError, from, map, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>,
        private authService: AuthService
    ) { }

    create(user: User): Observable<User> {
        console.log('create service');
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                console.log("asswordHash " + passwordHash);
                const newUser = new UserEntity();
                newUser.name = user.name;
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.password = passwordHash;

                return from(this.userRepository.save(newUser)).pipe(
                    map((user: User) =>{
                        const {password, ...result} = user;
                        return result;
                    }),
                    catchError((error: Error) => {
                                            throw error;
                                        })
                );                
            })
        )
    }

    findOne(id: number): Observable<User> {
        return from(this.userRepository.findOneBy({ id : id})).pipe(
            map((user: User) =>{
                const {password, ...result} = user;
                return result;
            }
        ));
    }

    findAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
            map((users: User[]) =>{
                users.forEach((user: User) => {
                    delete user.password
                });
                return users;
            })
        );
    }

    deleteOne(id: number): Observable<any> {
        return from(this.userRepository.delete(id));
    }

    updateOne(id:number, user: User): Observable<any> {
        return from(this.userRepository.update(id, user));
    }

    login(user: User): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: User) => {
               if (user) {
                return this.authService.generateJwt(user).pipe(
                    map((jwt: string) => {
                        return jwt;
                    })
                );
               } else {
                    throw new Error('Invalid credentials');
               }
            })
        )
    }

    validateUser(email: string, password: string): Observable<User> {
        return this.findByEmail(email).pipe(
            switchMap((user: User) => 
                this.authService.comparePassword(password, user.password).pipe(
                    map((match: boolean)=>{
                        if (match) {
                            const {password,...result} = user;
                            return result;
                        } else {
                            throw Error;
                        }
                    })
                ))
            )
     }

     findByEmail(email: string): Observable<User> {
        return from(this.userRepository.findOneBy({email}));
     }

}
