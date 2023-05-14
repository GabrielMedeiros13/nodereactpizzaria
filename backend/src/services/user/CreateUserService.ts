import prismaClient from '../../prisma'
import { hash } from 'bcryptjs'

interface UserRequest{
    username: string;
    email: string;
    password: string;
}

class CreateUserService{
    async execute({username, email, password}: UserRequest){
        if(!email){
            throw new Error("Email Incorrect")
        }

        const userAlreadyExists = await prismaClient.user.findFirst({
            where:{
                email: email
            }
        })

        if(userAlreadyExists){
            throw new Error("User already exists")
        }

        const passwordHash = await hash(password, 8)

        const user = await prismaClient.user.create({
            data:{
                username: username,
                email: email,
                password: passwordHash,
            },
            select:{
                id: true,
                email: true,
                username: true,
            }
        })

        return user;
    }
}

export { CreateUserService }