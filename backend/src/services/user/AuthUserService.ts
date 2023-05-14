
import prismaClient from '../../prisma';
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

interface AuthRequest{
    email: string;
    password: string;
}

class AuthUserService{
    async execute({ email, password }: AuthRequest){
        //Verificando se o email realmente existe
        const user = await prismaClient.user.findFirst({
            where:{
                email: email
            }
        })

        if(!user){
            throw new Error("User/password incorrect")
        }

        //Verificando se a senha está correta
        const passwordMatch = await compare(password, user.password)

        if(!passwordMatch){
            throw new Error("User/password incorrect")
        }

        // Se tudo ok, gerar token para o usuario
        const token = sign(
            {
                username: user.username,
                email: user.email 
            },
            process.env.JWT_SECRET,
            {
                subject: user.id,
                expiresIn: '30d'
            }
        )

        return{
          id: user.id,
          username: user.username,
          email: user.email,
          token: token
        }
    }
}

export { AuthUserService }