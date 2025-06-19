import { NextResponse } from "next/server"
import prisma from '@/lib/connect_db';
import bcrypt from 'bcrypt';

export const GET = async (req: Request) => {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

export const POST = async (req: Request) => {
    try {

        const data = await req.json();
        const email = data.email;
        const password = data.password;

        // Vérifier si l'utilisateur existe déjà
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (user) {
            return NextResponse.json({ message: 'Utilisateur déjà existant' }, { status: 400 });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'utilisateur
        const userCreated = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                name: data.name,
                otp: null,
                otpExpiration: null,
            }
        });
        
        return NextResponse.json(userCreated, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}